import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { siteConfig, siteMetadata } from "@/lib/site-config";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || siteConfig.url),
  title: siteMetadata.title,
  description: siteMetadata.fullDescription,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.creator, url: siteConfig.links.twitch }],
  creator: siteConfig.creator,
  openGraph: {
    url: "/",
    title: siteMetadata.title,
    description: siteMetadata.fullDescription,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.fullDescription,
    creator: siteConfig.creatorTwitter,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navbar />
        {children}
        <Script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="3bb1686d9eee"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
