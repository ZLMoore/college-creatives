import { NextResponse } from "next/server";
import { isEduEmail } from "@/lib/edu";
import { resend } from "@/lib/resend";
import { uniqueArtistSlug } from "@/lib/slug";
import { supabaseAdmin } from "@/lib/supabase";

const ADMIN_REVIEW_URL =
  "https://supabase.com/dashboard/project/anebdfwokdfqovlqmmst/editor";

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
    const { name, email, school, major, medium, bio, portfolio_url } = body;

    if (!name || !email || !school || !major || !medium || !bio) {
      return NextResponse.json(
        { error: "Missing required application fields." },
        { status: 400 },
      );
    }

    const emailNorm = String(email).trim().toLowerCase();
    if (!isEduEmail(emailNorm)) {
      return NextResponse.json(
        { error: "A valid .edu university email is required." },
        { status: 400 },
      );
    }

    const slug = await uniqueArtistSlug(String(name));

    const { data, error } = await supabaseAdmin
      .from("artists")
      .insert({
        name,
        email: emailNorm,
        school,
        major,
        medium,
        bio,
        portfolio_url: portfolio_url || null,
        status: "pending",
        slug,
      })
      .select("id")
      .single();

    if (error) throw error;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: emailNorm,
      subject: "College Creatives Application Received",
      html: `<p>Hi ${name},</p><p>Thanks for applying to College Creatives. Our curatorial team will review your application shortly.</p>`,
    });

    const portfolio =
      portfolio_url && String(portfolio_url).trim()
        ? String(portfolio_url).trim()
        : null;
    const adminHtml = `
<p><strong>Name:</strong> ${escapeHtml(String(name))}</p>
<p><strong>Email:</strong> ${escapeHtml(emailNorm)}</p>
<p><strong>School:</strong> ${escapeHtml(String(school))}</p>
<p><strong>Major:</strong> ${escapeHtml(String(major))}</p>
<p><strong>Medium:</strong> ${escapeHtml(String(medium))}</p>
<p><strong>Portfolio:</strong> ${
      portfolio
        ? `<a href="${escapeHtml(portfolio)}">${escapeHtml(portfolio)}</a>`
        : "Not provided"
    }</p>
<p><strong>Bio:</strong></p>
<p>${escapeHtml(String(bio)).replace(/\n/g, "<br />")}</p>
<p><strong>Review in Supabase:</strong> <a href="${ADMIN_REVIEW_URL}">${ADMIN_REVIEW_URL}</a></p>`;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "contact@collegecreatives.store",
        subject: `New Artist Application — ${name}`,
        html: adminHtml,
      });
    } catch (notifyErr) {
      console.error("apply: admin notification email failed", notifyErr);
    }

    return NextResponse.json({ artistId: data.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to submit application.", details: String(error) },
      { status: 500 },
    );
  }
}
