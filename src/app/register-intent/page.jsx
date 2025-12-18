"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { fetchUserIntents } from "@/lib/userIntents";
import {
  approveOrganization,
  fetchApprovedOrganizations,
  rejectOrganization,
  logIntentDecision,
  fetchIntentHistory,
} from "@/lib/approvedOrganizations";

export default function RegisterIntentPage() {
  const [loading, setLoading] = useState(true);
  const [intents, setIntents] = useState([]); // [{ id, data }]
  const [approvedNames, setApprovedNames] = useState(new Set());
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null); // { type: 'accept'|'reject', intent }
  const [history, setHistory] = useState([]); // [{ id, organization, action, decidedAt }]

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      const [intRes, appRes, histRes] = await Promise.all([
        fetchUserIntents(),
        fetchApprovedOrganizations(),
        fetchIntentHistory(),
      ]);
      if (cancelled) return;
      if (!intRes.ok) setError(intRes.error || "Failed to load intents");
      const items = (intRes.intents || []).map((d) => ({
        id: d.id,
        data: d.data || {},
      }));
      setIntents(items);
      const approved = new Set(
        (appRes.ok ? appRes.organizations : []).map((x) => x.name)
      );
      setApprovedNames(approved);
      setHistory(histRes.ok ? histRes.history : []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingIntents = useMemo(() => {
    return intents.filter((i) => {
      const org = String(i.data.organization ?? "").trim();
      return org && !approvedNames.has(org);
    });
  }, [intents, approvedNames]);

  function openConfirm(type, intent) {
    setConfirm({ type, intent });
  }

  async function performDecision() {
    if (!confirm) return;
    const intent = confirm.intent;
    const org = String(intent.data.organization ?? "").trim();
    const phone =
      String(
        intent.data.phone ??
          intent.data.mobile ??
          intent.data.phoneNumber ??
          intent.data.contactNumber ??
          intent.data.contact ??
          ""
      ) || "";
    try {
      if (confirm.type === "accept") {
        const res = await approveOrganization({
          name: org,
          phone,
          sourceUserId: intent.id,
        });
        if (!res.ok) throw new Error(res.error || "Approve failed");
        await logIntentDecision({
          userId: intent.id,
          organization: org,
          action: "accept",
          data: intent.data,
        });
        setApprovedNames((prev) => new Set([...prev, org]));
      } else {
        const res = await rejectOrganization({
          name: org,
          phone,
          sourceUserId: intent.id,
          data: intent.data,
        });
        if (!res.ok) throw new Error(res.error || "Reject failed");
        await logIntentDecision({
          userId: intent.id,
          organization: org,
          action: "reject",
          data: intent.data,
        });
        setIntents((prev) => prev.filter((i) => i.id !== intent.id));
      }
      // Refresh history list locally (append latest)
      setHistory((prev) => [
        {
          id: `${intent.id}-${Date.now()}`,
          userId: intent.id,
          organization: org,
          action: confirm.type,
          payload: intent.data,
          decidedAt: null,
        },
        ...prev,
      ]);
      setConfirm(null);
    } catch (e) {
      setError(String(e?.message || e));
    }
  }

  const tableColumns = useMemo(() => {
    const keys = new Set();
    for (const it of pendingIntents) {
      Object.keys(it.data || {}).forEach((k) => {
        // exclude createdAt/platform variants
        if (/^(createdat|created_at|_createdat|platform)$/i.test(k)) return;
        keys.add(k);
      });
    }
    const arr = Array.from(keys);
    arr.sort();
    const idx = arr.indexOf("organization");
    if (idx > 0) {
      arr.splice(idx, 1);
      arr.unshift("organization");
    }
    return arr;
  }, [pendingIntents]);

  function formatCell(value) {
    if (value === undefined || value === null) return "";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  }

  const historyColumns = useMemo(() => {
    const keys = new Set();
    for (const h of history) {
      Object.keys(h.payload || {}).forEach((k) => {
        // exclude createdAt/platform variants
        if (/^(createdat|created_at|_createdat|platform)$/i.test(k)) return;
        keys.add(k);
      });
    }
    let arr = Array.from(keys);
    // Promote contact info columns to front
    const promoteOrder = ["phone", "mobile", "phoneNumber", "contactNumber", "email"];
    const front = [];
    for (const key of promoteOrder) {
      const idx = arr.findIndex((k) => k.toLowerCase() === key.toLowerCase());
      if (idx !== -1) {
        front.push(arr[idx]);
        arr.splice(idx, 1);
      }
    }
    // Alphabetize the rest
    arr.sort();
    return [...front, ...arr];
  }, [history]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
            Register Intent
          </h1>
          <p className="text-sm text-slate-600">
            Review organizations submitted via the landing page intent form. Accept to approve.
          </p>
        </header>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <div className="text-sm text-slate-700">
              {loading ? "Loading..." : `${pendingIntents.length} pending`}
            </div>
            {error ? (
              <div className="text-xs text-red-600">{error}</div>
            ) : null}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {tableColumns.map((col) => (
                    <th key={col} className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingIntents.map((item) => (
                  <tr key={item.id} className="bg-white/60 hover:bg-slate-50 transition-colors">
                    {tableColumns.map((col) => (
                      <td key={col} className="px-4 py-2 text-slate-900 align-top">
                        <div className="max-w-[18rem] truncate" title={formatCell(item.data[col])}>
                          {formatCell(item.data[col]) || "-"}
                        </div>
                      </td>
                    ))}
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openConfirm("accept", item)}
                          className="inline-flex items-center gap-1 rounded-full bg-black text-white px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ring-black/10 hover:shadow-md transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => openConfirm("reject", item)}
                          className="inline-flex items-center gap-1 rounded-full bg-white text-slate-800 px-3 py-1.5 text-xs font-semibold border border-slate-300 hover:bg-slate-50 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && pendingIntents.length === 0 ? (
                  <tr>
                    <td colSpan={tableColumns.length + 1} className="px-4 py-6 text-center text-xs text-slate-500">
                      No pending intents.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="px-4 py-3 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900">History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600 whitespace-nowrap">
                    Organization
                  </th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600 whitespace-nowrap">
                    Action
                  </th>
                  {historyColumns.map((col) => (
                    <th key={col} className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((h) => (
                  <tr key={h.id} className="bg-white/60">
                    <td className="px-4 py-2 text-slate-900 align-top">
                      <div className="max-w-[18rem] truncate" title={h.organization || "-"}>
                        {h.organization || "-"}
                      </div>
                    </td>
                    <td className={`px-4 py-2 ${h.action === "reject" ? "text-red-600" : "text-green-600"} font-medium align-top`}>
                      {h.action || "-"}
                    </td>
                    {historyColumns.map((col) => (
                      <td key={col} className="px-4 py-2 text-slate-900 align-top">
                        <div className="max-w-[18rem] truncate" title={formatCell(h.payload?.[col])}>
                          {formatCell(h.payload?.[col]) || "-"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={2 + historyColumns.length} className="px-4 py-6 text-center text-xs text-slate-500">
                      No history yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.type === "accept" ? "Confirm Accept" : "Confirm Reject"}
        footer={
          <>
            <button
              onClick={() => setConfirm(null)}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={performDecision}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                confirm?.type === "accept" ? "bg-black hover:bg-gray-900" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {confirm?.type === "accept" ? "Accept" : "Reject"}
            </button>
          </>
        }
      >
        {confirm ? (
          <div className="text-sm text-slate-900">
            Are you sure you want to {confirm.type}{" "}
            <span className="font-semibold">
              {String(confirm.intent?.data?.organization ?? "")}
            </span>
            ?
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

