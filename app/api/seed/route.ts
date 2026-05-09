import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { seedDemoArtists } from "@/lib/seed-artists";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * One-time / idempotent demo seed. GET ?secret= must match ADMIN_PASSWORD.
 * Example: curl "http://localhost:3000/api/seed?secret=$ADMIN_PASSWORD"
 */
export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret") ?? "";
  if (!env.adminPassword || secret !== env.adminPassword) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const result = await seedDemoArtists(supabaseAdmin);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json(
      { error: "Seed failed.", details: String(e) },
      { status: 500 },
    );
  }
}
