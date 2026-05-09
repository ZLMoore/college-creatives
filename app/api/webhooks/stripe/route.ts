import Stripe from "stripe";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createPrintfulOrder } from "@/lib/printful";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.stripeWebhookSecret,
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid webhook signature.", details: String(error) },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const artworkId = session.metadata?.artworkId;

    if (orderId && artworkId && session.customer_email) {
      try {
        const { data: artwork, error: artworkError } = await supabaseAdmin
          .from("artworks")
          .select("printful_product_id")
          .eq("id", artworkId)
          .single();
        if (artworkError) throw artworkError;

        let printfulOrderId: string | null = null;
        if (artwork.printful_product_id) {
          printfulOrderId = await createPrintfulOrder({
            productId: artwork.printful_product_id,
            recipientEmail: session.customer_email,
          });
        }

        await supabaseAdmin
          .from("orders")
          .update({
            status: printfulOrderId ? "fulfilled" : "paid",
            stripe_payment_id: session.payment_intent?.toString() ?? null,
            printful_order_id: printfulOrderId,
          })
          .eq("id", orderId);
      } catch (error) {
        await supabaseAdmin
          .from("orders")
          .update({
            status: "failed",
          })
          .eq("id", orderId);

        return NextResponse.json(
          { error: "Webhook processing failed.", details: String(error) },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
