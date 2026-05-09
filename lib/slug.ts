import { supabaseAdmin } from "@/lib/supabase";

export function slugifyName(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "artist";
}

export async function uniqueArtistSlug(name: string): Promise<string> {
  const base = slugifyName(name);
  let slug = base;
  let counter = 2;
  const maxAttempts = 500;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data } = await supabaseAdmin.from("artists").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }

  throw new Error("Could not allocate a unique slug.");
}
