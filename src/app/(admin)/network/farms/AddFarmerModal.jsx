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

  const [sowingDate, setSowingDate] =
    useState("");

  const [harvestDate, setHarvestDate] =
    useState("");

  const [form, setForm] = useState({
    farmer_name: "",

    phone_number: "",

    total_land_size: "",

    interested_in_biochar: true,

    prior_biochar_exp: false,

    prior_biochar_acreage: "",

    gps_location: null,

    crops: []
  });

  function addCrop() {
    if (
      !cropName ||
      !cropArea ||
      !sowingDate ||
      !harvestDate
    )
      return;

    setForm({
      ...form,
      crops: [
        ...form.crops,
        {
          crop: cropName,

          acreage: Number(cropArea),

          sowing_date: sowingDate,

          estimated_harvest_date:
            harvestDate
        }
      ]
    });

    setCropName("");
    setCropArea("");
    setSowingDate("");
    setHarvestDate("");
  }

  async function handleSubmit() {
    setError(null);

    if (
      !form.farmer_name ||
      !form.phone_number ||
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

      phone_number:
        form.phone_number,

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

      interested_in_biochar:
        form.interested_in_biochar,

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

        <div className="min-h-full flex items-start justify-center py-10 px-4">

          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl">

            {/* Header */}
            <div className="border-b px-6 py-4">

              <h2 className="text-xl font-semibold">
                Add Farmer
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Capture farmer details,
                crop information and
                biochar interest
              </p>

            </div>

            <div className="p-6 space-y-8">

              {/* Farmer Info */}
              <div className="space-y-4">

                <div>

                  <h3 className="font-semibold text-lg">
                    Farmer Information
                  </h3>

                  <p className="text-sm text-neutral-500">
                    Basic farmer details
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <input
                    placeholder="Farmer Name *"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={
                      form.farmer_name
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        farmer_name:
                          e.target.value
                      })
                    }
                  />

                  <input
                    placeholder="Phone Number *"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={
                      form.phone_number
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone_number:
                          e.target.value
                      })
                    }
                  />

                </div>

                <LocationPicker
                  value={
                    form.gps_location
                  }
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
                  className="w-full border px-3 py-2 rounded-lg"
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

              </div>

              {/* Crop Section */}
              <div className="space-y-4">

                <div>

                  <h3 className="font-semibold text-lg">
                    Crop Details
                  </h3>

                  <p className="text-sm text-neutral-500">
                    Add all active crops
                    cultivated by the
                    farmer
                  </p>

                </div>

                <div className="border rounded-xl p-4 bg-neutral-50 space-y-4">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                      placeholder="Crop Name"
                      className="w-full border px-3 py-2 rounded-lg bg-white"
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
                      className="w-full border px-3 py-2 rounded-lg bg-white"
                      value={cropArea}
                      onChange={(e) =>
                        setCropArea(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-1">

                      <label className="text-sm text-neutral-600">
                        Estimated Sowing Date
                      </label>

                      <input
                        type="date"
                        className="w-full border px-3 py-2 rounded-lg bg-white"
                        value={sowingDate}
                        onChange={(e) =>
                          setSowingDate(
                            e.target.value
                          )
                        }
                      />

                    </div>

                    <div className="space-y-1">

                      <label className="text-sm text-neutral-600">
                        Estimated Harvest
                        Date
                      </label>

                      <input
                        type="date"
                        className="w-full border px-3 py-2 rounded-lg bg-white"
                        value={harvestDate}
                        onChange={(e) =>
                          setHarvestDate(
                            e.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={addCrop}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                  >
                    + Add Crop
                  </button>

                </div>

                {form.crops.length >
                  0 && (
                  <div className="space-y-3">

                    {form.crops.map(
                      (
                        crop,
                        index
                      ) => (
                        <div
                          key={index}
                          className="border rounded-xl p-4"
                        >
                          <div className="flex items-center justify-between">

                            <div>

                              <h4 className="font-medium">
                                {
                                  crop.crop
                                }
                              </h4>

                              <p className="text-sm text-neutral-500">
                                {
                                  crop.acreage
                                }{" "}
                                Acres
                              </p>

                            </div>

                            <div className="text-sm text-right text-neutral-600">

                              <p>
                                Sowing:{" "}
                                {
                                  crop.sowing_date
                                }
                              </p>

                              <p>
                                Harvest:{" "}
                                {
                                  crop.estimated_harvest_date
                                }
                              </p>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* Biochar Section */}
              <div className="space-y-4">

                <div>

                  <h3 className="font-semibold text-lg">
                    Biochar Information
                  </h3>

                  <p className="text-sm text-neutral-500">
                    Track farmer
                    adoption readiness
                  </p>

                </div>

                <div className="space-y-3">

                  <label className="flex items-center gap-3 border rounded-xl p-4">

                    <input
                      type="checkbox"
                      checked={
                        form.interested_in_biochar
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          interested_in_biochar:
                            e.target.checked
                        })
                      }
                    />

                    <span>
                      Farmer is interested
                      in biochar
                    </span>

                  </label>

                  <label className="flex items-center gap-3 border rounded-xl p-4">

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

                    <span>
                      Farmer has prior
                      biochar experience
                    </span>

                  </label>

                </div>

                {form.prior_biochar_exp && (
                  <input
                    type="number"
                    placeholder="Prior Biochar Acreage"
                    className="w-full border px-3 py-2 rounded-lg"
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

              </div>

              {/* Biomass */}
              <div className="bg-neutral-100 rounded-2xl p-5">

                <p className="text-sm text-neutral-500">
                  Estimated Biomass
                </p>

                <p className="text-3xl font-bold mt-1">
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
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex justify-end gap-3">

              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleSubmit}
                className="bg-black text-white px-5 py-2 text-sm rounded-lg"
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