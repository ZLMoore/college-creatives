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
    const { name, email, school, major, medium, bio, portfolio_url, preferred_name } = body;

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

    const preferredNorm =
      preferred_name != null && String(preferred_name).trim()
        ? String(preferred_name).trim()
        : null;

    const { data, error } = await supabaseAdmin
      .from("artists")
      .insert({
        name,
        preferred_name: preferredNorm,
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

    const applicantName = escapeHtml(String(name));
    const applicantEmailHtml = `<p>Hi ${applicantName},</p>

<p>Thanks for your interest in College Creatives! Here's exactly what happens next:</p>

<p><strong>Step 1 — We review your application.</strong> Our founder personally reviews every submission. You'll hear back within 3–5 business days.</p>

<p><strong>Step 2 — You get approved!</strong> Expect to receive a welcome email with a link to securely connect your payout account via Stripe. This is how you get paid.</p>

<p><strong>Step 3 — You submit your work.</strong> Upload your pieces with a title, price, and medium. To ensure the best print quality, your image must be at least 3000 x 3000px at 300 DPI. Here's how to get there depending on your medium:</p>

<ul>
  <li><strong>Digital art</strong> — export at full resolution from Procreate, Photoshop, Illustrator, or your preferred tool.</li>
  <li><strong>Painting or drawing</strong> — photograph in natural light with a steady hand or tripod, or scan at 600 DPI minimum. Use a free tool like Adobe Scan or Google PhotoScan.</li>
  <li><strong>Photography</strong> — submit the original RAW or highest-resolution JPEG. Avoid heavy compression.</li>
  <li><strong>Mixed media or collage</strong> — scan at 600 DPI or photograph flat on a neutral background with no shadows.</li>
</ul>

<p><strong>Step 4 — We review your art.</strong> We evaluate each piece for appropriateness and print-readiness. All submissions must meet our community standards and print quality requirements before going live. You'll be notified once your work is approved or if any changes are needed.</p>

<p><strong>Step 5 — You earn passive income!</strong> Every time a print sells, you keep 90% of your markup. Printful handles all printing and shipping for you.</p>

<p>Have questions? Reply to this email. We read every message!</p>

<p>— The College Creatives Team</p>

<a href="https://collegecreatives.store/apply" style="display:inline-block;background-color:#F5A623;color:#12172A;font-family:sans-serif;font-weight:bold;padding:14px 28px;border-radius:999px;text-decoration:none;margin-top:24px;">Become an Artist →</a>`;

    await resend.emails.send({
      from: "College Creatives <hello@collegecreatives.store>",
      to: emailNorm,
      subject: "More About Us!",
      html: applicantEmailHtml,
    });

    const portfolio =
      portfolio_url && String(portfolio_url).trim()
        ? String(portfolio_url).trim()
        : null;
    const adminHtml = `
<p><strong>Name:</strong> ${escapeHtml(String(name))}</p>
<p><strong>Preferred name:</strong> ${
      preferredNorm ? escapeHtml(preferredNorm) : "Not provided"
    }</p>
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
        from: "College Creatives <hello@collegecreatives.store>",
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
