import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const artworkId = typeof body.artworkId === "string" ? body.artworkId.trim() : "";
    const artworkTitle = typeof body.artworkTitle === "string" ? body.artworkTitle.trim() : "";
    const artistName = typeof body.artistName === "string" ? body.artistName.trim() : "";
    const suggestion = typeof body.suggestion === "string" ? body.suggestion.trim() : "";

    if (!artworkId || !artworkTitle || !artistName || !suggestion) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const html = `
<p><strong>Artist:</strong> ${escapeHtml(artistName)}</p>
<p><strong>Artwork:</strong> ${escapeHtml(artworkTitle)}</p>
<p><strong>Artwork ID:</strong> ${escapeHtml(artworkId)}</p>
<p><strong>Suggested edit:</strong></p>
<p>${escapeHtml(suggestion).replace(/\n/g, "<br />")}</p>`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "contact@collegecreatives.store",
      subject: `Curator Note Edit Request — ${artworkTitle}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send request." }, { status: 500 });
  }
}
