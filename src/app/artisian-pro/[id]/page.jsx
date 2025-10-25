"use client";
import Accordion from "@/components/Accordion";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";



import { useParams } from "next/navigation";

export default function ArtisanProDetail() {
  const { id } = useParams();
  const [openAddKontikki, setOpenAddKontikki] = useState(false);
  const [assignedKontikkiIds, setAssignedKontikkiIds] = useState(new Set());
  const [openAddClima, setOpenAddClima] = useState(false);
  const [kontikkis, setKontikkis] = useState([]);
  const [climapreneurs, setClimapreneurs] = useState([]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [artisanInfo, setArtisanInfo] = useState({
    fullName: "Ravi Kumar",
    fatherSpouse: "Suresh Kumar",
    mobile: "+91 90000 00000",
    altContact: "",
    email: "ravi@example.com",
    govId: "XXXX-XXXX-XXXX",
    resAddress: "Hyderabad, 500001",
    businessAddress: "Hyderabad Industrial Area",
    availability: "Full-time",
    serviceLocations: "Regional",
    languages: "Telugu, Hindi, English",
    status: "Active",
  });

  useEffect(() => {
    try {
      let k = JSON.parse(localStorage.getItem(`artisan:${id}:kontikkis`) || "null");
      if (!Array.isArray(k) || k.length === 0) {
        k = [
          { id: "k-1001", production: "2.4", location: "Hyderabad", status: "Ready", assigned: false },
          { id: "k-1002", production: "1.8", location: "Warangal", status: "In Use", assigned: true },
          { id: "k-1003", production: "3.1", location: "Nizamabad", status: "Maintenance", assigned: false },
        ];
        localStorage.setItem(`artisan:${id}:kontikkis`, JSON.stringify(k));
      }
      setKontikkis(k);
    } catch {}
    try {
      let c = JSON.parse(localStorage.getItem(`artisan:${id}:climapreneurs`) || "null");
      if (!Array.isArray(c) || c.length === 0) {
        c = [
          { id: "cp-2001", name: "Anita Sharma", phone: "+91 90000 00001", assigned: true },
          { id: "cp-2002", name: "Ravi Teja", phone: "+91 90000 00002", assigned: false },
          { id: "cp-2003", name: "Lakshmi Rao", phone: "+91 90000 00003", assigned: false },
        ];
        localStorage.setItem(`artisan:${id}:climapreneurs`, JSON.stringify(c));
      }
      setClimapreneurs(c);
    } catch {}
    try {
      const info = JSON.parse(localStorage.getItem(`artisan:${id}:info`) || "null");
      if (info) setArtisanInfo((p) => ({ ...p, ...info }));
    } catch {}
  }, [id]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Artisan Pro: {id}</h1>
      </div>

      <Accordion
        items={[
          {
            key: "info",
            title: "Info of Artisan Pro",
            actions: (
              <div className="flex items-center gap-2">
                <select
                  value={artisanInfo.status}
                  onChange={(e) => setArtisanInfo((p) => ({ ...p, status: e.target.value }))}
                  className="rounded-md border border-gray-300 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Retired</option>
                </select>
                {!isEditingInfo ? (
                  <button onClick={() => setIsEditingInfo(true)} className="rounded-md bg-green-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-900">Edit</button>
                ) : (
                  <>
                    <button onClick={() => setIsEditingInfo(false)} className="rounded-md border border-green-800 text-green-800 px-3 py-1.5 text-xs hover:bg-green-50">Cancel</button>
                    <button onClick={() => setIsEditingInfo(false)} className="rounded-md bg-green-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-950">Save</button>
                  </>
                )}
              </div>
            ),
            content: (
              <div className="grid gap-6">
                <section className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                  {!isEditingInfo ? (
                    <>
                      <div>
                        <div className="text-gray-500">Full Name</div>
                        <div className="font-medium">{artisanInfo.fullName}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Father/Spouse</div>
                        <div className="font-medium">{artisanInfo.fatherSpouse || "-"}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Mobile</div>
                        <div className="font-medium">{artisanInfo.mobile}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Alt. Contact</div>
                        <div className="font-medium">{artisanInfo.altContact || "-"}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-gray-500">Email</div>
                        <div className="font-medium">{artisanInfo.email}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-gray-500">Govt. ID</div>
                        <div className="font-medium">{artisanInfo.govId}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-gray-500">Residential Address</div>
                        <div className="font-medium">{artisanInfo.resAddress}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-gray-500">Business/Workshop Address</div>
                        <div className="font-medium">{artisanInfo.businessAddress}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Full Name</label>
                        <input value={artisanInfo.fullName} onChange={(e)=>setArtisanInfo(p=>({...p, fullName:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Father/Spouse</label>
                        <input value={artisanInfo.fatherSpouse} onChange={(e)=>setArtisanInfo(p=>({...p, fatherSpouse:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Mobile</label>
                        <input value={artisanInfo.mobile} onChange={(e)=>setArtisanInfo(p=>({...p, mobile:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Alt. Contact</label>
                        <input value={artisanInfo.altContact} onChange={(e)=>setArtisanInfo(p=>({...p, altContact:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input value={artisanInfo.email} onChange={(e)=>setArtisanInfo(p=>({...p, email:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Govt. ID</label>
                        <input value={artisanInfo.govId} onChange={(e)=>setArtisanInfo(p=>({...p, govId:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Residential Address</label>
                        <textarea value={artisanInfo.resAddress} onChange={(e)=>setArtisanInfo(p=>({...p, resAddress:e.target.value}))} rows="2" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Business/Workshop Address</label>
                        <textarea value={artisanInfo.businessAddress} onChange={(e)=>setArtisanInfo(p=>({...p, businessAddress:e.target.value}))} rows="2" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                    </>
                  )}
                </section>
                <section className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                  {!isEditingInfo ? (
                    <>
                      <div>
                        <div className="text-gray-500">Availability</div>
                        <div className="font-medium">{artisanInfo.availability}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Service Locations</div>
                        <div className="font-medium">{artisanInfo.serviceLocations}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-gray-500">Languages</div>
                        <div className="font-medium">{artisanInfo.languages}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Availability</label>
                        <select value={artisanInfo.availability} onChange={(e)=>setArtisanInfo(p=>({...p, availability:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700">
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>On-demand</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Service Locations</label>
                        <select value={artisanInfo.serviceLocations} onChange={(e)=>setArtisanInfo(p=>({...p, serviceLocations:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700">
                          <option>Local</option>
                          <option>Regional</option>
                          <option>Pan-India</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium">Languages</label>
                        <input value={artisanInfo.languages} onChange={(e)=>setArtisanInfo(p=>({...p, languages:e.target.value}))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
                      </div>
                    </>
                  )}
                </section>
              </div>
            ),
          },
          {
            key: "kontikkis",
            title: "Kontikkis",
            actions: (
              <button onClick={() => setOpenAddKontikki(true)} className="rounded-md bg-green-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-900 w-40 h-8">Add Kontikki</button>
            ),
            content: (
              
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="hidden grid-cols-12 gap-x-4 border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase text-gray-700 sm:grid">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-3">Production</div>
                  <div className="col-span-3">Location</div>
                  <div className="col-span-2">Assigned</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                <ul className="divide-y divide-gray-100 text-sm">
                  {(kontikkis.length === 0 ? [] : kontikkis).map((k) => (
                    <li key={k.id}>
                      <a href={`/artisian-pro/${id}/kontikkis/${k.id}`} className="block focus:outline-none focus:ring-2 focus:ring-green-700/20">
                        <div className="grid grid-cols-1 gap-4 px-4 py-3 sm:grid-cols-12 sm:items-center hover:bg-green-50">
                          <div className="text-gray-600 sm:col-span-2">{k.id}</div>
                          <div className="sm:col-span-3">{k.production || "0"} tons</div>
                          <div className="sm:col-span-3">{k.location || "-"}</div>
                          <div className="sm:col-span-2">{k.assigned ? "Assigned" : "Not assigned"}</div>
                          <div className="sm:col-span-2 text-right"><span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">{k.status || "Ready"}</span></div>
                        </div>
                      </a>
                    </li>
                  ))}
                  {kontikkis.length === 0 ? (
                    <li className="px-4 py-3 text-gray-500">No kontikkis yet.</li>
                  ) : null}
                </ul>
              </div>
            ),
          },
          {
            key: "climapreneurs",
            title: "Climapreneurs",
            actions: (
              <button onClick={() => setOpenAddClima(true)} className="rounded-md bg-green-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-900 w-40 h-8">Add Climapreneur</button>
            ),
            content: (
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="hidden grid-cols-12 border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase text-gray-700 sm:grid">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-5">Name</div>
                  <div className="col-span-3">Phone</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                <ul className="divide-y divide-gray-100 text-sm">
                  {(climapreneurs.length === 0 ? [] : climapreneurs).map((p) => (
                    <li key={p.id}>
                      {/* <a href={`/artisian-pro/${id}/climapreneurs/${p.id}`} className="block focus:outline-none focus:ring-2 focus:ring-green-700/20"> */}
                        <div className="grid grid-cols-1 gap-4 px-4 py-3 sm:grid-cols-12 sm:items-center hover:bg-green-50">
                          <div className="text-gray-600 sm:col-span-2">{p.id}</div>
                          <div className="sm:col-span-5">{p.name}</div>
                          <div className="text-gray-600 sm:col-span-3">{p.phone}</div>
                          <div className="sm:col-span-2 text-right">{p.assigned ? "Assigned" : "Not assigned"}</div>
                        </div>
                      {/* </a> */}
                    </li>
                  ))}
                  {climapreneurs.length === 0 ? (
                    <li className="px-4 py-3 text-gray-500">No climapreneurs yet.</li>
                  ) : null}
                </ul>
              </div>
            ),
          },
        ]}
        defaultOpenKey="info"
      />
      <Modal
        open={openAddKontikki}
        onClose={() => setOpenAddKontikki(false)}
        title="Add Kontikki"
        footer={
          <>
            <button onClick={() => setOpenAddKontikki(false)} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={() => setOpenAddKontikki(false)} className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">Save</button>
          </>
        }
      >
        <form className="grid gap-8">
          <section className="grid gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-sm font-semibold text-gray-800">Dimensional Specifications</h4>
            <div>
              <label className="mb-1 block text-sm font-medium">Upper Diameter / Surface Area</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Top opening width" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Depth / Height</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Vertical size" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Lower Diameter / Surface Area</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Bottom width" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Wall Angle / Slope</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Cone angle" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Wall Thickness</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="e.g., 3–5 mm" />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-sm font-semibold text-gray-800">Capacity</h4>
            <div>
              <label className="mb-1 block text-sm font-medium">Internal Volume</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="m³ or liters" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Batch Capacity</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="kg per batch" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Expected Biochar Yield</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="kg per batch" />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-sm font-semibold text-gray-800">Material Details</h4>
            <div>
              <label className="mb-1 block text-sm font-medium">Material Type</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Mild steel / Stainless steel / Cast iron" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Lining (if any)</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Firebrick, clay, refractory" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Corrosion Resistance / Coating</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Painted, galvanized, etc." />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-sm font-semibold text-gray-800">Operational Features</h4>
            <div>
              <label className="mb-1 block text-sm font-medium">Airflow / Ventilation Features</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Holes, draft pipes, chimney" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Drainage Hole at Bottom</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="For ash/pyrolysis liquid" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mobility</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Fixed pit / Portable kiln / Tiltable" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Safety Features</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Handles, shield, protective rim" />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-sm font-semibold text-gray-800">Performance Indicators</h4>
            <div>
              <label className="mb-1 block text-sm font-medium">Pyrolysis Temperature Range</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="e.g., 400–700 °C" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Carbonization Efficiency (%)</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="%" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Fuel/Biomass Types Suitable</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" placeholder="Crop residues, wood, husk, etc." />
            </div>
          </section>
        </form>
      </Modal>
      <Modal
        open={openAddClima}
        onClose={() => setOpenAddClima(false)}
        title="Add Climapreneur"
        footer={
          <>
            <button onClick={() => setOpenAddClima(false)} className="rounded-md border border-green-800 text-green-800 px-4 py-2 text-sm hover:bg-green-50">Cancel</button>
            <button onClick={() => setOpenAddClima(false)} className="rounded-md bg-green-900 px-4 py-2 text-sm font-medium text-white hover:bg-green-950">Save</button>
          </>
        }
      >
        <form className="grid gap-8">
          <section className="grid gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-sm font-semibold text-gray-800">Profile</h4>
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700">
                <option>Mr.</option>
                <option>Ms.</option>
                <option>Mrs.</option>
                <option>Dr.</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Gender</label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">First Name</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last Name</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mobile Number</label>
              <input type="tel" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email Address</label>
              <input type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address Line 1</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Address Line 2</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">State</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pincode</label>
              <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <h4 className="sm:col-span-2 text-sm font-semibold text-gray-800">Security</h4>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <input type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-700" />
            </div>
          </section>
        </form>
      </Modal>
    </div>
  );
}


