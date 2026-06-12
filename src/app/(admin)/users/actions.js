"use server";

import { createClient } from "@supabase/supabase-js";
import { getSignupRedirect, getSiteUrl } from "@/lib/siteUrl";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function createUser(form) {
  const redirectTo = getSignupRedirect();

  const { data: authData, error: authError } =
    await supabase.auth.admin.inviteUserByEmail(form.email, {
      data: { role: form.role },
      redirectTo,
    });

  if (authError) throw new Error(authError.message);

  const { error: dbError } = await supabase
    .from("users")
    .insert({
      id: authData.user.id,
      email: form.email,
      phone: form.phone,
      role: form.role,
      first_name: form.first_name,
      middle_name: form.middle_name || null,
      last_name: form.last_name,
      status: "pending_auth",
    });

  if (dbError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(dbError.message);
  }

  return {
    email: form.email,
    signupUrl: `${getSiteUrl()}/signup`,
    emailSent: true,
  };
}

export async function resendSignupEmail(id, email) {
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: getSignupRedirect(),
  });

  if (error) throw new Error(error.message);

  await supabase
    .from("users")
    .update({ status: "pending_auth" })
    .eq("id", id);

  return { emailSent: true };
}

export async function updateUser(id, form) {
  const { error } = await supabase
    .from("users")
    .update({
      phone: form.phone,
      role: form.role,
      status: form.status,
      first_name: form.first_name,
      middle_name: form.middle_name || null,
      last_name: form.last_name,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
}

export async function disableUser(id) {
  const { error: authError } = await supabase.auth.admin.updateUserById(id, {
    ban_duration: "87600h",
  });
  if (authError) throw new Error(authError.message);

  const { error: dbError } = await supabase
    .from("users")
    .update({ status: "disabled" })
    .eq("id", id);

  if (dbError) throw new Error(dbError.message);
  return true;
}
