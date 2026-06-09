
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LocationPicker from "@/components/maps/Locationpicker";

export default function AddFarmerModal({
  onClose,
  onSuccess
}) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [cropName, setCropName] =
    useState("");

  const [cropArea, setCropArea] =
    useState("");

  const [form, setForm] = useState({
    farmer_name: "",

    total_land_size: "",

    prior_biochar_exp: false,

    prior_biochar_acreage: "",

    gps_location: null,

    crops: []
  });

  function addCrop() {
    if (!cropName || !cropArea)
      return;

    setForm({
      ...form,
      crops: [
        ...form.crops,
        {
          crop: cropName,
          acreage: Number(cropArea)
        }
      ]
    });

    setCropName("");
    setCropArea("");
  }

  async function handleSubmit() {
    setError(null);

    if (
      !form.farmer_name ||
      !form.gps_location ||
      !form.total_land_size
    ) {
      setError(
        "Please fill all mandatory fields"
      );

      return;
    }

    if (form.crops.length === 0) {
      setError(
        "Please add at least one crop"
      );

      return;
    }

    setLoading(true);

    const estimatedBiomass =
      form.crops.reduce(
        (sum, crop) =>
          sum +
          Number(crop.acreage) * 2,
        0
      );

    const {
      data: { user }
    } = await supabase.auth.getUser();

    const { data: profile } =
      await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .single();

    const payload = {
      farmer_name:
        form.farmer_name,

      latitude:
        form.gps_location.lat,

      longitude:
        form.gps_location.lng,

      calculated_address:
        form.gps_location.address,

      total_land_size:
        Number(
          form.total_land_size
        ),

      crops: form.crops,

      prior_biochar_exp:
        form.prior_biochar_exp,

      prior_biochar_acreage:
        form.prior_biochar_acreage
          ? Number(
              form.prior_biochar_acreage
            )
          : null,

      estimated_biomass:
        estimatedBiomass,

      created_by: user.id,

      created_by_name:
        profile?.name,

      created_by_role:
        profile?.role
    };

    const { error } =
      await supabase
        .from("farmers")
        .insert(payload);

    if (error) {
      console.log(error);

      setError(error.message);

      setLoading(false);

      return;
    }

    onSuccess();

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50">

      <div className="absolute inset-0 overflow-y-auto">

        <div className="min-h-full flex items-start justify-center py-10">

          <div className="bg-white w-full max-w-3xl p-6 rounded space-y-5">

            <h2 className="text-lg font-semibold">
              Add Farmer
            </h2>

            <input
              placeholder="Farmer Name *"
              className="w-full border px-3 py-2 rounded"
              value={form.farmer_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  farmer_name:
                    e.target.value
                })
              }
            />

            <LocationPicker
              value={form.gps_location}
              onChange={(loc) =>
                setForm({
                  ...form,
                  gps_location: loc
                })
              }
            />

            <input
              type="number"
              placeholder="Total Land Size (Acres) *"
              className="w-full border px-3 py-2 rounded"
              value={
                form.total_land_size
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  total_land_size:
                    e.target.value
                })
              }
            />

            <div className="space-y-2">
              <h3 className="font-medium">
                Add Crop
              </h3>

              <input
                placeholder="Crop Name"
                className="w-full border px-3 py-2 rounded"
                value={cropName}
                onChange={(e) =>
                  setCropName(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Crop Area (Acres)"
                className="w-full border px-3 py-2 rounded"
                value={cropArea}
                onChange={(e) =>
                  setCropArea(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={addCrop}
                className="bg-black text-white px-4 py-2 rounded text-sm"
              >
                + Add Crop
              </button>
            </div>

            {form.crops.length > 0 && (
              <div className="space-y-2">
                {form.crops.map(
                  (crop, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 flex justify-between"
                    >
                      <span>
                        {crop.crop}
                      </span>

                      <span>
                        {
                          crop.acreage
                        }{" "}
                        Acres
                      </span>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-medium">
                Prior Biochar Experience
              </h3>

              <label className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  checked={
                    form.prior_biochar_exp
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      prior_biochar_exp:
                        e.target.checked
                    })
                  }
                />

                Farmer has prior biochar experience
              </label>
            </div>

            {form.prior_biochar_exp && (
              <input
                type="number"
                placeholder="Prior Biochar Acreage"
                className="w-full border px-3 py-2 rounded"
                value={
                  form.prior_biochar_acreage
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    prior_biochar_acreage:
                      e.target.value
                  })
                }
              />
            )}

            <div className="bg-neutral-100 rounded p-4">
              <p className="text-sm text-neutral-500">
                Estimated Biomass
              </p>

              <p className="text-2xl font-semibold">
                {form.crops.reduce(
                  (sum, crop) =>
                    sum +
                    Number(
                      crop.acreage
                    ) *
                      2,
                  0
                )}{" "}
                Tons
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-4">

              <button
                onClick={onClose}
                disabled={loading}
                className="text-sm"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 text-sm rounded"
              >
                {loading
                  ? "Saving..."
                  : "Create Farmer"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
