import { NextResponse } from "next/server";
import { createSupabaseAdminForServer } from "@/lib/supabase";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug ?? "").trim();
  if (!slug) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const admin = createSupabaseAdminForServer();
  if (!admin) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const { data: artistRow, error: artistError } = await admin
      .from("artists")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved")
      .maybeSingle();

    if (artistError || !artistRow) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const { data: artworksRows, error: artError } = await admin
      .from("artworks")
      .select("*")
      .eq("artist_id", artistRow.id)
      .in("status", ["published", "draft"])
      .order("created_at", { ascending: true });

    if (artError) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const sorted = [...(artworksRows ?? [])].sort((a, b) => {
      const rank = (s: string) => (s === "published" ? 0 : 1);
      const d = rank(a.status) - rank(b.status);
      if (d !== 0) return d;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    const seen = new Set<string>();
    const artworks = sorted.filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    });

    return NextResponse.json({ artist: artistRow, artworks });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
