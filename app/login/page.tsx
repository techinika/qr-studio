import LoginPage from "@/components/pages/LoginPage";
import React from "react";

export const metadata = {
  title: "Sign In | QR STUDIO - Access Your QR Dashboard",
  description:
    "Sign in to your QR Studio account to access your QR code dashboard, analytics, and advanced features.",
  robots: {
    index: false,
    follow: true,
  },
};

function page() {
  return <LoginPage />;
}

export default page;
