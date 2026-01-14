import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";

const RubikFont = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Studio - QR Code Generation and Scan Wizard",
  description:
    "Generate (Single & Batch) or Scan all your QR codes (Static & Dynamic) in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${RubikFont.variable} antialiased`}>{children}</body>
      <GoogleAnalytics gaId="G-KCHNK2L43X" />
    </html>
  );
}
