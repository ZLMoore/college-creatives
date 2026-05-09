import { cookies } from "next/headers";
import { AdminApproveButton } from "@/components/admin-approve-button";
import { AdminLoginForm } from "@/components/admin-login-form";
import { SeedDemoPanel } from "@/components/seed-demo-panel";
import { SiteHeader } from "@/components/site-header";
import { formatCurrencyFromCents } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";

export default async function AdminPage() {
  const isAuthed = cookies().get("cc_admin_auth")?.value === "true";

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-cream">
        <SiteHeader />
        <AdminLoginForm />
      </div>
    );
  }

  const [{ data: pendingArtists }, { data: artworks }, { data: orders }] =
    await Promise.all([
      supabaseAdmin
        .from("artists")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("artworks")
        .select("*, artist:artists(name)")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("orders")
        .select("*, artwork:artworks(title)")
        .order("created_at", { ascending: false }),
    ]);

  return (
    <div className="min-h-screen bg-cream">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-6 py-12">
        <h1 className="font-serif text-6xl text-navy">Admin Dashboard</h1>

        <SeedDemoPanel />

        <section className="bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
          <h2 className="font-serif text-3xl text-navy">Pending Applications</h2>
          <div className="mt-5 space-y-3">
            {pendingArtists?.map((artist) => (
              <article
                key={artist.id}
                className="flex items-start justify-between rounded-xl border border-navy/10 p-4"
              >
                <div>
                  <h3 className="font-semibold text-navy">{artist.name}</h3>
                  <p className="text-sm text-navy/70">
                    {artist.school} • {artist.major} • {artist.medium}
                  </p>
                </div>
                <AdminApproveButton artistId={artist.id} />
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
          <h2 className="font-serif text-3xl text-navy">Artworks</h2>
          <div className="mt-5 space-y-2">
            {artworks?.map((artwork) => (
              <p key={artwork.id} className="rounded-lg border border-navy/10 px-4 py-3 text-sm">
                {artwork.title} by {artwork.artist?.name ?? "Unknown"} - {artwork.status}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.18)]">
          <h2 className="font-serif text-3xl text-navy">Orders</h2>
          <div className="mt-5 space-y-2">
            {orders?.map((order) => (
              <p key={order.id} className="rounded-lg border border-navy/10 px-4 py-3 text-sm">
                {order.artwork?.title ?? "Artwork"} - {order.status} - {formatCurrencyFromCents(order.amount)}
              </p>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
