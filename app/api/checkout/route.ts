import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { artworkId, buyerEmail } = await request.json();
    if (!artworkId || !buyerEmail) {
      return NextResponse.json(
        { error: "artworkId and buyerEmail are required." },
        { status: 400 },
      );
    }

    const { data: artwork, error: artworkError } = await supabaseAdmin
      .from("artworks")
      .select("*")
      .eq("id", artworkId)
      .eq("status", "published")
      .single();
    if (artworkError) throw artworkError;

    const amountCents = Math.round(Number(artwork.price) * 100);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        artwork_id: artwork.id,
        buyer_email: buyerEmail,
        amount: amountCents,
        status: "pending",
      })
      .select("id")
      .single();
    if (orderError) throw orderError;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: buyerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: artwork.title,
              description: artwork.description,
              images: [artwork.image_url],
            },
          },
        },
      ],
      success_url: `${env.appUrl}/shop?checkout=success`,
      cancel_url: `${env.appUrl}/shop?checkout=cancelled`,
      metadata: {
        orderId: order.id,
        artworkId: artwork.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to start checkout.", details: String(error) },
      { status: 500 },
    );
  }
}
