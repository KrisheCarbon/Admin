"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function checkSignupEmail(email) {
  const { data, error } = await admin
    .from("users")
    .select("status")
    .ilike("email", email.trim())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return { allowed: false, reason: "not_found" };
  if (data.status === "disabled") return { allowed: false, reason: "disabled" };
  if (data.status === "active") return { allowed: false, reason: "already_active" };
  if (data.status === "pending_auth") return { allowed: true };

  return { allowed: false, reason: "unknown" };
}

export async function completeSignup({ userId }) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const { error } = await admin
    .from("users")
    .update({ status: "active" })
    .eq("id", userId)
    .eq("status", "pending_auth");

  if (error) throw new Error(error.message);
  return true;
}
