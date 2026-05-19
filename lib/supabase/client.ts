"use client";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

const { url, anonKey } = getSupabaseEnv();

const supabaseClient = createClient(
  url || "http://localhost:54321",
  anonKey || "missing-supabase-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

export default supabaseClient;
