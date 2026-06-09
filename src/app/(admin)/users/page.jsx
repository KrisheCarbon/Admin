
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/table/DataTable";
import AddUserModal from "./AddUserModal";

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        full_name,
        email,
        phone,
        role,
        status
      `)
      .order("created_at", { ascending: false });

    if (!error) {
      setRows(
        data.map((u) => ({
          id: u.id,
          name: u.full_name,
          email: u.email,
          phone: u.phone,

          role:
            u.role.charAt(0).toUpperCase() +
            u.role.slice(1),

          status:
            u.status === "disabled"
              ? "Disabled"
              : u.status === "pending_auth"
              ? "Pending Auth"
              : "Active",

          raw: u
        }))
      );
    }

    setLoading(false);
  }

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      !statusFilter || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Users</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          + Add User
        </button>
      </div>

      <div className="flex gap-3 items-center">

        <input
          placeholder="Search by name or email"
          className="border px-3 py-2 rounded text-sm w-64"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded text-sm"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Pending Auth">Pending Auth</option>
          <option value="Disabled">Disabled</option>
        </select>

      </div>

      <DataTable
        loading={loading}
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "role", label: "Role" },

          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  value === "Active"
                    ? "bg-green-100 text-green-700"
                    : value === "Pending Auth"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {value}
              </span>
            )
          }
        ]}
        rows={filteredRows}
        actions={(row) => (
          <button
            onClick={() => setEditUser(row.raw)}
            className="text-blue-600 hover:underline text-sm"
          >
            Edit
          </button>
        )}
      />

      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            fetchData();
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          data={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => {
            setEditUser(null);
            fetchData();
          }}
        />
      )}

    </div>
  );
}

