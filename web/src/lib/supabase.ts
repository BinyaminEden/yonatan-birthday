import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type Blessing = {
  id: string;
  name: string;
  message: string;
  media_url: string | null;
  media_type: "image" | "video" | null;
  created_at: string;
  approved: boolean;
};

export function getPublicClient() {
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, anonKey);
}

export function getServerClient() {
  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export const STORAGE_BUCKET = "blessings-media";

export function hasSupabaseConfig() {
  return Boolean(url && anonKey);
}
