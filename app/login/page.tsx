import LoginPage from "@/components/pages/LoginPage";
import React from "react";

export const metadata = {
  title: "Sign In to QR STUDIO | Access Your QR Universe",
  description:
    "Securely access your QR STUDIO workspace. Manage your dynamic codes, view analytics, and collaborate with your team. No password required—sign in with Google.",
  robots: {
    index: true,
    follow: true,
  },
};

function page() {
  return (
    <div>
      <LoginPage />
    </div>
  );
}

export default page;
