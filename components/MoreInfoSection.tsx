"use client";

import { FormEvent, useState } from "react";

export function MoreInfoSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/send-more-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setStatus(data.error ?? "Something went wrong.");
      return;
    }
    setName("");
    setEmail("");
    setStatus("Check your inbox — we sent you the details.");
  };

  return (
    <section
      className="more-info-wrap"
      style={{
        background: "#F7F4EF",
        borderTop: "1px solid #E0DDD8",
        padding: "56px 48px 64px",
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 10,
            letterSpacing: 3,
            color: "#7A7670",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Stay in the loop
        </p>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: "#12172A",
            marginBottom: 12,
          }}
        >
          Want more info?
        </h2>
        <p style={{ fontSize: 15, color: "#7A7670", lineHeight: 1.7, marginBottom: 24 }}>
          Leave your name and email and we&apos;ll send you our mission, how selling works, and
          what makes College Creatives different.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 10,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#7A7670",
              }}
            >
              Name
            </span>
            <input
              required
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                border: "0.5px solid #ddd",
                fontSize: 14,
                fontFamily: '"DM Sans", sans-serif',
              }}
            />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 10,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#7A7670",
              }}
            >
              Email
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                border: "0.5px solid #ddd",
                fontSize: 14,
                fontFamily: '"DM Sans", sans-serif',
              }}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#12172A",
              color: "#fff",
              border: "none",
              borderRadius: 40,
              padding: "14px 24px",
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "wait" : "pointer",
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {loading ? "Sending…" : "Send me more info"}
          </button>
          {status ? (
            <p style={{ margin: 0, fontSize: 14, color: "#12172A" }}>{status}</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
