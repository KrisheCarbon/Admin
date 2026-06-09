
"use client";

import { useState } from "react";
import { createUser } from "./actions";

export default function AddUserModal({
  onClose,
  onSuccess
}) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "climapreneur"
  });

  async function handleSubmit() {

    setError(null);

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone
    ) {
      setError("Please fill all mandatory fields");
      return;
    }

    setLoading(true);

    try {

      await createUser(form);

      onSuccess();

    } catch (err) {

      setError(err.message);

    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50">

      <div className="absolute inset-0 overflow-y-auto">

        <div className="min-h-full flex justify-center py-10">

          <div className="bg-white w-full max-w-lg p-6 rounded space-y-4">

            <h2 className="text-lg font-semibold">
              Add User
            </h2>

            <input
              placeholder="First name *"
              className="w-full border px-3 py-2 rounded"
              value={form.first_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  first_name: e.target.value
                })
              }
            />

            <input
              placeholder="Middle name"
              className="w-full border px-3 py-2 rounded"
              value={form.middle_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  middle_name: e.target.value
                })
              }
            />

            <input
              placeholder="Last name *"
              className="w-full border px-3 py-2 rounded"
              value={form.last_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  last_name: e.target.value
                })
              }
            />

            <input
              placeholder="Email *"
              className="w-full border px-3 py-2 rounded"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value
                })
              }
            />

            <input
              placeholder="Phone *"
              className="w-full border px-3 py-2 rounded"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
              }
            />

            <select
              className="w-full border px-3 py-2 rounded"
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value
                })
              }
            >
              <option value="climapreneur">
                Climapreneur
              </option>

              <option value="supervisor">
                Supervisor
              </option>

              <option value="admin">
                Admin
              </option>
            </select>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-4">

              <button onClick={onClose}>
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {loading ? "Creating..." : "Create"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
