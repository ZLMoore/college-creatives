"use client";

import { FormEvent, useState } from "react";
import { MEDIUM_OPTIONS } from "@/lib/medium-options";

const initialState = {
  name: "",
  email: "",
  school: "",
  major: "",
  medium: "",
  bio: "",
  portfolio_url: "",
};

export const ApplyForm = () => {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const response = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();

    setLoading(false);
    if (!response.ok) {
      setStatus(data.error ?? "Application failed.");
      return;
    }

    setForm(initialState);
    setStatus("Application submitted. Check your email for confirmation.");
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 bg-white p-8 shadow-[0_32px_80px_rgba(0,0,0,0.24)]">
      {[
        ["name", "Full Name"],
        ["email", "Email Address"],
        ["school", "School"],
        ["major", "Major"],
        ["medium", "Primary Medium"],
        ["portfolio_url", "Portfolio URL (optional)"],
      ].map(([key, label]) =>
        key === "medium" ? (
          <label key={key} className="grid gap-2 text-sm font-semibold text-navy">
            {label}
            <select
              required
              value={form.medium}
              onChange={(event) => setForm((prev) => ({ ...prev, medium: event.target.value }))}
              className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral transition focus:ring-2"
            >
              <option value="" disabled>
                Select medium
              </option>
              {MEDIUM_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label key={key} className="grid gap-2 text-sm font-semibold text-navy">
            {label}
            <input
              required={key !== "portfolio_url"}
              type={key === "email" ? "email" : "text"}
              value={form[key as keyof typeof form]}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, [key]: event.target.value }))
              }
              className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral transition focus:ring-2"
            />
          </label>
        ),
      )}

      <label className="grid gap-2 text-sm font-semibold text-navy">
        Artist Bio
        <textarea
          required
          rows={6}
          value={form.bio}
          onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral transition focus:ring-2"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-coral px-4 py-3 font-semibold text-white transition hover:bg-coral/90 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {status ? <p className="text-sm text-navy/80">{status}</p> : null}
    </form>
  );
};
