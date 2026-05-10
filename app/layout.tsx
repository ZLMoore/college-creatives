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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>© 2025 College Creatives</span>
          <span>collegecreatives.store</span>
        </footer>
      </body>
    </html>
  );
}
