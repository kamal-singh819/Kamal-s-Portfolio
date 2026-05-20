"use client";

import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/store/ui";

export function AuthButton() {
  const openAuthModal = useUiStore((state) => state.openAuthModal);

  return (
    <Button
      onClick={() => openAuthModal()}
    >
      Login
    </Button>
  );
}
