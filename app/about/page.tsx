/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent, useState } from "react";
import { SiteHeader } from "@/components/site-header";

export default function MissionPage() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "ok" | "err">("idle");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const onNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNewsletterStatus("idle");
    setNewsletterLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "", email: newsletterEmail }),
      });
      setNewsletterLoading(false);
      if (res.ok) {
        setNewsletterStatus("ok");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("err");
      }
    } catch {
      setNewsletterLoading(false);
      setNewsletterStatus("err");
    }
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        background: "var(--page-bg)",
        color: "var(--page-text)",
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <SiteHeader />

      <section
        style={{
          width: "100%",
          background: "#E8503A",
          padding: "38px 24px 42px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: "0 auto",
            maxWidth: 980,
            fontFamily: '"Playfair Display", serif',
            fontSize: "2rem",
            lineHeight: 1.08,
            letterSpacing: "-0.5px",
          }}
        >
          <span style={{ color: "#F7F4EF" }}>Founded on </span>
          <span style={{ color: "#F5A623", fontStyle: "italic" }}>creativity.</span>
        </h1>
      </section>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "3.5rem 2rem 3rem" }}>
        <section>
          <p style={{ margin: "0 0 1.25rem", fontSize: 18, lineHeight: 1.75, color: "var(--page-text)" }}>
            College Creatives began with a simple observation: many students pursuing rigorous academic paths quietly
            leave parts of themselves behind.
          </p>
          <p style={{ margin: "0 0 1.25rem", fontSize: 18, lineHeight: 1.75, color: "var(--page-text)" }}>
            For many young adults pursuing higher education, that tension feels deeply familiar. Creativity remains central
            to their identity. What was missing was a space where both could exist together without compromise.
          </p>
          <section
            style={{ maxWidth: 820, margin: "1.5rem auto", paddingLeft: 18, borderLeft: "3px solid #F5A623" }}
          >
            <p
              style={{
                margin: "0 0 1rem",
                fontFamily: '"Playfair Display", serif',
                fontStyle: "italic",
                fontSize: 20,
                lineHeight: 1.45,
                color: "var(--page-text)",
              }}
            >
              &quot;College Creatives exists to celebrate the artistic side of students whose chosen
              fields do not traditionally foster creativity.&quot;
            </p>
            <p style={{ margin: "0", fontSize: 14, fontStyle: "normal", color: "#F5A623" }}>— Our Founder</p>
          </section>
          <p style={{ margin: "0 0 1.25rem", fontSize: 18, lineHeight: 1.75, color: "var(--page-text)" }}>
            We present to you a curated platform where college students can earn passive income while pursuing demanding
            careers in STEM and other professional fields.
          </p>
          <p style={{ margin: "0 0 1.25rem", fontSize: 18, lineHeight: 1.75, color: "var(--page-text)" }}>
            Artists apply using a verified .edu email and undergo a review process before joining the platform. Once
            approved, they upload their work, set their prices, and fulfill orders through Printful&apos;s print-on-demand
            infrastructure, with direct payouts through Stripe.
          </p>
          <div className="cc-about-scroll" aria-hidden>
            <span className="cc-about-scroll-text">Scroll</span>
            <span className="cc-about-scroll-chevron" />
          </div>
        </section>

        <section style={{ margin: "64px 0 0" }}>
          <div className="founder-grid">
            <div
              style={{
                width: "100%",
                maxWidth: 320,
                flexShrink: 0,
                display: "flex",
                alignSelf: "stretch",
              }}
            >
              <img
                src="/images/about.png"
                alt="Zakora Moore"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, display: "block" }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#3BAFD4",
                  fontWeight: 600,
                }}
              >
                The founder
              </p>
              <h2
                style={{
                  margin: "0 0 28px",
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "clamp(34px, 4vw, 46px)",
                  lineHeight: 1.1,
                  color: "var(--page-text)",
                }}
              >
                Zakora Moore
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.85, color: "var(--page-text)" }}>
                Zakora is an aspiring physician-scientist whose path has never fit neatly into one category. Currently
                working in research and pursuing a career in medicine, she has spent years navigating spaces that rarely
                make room for artistic expression.
              </p>
              <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.85, color: "var(--page-text)" }}>
                Her experiences led her to build College Creatives. She wanted a place that acknowledged what so many
                science and pre-professional students already know: that creativity does not disappear when you choose a
                demanding field. It just goes looking for an outlet.
              </p>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.85, color: "var(--page-text)" }}>
                College Creatives is that outlet.
              </p>
            </div>
          </div>
        </section>

      </main>

      <section className="cc-newsletter" aria-labelledby="newsletter-heading">
        <p className="cc-newsletter-label">THE NEWSLETTER</p>
        <h2 id="newsletter-heading" className="cc-newsletter-heading">
          Stay in the <span className="cc-newsletter-loop">loop.</span>
        </h2>
        <p className="cc-newsletter-sub">
          New artists, new drops, and behind-the-scenes from the first marketplace built for student creators.
        </p>
        <form className="cc-newsletter-form" onSubmit={onNewsletterSubmit}>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={newsletterEmail}
            onChange={(ev) => setNewsletterEmail(ev.target.value)}
            aria-label="Email"
          />
          <button type="submit" disabled={newsletterLoading}>
            {newsletterLoading ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
        {newsletterStatus === "ok" ? (
          <p className="cc-newsletter-feedback ok">You&apos;re in. Watch your inbox.</p>
        ) : null}
        {newsletterStatus === "err" ? (
          <p className="cc-newsletter-feedback err">Something went wrong. Please try again.</p>
        ) : null}
      </section>

      <style>{`
        .cc-about-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 1.5rem auto 0;
        }
        .cc-about-scroll-text {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          color: rgba(18, 23, 42, 0.4);
          text-transform: uppercase;
        }
        .cc-about-scroll-chevron {
          margin-top: 10px;
          display: block;
          width: 10px;
          height: 10px;
          border-right: 2px solid rgba(18, 23, 42, 0.4);
          border-bottom: 2px solid rgba(18, 23, 42, 0.4);
          transform: rotate(45deg);
          animation: cc-about-scroll-nudge 2s ease-in-out infinite;
        }
        @keyframes cc-about-scroll-nudge {
          0%,
          100% {
            transform: rotate(45deg) translate(0, 0);
            opacity: 0.45;
          }
          50% {
            transform: rotate(45deg) translate(3px, 3px);
            opacity: 0.9;
          }
        }

        .founder-grid { display: flex; align-items: stretch; gap: 2.5rem; }

        @media (max-width: 760px) {
          .founder-grid {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
