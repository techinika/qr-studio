import LandingPage from "@/components/pages/LandingPage";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr-studio.techinika.com"),
  title: "QR STUDIO | Dynamic QR Code Generator with Analytics",
  description:
    "Create, customize, and track QR codes instantly. Professional QR code generator with custom colors, logos, dynamic URLs, and real-time analytics.",
  keywords: [
    "QR code generator",
    "free QR code",
    "dynamic QR code",
    "QR analytics",
    "custom QR code",
    "QR code maker",
    "QR code with logo",
  ],
  openGraph: {
    title: "QR STUDIO | Dynamic QR Code Generator",
    description: "Create and track QR codes with professional-grade tools.",
    type: "website",
    url: "https://qr-studio.techinika.com",
    siteName: "QR STUDIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR STUDIO | Dynamic QR Code Generator",
    description: "Create and track QR codes with professional-grade tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QR STUDIO",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "Dynamic QR code generator with real-time analytics, custom branding, and password protection.",
  url: "https://qr-studio.techinika.com",
};

function page() {
  return (
    <div>
      <LandingPage />
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </section>
    </div>
  );
}

export default page;
