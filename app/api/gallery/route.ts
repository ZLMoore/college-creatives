import { NextResponse } from "next/server";
import { createSupabaseAdminForServer } from "@/lib/supabase";

export async function GET() {
  const admin = createSupabaseAdminForServer();
  if (!admin) {
    return NextResponse.json({ artists: [] });
  }

  try {
    const { data: artistRows, error: artistError } = await admin
      .from("artists")
      .select("*")
      .eq("status", "approved")
      .not("slug", "is", null)
      .order("created_at", { ascending: false });

    if (artistError) {
      return NextResponse.json({ error: artistError.message }, { status: 500 });
    }

    const artists = artistRows ?? [];
    const artistIds = artists.map((a) => a.id);
    if (artistIds.length === 0) {
      return NextResponse.json({ artists: [] });
    }

    const { data: artworkRows, error: artworkError } = await admin
      .from("artworks")
      .select("*")
      .eq("status", "published")
      .in("artist_id", artistIds)
      .order("created_at", { ascending: true });

    if (artworkError) {
      return NextResponse.json({ error: artworkError.message }, { status: 500 });
    }

    const byArtist = new Map<string, NonNullable<typeof artworkRows>>();
    for (const row of artworkRows ?? []) {
      const list = byArtist.get(row.artist_id) ?? [];
      list.push(row);
      byArtist.set(row.artist_id, list);
    }

    const payload = artists.map((a) => ({
      id: a.id,
      slug: a.slug as string,
      name: a.name,
      school: a.school,
      major: a.major,
      medium: a.medium,
      bio: a.bio,
      artworks: (byArtist.get(a.id) ?? []).map((w) => ({
        id: w.id,
        title: w.title,
        src: w.image_url,
        price: w.price,
        medium: w.medium ?? null,
      })),
    }));

    return NextResponse.json({ artists: payload });
  } catch {
    return NextResponse.json({ error: "gallery_fetch_failed" }, { status: 500 });
  }
}
