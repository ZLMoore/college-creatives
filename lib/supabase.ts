import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

/** Server-only admin client: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (never the anon key). */
export function createSupabaseAdminForServer(): SupabaseClient | null {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey);
}

const adminUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const adminServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

export type ArtistStatus = "pending" | "approved" | "rejected";
export type ArtworkStatus = "draft" | "published" | "archived";
export type OrderStatus = "pending" | "paid" | "fulfilled" | "failed";

export type Artist = {
  id: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  email: string;
  school: string;
  major: string;
  medium: string;
  bio: string;
  portfolio_url: string | null;
  status: ArtistStatus;
  stripe_account_id: string | null;
  slug: string | null;
  created_at: string;
};

export type Artwork = {
  id: string;
  artist_id: string;
  title: string;
  description: string;
  price: number;
  printful_product_id: string | null;
  image_url: string;
  curator_note: string | null;
  medium: string | null;
  status: ArtworkStatus;
  created_at: string;
};

export type Order = {
  id: string;
  artwork_id: string;
  buyer_email: string;
  amount: number;
  stripe_payment_id: string | null;
  printful_order_id: string | null;
  status: OrderStatus;
  created_at: string;
};

const supabaseUrl = adminUrl || env.supabaseUrl || "https://placeholder.supabase.co";
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? env.supabaseAnonKey ?? "").trim() || "placeholder-anon-key";

/** Public / browser-safe client (anon key only). */
export const supabase = createClient(supabaseUrl, anonKey);

/**
 * Service-role client for API routes and scripts.
 * Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY — not the anon key.
 */
export const supabaseAdmin = createClient(
  adminUrl || "https://invalid.supabase.co",
  adminServiceRoleKey || "missing-SUPABASE_SERVICE_ROLE_KEY",
);
