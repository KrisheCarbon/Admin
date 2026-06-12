"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Define which roles see which top-level items
const NAV = [
  {
    type: "item",
    href: "/",
    label: "Dashboard",
    icon: "/icons/overview.svg",
    roles: ["admin", "supervisor"],
  },
  {
    type: "group",
    label: "Network",
    icon: "/icons/network.svg",
    prefix: "/network",
    roles: ["admin", "supervisor"],
    children: [
      { href: "/network/", label: "Overview" },
      { href: "/network/artisan-pros", label: "Artisan Pros" },
      { href: "/network/partners", label: "Partners" },
      { href: "/network/supervisors", label: "Supervisors" },
      { href: "/network/clusters", label: "Clusters" },
      { href: "/network/climapreneurs", label: "Climapreneurs" },
      { href: "/network/kontikkis", label: "Kontikkis" },
      { href: "/network/farms", label: "Farms" },
      { href: "/network/trainings", label: "Trainings" },
    ],
  },
  {
    type: "item",
    href: "/biochar",
    label: "Biochar",
    icon: "/icons/biochar.svg",
    roles: ["admin"],
  },
  {
    type: "item",
    href: "/intents",
    label: "Intents",
    icon: "/icons/intents.svg",
    roles: ["admin"],
  },
  {
    type: "item",
    href: "/reports",
    label: "Reports",
    icon: "/icons/reports.svg",
    roles: ["admin", "supervisor"],
  },
  {
    type: "item",
    href: "/users",
    label: "Users",
    icon: "/icons/users.svg",
    roles: ["admin"], // only admins manage users
  },
];

export default function Sidebar({ role }) {
  const pathname = usePathname();

  const visible = NAV.filter((item) => item.roles.includes(role));

  return (
    <nav className="p-4 space-y-1 mt-4">
      {visible.map((item) =>
        item.type === "item" ? (
          <SidebarItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            pathname={pathname}
          />
        ) : (
          <NetworkGroup
            key={item.label}
            item={item}
            pathname={pathname}
          />
        )
      )}
    </nav>
  );
}

function NetworkGroup({ item, pathname }) {
  const isActive = pathname.startsWith(item.prefix);
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    setOpen(isActive);
  }, [pathname, isActive]);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-md text-base transition
          ${isActive
            ? "bg-gray-100 text-gray-900 Sbold"
            : "text-gray-600 hover:bg-gray-50 Snormal"
          }`}
      >
        <img src={item.icon} className="h-5 w-5 opacity-80" />
        <span className="flex-1 text-left">{item.label}</span>
        <span className="text-xs">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="ml-8 mt-1 space-y-1">
          {item.children.map((child) => (
            <SubItem
              key={child.href}
              href={child.href}
              label={child.label}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </>
  );
}

function SidebarItem({ href, label, icon, pathname }) {
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-4 py-2.5 rounded-md text-base transition
        ${active ? "bg-gray-100 text-gray-900 Sbold" : "text-gray-600 hover:bg-gray-50 Snormal"}
      `}
    >
      {active && (
        <span className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-r" />
      )}
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
