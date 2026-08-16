"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@beecodefi/schemas";

export function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<MeResponse>("/me"),
    retry: false,
  });

  async function signOut() {
    await apiFetch("/auth/logout", { method: "POST" });
    queryClient.clear();
    setOpen(false);
    router.push("/");
  }

  if (!me) {
    return (
      <Link href="/auth/login" className="text-sm font-medium text-text/80 transition-colors hover:text-primary">
        Sign in
      </Link>
    );
  }

  const initial = me.displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-hover"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="hidden font-medium text-text sm:inline">{me.displayName}</span>
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-text/50">
          <path fill="currentColor" d="M5.5 7.5 10 12l4.5-4.5-1-1L10 10l-3.5-3.5-1 1z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-44 animate-fade-in-up rounded-lg border border-accent/15 bg-surface p-1 shadow-card">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-text transition-colors hover:bg-surface-hover"
            >
              Dashboard
            </Link>
            <button
              onClick={signOut}
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-error transition-colors hover:bg-error/10"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
