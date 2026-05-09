import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const applyUrl = "https://collegecreatives.store/apply";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;background:#FFFFFF;font-family:'DM Sans',sans-serif;color:#12172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(18,23,42,0.12);">
        <tr>
          <td style="background:#12172A;padding:28px 32px;display:flex;align-items:center;gap:12px;">
            <img src="https://collegecreatives.store/images/CC_logo.png" alt="College Creatives logo" style="height:36px;width:auto;display:inline-block;vertical-align:middle;margin-right:12px;" />
            <p style="margin:0;display:inline-block;font-family:Georgia,serif;font-size:22px;color:#FFFFFF;vertical-align:middle;">College <span style="color:#F5A623;">Creatives</span></p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p>Hi ${name},</p>
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
            <a href="${applyUrl}" style="display:inline-block;background-color:#F5A623;color:#12172A;font-family:sans-serif;font-weight:bold;padding:14px 28px;border-radius:999px;text-decoration:none;margin-top:24px;">Become an Artist →</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: "College Creatives <hello@collegecreatives.store>",
      to: email,
      subject: "More About Us!",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not send email.", details: String(error) },
      { status: 500 },
    );
  }
}
