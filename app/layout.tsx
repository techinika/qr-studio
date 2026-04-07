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
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://qr-studio.techinika.com"),
  title: "QR STUDIO | Best Free Dynamic QR Code Generator with Analytics",
  description:
    "Create high-quality dynamic QR codes for free. Track scans, customize colors and logos, password protect your codes. Best QR code generator online.",
  keywords: [
    "QR code generator",
    "best QR code generator",
    "free QR code generator",
    "dynamic QR code generator",
    "QR code generator with logo",
    "custom QR code maker",
    "QR code analytics",
    "online QR code scanner",
    "free QR code scanner",
    "QR code scanner online",
    "protected QR code scanner",
    "password protected QR code",
    "QR code maker free",
    "generate QR code",
    "create QR code",
    "dynamic QR codes that can be edited",
  ],
  authors: [{ name: "Ubunifu Labs" }],
  creator: "Ubunifu Labs",
  publisher: "Ubunifu Labs",
  openGraph: {
    title: "QR STUDIO | Best Free Dynamic QR Code Generator",
    description: "Create, track, and manage QR codes with professional-grade tools. Best QR code generator online.",
    images: [{ url: "/qr-studio.png", width: 1200, height: 630 }],
    type: "website",
    locale: "en_US",
    siteName: "QR Studio",
    url: "https://qr-studio.techinika.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR STUDIO | Best Free Dynamic QR Code Generator",
    description: "Create, track, and manage QR codes with professional-grade tools. Best QR code generator online.",
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
    canonical: "https://qr-studio.techinika.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={RubikFont.variable}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1268572467254702"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1268572467254702"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <meta
          name="google-site-verification"
          content="D3LBrk5L1VNTNkkazkp5cAkDmWp_dzOE7ORnVxdvvP4"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-rubik antialiased">
        <AuthProvider>
          <Toaster position="top-center" expand={true} richColors />
          {children}
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-2SS6CWQVDN" />
    </html>
  );
}