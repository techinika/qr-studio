import QRGenerator from "@/components/pages/QRGenerator";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr-studio.techinika.com"),
  title: "Best Free QR Code Generator | Create Custom QR Codes Instantly",
  description:
    "Generate high-quality, scannable QR codes for free. Customize colors, add logos, and track scans. Best QR code generator online.",
  keywords: [
    "QR code generator",
    "best QR code generator",
    "free QR code generator",
    "create qr code online",
    "custom qr code",
    "qr code with logo",
    "colorful qr code",
    "qr code maker",
    "generate QR code",
    "create QR code",
    "free QR code maker",
    "online QR code generator",
  ],
  openGraph: {
    title: "Best Free QR Code Generator",
    description: "Generate high-quality, scannable QR codes for free. Customize colors, add logos, and track scans.",
    type: "website",
    url: "https://qr-studio.techinika.com/generate",
    siteName: "QR STUDIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Free QR Code Generator",
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
