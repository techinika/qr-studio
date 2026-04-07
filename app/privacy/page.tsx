import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/parts/Footer";
import Nav from "@/components/parts/Nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr.studio"),
  title: "Privacy Policy | QR STUDIO",
  description: "Privacy Policy for QR STUDIO - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">
          Privacy <span className="text-emerald-500">Policy</span>
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Introduction</h2>
            <p className="text-slate-600">
              At QR STUDIO, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Information We Collect</h2>
            <p className="text-slate-600">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Account information (email, name) when you sign up</li>
              <li>QR code content you create</li>
              <li>Payment information for premium subscriptions</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">How We Use Your Information</h2>
            <p className="text-slate-600">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Track QR code scans and provide analytics</li>
              <li>Send you important account information</li>
              <li>Respond to your comments and questions</li>
              <li>Process transactions and send related information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Data Security</h2>
            <p className="text-slate-600">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Third-Party Services</h2>
            <p className="text-slate-600">
              We may use third-party service providers to help us operate our business. These providers have access to your personal information only to perform tasks on our behalf.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Your Rights</h2>
            <p className="text-slate-600">
              You have the right to access, update, or delete your personal information at any time. You can manage your account settings or contact us for assistance.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Changes to This Policy</h2>
            <p className="text-slate-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us at support@qr.studio
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
