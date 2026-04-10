import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SITE_MEDIA_BUCKET = "site-media";
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.",
    );
  }
}

export async function uploadImageFile(file, folder = "uploads") {
  ensureSupabaseConfigured();

  if (!supabase) {
    throw new Error("Supabase is not available for uploads.");
  }

  if (!file) {
    throw new Error("No file selected for upload.");
  }

  const extension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
  const safeName =
    file.name
      ?.replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "image";
  const uniqueId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filePath = `${folder}/${uniqueId}-${safeName}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(SITE_MEDIA_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    throw new Error(
      uploadError.message || "Upload failed. Make sure the `site-media` storage bucket exists and admin storage policies are applied.",
    );
  }

  const { data } = supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("Image uploaded but no public URL was returned.");
  }

  return data.publicUrl;
}
