"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { LoginInput } from "@/utils/types";

export function AuthButton() {
  const [input, setInput] = useState<LoginInput>({ email: "", password: "" });
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, isLoading, authError, initialize, signInWithEmailAndPassword, signOut } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signInWithEmailAndPassword(input.email.trim(), input.password.trim());
  }

  if (user) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-white p-3 text-sm">
        <span className="text-zinc-600">
          Signed in as <span className="font-medium text-ink">{user.email}</span>
          {role ? ` (${role})` : ""}
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          disabled={isLoading}
          className="rounded-md border border-line px-3 py-1.5 font-medium text-ink disabled:opacity-60"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-line bg-white p-3">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white"
      >
        Login
      </button>

      {isOpen ? (
        <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={input.email}
            onChange={(event) => setInput({ ...input, email: event.target.value })}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <input
            type="password"
            required
            value={input.password}
            onChange={(event) => setInput({ ...input, password: event.target.value })}
            placeholder="Password"
            className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md border border-ink px-4 py-2 text-sm font-medium text-ink disabled:opacity-60"
          >
            Login
          </button>
        </form>
      ) : null}

      {authError ? <p className="mt-2 text-sm text-zinc-600">{authError}</p> : null}
    </div>
  );
}
