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
              style={{ color: "#E8503A", textDecoration: "none", fontWeight: 600 }}
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
