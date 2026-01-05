"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { uploadPartnerDoc } from "@/lib/uploadPartnerDocs";
import DataTable from "@/components/table/DataTable";


function FormField({ label, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {hint && <span className="text-gray-400 text-xs ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
function FileField({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center justify-between border rounded-lg px-3 py-2 bg-white">
        {children}
      </div>
    </div>
  );
}


export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const { data: { user } } = await supabase.auth.getUser();
  console.log("STORAGE USER:", user);

  try {
    // 1️⃣ Insert partner (status defaults to 'draft')
    const { data: partner, error: insertError } = await supabase
      .from("partner_organizations")
      .insert({
        org_name: form.org_name.value,
        cin_number: form.cin_number.value || null,
        base_location: form.base_location.value,
        farmer_base: Number(form.farmer_base.value),
        states_of_operation: form.states_of_operation.value
          .split(",")
          .map(s => s.trim()),
        crop_types: form.crop_types.value
          .split(",")
          .map(s => s.trim()),
          bank_account_holders_name: form.bank_account_holders_name.value,
          bank_account_number: form.bank_account_number.value,
          bank_ifsc: form.bank_ifsc.value,
          bank_name: form.bank_name.value,
          bank_branch: form.bank_branch.value,
          bank_address: form.bank_address.value,
          created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }


    // 2️⃣ Upload PAN
    const panPath = await uploadPartnerDoc({
      file: form.pan_file.files[0],
      bucket: "partner-pan",
      partnerId: partner.id,
      type: "pan",
    });
    if (!form.pan_file.files[0]) {
  throw new Error("PAN file missing");
}


    // 3️⃣ Upload MoU
    const mouPath = await uploadPartnerDoc({
      file: form.mou_file.files[0],
      bucket: "partner-mou",
      partnerId: partner.id,
      type: "mou",
    });


    // 4️⃣ Update partner with docs + auto-set inactive
    const { error: updateError } = await supabase
      .from("partner_organizations")
      .update({
        pan_card_url: panPath,
        mou_url: mouPath,
        status: "inactive",
      })
      .eq("id", partner.id);

    if (updateError) throw updateError;

    // 5️⃣ Success
    setOpen(false);
    loadPartners();
  } catch (err) {
  console.error("Partner onboarding failed:", err);
  alert(
    err?.message ||
    err?.error_description ||
    JSON.stringify(err)
  );
}

}


  async function loadPartners() {
    const { data } = await supabase
      .from("partner_organizations")
      .select(`
        id,
        org_name,
        cin_number,
        base_location,
        farmer_base,
        status,
        last_modified_at
      `)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    setPartners(data || []);
  }
  async function updateStatus(partnerId, newStatus) {
  const { error } = await supabase
    .from("partner_organizations")
    .update({
      status: newStatus,
      last_modified_at: new Date().toISOString(),
    })
    .eq("id", partnerId);

  if (error) {
    alert("Failed to update status");
    console.error(error);
    return;
  }

  // Optimistic UI refresh
  setPartners(prev =>
    prev.map(p =>
      p.id === partnerId ? { ...p, status: newStatus } : p
    )
  );
}


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Partners</h1>
          <p className="text-sm text-gray-500">
            Partner organisations
          </p>
        </div>

        <button
            onClick={() => setOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
            >
            + Add Partner
        </button>

      </header>

      <DataTable
  columns={[
    { key: "org_name", label: "Organisation" },
    { key: "base_location", label: "Base Location" },
    { key: "farmer_base", label: "Farmers" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
  ]}
  rows={partners}
  actions={(p) => (
    <button
      onClick={() => router.push(`/network/partners/${p.id}`)}
      className="text-sm text-blue-600 hover:underline"
    >
      View
    </button>
  )}
/>
      {/* TABLE 
      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
                <th className="px-4 py-3 text-left">Organisation</th>
                <th className="px-4 py-3 text-left">Base Location</th>
                <th className="px-4 py-3 text-left">Farmers</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {partners.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.org_name}</td>
                <td className="px-4 py-3">{p.base_location}</td>
                <td className="px-4 py-3">{p.farmer_base}</td>
                <td className="px-4 py-3 capitalize">{p.status}</td>
                <td className="px-4 py-3 text-right">
                    <button
                    onClick={() => router.push(`/network/partners/${p.id}`)}
                    className="text-sm text-blue-600 hover:underline"
                    >
                    View
                    </button>
                </td>
                </tr>
            ))}
            </tbody>

        </table>
      </div>
      */}

      <Modal
            open={open}
            onClose={() => setOpen(false)}
            title="Onboard Partner Organisation"
            footer={
                <button
                form="partner-form"
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md text-sm"
                >
                Save Partner
                </button>
            }
            >
            <form
  id="partner-form"
  onSubmit={handleSubmit}
  className="space-y-8 max-h-[70vh] overflow-y-auto px-1"
>

  {/* ORGANISATION */}
  <div className="rounded-xl border bg-gray-50 p-6 space-y-4">
    <h3 className="text-base font-semibold">Organisation Details</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Organisation Name">
        <input name="org_name" required className="input" />
      </FormField>

      <FormField label="CIN Number" hint="Optional">
        <input name="cin_number" className="input" />
      </FormField>

      <FormField label="Base Location">
        <input name="base_location" required className="input" />
      </FormField>

      <FormField label="Number of Farmers">
        <input name="farmer_base" type="number" required className="input" />
      </FormField>
    </div>
  </div>

  {/* OPERATIONS */}
  <div className="rounded-xl border bg-white p-6 space-y-4">
    <h3 className="text-base font-semibold">Operations</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="States of Operation">
        <input
          name="states_of_operation"
          placeholder="Telangana, Karnataka"
          required
          className="input"
        />
      </FormField>

      <FormField label="Crop Types">
        <input
          name="crop_types"
          placeholder="Rice, Wheat"
          required
          className="input"
        />
      </FormField>
    </div>
  </div>

  {/* BANKING */}
  <div className="rounded-xl border bg-white p-6 space-y-4">
    <h3 className="text-base font-semibold">Banking Details</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Account Holder Name">
        <input name="bank_account_holders_name" required className="input" />
      </FormField>

      <FormField label="Account Number">
        <input name="bank_account_number" required className="input" />
      </FormField>

      <FormField label="IFSC Code">
        <input name="bank_ifsc" required className="input uppercase" />
      </FormField>

      <FormField label="Bank Name">
        <input name="bank_name" required className="input" />
      </FormField>

      <FormField label="Branch">
        <input name="bank_branch" required className="input" />
      </FormField>

      <FormField label="Bank Address">
        <input name="bank_address" required className="input" />
      </FormField>
    </div>
  </div>

  {/* DOCUMENTS */}
  <div className="rounded-xl border bg-gray-50 p-6 space-y-4">
    <h3 className="text-base font-semibold">Compliance Documents</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FileField label="PAN Card">
        <input
          type="file"
          name="pan_file"
          required
          accept="application/pdf,image/*"
        />
      </FileField>

      <FileField label="MoU Document">
        <input
          type="file"
          name="mou_file"
          required
          accept="application/pdf,image/*"
        />
      </FileField>
    </div>
  </div>
</form>


        </Modal>


    </div>

    
  );
}
