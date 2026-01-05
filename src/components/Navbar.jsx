"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-full flex items-center justify-between px-6">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <img src="/icons/logo.png" alt="KrisheCarbon" className="h-10" />
        <span className="Sbold text-lg tracking-tight text-gray-900">
          KrisheCarbon
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-gray-100">
          <img src="/icons/notifications.svg" alt="" className="h-5 w-5" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="h-8 w-8 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center"
          >
            A
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
