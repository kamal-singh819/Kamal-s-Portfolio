"use client";

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuthStore } from "@/store/auth";

export function AppProviders() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <>
      <LoginModal />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          className: "text-sm"
        }}
      />
    </>
  );
}
