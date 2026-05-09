"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MEDIUM_OPTIONS } from "@/lib/medium-options";

type ArtistOption = { id: string; name: string };

export function AdminCreateArtworkForm({ artists }: { artists: ArtistOption[] }) {
  const router = useRouter();
  const [artistId, setArtistId] = useState("");
  const [title, setTitle] = useState("");
  const [medium, setMedium] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/artwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist_id: artistId,
          title,
          medium,
          price: Number(price),
          image_url: imageUrl,
          description,
          status,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setMessage({ kind: "err", text: data.error ?? "Failed to create artwork." });
        return;
      }
      setArtistId("");
      setTitle("");
      setMedium("");
      setPrice("");
      setImageUrl("");
      setDescription("");
      setStatus("published");
      setMessage({ kind: "ok", text: "Artwork created." });
      router.refresh();
    } catch {
      setLoading(false);
      setMessage({ kind: "err", text: "Network error." });
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-5 grid max-w-xl gap-4">
      <label className="grid gap-1 text-sm font-medium text-navy">
        Artist
        <select
          required
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
        >
          <option value="" disabled>
            Select artist
          </option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-navy">
        Title
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-navy">
        Medium
        <select
          required
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
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
      <label className="grid gap-1 text-sm font-medium text-navy">
        Price (USD)
        <input
          required
          type="number"
          min={1}
          step={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-navy">
        Image URL
        <input
          required
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-navy">
        Description (optional)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-navy">
        Status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          className="rounded-lg border border-navy/20 px-3 py-2 outline-none ring-coral focus:ring-2"
        >
          <option value="published">published</option>
          <option value="draft">draft</option>
        </select>
      </label>
      <button
        type="submit"
        disabled={loading || artists.length === 0}
        className="rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Saving…" : "Add artwork"}
      </button>
      {message?.kind === "ok" ? <p className="text-sm text-navy/80">{message.text}</p> : null}
      {message?.kind === "err" ? <p className="text-sm text-coral">{message.text}</p> : null}
    </form>
  );
}
