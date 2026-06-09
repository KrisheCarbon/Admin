"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddKontikkiModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [artisanPros, setArtisanPros] = useState([]);

  const [form, setForm] = useState({
    kontikki_code: "",
    artisan_pro_id: "",

    top_diameter_cm: "",
    bottom_diameter_cm: "",
    depth_cm: "",

    top_photo: null,
    side_photo: null,
    plan_pdf: null,
  });

  /* ---------------- Fetch Artisan Pros ---------------- */

  useEffect(() => {
    fetchArtisanPros();
  }, []);

  async function fetchArtisanPros() {
    const { data, error } = await supabase
      .from("artisan_pros")
      .select("id, name")
      .order("name");

    if (!error) setArtisanPros(data || []);
  }

  /* ---------------- Upload helper ---------------- */

  async function uploadFile(bucket, file, folder) {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /* ---------------- Submit ---------------- */

  async function handleSubmit() {
    setError(null);

    if (
      !form.kontikki_code ||
      !form.artisan_pro_id ||
      !form.top_diameter_cm ||
      !form.bottom_diameter_cm ||
      !form.depth_cm ||
      !form.top_photo ||
      !form.side_photo
    ) {
      setError("Please fill all mandatory fields");
      return;
    }

    setLoading(true);

    try {
      const topPhotoUrl = await uploadFile(
        "kontikki-assets-photos",
        form.top_photo,
        "top"
      );

      const sidePhotoUrl = await uploadFile(
        "kontikki-assets-photos",
        form.side_photo,
        "side"
      );

      let planPdfUrl = null;
      if (form.plan_pdf) {
        planPdfUrl = await uploadFile(
          "kontikki-assets-plan",
          form.plan_pdf,
          "plan"
        );
      }

      const payload = {
        kontikki: {
          kontikki_code: form.kontikki_code,
          artisan_pro_id: form.artisan_pro_id,

          top_diameter_cm: form.top_diameter_cm,
          bottom_diameter_cm: form.bottom_diameter_cm,
          depth_cm: form.depth_cm,

          top_photo_url: topPhotoUrl,
          side_photo_url: sidePhotoUrl,
          plan_pdf_url: planPdfUrl,
        },
      };

      const { error } = await supabase.rpc("create_kontikki", {
        payload,
      });

      if (error) throw error;

      onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create Kontikki");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex justify-center py-10">
          <div className="bg-white p-6 w-full max-w-3xl rounded space-y-4">

            <h2 className="text-lg font-semibold">
              Add Kontikki
            </h2>

            {/* Artisan Pro */}
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.artisan_pro_id}
              onChange={(e) =>
                setForm({ ...form, artisan_pro_id: e.target.value })
              }
            >
              <option value="">Select Artisan Pro *</option>
              {artisanPros.map((ap) => (
                <option key={ap.id} value={ap.id}>
                  {ap.name}
                </option>
              ))}
            </select>

            {/* Kontikki ID */}
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Kontikki ID / Code *"
              value={form.kontikki_code}
              onChange={(e) =>
                setForm({ ...form, kontikki_code: e.target.value })
              }
            />

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Top diameter (cm) *"
                className="border px-3 py-2 rounded"
                value={form.top_diameter_cm}
                onChange={(e) =>
                  setForm({ ...form, top_diameter_cm: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Bottom diameter (cm) *"
                className="border px-3 py-2 rounded"
                value={form.bottom_diameter_cm}
                onChange={(e) =>
                  setForm({ ...form, bottom_diameter_cm: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Depth (cm) *"
                className="border px-3 py-2 rounded"
                value={form.depth_cm}
                onChange={(e) =>
                  setForm({ ...form, depth_cm: e.target.value })
                }
              />
            </div>

            {/* Photos */}
            {/* ---------------- Photos ---------------- */}
<div className="space-y-4">
  {/* Top Photo */}
  <div className="border rounded p-4 space-y-2">
    <label className="text-sm font-medium">
      Top photo *
    </label>

    <label className="flex items-center justify-center border-2 border-dashed rounded h-28 cursor-pointer text-sm text-gray-600 hover:bg-gray-50">
      {form.top_photo
        ? `Selected: ${form.top_photo.name}`
        : "Click to upload top photo"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          setForm({
            ...form,
            top_photo: e.target.files[0],
          })
        }
      />
    </label>
  </div>

  {/* Side Photo */}
  <div className="border rounded p-4 space-y-2">
    <label className="text-sm font-medium">
      Side photo *
    </label>

    <label className="flex items-center justify-center border-2 border-dashed rounded h-28 cursor-pointer text-sm text-gray-600 hover:bg-gray-50">
      {form.side_photo
        ? `Selected: ${form.side_photo.name}`
        : "Click to upload side photo"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          setForm({
            ...form,
            side_photo: e.target.files[0],
          })
        }
      />
    </label>
  </div>
</div>

            {/* Plan PDF */}
            {/* ---------------- Plan / CAD ---------------- */}
<div className="border rounded p-4 space-y-2">
  <label className="text-sm font-medium">
    Plan / CAD (PDF, optional)
  </label>

  <input
    type="file"
    accept="application/pdf"
    className="block w-full text-sm
      file:mr-4 file:py-2 file:px-4
      file:rounded file:border-0
      file:text-sm file:font-medium
      file:bg-gray-100 file:text-gray-700
      hover:file:bg-gray-200"
    onChange={(e) =>
      setForm({ ...form, plan_pdf: e.target.files[0] })
    }
  />

  {form.plan_pdf && (
    <p className="text-xs text-gray-600">
      Selected: {form.plan_pdf.name}
    </p>
  )}
</div>


            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={onClose}>
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {loading ? "Saving..." : "Create Kontikki"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
