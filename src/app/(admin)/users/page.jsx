
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DataTable from "@/components/table/DataTable";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import { resendSignupEmail } from "./actions";

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [resendLoading, setResendLoading] = useState(null);

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
        first_name,
        middle_name,
        last_name,
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
          role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
          status:
            u.status === "disabled"
              ? "Disabled"
              : u.status === "pending_auth"
              ? "Pending signup"
              : "Active",
          raw: u,
        }))
      );
    }

    setLoading(false);
  }

  async function handleResendEmail(row) {
    setResendLoading(row.id);
    try {
      await resendSignupEmail(row.id, row.email);
      alert(`Setup email resent to ${row.email}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
    setResendLoading(null);
  }

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || r.status === statusFilter;
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

      <p className="text-sm text-gray-500">
        New users sign up at{" "}
        <a href="/signup" className="text-gray-900 font-medium hover:underline">
          /signup
        </a>
      </p>

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
          <option value="Pending signup">Pending signup</option>
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
                    : value === "Pending signup"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        rows={filteredRows}
        actions={(row) => (
          <div className="flex gap-3">
            {row.status === "Pending signup" && (
              <button
                onClick={() => handleResendEmail(row)}
                disabled={resendLoading === row.id}
                className="text-green-700 hover:underline text-sm disabled:opacity-50"
              >
                {resendLoading === row.id ? "Sending…" : "Resend email"}
              </button>
            )}
            <button
              onClick={() => setEditUser(row.raw)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          </div>
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
