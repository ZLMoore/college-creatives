export const MEDIUM_OPTIONS = [
  "Watercolor",
  "Oil Painting",
  "Acrylic Painting",
  "Ink Wash",
  "Pen & Ink",
  "Calligraphy",
  "Graphite",
  "Oil Pastel",
  "Photography",
  "Digital Art",
  "Mixed Media",
  "Collage",
] as const;

export type MediumOption = (typeof MEDIUM_OPTIONS)[number];

export function isAllowedMedium(value: string): value is MediumOption {
  return (MEDIUM_OPTIONS as readonly string[]).includes(value);
}
