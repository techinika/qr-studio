import QRGenerator from "@/components/pages/QRGenerator";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr.studio"),
  title: "Free QR Code Generator | Create Custom QR Codes Instantly",
  description:
    "Generate high-quality, scannable QR codes for free. Customize colors, add logos, and track scans. No signup required. Fast, secure, and professional-grade.",
  keywords: [
    "free qr generator",
    "create qr code online",
    "custom qr code",
    "qr code with logo",
    "colorful qr code",
    "no signup qr generator",
    "qr code maker",
  ],
  openGraph: {
    title: "Free QR Code Generator | Create Custom QR Codes",
    description: "Generate high-quality, scannable QR codes for free. Customize colors, add logos, and track scans. No signup required.",
    type: "website",
    url: "https://qr.studio/generate",
    siteName: "QR STUDIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator",
    description: "Generate high-quality, scannable QR codes for free. Customize colors and add logos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function page() {
  return (
    <div>
      <QRGenerator />
    </div>
  );
}

export default page;
