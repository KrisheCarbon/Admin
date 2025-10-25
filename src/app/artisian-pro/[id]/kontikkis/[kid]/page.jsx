"use client";

import Accordion from "@/components/Accordion";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// export const metadata = { title: "Kontikki Details | kriSHE Admin" };

export default function KontikkiDetailNested() {
  const { id, kid } = useParams();
  const [openAddClima, setOpenAddClima] = useState(false);
  const [assignedName, setAssignedName] = useState(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState("");
  const [kontikki, setKontikki] = useState(null);
  const [climas, setClimas] = useState([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem(`artisan:${id}:kontikkis`) || "[]");
      const found = Array.isArray(arr) ? arr.find((k) => k.id === kid) : null;
      setKontikki(found || null);
    } catch {}
    try {
      const c = JSON.parse(localStorage.getItem(`artisan:${id}:climapreneurs`) || "[]");
      setClimas(Array.isArray(c) ? c : []);
    } catch {}
  }, [id, kid]);

  useEffect(() => {
    const current = climas.find((c) => c.assigned);
    setAssignedName(current ? current.name : null);
  }, [climas]);

  function updateClimaAssigned(targetId, value) {
    setClimas((prev) => {
      const next = prev.map((c) => ({ ...c, assigned: c.id === targetId ? value : false }));
      try { localStorage.setItem(`artisan:${id}:climapreneurs`, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/artisian-pro/${id}`} className="inline-flex items-center rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50">
            <img src="/Arrow.svg" alt="Back" className="h-4 w-4 rotate-180" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Kontikki: {kid}</h1>
        </div>
      </div>

      <Accordion
        items={[
          {
            key: "info",
            title: "Info of Kontikki",
            actions: (
              <div className="flex items-center gap-2">
                {!isEditingInfo ? (
                  <button onClick={() => setIsEditingInfo(true)} className="rounded-md bg-green-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-900">Edit</button>
                ) : (
                  <>
                    <button onClick={() => setIsEditingInfo(false)} className="rounded-md border border-green-800 text-green-800 px-3 py-1.5 text-xs hover:bg-green-50">Cancel</button>
                    <button
                      onClick={() => {
                        // Persist updated kontikki
                        try {
                          const arr = JSON.parse(localStorage.getItem(`artisan:${id}:kontikkis`) || "[]");
                          const idx = Array.isArray(arr) ? arr.findIndex((k) => k.id === kid) : -1;
                          if (idx >= 0) {
                            arr[idx] = kontikki;
                            localStorage.setItem(`artisan:${id}:kontikkis`, JSON.stringify(arr));
                          }
                        } catch {}
                        setIsEditingInfo(false);
                      }}
                      className="rounded-md bg-green-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-950"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            ),
            content: (
              <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                {isEditingInfo ? (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status <span className="text-red-600">*</span></label>
                      <input value={kontikki?.status || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), status:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" required />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Production (tons)</label>
                      <input value={kontikki?.production || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), production:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Location</label>
                      <input value={kontikki?.location || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), location:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Upper Diameter</label>
                      <input value={kontikki?.upperDiameter || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), upperDiameter:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Depth / Height</label>
                      <input value={kontikki?.depth || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), depth:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Lower Diameter</label>
                      <input value={kontikki?.lowerDiameter || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), lowerDiameter:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Wall Angle / Slope</label>
                      <input value={kontikki?.slope || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), slope:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Wall Thickness</label>
                      <input value={kontikki?.wallThickness || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), wallThickness:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Internal Volume</label>
                      <input value={kontikki?.internalVolume || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), internalVolume:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Batch Capacity</label>
                      <input value={kontikki?.batchCapacity || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), batchCapacity:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">Expected Biochar Yield</label>
                      <input value={kontikki?.biocharYield || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), biocharYield:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Material Type</label>
                      <input value={kontikki?.materialType || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), materialType:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Lining</label>
                      <input value={kontikki?.lining || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), lining:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">Coating</label>
                      <input value={kontikki?.coating || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), coating:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Airflow Features</label>
                      <input value={kontikki?.airflow || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), airflow:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Drainage</label>
                      <input value={kontikki?.drainage || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), drainage:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Mobility</label>
                      <input value={kontikki?.mobility || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), mobility:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Safety Features</label>
                      <input value={kontikki?.safety || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), safety:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Temperature Range</label>
                      <input value={kontikki?.temperatureRange || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), temperatureRange:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Efficiency</label>
                      <input value={kontikki?.efficiency || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), efficiency:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">Fuel Types</label>
                      <input value={kontikki?.fuelTypes || ""} onChange={(e)=>setKontikki((p)=>({...(p||{}), fuelTypes:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="text-gray-500">Status</div>
                      <div className="font-medium">{kontikki?.status || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Production</div>
                      <div className="font-medium">{kontikki?.production || "0"} tons</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Location</div>
                      <div className="font-medium">{kontikki?.location || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Assigned Climapreneur</div>
                      <div className="font-medium">{assignedName ?? "None"}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-gray-500">Upper Diameter</div>
                      <div className="font-medium">{kontikki?.upperDiameter || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Depth / Height</div>
                      <div className="font-medium">{kontikki?.depth || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Lower Diameter</div>
                      <div className="font-medium">{kontikki?.lowerDiameter || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Wall Angle / Slope</div>
                      <div className="font-medium">{kontikki?.slope || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Wall Thickness</div>
                      <div className="font-medium">{kontikki?.wallThickness || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Internal Volume</div>
                      <div className="font-medium">{kontikki?.internalVolume || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Batch Capacity</div>
                      <div className="font-medium">{kontikki?.batchCapacity || "-"}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-gray-500">Expected Biochar Yield</div>
                      <div className="font-medium">{kontikki?.biocharYield || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Material Type</div>
                      <div className="font-medium">{kontikki?.materialType || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Lining</div>
                      <div className="font-medium">{kontikki?.lining || "-"}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-gray-500">Coating</div>
                      <div className="font-medium">{kontikki?.coating || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Airflow Features</div>
                      <div className="font-medium">{kontikki?.airflow || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Drainage</div>
                      <div className="font-medium">{kontikki?.drainage || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Mobility</div>
                      <div className="font-medium">{kontikki?.mobility || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Safety Features</div>
                      <div className="font-medium">{kontikki?.safety || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Temperature Range</div>
                      <div className="font-medium">{kontikki?.temperatureRange || "-"}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Efficiency</div>
                      <div className="font-medium">{kontikki?.efficiency || "-"}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-gray-500">Fuel Types</div>
                      <div className="font-medium">{kontikki?.fuelTypes || "-"}</div>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            key: "climapreneurs",
            title: "Climapreneurs",
            // actions: (
            //   // <button onClick={() => setOpenAddClima(true)} className="rounded-md bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800">Add Climapreneur</button>
            // ),
            content: (
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="hidden grid-cols-12 border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase text-gray-600 sm:grid">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Phone</div>
                  <div className="col-span-4 text-right">Action</div>
                </div>
                <ul className="divide-y divide-gray-200 text-sm">
                  {climas.map((p, i) => (
                    <li key={i} className="px-4 py-2">
                      <details>
                        <summary className="grid cursor-pointer grid-cols-1 gap-1 sm:grid-cols-12 sm:items-center">
                          <div className="sm:col-span-2 text-gray-600">{p.id}</div>
                          <div className="sm:col-span-3">{p.name}</div>
                          <div className="sm:col-span-3 text-gray-600">{p.phone}</div>
                          <div className="sm:col-span-4 text-left sm:text-right flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (!p.assigned) updateClimaAssigned(p.id, true);
                              }}
                              disabled={climas.some((c)=>c.assigned)}
                              className={(p.assigned ? "bg-emerald-600 " : "bg-green-700 ") +
                                " rounded-md px-3 py-1 text-xs font-medium text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed"}
                            >
                              {p.assigned ? "Assigned" : "Assign to this Kontikki"}
                            </button>
                            {p.assigned ? (
                              <button
                                onClick={(e) => { e.preventDefault(); setConfirmRemoveId(p.id); }}
                                className="rounded-md border border-green-700 text-green-700 px-3 py-1 text-xs hover:bg-green-50"
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </summary>
                        <div className="mt-2 grid gap-2 text-xs text-gray-700 sm:grid-cols-2">
                          <div><span className="text-gray-500">Email:</span> {p.email || "-"}</div>
                          <div><span className="text-gray-500">Gender:</span> {p.gender || "-"}</div>
                          <div className="sm:col-span-2"><span className="text-gray-500">Address:</span> {[p.addr1,p.addr2,p.city,p.state,p.pincode].filter(Boolean).join(", ") || "-"}</div>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
        ]}
        defaultOpenKey="info"
      />

      <Modal
        open={!!confirmRemoveId}
        onClose={() => setConfirmRemoveId("")}
        title="Confirm Removal"
        footer={
          <>
            <button onClick={() => setConfirmRemoveId("")} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={() => { updateClimaAssigned(confirmRemoveId, false); setAssignedName(null); setConfirmRemoveId(""); }} className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">OK</button>
          </>
        }
      >
        <p className="text-sm text-gray-700">Are you sure you want to remove the assigned Climapreneur?</p>
      </Modal>

      <Modal
        open={openAddClima}
        onClose={() => setOpenAddClima(false)}
        title="Add Climapreneur"
        footer={
          <>
            <button onClick={() => setOpenAddClima(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={() => setOpenAddClima(false)} className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">Save</button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" placeholder="Enter name" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input type="tel" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" placeholder="Enter phone" />
          </div>
        </form>
      </Modal>
    </div>
  );
}


