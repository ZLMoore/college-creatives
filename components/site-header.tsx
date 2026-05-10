"use client";

import type { CSSProperties } from "react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";

const linkStyle: CSSProperties = {
  color: "rgba(255,255,255,0.4)",
  fontSize: "11px",
  fontFamily: '"DM Mono", monospace',
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  textDecoration: "none",
};

const HEADER_HEIGHT_PX = 58;

export const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
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
          .cc-header-nav {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 48px;
            height: ${HEADER_HEIGHT_PX}px;
            width: 100%;
            box-sizing: border-box;
            margin: 0;
          }
          .cc-header-center-links {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 28px;
            pointer-events: none;
          }
          .cc-header-center-links a {
            pointer-events: auto;
          }
          .cc-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 2;
          }
          .cc-header-menu-toggle {
            display: none;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            padding: 0;
            margin: 0;
            border: none;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.08);
            color: #f7f4ef;
            cursor: pointer;
            flex-shrink: 0;
          }
          .cc-header-menu-toggle:focus-visible {
            outline: 2px solid #f5a623;
            outline-offset: 2px;
          }
          .cc-header-menu-icon {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: 20px;
          }
          .cc-header-menu-icon span {
            display: block;
            height: 2px;
            width: 100%;
            background: #f7f4ef;
            border-radius: 1px;
            transition: transform 0.2s ease, opacity 0.2s ease;
          }
          .cc-header-menu-toggle[aria-expanded='true'] .cc-header-menu-icon span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
          }
          .cc-header-menu-toggle[aria-expanded='true'] .cc-header-menu-icon span:nth-child(2) {
            opacity: 0;
          }
          .cc-header-menu-toggle[aria-expanded='true'] .cc-header-menu-icon span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
          }
          .cc-header-mobile-backdrop {
            display: none;
            position: fixed;
            inset: 0;
            top: ${HEADER_HEIGHT_PX}px;
            background: rgba(0, 0, 0, 0.45);
            z-index: 198;
          }
          .cc-header-mobile-backdrop.cc-header-mobile-backdrop--open {
            display: block;
          }
          .cc-header-mobile-drawer {
            display: none;
            position: fixed;
            left: 0;
            right: 0;
            top: ${HEADER_HEIGHT_PX}px;
            z-index: 199;
            background: #12172a;
            border-bottom: 1px solid rgba(247, 244, 239, 0.12);
            padding: 12px 0 20px;
            flex-direction: column;
            gap: 0;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
          }
          .cc-header-mobile-drawer.cc-header-mobile-drawer--open {
            display: flex;
          }
          .cc-header-mobile-link {
            display: block;
            padding: 14px 24px;
            font-family: 'DM Mono', monospace;
            font-size: 11px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.85);
            text-decoration: none;
            border-bottom: 1px solid rgba(247, 244, 239, 0.08);
          }
          .cc-header-mobile-link:last-of-type {
            border-bottom: none;
          }
          .cc-header-mobile-link:active {
            background: rgba(255, 255, 255, 0.06);
          }
          @media (max-width: 768px) {
            .cc-header-nav {
              padding: 0 16px;
            }
            .cc-header-center-links {
              display: none !important;
            }
            .cc-header-menu-toggle {
              display: inline-flex;
            }
          }
          @media (min-width: 769px) {
            .cc-header-mobile-backdrop,
            .cc-header-mobile-drawer {
              display: none !important;
            }
          }
        `}</style>
        <nav className="cc-header-nav">
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

          <div className="cc-header-center-links">
            <Link href="/about" className="cc-header-nav-link cc-dm-mono-ui" style={{ ...linkStyle, pointerEvents: "auto" }}>
              About
            </Link>
            <Link href="/#gallery" prefetch={false} className="cc-header-nav-link cc-dm-mono-ui" style={{ ...linkStyle, pointerEvents: "auto" }}>
              Gallery
            </Link>
            <Link href="/#faq" prefetch={false} className="cc-header-nav-link cc-dm-mono-ui" style={{ ...linkStyle, pointerEvents: "auto" }}>
              FAQ
            </Link>
          </div>

          <div className="cc-header-actions">
            <button
              type="button"
              className="cc-header-menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="cc-header-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="cc-header-menu-icon" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
            <Link href="/artist-portal" className="cc-header-apply-btn">
              Artist Portal
            </Link>
          </div>
        </nav>

        <div
          className={`cc-header-mobile-backdrop${menuOpen ? " cc-header-mobile-backdrop--open" : ""}`}
          aria-hidden={!menuOpen}
          onClick={closeMenu}
        />

        <div
          id="cc-header-mobile-menu"
          className={`cc-header-mobile-drawer${menuOpen ? " cc-header-mobile-drawer--open" : ""}`}
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          <Link href="/about" className="cc-header-mobile-link" prefetch={false} onClick={closeMenu}>
            About
          </Link>
          <Link href="/#gallery" className="cc-header-mobile-link" prefetch={false} onClick={closeMenu}>
            Gallery
          </Link>
          <Link href="/#faq" className="cc-header-mobile-link" prefetch={false} onClick={closeMenu}>
            FAQ
          </Link>
        </div>
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
};
