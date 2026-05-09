"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
const HERO_BG_GRADIENT =
  "linear-gradient(to bottom, rgba(10,12,22,0.38) 0%, rgba(10,12,22,0.52) 40%, rgba(10,12,22,0.72) 100%)";

function heroImageFor(isDark: boolean, isWinter: boolean): string {
  if (isWinter) {
    return isDark ? "/images/night_college_snow.png" : "/images/day_college_snow.png";
  }
  return isDark ? "/images/night_college.png" : "/images/sunset_college.png";
}

type Artwork = { title: string; src: string; price: number };
type Artist = {
  id: string;
  slug: string;
  name: string;
  school: string;
  major: string;
  filter: "painting" | "print" | "abstract";
  medium: string;
  city: string;
  bio: string;
  tagBg: string;
  tagTxt: string;
  sales: number;
  artworks: Artwork[];
};

const artists: Artist[] = [
  {
    id: "vincent-van-gogh",
    slug: "vincent-van-gogh",
    name: "Vincent van Gogh",
    school: "Royal Academy of Arts",
    major: "Fine Arts",
    filter: "painting",
    medium: "Post-impressionism",
    city: "Arles, FR",
    bio: "Vincent's swirling post-impressionist canvases channel raw emotion through bold brushwork and electric color.",
    tagBg: "#3BAFD4",
    tagTxt: "#fff",
    sales: 218,
    artworks: [
      { title: "Starry Night Over the Rhône", src: "/images/starry-rhone.jpg", price: 44 },
      { title: "The Starry Night", src: "/images/starry-night.jpg", price: 52 },
      { title: "Self-Portrait with Palette", src: "/images/vangogh-self.jpg", price: 38 },
    ],
  },
  {
    id: "leonardo-da-vinci",
    slug: "leonardo-da-vinci",
    name: "Leonardo da Vinci",
    school: "Florentine Academy",
    major: "Renaissance Art",
    filter: "painting",
    medium: "Renaissance",
    city: "Florence, IT",
    bio: "Leonardo's mastery of sfumato produced works that transcend time. His portraits carry a quiet intensity.",
    tagBg: "#F5A623",
    tagTxt: "#12172A",
    sales: 142,
    artworks: [
      { title: "Mona Lisa", src: "/images/mona-lisa.jpg", price: 56 },
      { title: "Creation of Adam", src: "/images/creation.jpg", price: 48 },
    ],
  },
  {
    id: "katsushika-hokusai",
    slug: "katsushika-hokusai",
    name: "Katsushika Hokusai",
    school: "Kano School of Art",
    major: "Ukiyo-e Printmaking",
    filter: "print",
    medium: "Ukiyo-e",
    city: "Edo, JP",
    bio: "Hokusai's woodblock prints defined an era with bold lines and an eye for the sublime in nature.",
    tagBg: "#E8503A",
    tagTxt: "#fff",
    sales: 97,
    artworks: [{ title: "The Great Wave off Kanagawa", src: "/images/wave.jpg", price: 46 }],
  },
  {
    id: "wassily-kandinsky",
    slug: "kandinsky-wassily",
    name: "Wassily Kandinsky",
    school: "Bauhaus",
    major: "Abstract Composition",
    filter: "abstract",
    medium: "Abstract",
    city: "Munich, DE",
    bio: "Kandinsky pioneered pure abstraction — shapes and color used to express feeling directly.",
    tagBg: "#12172A",
    tagTxt: "#F5A623",
    sales: 74,
    artworks: [{ title: "Composition VIII", src: "/images/kandinsky.jpg", price: 42 }],
  },
];

export default function Page() {
  const [filter, setFilter] = useState<"all" | "painting" | "print" | "abstract">("all");
  const [heroBgUrl, setHeroBgUrl] = useState("/images/sunset_college.png");
  const [newsletterName, setNewsletterName] = useState("");
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

  const onNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNewsletterStatus("idle");
    setNewsletterLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newsletterName, email: newsletterEmail }),
      });
      setNewsletterLoading(false);
      if (res.ok) {
        setNewsletterStatus("ok");
        setNewsletterName("");
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
    if (filter === "all") return artists;
    return artists.filter((a) => a.filter === filter);
  }, [filter]);

  const featured = artists[0];
  const featuredImg = featured.artworks[1] ?? featured.artworks[0];

  const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --navy:#12172A; --amber:#F5A623; --coral:#E8503A; --sky:#3BAFD4; --cream:#F7F4EF; --ink:#0E1018; --muted:#7A7670; --white:#FFFFFF; }
html { scroll-behavior: smooth; }
body { font-family: "DM Sans", sans-serif; background: var(--cream); color: var(--ink); overflow-x: hidden; }

.cc-hero { position:relative; width:100%; height:100vh; min-height:620px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.cc-hero-bg { position:absolute; inset:0; background-size: cover; background-position: center; background-repeat: no-repeat; }
.cc-hero-inner { position:relative; z-index:2; text-align:center; padding:0 40px; max-width:860px; }
.cc-hero-kicker { font-family:"DM Mono",monospace; font-size:11px; letter-spacing:4px; color:#F5A623; text-transform:uppercase; margin-bottom:24px; }
.cc-hero h1 { font-family:"Playfair Display",serif; font-size:72px; font-weight:700; line-height:1.02; letter-spacing:-3px; color:#fff; margin-bottom:22px; text-shadow:0 2px 40px rgba(0,0,0,0.4); }
.cc-hero h1 .hl-italic { font-style:italic; color:#F5A623; }
.cc-hero h1 .hl-coral { color:#E8503A; }
.cc-hero-sub { font-size:clamp(10px, 2.35vw, 15px); color:rgba(255,255,255,.6); line-height:1.8; max-width:none; margin:0 auto 36px; white-space:nowrap; text-align:center; }
.cc-hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.cc-btn-amber { background:#F5A623; color:#12172A; padding:14px 32px; border-radius:40px; font-size:14px; font-weight:500; text-decoration:none; border:none; cursor:pointer; font-family:inherit; }
.cc-btn-ghost { background:rgba(255,255,255,.1); color:rgba(255,255,255,.85); padding:14px 32px; border-radius:40px; font-size:14px; border:0.5px solid rgba(255,255,255,.25); text-decoration:none; font-family:inherit; }
.cc-scroll-cue { position:absolute; bottom:28px; left:50%; transform:translateX(-50%); z-index:2; display:flex; flex-direction:column; align-items:center; gap:6px; }
.cc-scroll-line { width:1px; height:36px; background:linear-gradient(rgba(255,255,255,.3),transparent); animation:scrollpulse 2s ease-in-out infinite; }
.cc-scroll-text { font-family:"DM Mono",monospace; font-size:9px; letter-spacing:2px; color:rgba(255,255,255,.35); text-transform:uppercase; }
@keyframes scrollpulse { 0%,100%{opacity:.3} 50%{opacity:.8} }

.cc-ticker { background:#E8503A; padding:10px 0; overflow:hidden; white-space:nowrap; }
.cc-ticker-track { display:inline-flex; gap:48px; animation:tick 28s linear infinite; }
@keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.cc-ticker-item { font-family:"Playfair Display",serif; font-size:14px; font-style:italic; color:#fff; }
.cc-ticker-item::after { content:" ✦"; color:#F5A623; }

.cc-stats { display:grid; grid-template-columns:repeat(3,1fr); }
.cc-stat { padding:32px 0; text-align:center; }
.cc-stat-num { font-family:"Playfair Display",serif; font-size:40px; font-weight:700; }
.cc-stat-label { font-size:11px; color:rgba(14,16,24,.5); text-transform:uppercase; letter-spacing:.8px; margin-top:4px; }
.cc-stat.s1 { background:#F5A623; }
.cc-stat.s1 .cc-stat-num { color:#12172A; }
.cc-stat.s2 { background:#12172A; }
.cc-stat.s2 .cc-stat-num { color:#fff; }
.cc-stat.s2 .cc-stat-label { color:rgba(255,255,255,.45); }
.cc-stat.s3 { background:#E8503A; }
.cc-stat.s3 .cc-stat-num { color:#fff; }
.cc-stat.s3 .cc-stat-label { color:rgba(255,255,255,.55); }

.cc-gallery { background:#FFFFFF; padding:64px 48px; overflow:visible; }
.cc-gallery-artist { overflow:visible; }
.cc-gallery-eyebrow { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:#7A7670; text-transform:uppercase; margin-bottom:10px; }
.cc-gallery-title { font-family:"Playfair Display",serif; font-size:38px; font-weight:700; letter-spacing:-1px; }
.cc-filters { display:flex; gap:10px; margin-top:22px; margin-bottom:40px; flex-wrap:wrap; }
.cc-filter-pill { padding:7px 16px; border-radius:40px; font-size:11px; font-weight:500; border:0.5px solid #ddd; background:transparent; color:#7A7670; cursor:pointer; font-family:inherit; }
.cc-filter-pill.active { background:#12172A; color:#fff; }

.cc-artist-row { margin-bottom:72px; overflow:visible; }
.cc-artist-meta { display:flex; align-items:baseline; justify-content:space-between; padding-bottom:18px; border-bottom:0.5px solid #E0DDD8; margin-bottom:30px; overflow:visible; }
.cc-artist-idx { font-family:"DM Mono",monospace; font-size:10px; color:#ccc; letter-spacing:2px; margin-bottom:6px; }
.cc-artist-name { font-family:"Playfair Display",serif; font-size:32px; font-weight:700; letter-spacing:-0.8px; color:#0E1018; text-decoration:none; }
.cc-artist-name:hover { color:#E8503A; }
.cc-artist-badge { font-size:9px; font-weight:500; padding:3px 10px; border-radius:3px; text-transform:uppercase; letter-spacing:.8px; margin-left:10px; vertical-align:middle; }
.cc-artist-school { font-size:12px; color:#7A7670; margin-top:4px; }
.cc-artist-right { text-align:right; }
.cc-artist-sales { font-family:"Playfair Display",serif; font-size:28px; font-weight:700; color:#F5A623; }
.cc-artist-soldlbl { font-size:10px; color:#7A7670; text-transform:uppercase; letter-spacing:.5px; }
.cc-artist-profile { font-size:12px; color:#E8503A; font-weight:500; background:none; border:none; margin-top:6px; display:block; text-align:right; cursor:pointer; font-family:inherit; text-decoration:none; }
.cc-art-strip-outer { overflow:visible; }
.cc-art-strip { display:flex; align-items:flex-end; gap:40px; overflow-x:auto; overflow-y:visible; padding-top:16px; padding-bottom:14px; -webkit-overflow-scrolling:touch; }
.cc-art-piece { flex-shrink:0; cursor:pointer; transition:transform .3s; overflow:visible; }
.cc-art-piece:hover { transform:translateY(-12px); }
.cc-art-piece img { display:block; border-radius:2px; box-shadow:0 32px 80px rgba(0,0,0,.22), 0 14px 36px rgba(0,0,0,.14), 0 4px 12px rgba(0,0,0,.1); max-height:360px; width:auto; height:auto; object-fit:contain; }
.cc-art-cap { margin-top:16px; }
.cc-art-title { font-family:"Playfair Display",serif; font-size:14px; font-style:italic; color:#0E1018; }
.cc-art-price { font-size:13px; font-weight:500; color:#E8503A; margin-top:3px; }
.cc-art-payout { font-size:11px; color:#7A7670; font-family:"DM Mono",monospace; margin-top:2px; }
.cc-row-sep { height:0.5px; background:#E8E4DE; margin-bottom:72px; }

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
.cc-mission-left { background:#F5A623; padding:52px; color:#12172A; text-align:left; }
.cc-process-label { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:rgba(18,23,42,.55); text-transform:uppercase; margin:0 0 14px; }
.cc-process-h { font-family:"Playfair Display",serif; font-size:36px; font-weight:700; letter-spacing:-1px; color:#12172A; line-height:1.12; margin:0 0 28px; }
.cc-process-steps .cc-step { display:flex; gap:12px; margin-bottom:20px; align-items:flex-start; }
.cc-process-steps .cc-step:last-child { margin-bottom:0; }
.cc-process-steps .cc-step-num { width:28px; height:28px; border-radius:50%; background:#12172A; color:#F5A623; font-size:12px; font-family:"Playfair Display",serif; display:flex; align-items:center; justify-content:center; flex-shrink:0; line-height:1; }
.cc-process-steps .cc-step-title { font-size:14px; color:#12172A; font-weight:500; margin-bottom:4px; }
.cc-process-steps .cc-step-desc { font-size:12px; color:rgba(18,23,42,.55); line-height:1.5; }
.cc-mission-right { background:#F7F4EF; padding:52px; text-align:center; display:flex; flex-direction:column; align-items:center; }
.cc-more-inner { width:100%; max-width:520px; margin:0 auto; }
.cc-more-label { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:#7A7670; text-transform:uppercase; margin:0 0 14px; }
.cc-more-h { font-family:"Playfair Display",serif; font-size:42px; font-weight:700; letter-spacing:-1px; color:#12172A; line-height:1.08; margin:0 0 16px; }
.cc-more-sub { font-size:15px; color:#7A7670; line-height:1.75; margin:0 0 24px; }
.cc-more-form { width:100%; display:grid; gap:14px; text-align:left; }
.cc-more-fields { display:flex; flex-direction:row; flex-wrap:wrap; gap:12px; width:100%; }
.cc-more-fields label { flex:1 1 200px; min-width:0; display:grid; gap:6px; }
.cc-more-field-lbl { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:#7A7670; }
.cc-more-fields input { padding:12px 14px; border-radius:8px; border:0.5px solid #ddd; font-size:14px; font-family:"DM Sans",sans-serif; width:100%; box-sizing:border-box; }
.cc-more-form > button { width:100%; background:#12172A; color:#fff; border:none; border-radius:40px; padding:14px 24px; font-size:14px; font-weight:500; cursor:pointer; font-family:"DM Sans",sans-serif; }
.cc-more-form > button:disabled { opacity:.6; cursor:wait; }
.cc-more-status { margin:0; font-size:14px; color:#12172A; }

.cc-newsletter { background:#12172A; padding:64px 48px 72px; text-align:center; color:#fff; }
.cc-newsletter-label { font-family:"DM Mono",monospace; font-size:10px; letter-spacing:3px; color:rgba(255,255,255,.45); text-transform:uppercase; margin:0 0 14px; }
.cc-newsletter-heading { font-family:"Playfair Display",serif; font-size:clamp(28px,4vw,40px); font-weight:700; letter-spacing:-0.5px; color:#fff; margin:0 0 18px; line-height:1.15; }
.cc-newsletter-heading .cc-newsletter-loop { font-style:italic; color:#F5A623; }
.cc-newsletter-sub { font-size:15px; color:rgba(255,255,255,.65); line-height:1.75; max-width:560px; margin:0 auto 36px; }
.cc-newsletter-form { display:flex; flex-direction:row; flex-wrap:wrap; justify-content:center; align-items:stretch; gap:12px; max-width:720px; margin:0 auto; }
.cc-newsletter-form input { flex:1 1 180px; min-width:0; background:rgba(255,255,255,.06); border:0.5px solid rgba(255,255,255,.12); border-radius:8px; padding:14px 16px; font-size:14px; color:#fff; font-family:"DM Sans",sans-serif; }
.cc-newsletter-form input::placeholder { color:rgba(255,255,255,.35); }
.cc-newsletter-form button { flex:0 0 auto; background:#F5A623; color:#12172A; border:none; border-radius:40px; padding:14px 28px; font-size:14px; font-weight:600; font-family:"DM Sans",sans-serif; cursor:pointer; }
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
          <p className="cc-hero-kicker">Vol. 01  ·  The student gallery</p>
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
          <span className="cc-ticker-item">Vincent van Gogh · Royal Academy of Arts</span>
          <span className="cc-ticker-item">Leonardo da Vinci · Florentine Academy</span>
          <span className="cc-ticker-item">Katsushika Hokusai · Kano School of Art</span>
          <span className="cc-ticker-item">Wassily Kandinsky · Bauhaus</span>
          <span className="cc-ticker-item">Vincent van Gogh · Royal Academy of Arts</span>
          <span className="cc-ticker-item">Leonardo da Vinci · Florentine Academy</span>
          <span className="cc-ticker-item">Katsushika Hokusai · Kano School of Art</span>
          <span className="cc-ticker-item">Wassily Kandinsky · Bauhaus</span>
        </div>
      </section>

      <section className="cc-stats">
        <div className="cc-stat s1">
          <div className="cc-stat-num">90%</div>
          <div className="cc-stat-label">Goes to the artist</div>
        </div>
        <div className="cc-stat s2">
          <div className="cc-stat-num">47</div>
          <div className="cc-stat-label">Student artists</div>
        </div>
        <div className="cc-stat s3">
          <div className="cc-stat-num">.edu</div>
          <div className="cc-stat-label">Required to apply</div>
        </div>
      </section>

      <section id="gallery" className="cc-gallery">
        <p className="cc-gallery-eyebrow">The gallery</p>
        <h2 className="cc-gallery-title">Browse by artist</h2>
        <div className="cc-filters">
          {(
            [
              ["all", "All"],
              ["painting", "Painting"],
              ["print", "Printmaking"],
              ["abstract", "Abstract"],
            ] as const
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

        {filteredArtists.map((artist) => (
          <div key={artist.id} className="cc-gallery-artist">
            <article className="cc-artist-row">
              <div className="cc-artist-meta">
                <div>
                  <p className="cc-artist-idx">
                    {String(artists.indexOf(artist) + 1).padStart(2, "0")} / 04
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
                    {artist.school} · {artist.major} · {artist.city}
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
                    <div key={art.title} className="cc-art-piece">
                      <img src={art.src} alt={art.title} />
                      <div className="cc-art-cap">
                        <div className="cc-art-title">{art.title}</div>
                        <div className="cc-art-price">${art.price}</div>
                        <div className="cc-art-payout">${Math.round(art.price * 0.9)} to artist</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
            {filteredArtists.indexOf(artist) < filteredArtists.length - 1 ? (
              <div className="cc-row-sep" />
            ) : null}
          </div>
        ))}
      </section>

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

      <section id="mission" className="cc-mission-split">
        <div className="cc-mission-left">
          <p className="cc-process-label">THE PROCESS</p>
          <h2 className="cc-process-h">What does it mean to become a College Creative?</h2>
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
                <div className="cc-step-num">{idx + 1}</div>
                <div>
                  <div className="cc-step-title">{title}</div>
                  <div className="cc-step-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cc-mission-right">
          <div className="cc-more-inner">
            <p className="cc-more-label">STAY IN THE LOOP</p>
            <h2 className="cc-more-h">Want more info?</h2>
            <p className="cc-more-sub">
              Leave your name and email and we&apos;ll send you our mission, how selling works, and what
              makes College Creatives different.
            </p>
            <form className="cc-more-form" onSubmit={onMoreInfoSubmit}>
              <div className="cc-more-fields">
                <label>
                  <span className="cc-more-field-lbl">Name</span>
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
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Name"
            value={newsletterName}
            onChange={(ev) => setNewsletterName(ev.target.value)}
            aria-label="Name"
          />
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
