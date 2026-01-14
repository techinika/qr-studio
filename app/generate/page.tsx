import QRGenerator from "@/components/pages/QRGenerator";
import React from "react";

export const metadata = {
  title: "Free QR Code Generator | Create High-Res QR Codes Instantly",
  description:
    "Generate high-quality, scannable QR codes for URLs, WiFi, and V-Cards for free. No signup required. Fast, secure, and professional-grade.",
  keywords: [
    "free qr generator",
    "create qr code online",
    "high res qr code",
    "no signup qr generator",
  ],
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
