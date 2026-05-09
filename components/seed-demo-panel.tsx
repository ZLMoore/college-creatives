"use client";

import { useState } from "react";

export function SeedDemoPanel() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  const runSeed = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(`/api/seed?secret=${encodeURIComponent(secret)}`, { method: "GET" });
      const data = await res.json();
      setSecret("");
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error ?? "Request failed.");
        return;
      }
      setStatus("ok");
      setMessage(JSON.stringify(data.result, null, 2));
    } catch {
      setStatus("err");
      setMessage("Network error.");
    }
  };

  return (
    <section className="rounded-xl border border-navy/10 bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
      <h2 className="font-serif text-3xl text-navy">Seed demo artists</h2>
      <p className="mt-2 max-w-2xl text-sm text-navy/70">
        Inserts approved demo artists and published artworks into Supabase (skips any that already exist by
        slug or artwork title). Uses the same slugs as the marketing homepage.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="grid flex-1 gap-1 text-sm font-medium text-navy">
          Admin password
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          onClick={runSeed}
          disabled={status === "loading" || !secret.trim()}
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
        >
          {status === "loading" ? "Seeding…" : "Run seed"}
        </button>
      </div>
      {status === "ok" ? (
        <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-cream p-3 text-xs text-navy">{message}</pre>
      ) : null}
      {status === "err" ? <p className="mt-4 text-sm text-coral">{message}</p> : null}
    </section>
  );
}
