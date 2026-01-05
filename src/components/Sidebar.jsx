"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isCSink = pathname.startsWith("/c-sink-network");
  const [networkOpen, setNetworkOpen] = useState(isCSink);

  // Auto-expand when route changes
  useEffect(() => {
    setNetworkOpen(isCSink);
  }, [pathname]);


  return (
    <nav className="p-4 space-y-1 mt-4">

      {/* Dashboard */}
      <SidebarItem href="/" label="Dashboard" icon="/icons/overview.svg" pathname={pathname} />

      {/* C-Sink Network (parent click = overview) */}
      <button
        onClick={() => setNetworkOpen(prev => !prev)}
        className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-md text-base transition
          ${isCSink
            ? "bg-gray-100 text-gray-900 Sbold"
            : "text-gray-600 hover:bg-gray-50 Snormal"
          }`}
      >
        <img src="/icons/network.svg" className="h-5 w-5 opacity-80" />
        <span className="flex-1 text-left">Network</span>
        <span className="text-xs">{networkOpen ? "▾" : "▸"}</span>
      </button>


      {/* Sub-navigation */}
      {networkOpen && (
        <div className="ml-8 mt-1 space-y-1">
          <SubItem href="/network/" label="Overview" pathname={pathname} />
          <SubItem href="/network/artisan-pros" label="Artisan Pros" pathname={pathname} />
          <SubItem href="/network/partners" label="Partners" pathname={pathname} />
          <SubItem href="/network/supervisors" label="Supervisors" pathname={pathname} />
          <SubItem href="/network/clusters" label="Clusters" pathname={pathname} />
          <SubItem href="/network/biochar-producers" label="Biochar Producers" pathname={pathname} />
          <SubItem href="/network/kontikkis" label="Kontikkis" pathname={pathname} />
          <SubItem href="/network/farms" label="Farms" pathname={pathname} />
          <SubItem href="/network/trainings" label="Trainings" pathname={pathname} />
        </div>
      )}

      <SidebarItem href="/biochar" label="Biochar" icon="/icons/biochar.svg" pathname={pathname} />
      <SidebarItem href="/intents" label="Intents" icon="/icons/intents.svg" pathname={pathname} />
      <SidebarItem href="/reports" label="Reports" icon="/icons/reports.svg" pathname={pathname} />

    </nav>
  );
}

/* ---------- helpers ---------- */

function SidebarItem({ href, label, icon, pathname }) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-md text-base transition
        ${active ? "bg-gray-100 text-gray-900 Sbold" : "text-gray-600 hover:bg-gray-50 Snormal"}
      `}
    >
      {active && <span className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-r" />}
      <img src={icon} className="h-5 w-5 opacity-80" />
      <span className="tracking-tight">{label}</span>
    </Link>
  );
}

function SubItem({ href, label, pathname }) {
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block px-3 py-1.5 rounded-md text-sm transition
        ${active ? "text-gray-900 Smedium" : "text-gray-600 hover:text-gray-900 Snormal"}
      `}
    >
      {label}
    </Link>
  );
}
