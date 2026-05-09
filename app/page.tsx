"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { MEDIUM_OPTIONS, type MediumOption } from "@/lib/medium-options";
const HERO_BG_GRADIENT =
  "linear-gradient(to bottom, rgba(10,12,22,0.38) 0%, rgba(10,12,22,0.52) 40%, rgba(10,12,22,0.72) 100%)";

function heroImageFor(isDark: boolean, isWinter: boolean): string {
  if (isWinter) {
    return isDark ? "/images/night_college_snow.png" : "/images/day_college_snow.png";
  }
  return isDark ? "/images/night_college.png" : "/images/sunset_college.png";
}

type GalleryArtwork = { id: string; title: string; src: string; price: number; medium: string | null };
type GalleryArtist = {
  id: string;
  slug: string;
  name: string;
  school: string;
  major: string;
  medium: string;
  bio: string;
  tagBg: string;
  tagTxt: string;
  sales: number;
  artworks: GalleryArtwork[];
};

const TAG_PALETTE: [string, string][] = [
  ["#3BAFD4", "#fff"],
  ["#F5A623", "#12172A"],
  ["#E8503A", "#fff"],
  ["#12172A", "#F5A623"],
];

function dedupeArtworksById(artworks: GalleryArtwork[]): GalleryArtwork[] {
  const seen = new Set<string>();
  const out: GalleryArtwork[] = [];
  for (const w of artworks) {
    if (seen.has(w.id)) continue;
    seen.add(w.id);
    out.push(w);
  }
  return out;
}

const TICKER_PLACEHOLDER = "College Creatives · Opening Soon";

function buildTickerTrackRows(artists: { name: string; school: string }[]): string[] {
  const base =
    artists.length > 0
      ? artists.map((a) => {
          const name = String(a.name ?? "").trim();
          const school = String(a.school ?? "").trim();
          return `${name} · ${school}`;
        })
      : Array.from({ length: 4 }, () => TICKER_PLACEHOLDER);
  return [...base, ...base];
}

export default function Page() {
  const [galleryArtists, setGalleryArtists] = useState<GalleryArtist[]>([]);
  const [galleryReady, setGalleryReady] = useState(false);
  const [approvedArtistCount, setApprovedArtistCount] = useState(0);
  const [tickerTrackItems, setTickerTrackItems] = useState<string[]>(() => buildTickerTrackRows([]));
  const [filter, setFilter] = useState<"all" | MediumOption>("all");
  const [heroBgUrl, setHeroBgUrl] = useState("/images/sunset_college.png");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "ok" | "err">("idle");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [moreInfoName, setMoreInfoName] = useState("");
  const [moreInfoEmail, setMoreInfoEmail] = useState("");
  const [moreInfoStatus, setMoreInfoStatus] = useState("");
  const [moreInfoLoading, setMoreInfoLoading] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const month = new Date().getMonth() + 1;
      const isWinter = month === 12 || month === 1 || month === 2;
      setHeroBgUrl(heroImageFor(mq.matches, isWinter));
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/artists", { cache: "no-store" });
        const data: unknown = await res.json();
        if (cancelled) return;
        if (!res.ok || !data || typeof data !== "object" || !("artists" in data)) {
          setApprovedArtistCount(0);
          setTickerTrackItems(buildTickerTrackRows([]));
          return;
        }
        const raw = (data as { artists: unknown }).artists;
        if (!Array.isArray(raw)) {
          setApprovedArtistCount(0);
          setTickerTrackItems(buildTickerTrackRows([]));
          return;
        }
        const list = raw.map((row) => {
          const r = row as Record<string, unknown>;
          return {
            name: String(r.name ?? ""),
            school: String(r.school ?? ""),
          };
        });
        setApprovedArtistCount(list.length);
        setTickerTrackItems(buildTickerTrackRows(list));
      } catch {
        if (!cancelled) {
          setApprovedArtistCount(0);
          setTickerTrackItems(buildTickerTrackRows([]));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/gallery");
        const data: unknown = await res.json();
        if (cancelled || !res.ok || !data || typeof data !== "object" || !("artists" in data)) {
          return;
        }
        const raw = (data as { artists: unknown }).artists;
        if (!Array.isArray(raw)) return;
        const mapped: GalleryArtist[] = raw.map((row: unknown, i: number) => {
          const r = row as Record<string, unknown>;
          const arts = Array.isArray(r.artworks) ? r.artworks : [];
          const [tagBg, tagTxt] = TAG_PALETTE[i % TAG_PALETTE.length];
          return {
            id: String(r.id ?? ""),
            slug: String(r.slug ?? ""),
            name: String(r.name ?? ""),
            school: String(r.school ?? ""),
            major: String(r.major ?? ""),
            medium: String(r.medium ?? ""),
            bio: String(r.bio ?? ""),
            tagBg,
            tagTxt,
            sales: 0,
            artworks: dedupeArtworksById(
              arts.map((w: unknown) => {
                const x = w as Record<string, unknown>;
                const med = x.medium;
                return {
                  id: String(x.id ?? x.title ?? ""),
                  title: String(x.title ?? ""),
                  src: String(x.src ?? ""),
                  price: Number(x.price ?? 0),
                  medium: typeof med === "string" ? med : med == null ? null : String(med),
                };
              }),
            ),
          };
        });
        if (!cancelled) setGalleryArtists(mapped);
      } finally {
        if (!cancelled) setGalleryReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const onMoreInfoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMoreInfoLoading(true);
    setMoreInfoStatus("");
    const res = await fetch("/api/send-more-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: moreInfoName, email: moreInfoEmail }),
    });
    const data = await res.json();
    setMoreInfoLoading(false);
    if (!res.ok) {
      setMoreInfoStatus(data.error ?? "Something went wrong.");
      return;
    }
    setMoreInfoName("");
    setMoreInfoEmail("");
    setMoreInfoStatus("Check your inbox — we sent you the details.");
  };

  const filteredArtists = useMemo(() => {
    if (filter === "all") return galleryArtists;
    return galleryArtists.filter((artist) =>
      artist.artworks.some((artwork) => {
        const m = artwork.medium;
        if (m == null) return false;
        const t = String(m).trim();
        if (t === "") return false;
        return t === filter;
      }),
    );
  }, [galleryArtists, filter]);

  const featured = galleryArtists[0];
  const featuredImg = featured ? (featured.artworks[1] ?? featured.artworks[0]) : undefined;

  const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --navy:#12172A; --amber:#F5A623; --coral:#E8503A; --sky:#3BAFD4; --cream:#F7F4EF; --ink:#0E1018; --muted:#7A7670; --white:#FFFFFF; }
html { scroll-behavior: smooth; }
body { font-family: "DM Sans", sans-serif; background: var(--page-bg); color: var(--page-text); overflow-x: hidden; }

.cc-hero { position:relative; width:100%; height:100vh; min-height:620px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.cc-hero-bg { position:absolute; inset:0; background-size: cover; background-position: center; background-repeat: no-repeat; }
.cc-hero-inner { position:relative; z-index:2; text-align:center; padding:0 40px; max-width:860px; }
.cc-hero-kicker { font-family:"DM Mono",monospace; font-size:11px; letter-spacing:4px; color:#F5A623; text-transform:uppercase; margin-bottom:24px; }
.cc-hero h1 { font-family:"Playfair Display",serif; font-size:72px; font-weight:700; line-height:1.02; letter-spacing:-3px; color:#fff; margin-bottom:22px; text-shadow:0 2px 40px rgba(0,0,0,0.4); }
.cc-hero h1 .hl-italic { font-style:italic; color:#F5A623; }
.cc-hero h1 .hl-coral { color:#E8503A; }
.cc-hero-sub { font-size:clamp(10px, 2.35vw, 15px); color:rgba(255,255,255,.6); line-height:1.8; max-width:none; margin:0 auto 36px; white-space:nowrap; text-align:center; }
.cc-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.cc-btn-amber { background:#F5A623; color:#12172A; padding:14px 32px; border-radius:40px; font-size:14px; font-weight:500; text-decoration:none; border:none; cursor:pointer; font-family:inherit; transition:background-color .2s ease,color .2s ease; }
.cc-btn-amber:hover { background:#3BAFD4; color:#fff; }
.cc-btn-ghost { background:rgba(255,255,255,.1); color:rgba(255,255,255,.85); padding:14px 32px; border-radius:40px; font-size:14px; border:0.5px solid rgba(255,255,255,.25); text-decoration:none; font-family:inherit; transition:background .2s ease,color .2s ease,border-color .2s ease; }
.cc-btn-ghost:hover { background:#fff; color:#12172A; border-color:#fff; }
.cc-scroll-cue { position:absolute; bottom:80px; left:50%; transform:translateX(-50%); z-index:2; display:flex; flex-direction:column; align-items:center; gap:10px; min-width:48px; min-height:48px; }
.cc-scroll-line { width:2px; height:56px; background:linear-gradient(rgba(255,255,255,.3),transparent); animation:scrollpulse 2s ease-in-out infinite; }
.cc-scroll-text { font-family:"DM Mono",monospace; font-size:12px; letter-spacing:2px; color:rgba(255,255,255,.35); text-transform:uppercase; }
@keyframes scrollpulse { 0%,100%{opacity:.3} 50%{opacity:.8} }

.cc-ticker { background:#E8503A; padding:10px 0; overflow:hidden; white-space:nowrap; }
.cc-ticker-track { display:inline-flex; gap:48px; animation:tick 28s linear infinite; }
@keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.cc-ticker-item { font-family:"Playfair Display",serif; font-size:14px; font-style:italic; color:#fff; }
.cc-ticker-item::after { content:" ✦"; color:#F5A623; }

.cc-stats { display:grid; grid-template-columns:repeat(3,1fr); }
.cc-stat { padding:32px 0; text-align:center; }
.cc-stat-num { font-family:"Playfair Display",serif; font-size:40px; font-weight:700; }
.cc-stat-label { font-size:11px; color:var(--page-text-muted); text-transform:uppercase; letter-spacing:.8px; margin-top:4px; }
.cc-stat.s1 { background:#F5A623; }
.cc-stat.s1 .cc-stat-num { color:#12172A; }
.cc-stat.s2 { background:#12172A; }
.cc-stat.s2 .cc-stat-num { color:#fff; }
.cc-stat.s2 .cc-stat-label { color:rgba(255,255,255,.45); }
.cc-stat.s3 { background:#E8503A; }
.cc-stat.s3 .cc-stat-num { color:#fff; }
.cc-stat.s3 .cc-stat-label { color:rgba(255,255,255,.55); }

.cc-gallery { background:var(--page-bg); padding:64px 48px; overflow:visible; }
.cc-gallery-artist { overflow:visible; }
.cc-gallery-eyebrow { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:var(--page-text-muted); text-transform:uppercase; margin-bottom:10px; }
.cc-gallery-title { font-family:"Playfair Display",serif; font-size:38px; font-weight:700; letter-spacing:-1px; }
.cc-filters { display:flex; gap:10px; margin-top:22px; margin-bottom:40px; flex-wrap:wrap; }
.cc-filter-pill { padding:7px 16px; border-radius:40px; font-size:11px; font-weight:500; border:0.5px solid var(--page-border); background:transparent; color:var(--page-text-muted); cursor:pointer; font-family:inherit; transition:background .15s ease,color .15s ease,border-color .15s ease; }
.cc-filter-pill:hover:not(.active) { background:#6b7280; color:#fff; border-color:#6b7280; }
.cc-filter-pill.active { background:#12172A; color:#fff; border-color:#12172A; }

.cc-artist-row { margin-bottom:72px; overflow:visible; }
.cc-artist-meta { display:flex; align-items:baseline; justify-content:space-between; padding-bottom:18px; border-bottom:0.5px solid var(--page-border); margin-bottom:30px; overflow:visible; }
.cc-artist-idx { font-family:"DM Mono",monospace; font-size:10px; color:#ccc; letter-spacing:2px; margin-bottom:6px; }
.cc-artist-name { font-family:"Playfair Display",serif; font-size:32px; font-weight:700; letter-spacing:-0.8px; color:var(--page-text); text-decoration:none; }
.cc-artist-name:hover { color:#E8503A; }
.cc-artist-badge { font-size:9px; font-weight:500; padding:3px 10px; border-radius:3px; text-transform:uppercase; letter-spacing:.8px; margin-left:10px; vertical-align:middle; }
.cc-artist-school { font-size:12px; color:var(--page-text-muted); margin-top:4px; }
.cc-artist-right { text-align:right; }
.cc-artist-sales { font-family:"Playfair Display",serif; font-size:28px; font-weight:700; color:#F5A623; }
.cc-artist-soldlbl { font-size:10px; color:var(--page-text-muted); text-transform:uppercase; letter-spacing:.5px; }
.cc-artist-profile { font-size:12px; color:#E8503A; font-weight:500; background:none; border:none; margin-top:6px; display:block; text-align:right; cursor:pointer; font-family:inherit; text-decoration:none; }
.cc-art-strip-outer { overflow:visible; }
.cc-art-strip { display:flex; align-items:flex-end; gap:40px; overflow-x:auto; overflow-y:visible; padding-top:16px; padding-bottom:14px; -webkit-overflow-scrolling:touch; }
.cc-art-piece { flex-shrink:0; cursor:pointer; transition:transform .3s; overflow:visible; }
.cc-art-piece:hover { transform:translateY(-12px); }
.cc-art-piece img { display:block; border-radius:2px; box-shadow:0 32px 80px rgba(0,0,0,.22), 0 14px 36px rgba(0,0,0,.14), 0 4px 12px rgba(0,0,0,.1); max-height:360px; width:auto; height:auto; object-fit:contain; }
.cc-art-cap { margin-top:16px; }
.cc-art-cap-head { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
.cc-art-title { flex:1; min-width:0; font-family:"Playfair Display",serif; font-size:14px; font-style:italic; color:var(--page-text); }
.cc-art-medium-pill { flex-shrink:0; font-size:9px; font-weight:500; padding:3px 10px; border-radius:3px; text-transform:uppercase; letter-spacing:.8px; border:0.5px solid var(--page-border); color:var(--page-text-muted); background:transparent; font-family:"DM Sans",sans-serif; margin:0; }
.cc-art-price { font-size:13px; font-weight:500; color:#E8503A; margin-top:3px; }
.cc-art-payout { font-size:11px; color:var(--page-text-muted); font-family:"DM Mono",monospace; margin-top:2px; }
.cc-row-sep { height:0.5px; background:var(--page-border); margin-bottom:72px; }

.cc-featured { display:grid; grid-template-columns:1fr 1fr; min-height:400px; }
.cc-feat-left { background:#3BAFD4; padding:52px; color:#fff; display:flex; flex-direction:column; justify-content:space-between; }
.cc-feat-kicker { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:rgba(255,255,255,.5); text-transform:uppercase; margin-bottom:14px; }
.cc-feat-name { font-family:"Playfair Display",serif; font-size:42px; font-weight:700; letter-spacing:-1.5px; margin-bottom:8px; line-height:1; }
.cc-feat-school { font-size:12px; color:rgba(255,255,255,.5); margin-bottom:18px; }
.cc-feat-bio { font-size:14px; color:rgba(255,255,255,.8); line-height:1.85; }
.cc-feat-btn { background:#fff; color:#3BAFD4; padding:12px 24px; border-radius:40px; font-size:13px; font-weight:500; text-decoration:none; display:inline-block; width:fit-content; margin-top:20px; }
.cc-feat-right { background:#1A1F30; display:flex; align-items:center; justify-content:center; padding:44px; }
.cc-feat-right img { max-height:310px; max-width:100%; object-fit:contain; border-radius:2px; box-shadow:0 32px 80px rgba(0,0,0,.6), 0 14px 36px rgba(0,0,0,.4); }

.cc-mission-split { display:grid; grid-template-columns:1fr 2fr; align-items:stretch; }
.cc-mission-left { background:#F5A623; padding:52px; color:#12172A; display:flex; flex-direction:column; align-items:center; }
.cc-mission-left-inner { align-self:center; width:fit-content; max-width:100%; text-align:left; box-sizing:border-box; }
.cc-process-label { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:rgba(18,23,42,.55); text-transform:uppercase; margin:0 0 14px; }
.cc-process-h { font-family:"Playfair Display",serif; font-size:36px; font-weight:700; letter-spacing:-1px; color:#12172A; line-height:1.12; margin:0 0 28px; }
.cc-process-steps .cc-step { display:flex; gap:12px; margin-bottom:20px; align-items:flex-start; }
.cc-process-steps .cc-step:last-child { margin-bottom:0; }
.cc-process-steps .cc-step-num { width:28px; height:28px; border-radius:50%; background:#12172A; color:#F5A623; font-size:17px; font-family:"Playfair Display",serif; display:grid; place-items:center; flex-shrink:0; line-height:0; }
.cc-process-steps .cc-step-num-inner { display:block; line-height:1; transform:translateY(-3px); }
.cc-process-steps .cc-step-title { font-size:14px; color:#12172A; font-weight:500; margin-bottom:4px; }
.cc-process-steps .cc-step-desc { font-size:12px; color:rgba(18,23,42,.55); line-height:1.5; }
.cc-btn-process-apply { background:#fff; color:#12172A; padding:14px 32px; border-radius:40px; font-size:14px; font-weight:500; text-decoration:none; border:none; cursor:pointer; font-family:"DM Sans",sans-serif; display:block; width:fit-content; margin:28px auto 0; transition:background .2s ease,color .2s ease; }
.cc-btn-process-apply:hover { background:#E8503A; color:#fff; }
.cc-mission-right { background:var(--page-bg); padding:52px; text-align:center; display:flex; flex-direction:column; align-items:center; }
.cc-more-inner { width:100%; max-width:520px; margin:0 auto; }
.cc-more-label { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:var(--page-text-muted); text-transform:uppercase; margin:0 0 14px; }
.cc-more-h { font-family:"Playfair Display",serif; font-size:42px; font-weight:700; letter-spacing:-1px; color:var(--page-text); line-height:1.08; margin:0 0 16px; }
.cc-more-sub { font-size:15px; color:var(--page-text-muted); line-height:1.75; margin:0 0 24px; }
.cc-more-form { width:100%; display:grid; gap:14px; text-align:left; }
.cc-more-fields { display:flex; flex-direction:row; flex-wrap:wrap; gap:12px; width:100%; }
.cc-more-fields label { flex:1 1 200px; min-width:0; display:grid; gap:6px; }
.cc-more-field-lbl { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--page-text-muted); }
.cc-more-fields input { padding:12px 14px; border-radius:8px; border:0.5px solid #ddd; font-size:14px; font-family:"DM Sans",sans-serif; width:100%; box-sizing:border-box; }
.cc-more-form > button { width:100%; background:#12172A; color:#fff; border:none; border-radius:40px; padding:14px 24px; font-size:14px; font-weight:500; cursor:pointer; font-family:"DM Sans",sans-serif; transition:background .2s ease,color .2s ease; }
.cc-more-form > button:hover:not(:disabled) { background:#F5A623; color:#12172A; }
.cc-more-form > button:disabled { opacity:.6; cursor:wait; }
.cc-more-status { margin:0; font-size:14px; color:var(--page-text); }

.cc-newsletter { background:#12172A; padding:64px 48px 72px; text-align:center; color:#fff; }
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

.cc-footer { background:#080C14; padding:24px 48px; display:flex; justify-content:space-between; align-items:center; }
.cc-footer-left { font-family:"Playfair Display",serif; font-size:15px; color:rgba(255,255,255,.3); }
.cc-footer-right { font-size:11px; color:rgba(255,255,255,.2); }

@media (max-width:900px) {
  .cc-hero h1 { font-size:42px; letter-spacing:-1px; }
  .cc-hero-sub { font-size:clamp(8px, 2.8vw, 15px); padding:0 12px; box-sizing:border-box; }
  .cc-featured, .cc-mission-split { grid-template-columns:1fr; }
  .cc-mission-left, .cc-mission-right { padding:40px 24px; }
  .cc-gallery { padding:40px 20px; }
  .cc-artist-meta { flex-direction:column; gap:16px; }
  .cc-artist-right { text-align:left; }
  .cc-artist-profile { text-align:left; }
  .cc-newsletter { padding:48px 20px 56px; }
}
`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <SiteHeader />

      <section className="cc-hero">
        <div
          className="cc-hero-bg"
          aria-hidden
          style={{
            backgroundImage: `${HERO_BG_GRADIENT}, url('${heroBgUrl}')`,
          }}
        />
        <div className="cc-hero-inner">
          <p className="cc-hero-kicker">Welcome</p>
          <h1>
            Original art
            <br />
            by <span className="hl-italic">students</span> who
            <br />
            dare to <span className="hl-coral">create.</span>
          </h1>
          <p className="cc-hero-sub">
            Every print supports a real college student. Every purchase funds their success.
          </p>
          <div className="cc-hero-btns">
            <a href="#gallery" className="cc-btn-amber">
              Enter gallery
            </a>
            <a href="/apply" className="cc-btn-ghost">
              Become an artist →
            </a>
          </div>
        </div>
        <div className="cc-scroll-cue">
          <div className="cc-scroll-line" />
          <span className="cc-scroll-text">Scroll</span>
        </div>
      </section>

      <section className="cc-ticker" aria-label="Featured artists">
        <div className="cc-ticker-track">
          {tickerTrackItems.map((label, idx) => (
            <span key={`${idx}-${label.slice(0, 24)}`} className="cc-ticker-item">
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="cc-stats">
        <div className="cc-stat s1">
          <div className="cc-stat-num">90%</div>
          <div className="cc-stat-label">Goes to the artist</div>
        </div>
        <div className="cc-stat s2">
          <div className="cc-stat-num">{approvedArtistCount}</div>
          <div className="cc-stat-label">Student artists</div>
        </div>
        <div className="cc-stat s3">
          <div className="cc-stat-num">.edu</div>
          <div className="cc-stat-label">Required to apply</div>
        </div>
      </section>

      <section id="gallery" className="cc-gallery">
        <p className="cc-gallery-eyebrow">The gallery</p>
        <h2 className="cc-gallery-title">Browse by medium</h2>
        <div className="cc-filters">
          {(
            [["all", "All"] as const, ...MEDIUM_OPTIONS.map((m) => [m, m] as const)]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`cc-filter-pill${filter === key ? " active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {galleryReady && filteredArtists.length === 0 ? (
          <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--page-text-muted)", margin: "8px 0 0" }}>
            No artists in this medium yet.
          </p>
        ) : null}

        {filteredArtists.map((artist, artistIdx) => (
          <div key={artist.id} className="cc-gallery-artist">
            <article className="cc-artist-row">
              <div className="cc-artist-meta">
                <div>
                  <p className="cc-artist-idx">
                    {String(artistIdx + 1).padStart(2, "0")} /{" "}
                    {String(filteredArtists.length).padStart(2, "0")}
                  </p>
                  <div>
                    <a href={`/artist/${artist.slug}`} className="cc-artist-name">
                      {artist.name}
                    </a>
                    <span
                      className="cc-artist-badge"
                      style={{ backgroundColor: artist.tagBg, color: artist.tagTxt }}
                    >
                      {artist.medium}
                    </span>
                  </div>
                  <p className="cc-artist-school">
                    {artist.school} · {artist.major}
                  </p>
                </div>
                <div className="cc-artist-right">
                  <div className="cc-artist-sales">{artist.sales}</div>
                  <div className="cc-artist-soldlbl">prints sold</div>
                  <a href={`/artist/${artist.slug}`} className="cc-artist-profile">
                    View full profile →
                  </a>
                </div>
              </div>
              <div className="cc-art-strip-outer">
                <div className="cc-art-strip">
                  {artist.artworks.map((art) => (
                    <div key={art.id} className="cc-art-piece">
                      <img src={art.src} alt={art.title} />
                      <div className="cc-art-cap">
                        <div className="cc-art-cap-head">
                          <div className="cc-art-title">{art.title}</div>
                          {art.medium?.trim() ? (
                            <span className="cc-art-medium-pill">{art.medium.trim()}</span>
                          ) : null}
                        </div>
                        <div className="cc-art-price">${art.price}</div>
                        <div className="cc-art-payout">${Math.round(art.price * 0.9)} to artist</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            {artistIdx < filteredArtists.length - 1 ? <div className="cc-row-sep" /> : null}
          </div>
        ))}
      </section>

      {featured && featuredImg ? (
        <section className="cc-featured">
          <div className="cc-feat-left">
            <div>
              <p className="cc-feat-kicker">Featured artist</p>
              <h3 className="cc-feat-name">{featured.name}</h3>
              <p className="cc-feat-school">{featured.school}</p>
              <p className="cc-feat-bio">{featured.bio}</p>
            </div>
            <a href={`/artist/${featured.slug}`} className="cc-feat-btn">
              View full profile →
            </a>
          </div>
          <div className="cc-feat-right">
            <img src={featuredImg.src} alt={featuredImg.title} />
          </div>
        </section>
      ) : null}

      <section id="mission" className="cc-mission-split">
        <div className="cc-mission-left">
          <div className="cc-mission-left-inner">
            <p className="cc-process-label">THE PROCESS</p>
            <h2 className="cc-process-h">
              How to become an{" "}
              <span style={{ fontStyle: "italic", color: "#E8503A" }}>artist!</span>
            </h2>
            <div className="cc-process-steps">
              {[
                [
                  "Apply with your .edu email",
                  "We verify you're an active student at an accredited university",
                ],
                [
                  "Get approved by our team",
                  "We review every application personally — no auto-approvals",
                ],
                [
                  "Submit your artwork to us",
                  "We handle listings, mockups and Printful product creation",
                ],
                [
                  "Earn 90% of your markup",
                  "Paid out automatically via Stripe Connect. We take 10%.",
                ],
              ].map(([title, desc], idx) => (
                <div key={title} className="cc-step">
                  <div className="cc-step-num">
                    <span className="cc-step-num-inner">{idx + 1}</span>
                  </div>
                  <div>
                    <div className="cc-step-title">{title}</div>
                    <div className="cc-step-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/apply" className="cc-btn-process-apply">
              Become an artist →
            </a>
          </div>
        </div>
        <div className="cc-mission-right">
          <div className="cc-more-inner">
            <p className="cc-more-label">INTEREST FORM</p>
            <h2 className="cc-more-h">Want more info?</h2>
            <p className="cc-more-sub">
              Leave your name and email and we&apos;ll tell you our requirements, how selling works, what
              types of art you can sell!
            </p>
            <form className="cc-more-form" onSubmit={onMoreInfoSubmit}>
              <div className="cc-more-fields">
                <label>
                  <span className="cc-more-field-lbl">Preferred Name</span>
                  <input
                    required
                    value={moreInfoName}
                    onChange={(ev) => setMoreInfoName(ev.target.value)}
                    autoComplete="name"
                  />
                </label>
                <label>
                  <span className="cc-more-field-lbl">Email</span>
                  <input
                    required
                    type="email"
                    value={moreInfoEmail}
                    onChange={(ev) => setMoreInfoEmail(ev.target.value)}
                    autoComplete="email"
                  />
                </label>
              </div>
              <button type="submit" disabled={moreInfoLoading}>
                {moreInfoLoading ? "Sending…" : "Send me more info"}
              </button>
              {moreInfoStatus ? <p className="cc-more-status">{moreInfoStatus}</p> : null}
            </form>
          </div>
        </div>
      </section>

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

      <footer className="cc-footer">
        <span className="cc-footer-left">College Creatives</span>
        <span className="cc-footer-right">© 2025 · collegecreatives.store</span>
      </footer>
    </>
  );
}
