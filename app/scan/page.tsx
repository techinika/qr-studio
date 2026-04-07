import QRSannerPage from "@/components/pages/QRSanner";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr-studio.techinika.com"),
  title: "Best Free Online QR Code Scanner | Scan QR Codes Instantly",
  description:
    "Scan any QR code instantly with your camera or from an image. Fast, secure, and free QR scanner. Best online QR code scanner.",
  keywords: [
    "QR scanner",
    "free QR scanner",
    "QR code scanner online",
    "scan QR code",
    "QR code reader",
    "best QR scanner",
    "online QR code scanner",
    "scan QR code online",
    "camera QR scanner",
    "QR code scanner free",
  ],
  openGraph: {
    title: "Best Free Online QR Code Scanner",
    description: "Scan any QR code instantly with your camera or from an image. Fast, secure, and free QR scanner.",
    type: "website",
    url: "https://qr-studio.techinika.com/scan",
    siteName: "QR STUDIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Free Online QR Code Scanner",
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
