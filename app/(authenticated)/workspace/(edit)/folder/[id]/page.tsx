import FolderItemsPage from "@/components/pages/view/FolderDetails";
import React from "react";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <FolderItemsPage folderId={id} />
    </div>
  );
}

export default page;
