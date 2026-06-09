
"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function createUser(form) {

  // Create auth user + send invite email
  const { data: authData, error: authError } =
    await supabase.auth.admin.inviteUserByEmail(
      form.email
    );

  if (authError) {
    throw new Error(authError.message);
  }

  // Insert into public.users
  const { error: dbError } = await supabase
    .from("users")
    .insert({
      id: authData.user.id,
      email: form.email,
      phone: form.phone,
      role: form.role,

      first_name: form.first_name,
      middle_name: form.middle_name,
      last_name: form.last_name,

      status: "pending_auth"
    });

  if (dbError) {
    throw new Error(dbError.message);
  }

  return true;
}
