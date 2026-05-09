import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (password !== env.adminPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  cookies().set("cc_admin_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
