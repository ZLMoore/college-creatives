import { ArtworkCard } from "@/components/artwork-card";
import { CheckoutButton } from "@/components/checkout-button";
import { SiteHeader } from "@/components/site-header";
import { supabaseAdmin } from "@/lib/supabase";

export default async function ShopPage() {
  const { data: artworks } = await supabaseAdmin
    .from("artworks")
    .select("*, artist:artists(id,name,slug)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-cream">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-14">
        <h1 className="font-serif text-6xl text-navy">Print Shop</h1>
        <p className="mt-3 max-w-2xl text-navy/75">
          Collect premium prints by top student artists. Every purchase directly supports emerging creatives.
        </p>
        <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {artworks?.map((artwork) => (
            <div key={artwork.id}>
              <ArtworkCard artwork={artwork} showArtist />
              <CheckoutButton artworkId={artwork.id} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
