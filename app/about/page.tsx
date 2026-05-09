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
        minHeight: "100vh",
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
          padding: "54px 24px 60px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "#F7F4EF",
          }}
        >
          OUR STORY
        </p>
        <h1
          style={{
            margin: "0 auto",
            maxWidth: 980,
            fontFamily: '"Playfair Display", serif',
            fontSize: "clamp(30px, 4vw, 46px)",
            lineHeight: 1.08,
            letterSpacing: "-0.5px",
          }}
        >
          <span style={{ color: "#F7F4EF" }}>Founded on </span>
          <span style={{ color: "#F5A623", fontStyle: "italic" }}>creativity.</span>
        </h1>
      </section>

      <div className="cc-about-scroll" aria-hidden>
        <span className="cc-about-scroll-text">Scroll</span>
        <span className="cc-about-scroll-chevron" />
      </div>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "3rem 2rem" }}>
        <section style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ width: 40, height: 2, background: "#E8503A", marginBottom: 30 }} />
          <p style={{ margin: "0 0 22px", fontSize: 18, lineHeight: 1.9, color: "var(--page-text)" }}>
            College Creatives began with a simple observation: many students pursuing rigorous academic paths quietly
            leave parts of themselves behind.
          </p>
          <p style={{ margin: "0 0 22px", fontSize: 18, lineHeight: 1.9, color: "var(--page-text)" }}>
            For many young adults pursuing higher education, that tension feels deeply familiar. Creativity remains
            central to their identity. What was missing was a space where both could exist together without compromise.
          </p>
          <section
            style={{ maxWidth: 820, margin: "28px auto 2rem", paddingLeft: 18, borderLeft: "3px solid #F5A623" }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: '"Playfair Display", serif',
                fontStyle: "italic",
                fontSize: "20px",
                lineHeight: 1.45,
                color: "var(--page-text)",
                marginBottom: "1rem",
              }}
            >
              &quot;We exist to celebrate the artistic side of students whose chosen fields do not
              traditionally foster creativity.&quot;
            </p>
            <p style={{ margin: "0", fontSize: 14, fontStyle: "normal", color: "#F5A623" }}>— Our Founder</p>
          </section>
          <p style={{ margin: "0 0 22px", fontSize: 18, lineHeight: 1.9, color: "var(--page-text)" }}>
            We present to you a curated platform where college students can earn passive income while pursuing
            demanding careers in STEM and other professional fields.
          </p>
          <p style={{ margin: "0 0 1.5rem", fontSize: 18, lineHeight: 1.9, color: "var(--page-text)" }}>
            Artists apply using a verified .edu email and undergo a review process before joining the platform. Once
            approved, they upload their work, set their prices, and fulfill orders through Printful&apos;s print-on-demand
            infrastructure, with direct payouts through Stripe.
          </p>
        </section>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--page-border)",
            margin: "3rem 0",
            width: "100%",
          }}
        />

        <section style={{ maxWidth: 820, margin: "64px 0 0" }}>
          <div className="founder-grid">
            <div style={{ width: 320, flexShrink: 0, display: "flex", alignSelf: "stretch" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about.png"
                alt="Zakora Moore"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, display: "block" }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
              <p
                style={{
                  marginTop: 0,
                  marginRight: 0,
                  marginBottom: 10,
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
                  marginTop: 0,
                  marginRight: 0,
                  marginBottom: 28,
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
                working in clinical research and pursuing a career in medicine, she has spent years navigating spaces
                that rarely make room for her artistic passions.
              </p>
              <p style={{ margin: "0 0 16px", fontSize: 16, lineHeight: 1.85, color: "var(--page-text)" }}>
                Her experiences led her to build College Creatives. She wanted a place that acknowledged what so many
                science and pre-professional students already know: that creativity does not disappear when you choose
                a demanding field. It just goes looking for an outlet.
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
          padding: 1.5rem 0;
          background: #e8503a;
        }
        .cc-about-scroll-text {
          font-family: "DM Mono", monospace;
          font-size: 12px;
          letter-spacing: 2px;
          color: rgba(247, 244, 239, 0.45);
          text-transform: uppercase;
        }
        .cc-about-scroll-chevron {
          margin-top: 10px;
          display: block;
          width: 10px;
          height: 10px;
          border-right: 2px solid rgba(247, 244, 239, 0.45);
          border-bottom: 2px solid rgba(247, 244, 239, 0.45);
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

        .cc-newsletter { background:#12172A; padding:64px 48px 72px; text-align:center; color:#fff; margin-top:4rem; }
        .cc-newsletter-label { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:rgba(255,255,255,.45); text-transform:uppercase; margin:0 0 14px; }
        .cc-newsletter-heading { font-family:"Playfair Display",serif; font-size:clamp(28px,4vw,40px); font-weight:700; letter-spacing:-0.5px; color:#fff; margin:0 0 18px; line-height:1.15; }
        .cc-newsletter-heading .cc-newsletter-loop { font-style:italic; color:#F5A623; }
        .cc-newsletter-sub { font-size:15px; color:rgba(255,255,255,.65); line-height:1.75; max-width:560px; margin:0 auto 36px; }
        .cc-newsletter-form { display:flex; flex-direction:row; justify-content:center; align-items:stretch; gap:12px; max-width:560px; margin:0 auto; }
        .cc-newsletter-form input { width:320px; max-width:100%; background:rgba(255,255,255,.06); border:0.5px solid rgba(255,255,255,.12); border-radius:8px; padding:14px 16px; font-size:14px; color:#fff; font-family:"DM Sans",sans-serif; }
        .cc-newsletter-form input::placeholder { color:rgba(255,255,255,.35); }
        .cc-newsletter-form button { flex:0 0 auto; background:#E8503A; color:#fff; border:none; border-radius:40px; padding:14px 28px; font-size:14px; font-weight:600; font-family:"DM Sans",sans-serif; cursor:pointer; }
        .cc-newsletter-form button:disabled { opacity:.6; cursor:wait; }
        .cc-newsletter-feedback { margin:18px 0 0; font-size:14px; }
        .cc-newsletter-feedback.ok { color:#3BAFD4; }
        .cc-newsletter-feedback.err { color:#E8503A; }

        @media (max-width: 760px) {
          .founder-grid {
            flex-direction: column;
          }
          .cc-newsletter { padding:48px 20px 56px; }
        }
      `}</style>
    </div>
  );
}
