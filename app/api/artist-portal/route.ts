import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!emailRaw) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const { data: artist, error } = await supabaseAdmin
      .from("artists")
      .select("id,email,status,stripe_account_id")
      .eq("email", emailRaw)
      .maybeSingle();

    if (error) throw error;
    if (!artist) {
      return NextResponse.json(
        { error: "No account found for that email." },
        { status: 404 },
      );
    }
    if (artist.status !== "approved") {
      return NextResponse.json(
        { error: "Your application is not approved yet." },
        { status: 403 },
      );
    }
    if (!artist.stripe_account_id) {
      return NextResponse.json(
        { error: "Payout account is not ready. Please contact support." },
        { status: 400 },
      );
    }

    const loginLink = await stripe.accounts.createLoginLink(artist.stripe_account_id);

    return NextResponse.json({ url: loginLink.url });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not open artist portal.", details: String(error) },
      { status: 500 },
    );
  }
}
