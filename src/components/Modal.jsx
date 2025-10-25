"use client";

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl md:max-w-5xl max-h-[85vh] rounded-xl border border-gray-200 bg-white shadow-2xl flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded p-2 hover:bg-gray-100">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            {children}
          </div>
        </div>
        {footer ? (
          <div className="sticky bottom-0 z-10 flex justify-end gap-2 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}


