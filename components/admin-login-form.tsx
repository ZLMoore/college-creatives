"use client";

import { FormEvent, useState } from "react";

export const AdminLoginForm = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Authentication failed.");
      return;
    }

    window.location.reload();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-20 grid max-w-md gap-4 bg-white p-8 shadow-[0_22px_60px_rgba(0,0,0,0.18)]"
    >
      <h1 className="font-serif text-3xl text-navy">Admin Access</h1>
      <p className="text-sm text-navy/70">Enter dashboard password to continue.</p>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral transition focus:ring-2"
        required
      />
      <button type="submit" className="rounded-lg bg-navy px-4 py-2 font-semibold text-cream">
        Unlock Dashboard
      </button>
      {error ? <p className="text-sm text-coral">{error}</p> : null}
    </form>
  );
};
