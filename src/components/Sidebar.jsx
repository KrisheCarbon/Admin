"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ open = false, onClose }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: "/icons/gauge.svg" },
    { href: "/artisian-pro", label: "Artisan Pro", icon: "/icons/toolbox.svg" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed h-screen inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 shadow-md transition-transform duration-300 ease-in-out md:static md:z-auto md:translate-x-0 md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-screen flex-col bg-green-50">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 text-xl font-semibold text-green-800">
            Admin Panel
          </div>

          {/* Navigation */}
          <nav className="flex flex-col p-3 gap-1 mt-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2  font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-green-100 text-green-900 shadow-md"
                      : "text-green-900 hover:bg-green-100 hover:text-green-700"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-md `}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      className={`h-6 w-6 ${
                        isActive ? "opacity-100" : "opacity-70"
                      }`}
                    />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer (Optional for later use) */}
          {/* <div className="mt-auto p-3 border-t border-gray-200 text-xs text-gray-500">
            © 2025 KriSHE Admin
          </div> */}
        </div>
      </aside>
    </>
  );
}
