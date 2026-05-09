import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAllowedMedium } from "@/lib/medium-options";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  if (cookies().get("cc_admin_auth")?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const artist_id = typeof body.artist_id === "string" ? body.artist_id.trim() : "";
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const medium = typeof body.medium === "string" ? body.medium.trim() : "";
    const image_url = typeof body.image_url === "string" ? body.image_url.trim() : "";
    const description =
      typeof body.description === "string" ? body.description.trim() : "";
    const price = Number(body.price);
    const status = body.status === "draft" ? "draft" : "published";

    if (!artist_id || !title || !medium || !image_url || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!isAllowedMedium(medium)) {
      return NextResponse.json({ error: "Invalid medium." }, { status: 400 });
    }

    const { data: artist, error: artistError } = await supabaseAdmin
      .from("artists")
      .select("id")
      .eq("id", artist_id)
      .eq("status", "approved")
      .maybeSingle();

    if (artistError || !artist) {
      return NextResponse.json({ error: "Artist not found or not approved." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("artworks")
      .insert({
        artist_id,
        title,
        description:
          description ||
          `Archival-quality print after ${title}. Produced for College Creatives collectors.`,
        price,
        image_url,
        medium,
        curator_note: null,
        status,
        printful_product_id: null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
