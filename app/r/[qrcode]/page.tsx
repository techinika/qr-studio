import RedirectGate from "@/components/pages/DynamicViewPage";
import React from "react";

async function page({ params }: { params: Promise<{ qrcode: string }> }) {
  const { qrcode } = await params;
  return (
    <div>
      <RedirectGate qrcode={qrcode} />
    </div>
  );
}

export default page;
