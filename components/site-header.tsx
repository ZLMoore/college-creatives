import type { CSSProperties } from "react";
import { Fragment } from "react";
import Link from "next/link";

const linkStyle: CSSProperties = {
  color: "rgba(255,255,255,0.4)",
  fontSize: "11px",
  fontFamily: '"DM Mono", monospace',
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  textDecoration: "none",
};

const centeredLinksStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "28px",
};

type SiteHeaderProps = {
  /** Hide the primary CTA (e.g. on `/apply` where the page is already the apply flow). */
  hideApplyCta?: boolean;
};

const HEADER_HEIGHT_PX = 58;

export const SiteHeader = ({ hideApplyCta }: SiteHeaderProps = {}) => (
  <Fragment>
  <header
    style={{
      background: "#12172A",
      height: `${HEADER_HEIGHT_PX}px`,
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      width: "100%",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    }}
  >
    <style>{`
      .cc-header-apply-btn {
        background: #f5a623;
        color: #12172a;
        padding: 8px 22px;
        border-radius: 40px;
        font-size: 12px;
        font-weight: 500;
        font-family: 'DM Sans', sans-serif;
        text-decoration: none;
        z-index: 1;
        white-space: nowrap;
        display: inline-block;
        transition: background 0.2s ease, color 0.2s ease;
      }
      .cc-header-apply-btn:hover {
        background: #3bafd4;
        color: #fff;
      }
    `}</style>
    <nav
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: `${HEADER_HEIGHT_PX}px`,
        width: "100%",
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      <Link
        href="/"
        style={{
          textDecoration: "none",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/CC_logo.png"
            alt="College Creatives"
            height="48"
            style={{ height: "48px", width: "auto", objectFit: "contain", display: "block" }}
          />
          <span
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: "20px",
              color: "#fff",
            }}
          >
            College <span style={{ color: "#F5A623" }}>Creatives</span>
          </span>
        </div>
      </Link>

      <div style={{ ...centeredLinksStyle, pointerEvents: "none" }}>
        <Link href="/" style={{ ...linkStyle, pointerEvents: "auto" }}>
          Home
        </Link>
        <Link href="/about" style={{ ...linkStyle, pointerEvents: "auto" }}>
          About
        </Link>
        <Link href="/#gallery" prefetch={false} style={{ ...linkStyle, pointerEvents: "auto" }}>
          Gallery
        </Link>
        <Link href="/for-artists" style={{ ...linkStyle, pointerEvents: "auto" }}>
          Artist Portal
        </Link>
      </div>

      {hideApplyCta ? null : (
        <Link href="/apply" className="cc-header-apply-btn">
          Apply to Sell
        </Link>
      )}
    </nav>
  </header>
  <div
    aria-hidden
    style={{
      height: `${HEADER_HEIGHT_PX}px`,
      flexShrink: 0,
      width: "100%",
    }}
  />
  </Fragment>
);
