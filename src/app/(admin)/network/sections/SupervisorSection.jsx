"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";



/* ================= INITIAL FORM ================= */

const initialForm = {
  id: "",
  name: "",
  mobile: "",
  education: "",
  currentIncome: "",
  bikeAccess: false,

  partnerId: "",
  partnerName: "",
  cluster: "",

  trainingDate: "",
  demoImages: [],
  agreementSigned: false,

  bankAccountName: "",
  bankAccountNumber: "",
  bankIfsc: "",
  bankName: "",

  panUrl: "",
  panName: "",
};

/* ================= MAIN COMPONENT ================= */

export default function SupervisorSection() {
  const [supervisors, setSupervisors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [openAdd, setOpenAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewId, setViewId] = useState(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadSupervisors();
    loadPartners();
  }, []);

  async function loadSupervisors() {
    const q = query(collection(db, "supervisors"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setSupervisors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  async function loadPartners() {
    const snap = await getDocs(collection(db, "partner_organizations"));
    setPartners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }

  /* ================= FORM HELPERS ================= */

  function resetForm() {
    setForm(initialForm);
  }

  function v(field) {
    return (e) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  /* ================= FILE UPLOADS ================= */

  async function uploadFileAndSet(path, file, cb) {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    cb(url);
  }

  async function uploadPan(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const id = form.id || crypto.randomUUID();

    uploadFileAndSet(
      `supervisors/${id}/pan-${file.name}`,
      file,
      (url) =>
        setForm(f => ({
          ...f,
          id,
          panUrl: url,
          panName: file.name,
        }))
    );
  }

  async function uploadDemoImages(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const id = form.id || crypto.randomUUID();
    const urls = [];

    for (const file of files) {
      const fileRef = ref(storage, `supervisors/${id}/demo/${file.name}`);
      await uploadBytes(fileRef, file);
      urls.push(await getDownloadURL(fileRef));
    }

    setForm(f => ({ ...f, id, demoImages: urls }));
  }

  /* ================= SUBMIT ================= */

  async function submitForm() {
    if (!form.name || !form.mobile) return;

    const id = form.id || crypto.randomUUID();

    const payload = {
      name: form.name,
      mobile: form.mobile,
      education: form.education,
      currentIncome: Number(form.currentIncome || 0),
      bikeAccess: form.bikeAccess,

      partner: {
        id: form.partnerId,
        name: form.partnerName,
      },

      cluster: form.cluster,

      training: {
        biocharDate: form.trainingDate,
        demoImages: form.demoImages,
        agreementSigned: form.agreementSigned,
      },

      kyc: {
        bank: {
          accountName: form.bankAccountName,
          accountNumber: form.bankAccountNumber,
          ifsc: form.bankIfsc,
          bankName: form.bankName,
        },
        pan: {
          url: form.panUrl,
          name: form.panName,
        },
      },

      createdAt: serverTimestamp(),
    };

    if (editingId) {
      await updateDoc(doc(db, "supervisors", id), payload);
    } else {
      await setDoc(doc(db, "supervisors", id), payload);
    }

    setOpenAdd(false);
    setEditingId(null);
    resetForm();
    loadSupervisors();
  }

  /* ================= EDIT / DELETE ================= */

  function editSupervisor(id) {
    const s = supervisors.find(x => x.id === id);
    if (!s) return;

    setForm({
      id,
      name: s.name,
      mobile: s.mobile,
      education: s.education,
      currentIncome: s.currentIncome,
      bikeAccess: s.bikeAccess,

      partnerId: s.partner?.id,
      partnerName: s.partner?.name,
      cluster: s.cluster,

      trainingDate: s.training?.biocharDate,
      demoImages: s.training?.demoImages || [],
      agreementSigned: s.training?.agreementSigned,

      bankAccountName: s.kyc?.bank?.accountName,
      bankAccountNumber: s.kyc?.bank?.accountNumber,
      bankIfsc: s.kyc?.bank?.ifsc,
      bankName: s.kyc?.bank?.bankName,

      panUrl: s.kyc?.pan?.url,
      panName: s.kyc?.pan?.name,
    });

    setEditingId(id);
    setOpenAdd(true);
  }

  async function deleteSupervisor(id) {
    await deleteDoc(doc(db, "supervisors", id));
    loadSupervisors();
  }

  /* ================= RENDER ================= */

  return (
    <>
      <details className="rounded-xl border bg-white shadow-sm" open>
        <summary className="flex justify-between px-5 py-4 cursor-pointer">
          <span className="text-lg font-semibold">Supervisors</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              resetForm();
              setOpenAdd(true);
            }}
            className="rounded-full bg-black px-4 py-2 text-xs text-white"
          >
            + Add Supervisor
          </button>
        </summary>

        <div className="border-t px-5 pb-4">
          <ul className="divide-y">
            {supervisors.map(s => (
              <li key={s.id} className="py-3 flex justify-between">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-slate-500">
                    {s.mobile} • {s.partner?.name || "-"}
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <button onClick={() => setViewId(s.id)}>View</button>
                  <button onClick={() => editSupervisor(s.id)}>Edit</button>
                  <button onClick={() => deleteSupervisor(s.id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </details>

      {/* ================= ADD / EDIT MODAL ================= */}

      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title={editingId ? "Edit Supervisor" : "Add Supervisor"}
        footer={
          <>
            <button onClick={() => setOpenAdd(false)} className="border px-4 py-2 text-sm">
              Cancel
            </button>
            <button onClick={submitForm} className="bg-black text-white px-4 py-2 text-sm">
              {editingId ? "Save" : "Create"}
            </button>
          </>
        }
      >
        <form className="grid gap-6">
          <Section title="Basic Details">
            <Input label="Name" value={form.name} onChange={v("name")} />
            <Input label="Mobile Number" value={form.mobile} onChange={v("mobile")} />
            <Input label="Education" value={form.education} onChange={v("education")} />
            <Input label="Current Income" value={form.currentIncome} onChange={v("currentIncome")} />
            <Checkbox label="Bike Access" checked={form.bikeAccess}
              onChange={() => setForm(f => ({ ...f, bikeAccess: !f.bikeAccess }))} />
          </Section>

          <Section title="Assignment">
            <Select
              label="Partner"
              options={partners}
              value={form.partnerId}
              onChange={(e) => {
                const p = partners.find(x => x.id === e.target.value);
                setForm(f => ({ ...f, partnerId: p.id, partnerName: p.orgName }));
              }}
            />
            <Input label="Cluster Assigned" value={form.cluster} onChange={v("cluster")} />
          </Section>

          <Section title="Training">
            <Input label="Biochar Training Date" type="date" value={form.trainingDate} onChange={v("trainingDate")} />
            <Upload label="Demo Pictures" multiple onChange={uploadDemoImages} />
            <Checkbox label="Agreement Signed" checked={form.agreementSigned}
              onChange={() => setForm(f => ({ ...f, agreementSigned: !f.agreementSigned }))} />
          </Section>

          <Section title="KYC">
            <Input label="Account Holder Name" value={form.bankAccountName} onChange={v("bankAccountName")} />
            <Input label="Account Number" value={form.bankAccountNumber} onChange={v("bankAccountNumber")} />
            <Input label="IFSC" value={form.bankIfsc} onChange={v("bankIfsc")} />
            <Input label="Bank Name" value={form.bankName} onChange={v("bankName")} />
            <Upload label="PAN Card" onChange={uploadPan} />
          </Section>
        </form>
      </Modal>
    </>
  );
}

/* ================= UI HELPERS ================= */

function Section({ title, children }) {
  return (
    <section className="border rounded-xl p-4 space-y-4">
      <h4 className="font-semibold text-sm">{title}</h4>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <input type={type} value={value || ""} onChange={onChange}
        className="w-full border rounded px-3 py-2 text-sm" />
    </div>
  );
}

function Upload({ label, ...props }) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <input type="file" {...props} />
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full border rounded px-3 py-2 text-sm">
        <option value="">Select</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.orgName}</option>
        ))}
      </select>
    </div>
  );
}
