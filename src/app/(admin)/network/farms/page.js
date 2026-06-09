
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/table/DataTable";
import AddFarmerModal from "./AddFarmerModal";
import { useRouter } from "next/navigation";

export default function FarmsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] =
    useState(true);

  const [showAdd, setShowAdd] =
    useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchFarmers();
  }, []);

  async function fetchFarmers() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("farmers")
        .select(`
          id,
          farmer_name,
          estimated_biomass
        `)
        .order("created_at", {
          ascending: false
        });

    if (!error) {
      setRows(
        data.map((f) => ({
          id: f.id,

          name:
            f.farmer_name,

          biomass:
            f.estimated_biomass ||
            0
        }))
      );
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h1 className="text-xl font-semibold">
          Farms
        </h1>

        <button
          onClick={() =>
            setShowAdd(true)
          }
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          + Add Farmer
        </button>

      </div>

      <DataTable
        loading={loading}
        columns={[
          {
            key: "name",
            label: "Farmer Name"
          },
          {
            key: "biomass",
            label:
              "Potential Biomass (Tons)"
          }
        ]}
        rows={rows}
        actions={(row) => (
          <button
            onClick={() =>
              router.push(
                `/network/farms/${row.id}`
              )
            }
            className="text-blue-600 text-sm hover:underline"
          >
            View
          </button>
        )}
      />

      {showAdd && (
        <AddFarmerModal
          onClose={() =>
            setShowAdd(false)
          }
          onSuccess={() => {
            setShowAdd(false);

            fetchFarmers();
          }}
        />
      )}

    </div>
  );
}
