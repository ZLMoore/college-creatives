import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (cookies().get("cc_admin_auth")?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { data: artist, error: fetchError } = await supabaseAdmin
      .from("artists")
      .select("*")
      .eq("id", params.id)
      .single();
    if (fetchError) throw fetchError;

    const account = await stripe.accounts.create({
      type: "express",
      email: artist.email,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: "individual",
      metadata: {
        artistId: artist.id,
      },
    });

    const { error: updateError } = await supabaseAdmin
      .from("artists")
      .update({
        status: "approved",
        stripe_account_id: account.id,
      })
      .eq("id", artist.id);
    if (updateError) throw updateError;

    await resend.emails.send({
      from: env.fromEmail,
      to: artist.email,
      subject: "You're approved on College Creatives",
      html: `<p>Hi ${artist.name},</p><p>Your artist application has been approved. We are excited to feature your work.</p>`,
    });

    return NextResponse.json({ ok: true, stripeAccountId: account.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to approve artist.", details: String(error) },
      { status: 500 },
    );
  }
}
