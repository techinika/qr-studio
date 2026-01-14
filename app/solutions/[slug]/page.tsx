import IndustryDetailPage, {
  industryContent,
} from "@/components/pages/OneSolutionPage";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const data = industryContent[params.slug];

  if (!data) {
    return { title: "Solution Not Found | QR STUDIO" };
  }

  return {
    title: `QR Codes for ${data.title} | Professional Solutions by QR STUDIO`,
    description: data.description,
    openGraph: {
      title: `How ${data.title} Use QR STUDIO`,
      description: `Optimize your ${params.slug} workflow with dynamic QR tracking.`,
      images: [data.heroImage],
    },
  };
}

function page() {
  return (
    <div>
      <IndustryDetailPage />
    </div>
  );
}

export default page;
