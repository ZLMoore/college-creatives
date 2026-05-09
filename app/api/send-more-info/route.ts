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
<body style="margin:0;background:#F7F4EF;font-family:Georgia,serif;color:#12172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EF;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(18,23,42,0.12);">
        <tr><td style="background:#12172A;padding:28px 32px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:22px;color:#FFFFFF;">College <span style="color:#F5A623;">Creatives</span></p>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${name},</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#0E1018;">
            Thanks for your interest in <strong>College Creatives</strong>. We&apos;re building the student art marketplace where campus talent meets collectors who care.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#0E1018;">
            <strong>Our mission:</strong> Put student artists first — fair economics, gallery-level presentation, and real support from application to payout.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#0E1018;">
            <strong>Founder:</strong> Zakora Moore
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:#0E1018;">
            <strong>100% profit to artists — zero platform fees on your share.</strong> We believe your work should fund your future, not disappear into hidden cuts.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#0E1018;">
            <strong>.edu required:</strong> College Creatives is for verified students. Apply with your university email so we can keep the community authentic.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:40px;background:#F5A623;">
            <a href="${applyUrl}" style="display:inline-block;padding:14px 28px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;color:#12172A;text-decoration:none;">Apply to sell on College Creatives</a>
          </td></tr></table>
          <p style="margin:24px 0 0;font-size:12px;color:#7A7670;line-height:1.6;">
            Questions? Reply to this email — we read every message.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "More about College Creatives",
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
