import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "College Creatives",
  description: "A premium student art marketplace.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  themeColor: "#12172A",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "College Creatives",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        {children}
        <footer
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "#12172A",
            color: "rgba(247,244,239,0.4)",
            fontFamily: '"DM Sans", sans-serif',
            fontSize: 12,
            padding: "1rem 2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span style={{ textAlign: "left" }}>© 2025 College Creatives</span>
          <span style={{ textAlign: "center" }}>
            Questions?{" "}
            <a
              href="mailto:contact@collegecreatives.store"
              style={{ color: "#3BAFD4", textDecoration: "none", fontWeight: 600 }}
            >
              contact@collegecreatives.store
            </a>
          </span>
          <span style={{ textAlign: "right" }}>collegecreatives.store</span>
        </footer>
      </body>
    </html>
  );
}
