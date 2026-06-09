"use client";

import Link from "next/link";

export default function CSinkNetworkOverviewPage() {
  return (
    <div className="space-y-10">

      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl Sbold text-gray-900">
          KrisheCarbon's Network
        </h1>
        <p className="text-sm Snormal text-gray-500">
          Overview of the people, assets, and operations in KrisheCarbon's Network
        </p>
      </header>

      {/* High-level metrics */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard label="Partners" value="24" href="/network/partners" />
        <OverviewCard label="Clusters" value="9" href="/network/clusters" />
        <OverviewCard label="Artisan Pros" value="128" href="/network/artisan-pros" />
        <OverviewCard label="Kontikkis" value="56" href="/network/kontikkis" />
        <OverviewCard label="Supervisors" value="18" href="/network/supervisors" />
        <OverviewCard label="Climapreneurs" value="12" href="/network/climapreneurs" />
        <OverviewCard label="Farms" value="342" href="/network/farms" />
        <OverviewCard label="Trainings" value="21" href="/network/trainings" />
      </section>

    </div>
  );
}

/* ---------- helper card ---------- */

function OverviewCard({ label, value, href }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:-translate-y-[1px] transition"
    >
      <div className="Snormal text-sm text-gray-500">
        {label}
      </div>
      <div className="mt-2 Sbold text-2xl text-gray-900">
        {value}
      </div>
      <div className="mt-3 text-sm Smedium text-gray-600">
        View →
      </div>
    </Link>
  );
}
