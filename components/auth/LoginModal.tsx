"use client";

import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";
import type { LoginInput, RegisterInput } from "@/utils/types";

const emptyLogin: LoginInput = { email: "", password: "" };
const emptyRegister: RegisterInput = { email: "", password: "", name: "" };

export function LoginModal() {
  const {
    user,
    isLoading,
    authError,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
    clearAuthError
  } = useAuthStore();
  const {
    isAuthModalOpen,
    authModalMode,
    authModalReason,
    closeAuthModal,
    setAuthModalMode
  } = useUiStore();
  const [loginInput, setLoginInput] = useState<LoginInput>(emptyLogin);
  const [registerInput, setRegisterInput] = useState<RegisterInput>(emptyRegister);

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

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signUpWithEmailAndPassword(
      registerInput.email.trim(),
      registerInput.password,
      registerInput.name.trim()
    );

    if (!useAuthStore.getState().authError) {
      toast.success("Account created. Check your email if confirmation is enabled.");
      setRegisterInput(emptyRegister);
      closeAuthModal();
    }
  }

  const isLogin = authModalMode === "login";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/45 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {isLogin ? "Login" : "Create account"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Join the conversation
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {authModalReason ||
                "Use your email and password to like posts and leave responses."}
            </p>
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

        <div className="mt-5 grid grid-cols-2 rounded-md border border-line bg-zinc-50 p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setAuthModalMode("login")}
            className={`rounded px-3 py-2 ${isLogin ? "bg-white text-ink shadow-sm" : "text-zinc-500"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setAuthModalMode("signup")}
            className={`rounded px-3 py-2 ${!isLogin ? "bg-white text-ink shadow-sm" : "text-zinc-500"}`}
          >
            Sign up
          </button>
        </div>

        {isLogin ? (
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
        ) : (
          <form onSubmit={handleSignup} className="mt-5 space-y-3">
            <input
              required
              value={registerInput.name}
              onChange={(event) =>
                setRegisterInput({ ...registerInput, name: event.target.value })
              }
              placeholder="Display name"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <input
              type="email"
              required
              value={registerInput.email}
              onChange={(event) =>
                setRegisterInput({ ...registerInput, email: event.target.value })
              }
              placeholder="you@example.com"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <input
              type="password"
              required
              minLength={6}
              value={registerInput.password}
              onChange={(event) =>
                setRegisterInput({ ...registerInput, password: event.target.value })
              }
              placeholder="Password"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <Button type="submit" isLoading={isLoading} className="w-full">
              Create account
            </Button>
          </form>
        )}

        {authError ? <p className="mt-3 text-sm text-red-600">{authError}</p> : null}
      </div>
    </div>
  );
}
