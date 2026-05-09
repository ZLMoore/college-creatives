import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediumOption } from "./medium-options";

export type SeedArtworkInput = {
  title: string;
  /** Dollar amount (e.g. 44 = $44.00); stored as cents in DB */
  price: number;
  image_url: string;
  curator_note: string | null;
  medium: MediumOption;
};

export type SeedArtistInput = {
  name: string;
  email: string;
  school: string;
  major: string;
  medium: string;
  bio: string;
  status: "approved";
  slug: string;
  artworks: SeedArtworkInput[];
};

/** Demo artists + artworks for local / staging. Idempotent: skips rows that already exist (by slug / title). */
export const DEMO_SEED_ARTISTS: SeedArtistInput[] = [
  {
    name: "Vincent van Gogh",
    email: "vangogh@demo.edu",
    school: "Royal Academy of Arts",
    major: "Fine Arts",
    medium: "Post-impressionism",
    bio: "Vincent's swirling post-impressionist canvases channel raw emotion through bold brushwork and electric color.",
    status: "approved",
    slug: "vincent-van-gogh",
    artworks: [
      {
        title: "Starry Night Over the Rhône",
        price: 44,
        image_url: "/images/starry-rhone.jpg",
        curator_note: null,
        medium: "Oil Painting",
      },
      {
        title: "The Starry Night",
        price: 52,
        image_url: "/images/starry-night.jpg",
        curator_note: null,
        medium: "Oil Painting",
      },
      {
        title: "Self-Portrait with Palette",
        price: 38,
        image_url: "/images/vangogh-self.jpg",
        curator_note: null,
        medium: "Oil Painting",
      },
    ],
  },
  {
    name: "Leonardo da Vinci",
    email: "davinci@demo.edu",
    school: "Florentine Academy",
    major: "Renaissance Art",
    medium: "Renaissance",
    bio: "Leonardo's mastery of sfumato produced works that transcend time. His portraits carry a quiet intensity.",
    status: "approved",
    slug: "leonardo-da-vinci",
    artworks: [
      {
        title: "Mona Lisa",
        price: 56,
        image_url: "/images/mona-lisa.jpg",
        curator_note: null,
        medium: "Oil Painting",
      },
      {
        title: "Creation of Adam",
        price: 48,
        image_url: "/images/creation.jpg",
        curator_note: null,
        medium: "Oil Painting",
      },
    ],
  },
  {
    name: "Katsushika Hokusai",
    email: "hokusai@demo.edu",
    school: "Kano School of Art",
    major: "Ukiyo-e Printmaking",
    medium: "Ukiyo-e",
    bio: "Hokusai's woodblock prints defined an era with bold lines and an eye for the sublime in nature.",
    status: "approved",
    slug: "katsushika-hokusai",
    artworks: [
      {
        title: "The Great Wave off Kanagawa",
        price: 46,
        image_url: "/images/wave.jpg",
        curator_note: null,
        medium: "Ink Wash",
      },
    ],
  },
  {
    name: "Wassily Kandinsky",
    email: "kandinsky@demo.edu",
    school: "Bauhaus",
    major: "Abstract Composition",
    medium: "Abstract",
    bio: "Kandinsky pioneered pure abstraction — shapes and color used to express feeling directly.",
    status: "approved",
    slug: "kandinsky-wassily",
    artworks: [
      {
        title: "Composition VIII",
        price: 42,
        image_url: "/images/kandinsky.jpg",
        curator_note: null,
        medium: "Oil Painting",
      },
    ],
  },
];

export type SeedDemoResult = {
  artistsInserted: number;
  artistsExisting: number;
  artworksInserted: number;
  artworksExisting: number;
};

export async function seedDemoArtists(client: SupabaseClient): Promise<SeedDemoResult> {
  const out: SeedDemoResult = {
    artistsInserted: 0,
    artistsExisting: 0,
    artworksInserted: 0,
    artworksExisting: 0,
  };

  for (const a of DEMO_SEED_ARTISTS) {
    const { data: existingArtist } = await client
      .from("artists")
      .select("id")
      .eq("slug", a.slug)
      .maybeSingle();

    let artistId: string;

    if (existingArtist?.id) {
      artistId = existingArtist.id;
      out.artistsExisting++;
    } else {
      const { data: inserted, error: insErr } = await client
        .from("artists")
        .insert({
          name: a.name,
          email: a.email,
          school: a.school,
          major: a.major,
          medium: a.medium,
          bio: a.bio,
          status: a.status,
          slug: a.slug,
          portfolio_url: null,
          stripe_account_id: null,
        })
        .select("id")
        .single();

      if (insErr) throw insErr;
      if (!inserted?.id) throw new Error("Insert artist returned no id");
      artistId = inserted.id;
      out.artistsInserted++;
    }

    for (const aw of a.artworks) {
      const { data: existingArt } = await client
        .from("artworks")
        .select("id")
        .eq("artist_id", artistId)
        .eq("title", aw.title)
        .maybeSingle();

      if (existingArt?.id) {
        const { error: upErr } = await client
          .from("artworks")
          .update({ medium: aw.medium })
          .eq("id", existingArt.id);
        if (upErr) throw upErr;
        out.artworksExisting++;
        continue;
      }

      const { error: awErr } = await client.from("artworks").insert({
        artist_id: artistId,
        title: aw.title,
        description: `Archival-quality print after ${aw.title}. Produced for College Creatives collectors.`,
        price: aw.price,
        image_url: aw.image_url,
        curator_note: aw.curator_note,
        medium: aw.medium,
        status: "published",
      });

      if (awErr) throw awErr;
      out.artworksInserted++;
    }
  }

  return out;
}
