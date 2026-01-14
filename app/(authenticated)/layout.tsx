import WorkspaceNav from "@/components/parts/workspace/AuthNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Studio Workspace - Advanced QR Code Generation and Scan Wizard",
  description:
    "Generate (Single & Batch) or Scan all your QR codes (Static & Dynamic) in real time.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <WorkspaceNav />
      {children}
    </div>
  );
}
