import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/AuthContext";

const RubikFont = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR STUDIO | Free Dynamic QR Code Generator with Analytics",
  description:
    "Create high-quality dynamic QR codes for free. Track scans, customize colors and logos, password protect your codes. No subscription required.",
  keywords: [
    "QR code generator",
    "free QR code",
    "dynamic QR code",
    "QR analytics",
    "QR code maker",
    "custom QR code",
    "QR code with logo",
  ],
  authors: [{ name: "Ubunifu Labs" }],
  creator: "Ubunifu Labs",
  publisher: "Ubunifu Labs",
  openGraph: {
    title: "QR STUDIO | Free Dynamic QR Code Generator with Analytics",
    description: "Create, track, and manage QR codes with professional-grade tools. Completely free.",
    images: [{ url: "/qr-studio.png", width: 1200, height: 630 }],
    type: "website",
    locale: "en_US",
    siteName: "QR Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR STUDIO | Free Dynamic QR Code Generator",
    description: "Create, track, and manage QR codes with professional-grade tools. Completely free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://qrstudio.app",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${RubikFont.variable} antialiased`}>
        <AuthProvider>
          <Toaster position="top-center" expand={true} richColors />
          {children}
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-2SS6CWQVDN" />
    </html>
  );
}
