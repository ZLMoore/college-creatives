"use client";

import { type FormEvent, useState } from "react";
import { formatCurrency } from "@/lib/format";
import type { Artwork } from "@/lib/supabase";

type Props = {
  artwork: Artwork;
  artistName: string;
  imageOnLeft: boolean;
  /** Draft rows are included on the profile for demo / preview. */
  showDraftBadge?: boolean;
};

export function ArtistArtworkBlock({ artwork, artistName, imageOnLeft, showDraftBadge }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "ok" | "err">("idle");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("idle");
    try {
      const res = await fetch("/api/artwork/request-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId: artwork.id,
          artworkTitle: artwork.title,
          artistName,
          suggestion,
        }),
      });
      setLoading(false);
      if (res.ok) {
        setFeedback("ok");
        setSuggestion("");
        setShowForm(false);
      } else {
        setFeedback("err");
      }
    } catch {
      setLoading(false);
      setFeedback("err");
    }
  };

  const note = artwork.curator_note?.trim();

  const imageSide = (
    <div className="box-border flex min-h-[500px] w-full items-stretch bg-white p-12 max-md:min-h-[420px] max-md:p-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artwork.image_url}
        alt={artwork.title}
        className="h-full min-h-[320px] w-full flex-1 rounded-none object-cover object-center shadow-[0_32px_80px_rgba(0,0,0,0.22)] max-md:min-h-[280px]"
      />
    </div>
  );

  const textSide = (
    <div className="flex min-h-[500px] flex-col justify-center bg-white p-16 max-md:p-10 md:min-h-[500px]">
      {showDraftBadge ? (
        <p
          className="mb-3 inline-flex w-fit bg-[#F5A623]/20 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#12172A]"
          style={{ fontFamily: '"DM Mono", monospace' }}
        >
          Preview · not published
        </p>
      ) : null}
      <h2 className="font-serif text-[32px] font-bold italic leading-tight text-[#0E1018]">{artwork.title}</h2>
      <p className="mt-2 text-[18px] font-medium text-[#E8503A]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        {formatCurrency(artwork.price)}
      </p>
      <hr className="my-6 border-0 border-t border-solid border-[#E0DDD8]" style={{ borderTopWidth: "0.5px" }} />
      <p
        className="mb-3 text-[10px] font-normal uppercase tracking-[3px] text-[#F5A623]"
        style={{ fontFamily: '"DM Mono", monospace' }}
      >
        Curator&apos;s note
      </p>
      {note ? (
        <p
          className="text-[15px] italic leading-[1.85] text-[#4a4a4a]"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {note}
        </p>
      ) : (
        <p
          className="text-[15px] italic leading-[1.85] text-[#7A7670]"
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          Curator&apos;s note coming soon.
        </p>
      )}
      <button
        type="button"
        onClick={() => {
          setShowForm((v) => !v);
          setFeedback("idle");
        }}
        className="mt-4 w-fit cursor-pointer border-0 bg-transparent p-0 text-left text-[11px] text-[#7A7670] underline decoration-[#7A7670]/40 underline-offset-4 transition hover:text-[#12172A]"
        style={{ fontFamily: '"DM Mono", monospace' }}
      >
        Request edit to this note →
      </button>

      {showForm ? (
        <form onSubmit={onSubmit} className="mt-6 border-t border-[#E8E4DE] pt-6">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-[#12172A]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
              Your suggested edit or correction:
            </span>
            <textarea
              required
              rows={5}
              value={suggestion}
              onChange={(ev) => setSuggestion(ev.target.value)}
              className="w-full resize-y border border-[#ddd] bg-[#faf9f7] px-3 py-2 text-sm text-[#12172A] outline-none focus:ring-2 focus:ring-[#F5A623]"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-full bg-[#F5A623] px-6 py-2.5 text-sm font-semibold text-[#12172A] disabled:opacity-60"
            style={{ fontFamily: '"DM Sans", sans-serif' }}
          >
            {loading ? "Sending…" : "Submit request"}
          </button>
        </form>
      ) : null}

      {feedback === "ok" ? (
        <p className="mt-4 text-sm text-emerald-600" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          Your request has been sent. Our team will review it.
        </p>
      ) : null}
      {feedback === "err" ? (
        <p className="mt-4 text-sm text-[#E8503A]" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          Something went wrong. Please try again.
        </p>
      ) : null}
    </div>
  );

  return (
    <section id={`work-${artwork.id}`} className="w-full scroll-mt-[58px] bg-white">
      <div className="flex min-h-[500px] flex-col md:flex-row">
        <div className={`w-full md:w-1/2 ${imageOnLeft ? "" : "md:order-2"}`}>{imageSide}</div>
        <div className={`w-full md:w-1/2 ${imageOnLeft ? "" : "md:order-1"}`}>{textSide}</div>
      </div>
    </section>
  );
}
