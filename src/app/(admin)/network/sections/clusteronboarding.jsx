"use client";

import { useEffect, useState } from "react";
import VillageMapPicker from "@/components/maps/Villagepicker";
import Modal from "@/components/Modal";




/* ================= INITIAL FORM ================= */

const initialVillage = {
  name: "",
  farmersCount: "",
  cottonAcres: "",
  chilliAcres: "",
  sowingDate: "",
  harvestDate: "",
  biomassUsage: "",
  lat: "",
  lng: "",
};

const initialForm = {
  clusterName: "",
  villages: [],
  retainedSamples: "",
  testingStatus: "",
  auditRemarks: "",
};

/* ================= MAIN COMPONENT ================= */

export default function ClusterOnboardingSection() {
  const [clusters, setClusters] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadClusters();
  }, []);

  async function loadClusters() {
    const snap = await getDocs(collection(db, "clusters"));
    setClusters(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  function addVillage() {
    setForm((f) => ({
      ...f,
      villages: [...f.villages, { ...initialVillage }],
    }));
  }

  function updateVillage(index, field, value) {
    const updated = [...form.villages];
    updated[index][field] = value;
    setForm((f) => ({ ...f, villages: updated }));
  }

  function removeVillage(index) {
    setForm((f) => ({
      ...f,
      villages: f.villages.filter((_, i) => i !== index),
    }));
  }

  async function submitForm() {
    if (!form.clusterName || form.villages.length === 0) return;

    const id = crypto.randomUUID();

    const payload = {
      name: form.clusterName,
      villages: form.villages.map((v) => ({
        name: v.name,
        farmersCount: Number(v.farmersCount),
        feedstock: {
          cottonAcres: Number(v.cottonAcres),
          chilliAcres: Number(v.chilliAcres),
        },
        sowingDate: v.sowingDate,
        harvestDate: v.harvestDate,
        biomassUsage: v.biomassUsage,
        gps: {
          lat: Number(v.lat),
          lng: Number(v.lng),
        },
      })),
      sampling: {
        retainedSamples: form.retainedSamples,
        testingStatus: form.testingStatus,
      },
      audit: {
        remarks: form.auditRemarks,
      },
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "clusters", id), payload);

    setOpen(false);
    setForm(initialForm);
    loadClusters();
  }

  return (
    <>
      <details className="rounded-xl border bg-white shadow-sm" open>
        <summary className="flex justify-between px-5 py-4 cursor-pointer">
          <span className="text-lg font-semibold">Cluster Onboarding</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
            className="rounded-full bg-black px-4 py-2 text-xs text-white"
          >
            + Add Cluster
          </button>
        </summary>

        <div className="border-t px-5 pb-4">
          <ul className="divide-y">
            {clusters.map((c) => (
              <li key={c.id} className="py-3">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-slate-500">
                  {c.villages?.length || 0} villages
                </div>
              </li>
            ))}
          </ul>
        </div>
      </details>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cluster Onboarding"
        footer={
          <>
            <button
              onClick={() => setOpen(false)}
              className="border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={submitForm}
              className="bg-black text-white px-4 py-2 text-sm"
            >
              Save Cluster
            </button>
          </>
        }
      >
        <form className="grid gap-6">
          <Section title="Cluster">
            <Input
              label="Cluster Name"
              value={form.clusterName}
              onChange={(e) =>
                setForm((f) => ({ ...f, clusterName: e.target.value }))
              }
            />
          </Section>

          <Section title="Villages">
            {form.villages.map((v, i) => (
              <div key={i} className="border rounded p-3 space-y-3">
                <Input
                  label="Village Name"
                  value={v.name}
                  onChange={(e) => updateVillage(i, "name", e.target.value)}
                />

                <VillageMapPicker
                  value={{ lat: v.lat, lng: v.lng }}
                  onChange={({ lat, lng, placeName }) => {
                    updateVillage(i, "lat", lat);
                    updateVillage(i, "lng", lng);
                    if (!v.name && placeName) {
                      updateVillage(i, "name", placeName);
                    }
                  }}
                />

                <Input
                  label="Number of Farmers"
                  value={v.farmersCount}
                  onChange={(e) =>
                    updateVillage(i, "farmersCount", e.target.value)
                  }
                />

                <Input
                  label="Cotton Acres"
                  value={v.cottonAcres}
                  onChange={(e) =>
                    updateVillage(i, "cottonAcres", e.target.value)
                  }
                />

                <Input
                  label="Chilli Acres"
                  value={v.chilliAcres}
                  onChange={(e) =>
                    updateVillage(i, "chilliAcres", e.target.value)
                  }
                />

                <Input
                  label="Sowing Date"
                  type="date"
                  value={v.sowingDate}
                  onChange={(e) =>
                    updateVillage(i, "sowingDate", e.target.value)
                  }
                />

                <Input
                  label="Harvest Date"
                  type="date"
                  value={v.harvestDate}
                  onChange={(e) =>
                    updateVillage(i, "harvestDate", e.target.value)
                  }
                />

                <Input
                  label="Biomass Usage"
                  value={v.biomassUsage}
                  onChange={(e) =>
                    updateVillage(i, "biomassUsage", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removeVillage(i)}
                  className="text-xs text-red-600"
                >
                  Remove Village
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addVillage}
              className="border px-3 py-1 text-xs rounded"
            >
              + Add Village
            </button>
          </Section>

          <Section title="Sampling & Audit">
            <Input
              label="Sampling Retention"
              value={form.retainedSamples}
              onChange={(e) =>
                setForm((f) => ({ ...f, retainedSamples: e.target.value }))
              }
            />
            <Input
              label="Testing Status"
              value={form.testingStatus}
              onChange={(e) =>
                setForm((f) => ({ ...f, testingStatus: e.target.value }))
              }
            />
            <Input
              label="Audit Remarks"
              value={form.auditRemarks}
              onChange={(e) =>
                setForm((f) => ({ ...f, auditRemarks: e.target.value }))
              }
            />
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
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}