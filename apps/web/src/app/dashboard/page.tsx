"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { MeResponse } from "@beecodefi/schemas";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<MeResponse>("/me"),
    retry: false,
  });

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <Card>
        {isLoading && <p className="text-text/60">Loading…</p>}
        {isError && <p className="text-text/60">Sign in to see your progress here.</p>}
        {data && <p>Welcome back, {data.displayName}. No courses started yet.</p>}
      </Card>
    </section>
  );
}
