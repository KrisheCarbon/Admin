"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/table/DataTable";
import AddClusterModal from "./AddClusterModal";
import { useRouter } from "next/navigation";

export default function ClustersPage() {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchClusters();
  }, []);

  async function fetchClusters() {
    setLoading(true);

    const { data, error } = await supabase
      .from("clusters")
      .select(`
        id,
        name,
        created_by_name,
        clusters_villages (
          number_of_farmers,
          clusters_villages_crops (
            acres,
            estimated_biochar_m3_per_year
          )
        )
      `);

    if (!error) {
      const formatted = data.map((c) => {
      const villages = c.clusters_villages || [];

      const totalVillages = villages.length;

      const totalFarmers = villages.reduce(
        (sum, v) => sum + (v.number_of_farmers || 0),
        0
      );

      const totalAcres = villages.reduce(
        (sum, v) =>
          sum +
          (v.clusters_villages_crops || []).reduce(
            (s, crop) => s + (crop.acres || 0),
            0
          ),
        0
      );

      const totalBiochar = villages.reduce(
        (sum, v) =>
          sum +
          (v.clusters_villages_crops || []).reduce(
            (s, crop) =>
              s + (crop.estimated_biochar_m3_per_year || 0),
            0
          ),
        0
      );

      return {
        id: c.id,
        cluster_name: c.name,
        villages: totalVillages,
        farmers: totalFarmers,
        acres: totalAcres,
        biochar: totalBiochar,
        created_by: c.created_by_name, // fallback to creator
      };
    });


      setClusters(formatted);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clusters</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          + Add Cluster
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={[
          { key: "cluster_name", label: "Cluster Name" },
          { key: "villages", label: "Villages" },
          { key: "farmers", label: "Farmers" },
          { key: "acres", label: "Acres" },
          { key: "biochar", label: "Biochar (m³/year)" },
          { key: "created_by", label: "Created By" },
        ]}
        rows={clusters}
        actions={(row) => (
          <button
            onClick={() => router.push(`/network/clusters/${row.id}`)}
            className="text-sm text-blue-600 hover:underline"
          >
            View
          </button>
        )}
      />

      {showAddModal && (
        <AddClusterModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchClusters();
          }}
        />
      )}
    </div>
  );
}
