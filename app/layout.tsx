import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Creatives",
  description: "A premium student art marketplace.",
  icons: {
    icon: "/images/CC_logo.png",
    apple: "/images/CC_logo.png",
  },
  themeColor: "#12172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
