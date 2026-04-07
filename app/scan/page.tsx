import QRSannerPage from "@/components/pages/QRSanner";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr-studio.techinika.com"),
  title: "QR Scanner | Scan QR Codes Instantly",
  description:
    "Scan any QR code instantly with your camera or from an image. Fast, secure, and free QR scanner with real-time tracking.",
  keywords: [
    "QR scanner",
    "free QR scanner",
    "scan QR code",
    "QR code reader",
    "QR code scanner online",
  ],
  openGraph: {
    title: "QR Scanner | Scan QR Codes Instantly",
    description: "Scan any QR code instantly with your camera or from an image. Fast, secure, and free QR scanner.",
    type: "website",
    url: "https://qr-studio.techinika.com/scan",
    siteName: "QR STUDIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Scanner | Scan QR Codes Instantly",
    description: "Scan any QR code instantly with your camera or from an image. Fast, secure, and free.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function page() {
  return <QRSannerPage />;
}

export default page;
