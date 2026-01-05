"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function PartnerEditor({ partner, onCancel }) {

    const [panFile, setPanFile] = useState(null);
    const [mouFile, setMouFile] = useState(null);

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [form, setForm] = useState({
    org_name: partner.org_name,
    base_location: partner.base_location,
    cin_number: partner.cin_number || "",
    farmer_base: partner.farmer_base,
    states_of_operation: partner.states_of_operation.join(", "),
    crop_types: partner.crop_types.join(", "),
    status: partner.status,

    bank_account_holders_name: partner.bank_account_holders_name,
    bank_account_number: partner.bank_account_number,
    bank_ifsc: partner.bank_ifsc,
    bank_name: partner.bank_name,
    bank_branch: partner.bank_branch,
    bank_address: partner.bank_address,
  });

  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  async function uploadFile(bucket, folder, file) {
  const filePath = `${folder}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: false,
    });

  if (error) throw error;

  return filePath;
}


  async function save() {
  setLoading(true);

  try {
    const payload = {
      ...form,
      farmer_base: Number(form.farmer_base),
      states_of_operation: form.states_of_operation
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      crop_types: form.crop_types
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      last_modified_at: new Date().toISOString(),
    };

    const baseFolder = `partners/${partner.id}`;

    if (panFile) {
      payload.pan_card_url = await uploadFile(
        "partner-pan",
        `${baseFolder}/pan`,
        panFile
      );
    }

    if (mouFile) {
      payload.mou_url = await uploadFile(
        "partner-mou",
        `${baseFolder}/mou`,
        mouFile
      );
    }

    const { error } = await supabase
      .from("partner_organizations")
      .update(payload)
      .eq("id", partner.id);

    if (error) throw error;

    router.refresh();
    onCancel();
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="space-y-8">

      {/* ORGANISATION */}
      <Section title="Organisation Details">
        <Input
          label="Organisation Name"
          value={form.org_name}
          onChange={(v) => updateField("org_name", v)}
        />
        <Input
          label="Base Location"
          value={form.base_location}
          onChange={(v) => updateField("base_location", v)}
        />
        <Input
          label="CIN Number"
          value={form.cin_number}
          onChange={(v) => updateField("cin_number", v)}
        />
        <Input
          label="Farmer Base"
          type="number"
          value={form.farmer_base}
          onChange={(v) => updateField("farmer_base", v)}
        />

        <Input
          label="States of Operation (comma separated)"
          value={form.states_of_operation}
          onChange={(v) => updateField("states_of_operation", v)}
        />

        <Input
          label="Crop Types (comma separated)"
          value={form.crop_types}
          onChange={(v) => updateField("crop_types", v)}
        />

        <Select
          label="Status"
          value={form.status}
          onChange={(v) => updateField("status", v)}
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </Section>

      {/* BANK */}
      <Section title="Bank Details">
        <Input
          label="Account Holder Name"
          value={form.bank_account_holders_name}
          onChange={(v) =>
            updateField("bank_account_holders_name", v)
          }
        />
        <Input
          label="Account Number"
          value={form.bank_account_number}
          onChange={(v) =>
            updateField("bank_account_number", v)
          }
        />
        <Input
          label="IFSC Code"
          value={form.bank_ifsc}
          onChange={(v) => updateField("bank_ifsc", v)}
        />
        <Input
          label="Bank Name"
          value={form.bank_name}
          onChange={(v) => updateField("bank_name", v)}
        />
        <Input
          label="Branch"
          value={form.bank_branch}
          onChange={(v) => updateField("bank_branch", v)}
        />
        <Input
          label="Bank Address"
          value={form.bank_address}
          onChange={(v) => updateField("bank_address", v)}
        />
      </Section>

      <Section title="Compliance Documents">
        <FileInput
            label="Upload New PAN Card"
            onChange={setPanFile}
        />

        <FileInput
            label="Upload New MoU Document"
            onChange={setMouFile}
        />
        </Section>


      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={loading}
          className="px-5 py-2 text-sm bg-black text-white rounded-md"
        >
          Save Changes
        </button>

        <button
          onClick={onCancel}
          className="px-5 py-2 text-sm border rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
function Section({ title, children }) {
  return (
    <div className="border rounded-xl bg-white p-6 space-y-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-md px-2 py-1"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-md px-2 py-1"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
function FileInput({ label, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="mt-1 block w-full text-sm"
      />
    </div>
  );
}
