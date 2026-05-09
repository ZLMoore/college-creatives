import type { CSSProperties } from "react";
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

export const SiteHeader = () => (
  <header
    style={{
      background: "#12172A",
      height: "58px",
      position: "sticky",
      top: 0,
      zIndex: 200,
      width: "100%",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    }}
  >
    <nav
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "58px",
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
        <Link href="/#gallery" prefetch={false} style={{ ...linkStyle, pointerEvents: "auto" }}>
          Gallery
        </Link>
        <Link href="/for-artists" style={{ ...linkStyle, pointerEvents: "auto" }}>
          For Artists
        </Link>
        <Link href="/#mission" prefetch={false} style={{ ...linkStyle, pointerEvents: "auto" }}>
          About
        </Link>
      </div>

      <Link
        href="/apply"
        style={{
          background: "#F5A623",
          color: "#12172A",
          padding: "8px 22px",
          borderRadius: "40px",
          fontSize: "12px",
          fontWeight: 500,
          fontFamily: '"DM Sans", sans-serif',
          textDecoration: "none",
          zIndex: 1,
          whiteSpace: "nowrap",
        }}
      >
        Apply to Sell
      </Link>
    </nav>
  </header>
);
