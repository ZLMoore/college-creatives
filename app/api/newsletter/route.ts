import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    if (!env.resendApiKey || !env.resendAudienceId) {
      return NextResponse.json({ error: "Newsletter is not configured." }, { status: 503 });
    }

    const { error } = await resend.contacts.create({
      email,
      firstName: name.split(" ")[0],
      lastName: name.split(" ").slice(1).join(" "),
      unsubscribed: false,
      audienceId: env.resendAudienceId,
    });

    if (error) {
      return NextResponse.json(
        { error: typeof error.message === "string" ? error.message : "Resend error" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
