"use client";

import type { CSSProperties } from "react";
import { FormEvent, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { isEduEmail } from "@/lib/edu";
import { MEDIUM_OPTIONS } from "@/lib/medium-options";

const initial = {
  name: "",
  email: "",
  school: "",
  major: "",
  medium: "",
  portfolio_url: "",
  bio: "",
};

const APPLY_NAV_HEIGHT_PX = 58;

function applyHeroImageFor(isDark: boolean, isWinter: boolean): string {
  if (isWinter) {
    return isDark ? "/images/night_college_snow_aerial.png" : "/images/day_college_snow_aerial.png";
  }
  return isDark ? "/images/night_college_aerial.png" : "/images/sunset_college_aerial.png";
}

export default function ApplyPage() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [applyHeroBgUrl, setApplyHeroBgUrl] = useState("/images/sunset_college_aerial.png");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const month = new Date().getMonth() + 1;
      const isWinter = month === 12 || month === 1 || month === 2;
      setApplyHeroBgUrl(applyHeroImageFor(mq.matches, isWinter));
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!isEduEmail(form.email)) {
      setError("Please use a valid .edu university email.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email.trim().toLowerCase(),
        school: form.school,
        major: form.major,
        medium: form.medium,
        bio: form.bio,
        portfolio_url: form.portfolio_url || null,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Application failed.");
      return;
    }
    setForm(initial);
    setStatus("Application received. Check your email for confirmation.");
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        border: "none",
        background: "#12172A",
        color: "#fff",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <SiteHeader />

      <main
        className="apply-split"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          minHeight: `calc(100vh - ${APPLY_NAV_HEIGHT_PX}px)`,
          margin: 0,
          padding: 0,
          background: "#12172A",
          alignItems: "stretch",
        }}
      >
        <style>{`
            @media (max-width: 900px) {
              .apply-split { flex-direction: column !important; }
              .apply-left-col {
                width: 100% !important;
                min-height: 45vh !important;
              }
              .apply-right-col {
                width: 100% !important;
                padding: 56px 24px 80px !important;
              }
            }
            .apply-form-field:focus,
            .apply-form-field:focus-visible {
              outline: none;
              border-color: #e8503a;
              box-shadow: 0 0 0 2px rgba(232, 80, 58, 0.45);
            }
            .apply-submit-btn {
              margin-top: 4px;
              width: 100%;
              background: #f5a623;
              color: #12172a;
              border: none;
              border-radius: 40px;
              padding: 14px;
              font-size: 14px;
              font-weight: 600;
              font-family: "DM Sans", sans-serif;
              cursor: pointer;
              transition: background 0.2s ease, color 0.2s ease;
            }
            .apply-submit-btn:hover:not(:disabled) {
              background: #e8503a;
              color: #fff;
            }
            .apply-submit-btn:disabled {
              cursor: wait;
              opacity: 0.6;
            }
          `}</style>
          <div
            className="apply-left-col"
            style={{
              position: "relative",
              width: "50%",
              minHeight: "100%",
              margin: 0,
              padding: 0,
              flexShrink: 0,
              backgroundImage: `url('${applyHeroBgUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(18,23,42,0.5)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: 11,
                  letterSpacing: 3,
                  color: "#F5A623",
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                }}
              >
                Application
              </p>
              <h1
                style={{
                  margin: "0 0 20px",
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "clamp(32px, 4.2vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  lineHeight: 1.08,
                  color: "#fff",
                }}
              >
                Ready to sell your{" "}
                <span style={{ fontStyle: "italic", color: "#E8503A" }}>art?</span>
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,.72)",
                  maxWidth: 440,
                }}
              >
                We handle printing, shipping, and payments. You set your price and keep 90% of your markup.
              </p>
            </div>
          </div>

          <div
            className="apply-right-col"
            style={{
              width: "50%",
              minWidth: 0,
              flexShrink: 0,
              margin: 0,
              padding: "56px 48px 80px",
              boxSizing: "border-box",
              background: "#12172A",
            }}
          >
          <form
            onSubmit={onSubmit}
            style={{
              width: "100%",
              minWidth: 0,
              padding: 0,
              display: "grid",
              gap: 16,
            }}
          >
            <label style={labelBlock}>
              <span style={labelText}>Full Name</span>
              <input
                required
                value={form.name}
                onChange={(ev) => setForm((p) => ({ ...p, name: ev.target.value }))}
                placeholder="Your full name"
                className="apply-form-field"
                style={inputStyle}
              />
            </label>
            <label style={labelBlock}>
              <span style={labelText}>University Email (.edu required)</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(ev) => setForm((p) => ({ ...p, email: ev.target.value }))}
                placeholder="you@university.edu"
                className="apply-form-field"
                style={inputStyle}
              />
            </label>
            <label style={labelBlock}>
              <span style={labelText}>School</span>
              <input
                required
                value={form.school}
                onChange={(ev) => setForm((p) => ({ ...p, school: ev.target.value }))}
                placeholder="e.g. Boston University"
                className="apply-form-field"
                style={inputStyle}
              />
            </label>
            <label style={labelBlock}>
              <span style={labelText}>Major</span>
              <input
                required
                value={form.major}
                onChange={(ev) => setForm((p) => ({ ...p, major: ev.target.value }))}
                placeholder="e.g. Fine Arts"
                className="apply-form-field"
                style={inputStyle}
              />
            </label>
            <label style={labelBlock}>
              <span style={labelText}>Medium / Style</span>
              <select
                required
                value={form.medium}
                onChange={(ev) => setForm((p) => ({ ...p, medium: ev.target.value }))}
                className="apply-form-field"
                style={{ ...inputStyle, cursor: "pointer" }}
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
            <label style={labelBlock}>
              <span style={labelText}>Portfolio Link (optional)</span>
              <input
                type="text"
                value={form.portfolio_url}
                onChange={(ev) => setForm((p) => ({ ...p, portfolio_url: ev.target.value }))}
                placeholder="Instagram, Behance, personal site"
                className="apply-form-field"
                style={inputStyle}
              />
            </label>
            <label style={labelBlock}>
              <span style={labelText}>Tell us about your work</span>
              <textarea
                required
                rows={5}
                value={form.bio}
                onChange={(ev) => setForm((p) => ({ ...p, bio: ev.target.value }))}
                placeholder="What inspires you?"
                className="apply-form-field"
                style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
              />
            </label>
            {error ? <p style={{ margin: 0, color: "#E8503A", fontSize: 14 }}>{error}</p> : null}
            {status ? <p style={{ margin: 0, color: "#3BAFD4", fontSize: 14 }}>{status}</p> : null}
            <button type="submit" disabled={loading} className="apply-submit-btn">
              {loading ? "Submitting…" : "Submit application"}
            </button>
            <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,.45)", textAlign: "left" }}>
              You will earn 90% of your markup on every sale. We take a 10% commission to keep the platform running.
            </p>
          </form>
          </div>
      </main>

      <footer
        style={{
          background: "#080C14",
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 15, color: "rgba(255,255,255,.3)" }}>
          College Creatives
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,.2)" }}>© 2025 · collegecreatives.store</span>
      </footer>
    </div>
  );
}

const labelBlock: CSSProperties = { display: "grid", gap: 8 };

const labelText: CSSProperties = {
  fontFamily: '"DM Mono", monospace',
  fontSize: 10,
  color: "rgba(255,255,255,0.35)",
  textTransform: "uppercase",
  letterSpacing: 1,
};

const inputStyle: CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "12px 16px",
  fontSize: 13,
  color: "#fff",
  width: "100%",
  fontFamily: '"DM Sans", sans-serif',
  boxSizing: "border-box",
};
