"use client";

import { create } from "zustand";

type AuthModalMode = "login" | "signup";

type UiState = {
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  authModalReason: string;
  openAuthModal: (reason?: string, mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: AuthModalMode) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isAuthModalOpen: false,
  authModalMode: "login",
  authModalReason: "",
  openAuthModal: (reason = "", mode = "login") =>
    set({
      isAuthModalOpen: true,
      authModalMode: mode,
      authModalReason: reason
    }),
  closeAuthModal: () => set({ isAuthModalOpen: false, authModalReason: "" }),
  setAuthModalMode: (mode) => set({ authModalMode: mode })
}));
