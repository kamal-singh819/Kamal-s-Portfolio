"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";
import type { LoginInput } from "@/utils/types";

const emptyLogin: LoginInput = { email: "", password: "" };

export function LoginModal() {
  const {
    user,
    isLoading,
    authError,
    signInWithEmailAndPassword,
    clearAuthError
  } = useAuthStore();
  const {
    isAuthModalOpen,
    closeAuthModal,
  } = useUiStore();
  const [loginInput, setLoginInput] = useState<LoginInput>(emptyLogin);

  useEffect(() => {
    if (user && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [closeAuthModal, isAuthModalOpen, user]);

  useEffect(() => {
    if (!isAuthModalOpen) {
      clearAuthError();
    }
  }, [clearAuthError, isAuthModalOpen]);

  if (!isAuthModalOpen) {
    return null;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signInWithEmailAndPassword(
      loginInput.email.trim(),
      loginInput.password.trim()
    );

    if (!useAuthStore.getState().authError) {
      toast.success("Welcome back.");
      setLoginInput(emptyLogin);
      closeAuthModal();
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/45 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Admin Login
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="rounded-md px-2 py-1 text-xl leading-none text-zinc-500 hover:bg-zinc-100 hover:text-ink"
            aria-label="Close login modal"
          >
            x
          </button>
        </div>

        <form onSubmit={handleLogin} className="mt-5 space-y-3">
          <input
            type="email"
            required
            value={loginInput.email}
            onChange={(event) =>
              setLoginInput({ ...loginInput, email: event.target.value })
            }
            placeholder="you@example.com"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <input
            type="password"
            required
            value={loginInput.password}
            onChange={(event) =>
              setLoginInput({ ...loginInput, password: event.target.value })
            }
            placeholder="Password"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Login
          </Button>
        </form>
        {authError ? <p className="mt-3 text-sm text-red-600">{authError}</p> : null}
      </div>
    </div>
  );
}
