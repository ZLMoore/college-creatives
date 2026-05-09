import Link from "next/link";
import type { Artwork } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";

type Props = {
  artwork: Artwork & { artist?: { id: string; name: string; slug: string | null } | null };
  showArtist?: boolean;
};

export const ArtworkCard = ({ artwork, showArtist = false }: Props) => (
  <article className="group overflow-hidden bg-white shadow-[0_32px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-1">
    <div
      className="h-72 w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${artwork.image_url})` }}
    />
    <div className="space-y-2 p-6">
      <h3 className="font-serif text-2xl text-navy">{artwork.title}</h3>
      <p className="text-sm text-navy/70">{artwork.description}</p>
      {showArtist && artwork.artist && (
        <Link
          href={
            artwork.artist.slug
              ? `/artist/${artwork.artist.slug}`
              : `/artist/${artwork.artist.id}`
          }
          className="inline-block text-sm font-semibold text-sky hover:text-coral"
        >
          by {artwork.artist.name}
        </Link>
      )}
      <p className="font-semibold text-coral">{formatCurrency(artwork.price)}</p>
    </div>
  </article>
);
