import { SubscriptionGuard } from "@/components/pages/SubscriptionGuard";
import WorkspaceNav from "@/components/parts/workspace/AuthNav";
import AdBanner from "@/components/parts/AdBanner";
import Footer from "@/components/parts/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Studio Workspace - Dashboard",
  description:
    "Manage your QR codes, view analytics, and access advanced features in your QR Studio workspace.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SubscriptionGuard>
      <WorkspaceNav />
      {children}
      <AdBanner />
      <Footer />
    </SubscriptionGuard>
  );
}
