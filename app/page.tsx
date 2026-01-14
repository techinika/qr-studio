import QRScannerHome from "@/components/pages/QRSanner";
import React from "react";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "QR STUDIO",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "8.00",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1024",
  },
};

function page() {
  return (
    <div>
      <QRScannerHome />
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
