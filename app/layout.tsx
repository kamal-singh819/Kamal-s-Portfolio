import type { Metadata } from "next";
import { Special_Elite, Shadows_Into_Light } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { profile } from "@/data/common/profile";
import "@/styles/globals.css";
import "highlight.js/styles/github-dark.css";

const specialElite = Special_Elite({
  weight: "400",
  variable: "--font-special-elite",
  subsets: ["latin"]
});

const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  variable: "--font-shadows-into-light",
  subsets: ["latin"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kamal Singh | Portfolio and Blog",
    template: "%s | Kamal Singh"
  },
  description: "A minimal developer portfolio and Markdown-powered blog.",
  openGraph: {
    title: "Kamal Singh | Portfolio and Blog",
    description: "A minimal developer portfolio and Markdown-powered blog.",
    url: siteUrl,
    siteName: "Kamal Singh"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={`${specialElite.variable} ${shadowsIntoLight.variable}`}>
      <body className="font-sans antialiased">
        <header className="border-b border-line bg-paper/90">
          <Navigation />
        </header>
        <main className="mx-auto max-w-[700px] px-5 py-12">{children}</main>
        <footer className="mx-auto max-w-[700px] border-t border-line px-5 py-6 text-center text-sm text-zinc-500">
          © {currentYear} {profile.name}. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
