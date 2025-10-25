"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "@/components/Modal";

// Mock Data
const mockArtisans = [
  { id: "ap-001", name: "Ravi Kumar", location: "Hyderabad" },
  { id: "ap-002", name: "Sita Devi", location: "Warangal" },
  { id: "ap-003", name: "Mahesh", location: "Nizamabad" },
  { id: "ap-004", name: "Lakshmi", location: "Karimnagar" },
];

export default function ArtisianProPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-green-800 tracking-tight">
          Artisan Pros
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-green-800 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-900 transition-all active:scale-95 shadow-sm"
        >
          + Add Artisan Pro
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 border-b border-gray-200 bg-green-50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-green-900">
          <div className="col-span-2">ID</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Location</div>
          <div className="col-span-2 text-right">Kontikkis</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Table Body */}
        <ul className="divide-y divide-gray-100">
          {mockArtisans.map((a) => (
            <li key={a.id}>
              <Link
                href={`/artisian-pro/${a.id}`}
                className="block transition-all hover:bg-green-50 focus:bg-green-100 focus:outline-none"
              >
                <div className="grid grid-cols-1 gap-3 px-6 py-4 text-sm sm:grid-cols-12 sm:items-center text-gray-700">
                  <div className="sm:col-span-2">{a.id}</div>
                  <div className="font-semibold sm:col-span-3">{a.name}</div>
                  <div className="sm:col-span-3">{a.location}</div>
                  <div className="sm:col-span-2 text-right">{Math.floor(Math.random() * 5) + 1}</div>
                  <div className="sm:col-span-2 text-right">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Artisan Pro"
        footer={
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setOpen(false)}
              className="rounded-md border border-green-800 text-green-800 px-4 py-2 text-sm hover:bg-green-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md bg-green-800 px-5 py-2 text-sm font-medium text-white hover:bg-green-900 transition"
            >
              Save
            </button>
          </div>
        }
      >
        <form className="space-y-10 max-h-[70vh] overflow-y-auto pr-2">
          {/* Section 1: Identity */}
          <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
            <h4 className="mb-5 text-lg font-semibold text-green-700">
              Identity & Contact Information
            </h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full Name of Artisan Pro / Firm" placeholder="Enter full name" />
              <Input label="Father’s / Spouse’s Name" placeholder="Enter name" />
              <Input label="Mobile Number" placeholder="Primary mobile" />
              <Input label="Alternate Contact" placeholder="Alternate contact" />
              <Input label="Email ID" type="email" placeholder="name@email.com" className="sm:col-span-2" />
              <Input label="Aadhaar Number / Govt. ID proof" placeholder="Aadhaar / PAN / Voter ID" className="sm:col-span-2" />
              <Textarea label="Residential Address + Pincode" placeholder="Address with pincode" className="sm:col-span-2" />
              <Textarea label="Business/Workshop Address (if different)" placeholder="Business/Workshop address" className="sm:col-span-2" />
            </div>
          </section>

          {/* Section 2: Operational */}
          <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
            <h4 className="mb-5 text-lg font-semibold text-green-700">Operational Details</h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Availability" options={["Full-time", "Part-time", "On-demand"]} />
              <Select label="Service Locations" options={["Local", "Regional", "Pan-India"]} />
              <Input label="Language(s) Spoken" placeholder="Telugu, Hindi, English" className="sm:col-span-2" />
            </div>
          </section>

          {/* Section 3: Compliance */}
          <section className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
            <h4 className="mb-5 text-lg font-semibold text-green-700">Compliance & Verification</h4>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="ID Proof" placeholder="Aadhaar/PAN copy" />
              <Input label="Address Proof" placeholder="Utility bill, ration card, etc." />
              <Textarea label="Reference / Endorsements" placeholder="Optional" className="sm:col-span-2" />
            </div>
          </section>
        </form>
      </Modal>
    </div>
  );
}

/* -------------------- Reusable Components -------------------- */
function Input({ label, type = "text", placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}

function Textarea({ label, placeholder, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        placeholder={placeholder}
        rows="2"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}

function Select({ label, options = [], className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600">
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
