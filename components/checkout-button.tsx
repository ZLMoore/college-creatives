"use client";

import { useState } from "react";

export const CheckoutButton = ({ artworkId }: { artworkId: string }) => {
  const [buyerEmail, setBuyerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artworkId, buyerEmail }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.url) {
      setError(data.error ?? "Checkout failed.");
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="mt-4 grid gap-2">
      <input
        value={buyerEmail}
        onChange={(event) => setBuyerEmail(event.target.value)}
        type="email"
        placeholder="you@email.com"
        className="rounded-none border border-navy/20 px-3 py-2 text-sm"
      />
      <button
        onClick={startCheckout}
        disabled={loading || !buyerEmail}
        className="rounded-none bg-amber px-3 py-2 text-sm font-semibold text-navy transition hover:bg-amber/90 disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Buy Print"}
      </button>
      {error ? <p className="text-xs text-coral">{error}</p> : null}
    </div>
  );
};
