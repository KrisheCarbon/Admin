import { supabase } from "@/lib/supabase";

export async function uploadPartnerDoc({ file, bucket, partnerId, type }) {
  if (!file) {
    throw new Error(`${type.toUpperCase()} file missing`);
  }

  const ext = file.name.split(".").pop();
  const path = `${partnerId}/${type}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error("STORAGE UPLOAD ERROR:", error);
    throw error;
  }

  return path;
}
