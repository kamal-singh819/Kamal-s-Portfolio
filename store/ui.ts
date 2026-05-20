"use client";

import { create } from "zustand";

type UiState = {
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isAuthModalOpen: false,

  openAuthModal: () =>
    set({
      isAuthModalOpen: true,
    }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
