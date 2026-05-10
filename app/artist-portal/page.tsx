"use client";

import type { CSSProperties } from "react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function ArtistPortalPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/artist-portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok || !data.url) {
      setError(data.error ?? "Could not open dashboard.");
      return;
    }
    window.location.href = data.url as string;
  };

  const fieldWidth: CSSProperties = {
    width: "100%",
    maxWidth: "480px",
    marginLeft: "auto",
    marginRight: "auto",
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: "#12172A",
        color: "#fff",
        fontFamily: '"DM Sans", sans-serif',
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        .artist-portal-dashboard-btn {
          width: 100%;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
          margin-top: 2px;
          background: #f5a623;
          color: #12172a;
          border: none;
          border-radius: 40px;
          padding: 14px 18px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .artist-portal-dashboard-btn:hover:not(:disabled) {
          background: #e8503a;
          color: #fff;
        }
        .artist-portal-dashboard-btn:disabled {
          cursor: wait;
          opacity: 0.6;
        }
      `}</style>
      <SiteHeader />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "640px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 11,
              letterSpacing: 3,
              color: "#3BAFD4",
              textTransform: "uppercase",
              margin: "0 0 12px",
            }}
          >
            Artist Portal
          </p>
          <h1
            style={{
              margin: "0 0 14px",
              fontFamily: '"Playfair Display", serif',
              fontSize: "clamp(34px, 5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-1px",
              color: "#fff",
            }}
          >
            Welcome back, <span style={{ fontStyle: "italic", color: "#F5A623" }}>creator.</span>
          </h1>
          <p
            style={{
              margin: "0 0 32px",
              maxWidth: "560px",
              fontSize: 15,
              lineHeight: 1.75,
              color: "rgba(255,255,255,.72)",
            }}
          >
            Access your Stripe dashboard to view your sales, track payouts, and manage your creations.
          </p>

          <form
            onSubmit={onSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              margin: 0,
              padding: 0,
              border: "none",
              background: "transparent",
            }}
          >
            <label style={{ ...fieldWidth, display: "grid", gap: 8, textAlign: "left" }}>
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 10,
                  color: "rgba(255,255,255,.5)",
                  textTransform: "uppercase",
                  letterSpacing: 1.3,
                }}
              >
                EMAIL
              </span>
              <input
                required
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                style={{
                  padding: "14px 20px",
                  fontSize: "15px",
                  width: "100%",
                  maxWidth: "480px",
                  background: "rgba(255,255,255,0.06)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  color: "#fff",
                  outline: "none",
                  fontFamily: '"DM Sans", sans-serif',
                  display: "block",
                  margin: "0 auto 12px",
                }}
              />
            </label>
            {error ? (
              <p style={{ ...fieldWidth, margin: 0, color: "#E8503A", fontSize: 14, textAlign: "left" }}>{error}</p>
            ) : null}
            <button type="submit" disabled={loading} className="artist-portal-dashboard-btn">
              {loading ? "Redirecting..." : "Access my dashboard →"}
            </button>

            <p
              style={{
                ...fieldWidth,
                margin: "32px 0 0",
                fontSize: 13,
                color: "rgba(255,255,255,.55)",
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              Not an artist yet?{" "}
              <Link href="/apply" style={{ color: "#3BAFD4", textDecoration: "none", fontWeight: 600 }}>
                Apply to join →
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
