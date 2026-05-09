"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import type { Artist, Artwork } from "@/lib/supabase";

type Payload = { artist: Artist; artworks: Artwork[] };

export default function ArtistProfilePage() {
  const params = useParams();
  const slug = decodeURIComponent(String(params?.slug ?? "")).trim();

  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!slug) {
      setMissing(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/artist/${encodeURIComponent(slug)}`, { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) {
            setMissing(true);
            setLoading(false);
          }
          return;
        }
        const json = (await res.json()) as Payload;
        if (!cancelled) {
          setPayload(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setMissing(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) {
    notFound();
  }

  if (loading || !payload) {
    return (
      <div style={{ fontFamily: '"DM Sans", sans-serif', background: "var(--page-bg)", minHeight: "100vh" }}>
        <SiteHeader />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7A7670",
            padding: "48px",
          }}
        >
          Loading…
        </div>
      </div>
    );
  }

  const { artist, artworks: rawArtworks } = payload;
  const artworks = useMemo(() => {
    const seen = new Set<string>();
    return rawArtworks.filter((row) => {
      const key = `${row.title}::${row.image_url}::${row.artist_id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rawArtworks]);
  console.log("artworks count:", artworks.length);

  return (
    <div style={{ fontFamily: '"DM Sans", sans-serif', background: "var(--page-bg)", minHeight: "100vh" }}>
      <SiteHeader />

      {/* HERO */}
      <div style={{ background: "#12172A", padding: "80px 48px" }}>
        <p
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: "10px",
            letterSpacing: "4px",
            color: "#F5A623",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Artist
        </p>
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: "64px",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.05,
            marginBottom: "16px",
          }}
        >
          {artist.name}
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>
          {artist.school} · {artist.major}
        </p>
        <span
          style={{
            background: "#F5A623",
            color: "#12172A",
            fontSize: "10px",
            fontFamily: '"DM Mono", monospace',
            letterSpacing: "1px",
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: "3px",
            display: "inline-block",
            marginBottom: "24px",
          }}
        >
          {artist.medium}
        </span>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "560px" }}>
          {artist.bio}
        </p>
      </div>

      {/* ARTWORKS — single Supabase-backed array, exactly one .map */}
      {artworks.length === 0 ? (
        <p style={{ padding: "80px 48px", textAlign: "center", color: "#7A7670", margin: 0 }}>No artworks yet.</p>
      ) : null}

      {artworks.map((artwork, i) => (
        <section
          key={artwork.id}
          style={{
            padding: "80px 48px",
            borderBottom: "0.5px solid var(--page-border)",
            background: "var(--page-bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "640px",
              alignSelf: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "10px",
                letterSpacing: "3px",
                color: "#ccc",
                textTransform: "uppercase",
                marginBottom: "48px",
                width: "100%",
                textAlign: "left",
              }}
            >
              {String(i + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}
            </p>

            <div
              style={{
                marginBottom: "52px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.18)) drop-shadow(0 8px 24px rgba(0,0,0,0.12))",
                transition: "transform 0.4s ease, filter 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-16px)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 48px 80px rgba(0,0,0,0.24)) drop-shadow(0 16px 32px rgba(0,0,0,0.16))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.filter =
                  "drop-shadow(0 32px 64px rgba(0,0,0,0.18)) drop-shadow(0 8px 24px rgba(0,0,0,0.12))";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artwork.image_url}
                alt={artwork.title}
                style={{
                  maxHeight: "520px",
                  maxWidth: "100%",
                  display: "block",
                  borderRadius: "2px",
                }}
              />
            </div>

            <div style={{ width: "100%", maxWidth: "640px", textAlign: "left" }}>
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: "36px",
                  fontStyle: "italic",
                  color: "var(--page-text)",
                  marginBottom: "8px",
                  lineHeight: 1.2,
                }}
              >
                {artwork.title}
              </h2>
              <p style={{ fontSize: "20px", fontWeight: 500, color: "#E8503A", marginBottom: "32px" }}>
                {artwork.price}
              </p>
              <hr style={{ border: "none", borderTop: "0.5px solid var(--page-border)", marginBottom: "28px" }} />
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "10px",
                  letterSpacing: "3px",
                  color: "#F5A623",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Curator&apos;s Note
              </p>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--page-text)",
                  lineHeight: 1.9,
                  fontStyle: "italic",
                  maxWidth: "560px",
                }}
              >
                {artwork.curator_note?.trim() ?? "Curator's note coming soon."}
              </p>
              <button
                type="button"
                style={{
                  marginTop: "20px",
                  background: "none",
                  border: "none",
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "11px",
                  color: "#7A7670",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: 0,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Request edit to this note →
              </button>
            </div>
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <div
        style={{
          background: "#080C14",
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: "15px", color: "rgba(255,255,255,0.3)" }}>
          College Creatives
        </span>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>© 2025 · collegecreatives.store</span>
      </div>
    </div>
  );
}
