import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/artwork-card";
import { SiteHeader } from "@/components/site-header";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const { data: artist } = await supabaseAdmin
    .from("artists")
    .select("*")
    .eq("id", params.id)
    .eq("status", "approved")
    .single();

  if (!artist) notFound();

  const { data: artworks } = await supabaseAdmin
    .from("artworks")
    .select("*")
    .eq("artist_id", artist.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-cream">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="bg-navy p-10 text-cream shadow-[0_32px_80px_rgba(0,0,0,0.25)]">
          <p className="text-xs uppercase tracking-[0.25em] text-sky">{artist.school}</p>
          <h1 className="mt-3 font-serif text-6xl">{artist.name}</h1>
          <p className="mt-2 text-lg text-cream/80">{artist.major}</p>
          <p className="mt-6 max-w-3xl text-cream/85">{artist.bio}</p>
          {artist.portfolio_url ? (
            <a
              href={artist.portfolio_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full bg-amber px-5 py-2 font-semibold text-navy"
            >
              View Portfolio
            </a>
          ) : null}
        </section>

        <section className="mt-10">
          <h2 className="inline-block bg-sky px-5 py-2 font-serif text-4xl text-navy">Published Artworks</h2>
          <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {artworks?.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
