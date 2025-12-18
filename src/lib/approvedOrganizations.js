"use client";

import { getDb } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

function getApprovedPathParts() {
  const raw =
    process.env.NEXT_PUBLIC_FIREBASE_APPROVED_COLLECTION || "approved_orgs";
  return raw.split("/").filter(Boolean).length ? raw.split("/").filter(Boolean) : ["approved_orgs"];
}

function getRejectedPathParts() {
  const raw =
    process.env.NEXT_PUBLIC_FIREBASE_REJECTED_COLLECTION || "rejected_orgs";
  const parts = raw.split("/").filter(Boolean);
  return parts.length ? parts : ["rejected_orgs"];
}

function getHistoryPathParts() {
  const raw =
    process.env.NEXT_PUBLIC_FIREBASE_INTENT_HISTORY_COLLECTION || "intent_history";
  const parts = raw.split("/").filter(Boolean);
  return parts.length ? parts : ["intent_history"];
}

function normalizeIdFromName(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "org";
}

/**
 * Read approved organizations from Firestore.
 * Returns: { ok, organizations: [{ id, name, phone }], error? }
 */
export async function fetchApprovedOrganizations() {
  try {
    const db = getDb();
    const colRef = collection(db, ...getApprovedPathParts());
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach((d) => {
      const data = d.data() || {};
      const id = String(d.id);
      const name = String(data.name ?? data.organization ?? id);
      const phone = String(
        data.phone ??
          data.mobile ??
          data.phoneNumber ??
          data.contactNumber ??
          data.contact ??
          ""
      );
      list.push({ id, name, phone });
    });
    // De-dupe by name just in case
    const byName = new Map();
    for (const o of list) {
      if (!byName.has(o.name)) byName.set(o.name, o);
    }
    return { ok: true, organizations: Array.from(byName.values()) };
  } catch (e) {
    return { ok: false, organizations: [], error: String(e?.message || e) };
  }
}

/**
 * Accept an intent by adding/upserting a record in approved_orgs (or configured collection).
 * Params: { name: string, phone?: string, sourceUserId?: string }
 */
export async function approveOrganization({ name, phone = "", sourceUserId = "" }) {
  if (!name || !name.trim()) {
    return { ok: false, error: "Organization name is required" };
  }
  try {
    const db = getDb();
    const parts = getApprovedPathParts();
    const id = normalizeIdFromName(name);
    const ref = doc(collection(db, ...parts), id);
    await setDoc(
      ref,
      {
        name: name.trim(),
        phone: String(phone || ""),
        sourceUserId: String(sourceUserId || ""),
        approvedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

/**
 * Reject an intent by writing to rejected_orgs (or configured collection).
 * Params: { name, phone?, sourceUserId?, data? }
 */
export async function rejectOrganization({ name, phone = "", sourceUserId = "", data = {} }) {
  if (!name || !name.trim()) {
    return { ok: false, error: "Organization name is required" };
  }
  try {
    const db = getDb();
    const parts = getRejectedPathParts();
    const id = String(sourceUserId || `${normalizeIdFromName(name)}-${Date.now()}`);
    const ref = doc(collection(db, ...parts), id);
    await setDoc(
      ref,
      {
        name: name.trim(),
        phone: String(phone || ""),
        sourceUserId: String(sourceUserId || ""),
        snapshot: data || {},
        rejectedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export async function fetchRejectedOrganizations() {
  try {
    const db = getDb();
    const colRef = collection(db, ...getRejectedPathParts());
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach((d) => {
      const data = d.data() || {};
      list.push({
        id: String(d.id),
        name: String(data.name ?? ""),
        phone: String(data.phone ?? ""),
        sourceUserId: String(data.sourceUserId ?? ""),
        rejectedAt: data.rejectedAt ?? null,
      });
    });
    return { ok: true, organizations: list };
  } catch (e) {
    return { ok: false, organizations: [], error: String(e?.message || e) };
  }
}

/**
 * Log a decision (accept/reject) to intent_history.
 * Params: { userId, organization, action: "accept" | "reject", data? }
 */
export async function logIntentDecision({ userId = "", organization = "", action = "", data = {} }) {
  try {
    const db = getDb();
    const colRef = collection(db, ...getHistoryPathParts());
    await addDoc(colRef, {
      userId: String(userId || ""),
      organization: String(organization || ""),
      action: String(action || ""),
      payload: data || {},
      decidedAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export async function fetchIntentHistory() {
  try {
    const db = getDb();
    const colRef = collection(db, ...getHistoryPathParts());
    const snap = await getDocs(colRef);
    const list = [];
    snap.forEach((d) => {
      const data = d.data() || {};
      list.push({
        id: String(d.id),
        userId: String(data.userId ?? ""),
        organization: String(data.organization ?? ""),
        action: String(data.action ?? ""),
        payload: data.payload || {},
        decidedAt: data.decidedAt ?? null,
      });
    });
    return { ok: true, history: list };
  } catch (e) {
    return { ok: false, history: [], error: String(e?.message || e) };
  }
}


