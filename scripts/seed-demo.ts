/**
 * One-time / idempotent CLI seed. Loads `.env.local` before Supabase client init.
 * Run: npm run seed:demo
 */
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { seedDemoArtists } = await import("../lib/seed-artists");
  const { supabaseAdmin } = await import("../lib/supabase");
  const r = await seedDemoArtists(supabaseAdmin);
  console.log("Seed complete:", r);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
