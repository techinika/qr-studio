// app/solutions/page.tsx
import SolutionsPage from "@/components/pages/SolutionsPage";
import { baseUrl } from "@/lib/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr.studio"),
  title: "QR Code Solutions for Every Industry | QR STUDIO",
  description:
    "Discover how Restaurants, Real Estate, Retail, Healthcare, Education, and Events use QR STUDIO to bridge the gap between physical marketing and digital analytics.",
  keywords: [
    "QR codes for restaurants",
    "real estate qr codes",
    "retail qr marketing",
    "healthcare qr codes",
    "education qr codes",
    "event check-in qr",
    "contactless menu",
    "trackable yard signs",
  ],
  alternates: { canonical: `${baseUrl}/solutions` },
  openGraph: {
    title: "QR Code Solutions for Every Industry",
    description: "Discover how businesses across industries use QR STUDIO for marketing and analytics.",
    type: "website",
    url: "https://qr.studio/solutions",
    siteName: "QR STUDIO",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Solutions for Every Industry",
    description: "Discover how businesses use QR STUDIO for marketing and analytics.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "QR STUDIO Industry Solutions",
  description:
    "Professional QR code management tailored for various business sectors including restaurants, real estate, retail, healthcare, education, and events.",
  provider: {
    "@type": "SoftwareApplication",
    name: "QR STUDIO",
    applicationCategory: "BusinessApplication",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Industry Solutions",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Restaurant Digital Menus" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Real Estate Virtual Tours" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Retail Product Information" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Healthcare Patient Check-in" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Education Interactive Learning" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Events Digital Ticketing" } },
    ],
  },
};

function page() {
  return (
    <div>
      <SolutionsPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

export default page;
