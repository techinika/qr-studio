// app/solutions/page.tsx
import SolutionsPage from "@/components/pages/SolutionsPage";
import { baseUrl } from "@/lib/main";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Solutions for Every Industry | QR STUDIO",
  description:
    "Discover how Restaurants, Real Estate, Retail, and Events use QR STUDIO to bridge the gap between physical marketing and digital analytics.",
  keywords: [
    "QR codes for restaurants",
    "real estate qr codes",
    "contactless menu",
    "trackable yard signs",
    "event check-in qr",
  ],
  alternates: { canonical: `${baseUrl}/solutions` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "QR STUDIO Industry Solutions",
  description:
    "Professional QR code management tailored for various business sectors.",
  provider: {
    "@type": "SoftwareApplication",
    name: "QR STUDIO",
    applicationCategory: "BusinessApplication",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Industry Solutions",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Restaurant Digital Menus" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Real Estate Virtual Tours" },
      },
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
