import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const RubikFont = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR STUDIO | Professional Dynamic QR Code Generator & Analytics",
  description:
    "Generate, track, and manage secure dynamic QR codes. Features bulk creation, password protection, and real-time scan analytics for teams.",
  keywords: [
    "QR code generator",
    "dynamic QR code",
    "QR analytics",
    "bulk QR creation",
    "secure QR scanner",
  ],
  openGraph: {
    title: "QR STUDIO - The Professional QR Universe",
    description: "The all-in-one workspace for your QR code strategy.",
    images: [{ url: "/qr-studio.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1268572467254702"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <meta
          name="google-site-verification"
          content="D3LBrk5L1VNTNkkazkp5cAkDmWp_dzOE7ORnVxdvvP4"
        />
      </head>
      <body className={`${RubikFont.variable} antialiased`}>{children}</body>
      <GoogleAnalytics gaId="G-2SS6CWQVDN" />
    </html>
  );
}
