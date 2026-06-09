"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/table/DataTable";
import { useRouter } from "next/navigation";
import AddKontikkiModal from "./AddKontikkiModal";

export default function KontikkisPage() {
  const [kontikkis, setKontikkis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchKontikkis();
  }, []);

  async function fetchKontikkis() {
    setLoading(true);

    const { data, error } = await supabase
      .from("kontikkis")
      .select(`
        id,
        kontikki_code,
        artisan_pro:artisan_pros (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((k) => ({
        id: k.id,
        kontikki_code: k.kontikki_code,
        artisan_pro: k.artisan_pro?.name || "-",
      }));
      setKontikkis(formatted);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Kontikkis</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          + Add Kontikki
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: "kontikki_code", label: "Kontikki ID" },
          { key: "artisan_pro", label: "Artisan Pro" },
        ]}
        rows={kontikkis}
        actions={(row) => (
          <button
            onClick={() =>
              router.push(`/network/kontikkis/${row.id}`)
            }
            className="text-sm text-blue-600 hover:underline"
          >
            View
          </button>
        )}
      />

      {showAddModal && (
        <AddKontikkiModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchKontikkis();
          }}
        />
      )}
    </div>
  );
}
