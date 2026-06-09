"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditKontikkiModal from "../EditKontikkiModal";
import { supabase } from "@/lib/supabase";

export default function KontikkiViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    if (!id) return;
    fetchKontikki();
  }, [id]);


  async function fetchKontikki() {
    setLoading(true);

    const { data, error } = await supabase
      .from("kontikkis")
      .select(`
        id,
        kontikki_code,
        artisan_pro:artisan_pros (
          id,
          name
        ),
        top_diameter_cm,
        bottom_diameter_cm,
        depth_cm,
        top_photo_url,
        side_photo_url,
        plan_pdf_url
      `)
      .eq("id", id)
      .single();

    if (error) {
      setError(error.message);
      setData(null);
    } else {
      setData(data);
    }

    setLoading(false);
  }

  async function handleDelete() {
  const confirmed = window.confirm(
    "This will permanently delete this Kontikki.\n\nThis action cannot be undone.\n\nDo you want to continue?"
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase.rpc("delete_kontikki", {
        kontikki_id: data.id,
    });

    setDeleting(false);

    if (error) {
        alert(error.message || "Failed to delete Kontikki");
        return;
    }

    alert("Kontikki deleted successfully");
    router.push("/network/kontikkis");
    }



  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>Kontikki not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Kontikki {data.kontikki_code}
        </h1>

        <div className="flex gap-2">
            <button
                onClick={() => setShowEdit(true)}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-50"
            >
                Edit
            </button>

            <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-50"
            >
                {deleting ? "Deleting..." : "Delete"}
            </button>
            </div>

      </div>

      <div className="border rounded p-4 space-y-2 text-sm">
        <p>
          <strong>Artisan Pro:</strong>{" "}
          {data.artisan_pro?.name || "-"}
        </p>
        <p>
          <strong>Top diameter:</strong>{" "}
          {data.top_diameter_cm ?? "-"} cm
        </p>
        <p>
          <strong>Bottom diameter:</strong>{" "}
          {data.bottom_diameter_cm ?? "-"} cm
        </p>
        <p>
          <strong>Depth:</strong>{" "}
          {data.depth_cm ?? "-"} cm
        </p>
      </div>

      {/* ---------- Photos ---------- */}
{(data.top_photo_url || data.side_photo_url) && (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold">Photos</h3>

    <div className="grid grid-cols-2 gap-4">
      {data.top_photo_url && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Top photo</p>
          <img
            src={data.top_photo_url}
            alt="Top view"
            className="rounded border"
          />
        </div>
      )}

      {data.side_photo_url && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Side photo</p>
          <img
            src={data.side_photo_url}
            alt="Side view"
            className="rounded border"
          />
        </div>
      )}
    </div>
  </div>
)}

{/* ---------- Plan / CAD ---------- */}
{/* ---------- Plan / CAD ---------- */}
<div className="space-y-2">
  <h3 className="text-sm font-semibold">Plan / CAD</h3>

  {data.plan_pdf_url ? (
    <a
      href={data.plan_pdf_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-sm text-blue-600 underline"
    >
      View Plan / CAD PDF
    </a>
  ) : (
    <p className="text-sm text-gray-500 italic">
      Not uploaded
    </p>
  )}
</div>

{showEdit && (
  <EditKontikkiModal
    data={data}
    onClose={() => setShowEdit(false)}
    onSuccess={() => {
      setShowEdit(false);
      fetchKontikki();
    }}
  />
)}

    </div>
  );
}
