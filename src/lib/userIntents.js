"use client";

import { getDb } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

function getUserIntentsPathParts() {
  const raw =
    process.env.NEXT_PUBLIC_FIREBASE_ORG_COLLECTION || "users";
  const parts = raw.split("/").filter(Boolean);
  return parts.length ? parts : ["users"];
}

/**
 * Fetch raw user intent documents from Firestore.
 * Returns: { ok, intents: [{ id, data }], error? }
 */
export async function fetchUserIntents() {
  try {
    const db = getDb();
    const colRef = collection(db, ...getUserIntentsPathParts());
    const snap = await getDocs(colRef);
    const intents = [];
    snap.forEach((doc) => intents.push({ id: doc.id, data: doc.data() || {} }));
    return { ok: true, intents };
  } catch (e) {
    return { ok: false, intents: [], error: String(e?.message || e) };
  }
}


