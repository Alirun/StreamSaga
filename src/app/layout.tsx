import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "StreamSaga";
const title = siteName;
const description = "Propose and vote for projects to be built live.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://streamsaga.space"),
  title,
  description,
  openGraph: {
    url: "/",
    title,
    description,
    siteName,
    type: "website",
    // TODO: Add locale-specific OG images: `/images/og/og-${locale}.png`
    // images: [ogImagePath],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    // TODO: Add locale-specific Twitter images: `/images/og/og-${locale}.png`
    // images: [ogImagePath],
  },
};

import { Navbar } from "@/components/navbar";

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
      </body>
    </html>
  );
}
