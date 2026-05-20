"use client";

import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import supabaseClient from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { UserRole } from "@/models/blog";

type AuthState = {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  isReady: boolean;
  isLoading: boolean;
  authError: string;
  initialize: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshRole: (user: User | null) => Promise<void>;
  clearAuthError: () => void;
};

let authListenerStarted = false;
let authInitialized = false;

async function getOrCreateRole(user: User | null): Promise<UserRole | null> {
  if (!user || !hasSupabaseEnv()) {
    return null;
  }

  const { data: existing } = await supabaseClient
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (existing?.role === "admin" || existing?.role === "end_user") {
    return existing.role;
  }

  const { data } = await supabaseClient
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email,
        display_name:
          user.user_metadata?.name ?? user.email?.split("@")[0] ?? "Reader",
        role: "end_user"
      },
      { onConflict: "id" }
    )
    .select("role")
    .single();

  return data?.role === "admin" ? "admin" : "end_user";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  role: null,
  isReady: false,
  isLoading: false,
  authError: "",
  initialize: async () => {
    if (authInitialized) {
      return;
    }

    authInitialized = true;

    if (!hasSupabaseEnv()) {
      set({
        isReady: true,
        authError:
          "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable login."
      });
      return;
    }

    set({ isLoading: true });
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
      set({ isReady: true, isLoading: false, authError: error.message });
      return;
    }

    const session = data.session;
    set({ session, user: session?.user ?? null });
    await get().refreshRole(session?.user ?? null);

    if (!authListenerStarted) {
      authListenerStarted = true;
      supabaseClient.auth.onAuthStateChange(async (_event, nextSession) => {
        set({ session: nextSession, user: nextSession?.user ?? null });
        await get().refreshRole(nextSession?.user ?? null);
      });
    }

    set({ isReady: true, isLoading: false });
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    if (!hasSupabaseEnv()) {
      set({
        authError:
          "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable login."
      });
      return;
    }

    set({ isLoading: true, authError: "" });
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    set({
      isLoading: false,
      authError: error ? error.message : ""
    });
  },
  signOut: async () => {
    set({ isLoading: true, authError: "" });
    await supabaseClient.auth.signOut();
    set({ session: null, user: null, role: null, isLoading: false });
  },
  refreshRole: async (user) => {
    const role = await getOrCreateRole(user);
    set({ role });
  },
  clearAuthError: () => set({ authError: "" })
}));
