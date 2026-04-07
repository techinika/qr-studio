import React from "react";
import { Metadata } from "next";
import Footer from "@/components/parts/Footer";
import Nav from "@/components/parts/Nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://qr.studio"),
  title: "Terms of Service | QR STUDIO",
  description: "Terms of Service for QR STUDIO - Read our terms and conditions.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">
          Terms of <span className="text-emerald-500">Service</span>
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing and using QR STUDIO, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Description of Service</h2>
            <p className="text-slate-600">
              QR STUDIO provides a platform for creating, managing, and tracking QR codes. We reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">User Accounts</h2>
            <p className="text-slate-600">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Acceptable Use</h2>
            <p className="text-slate-600">
              You agree not to use the service to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Generate QR codes containing malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Distribute spam or engage in phishing activities</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Intellectual Property</h2>
            <p className="text-slate-600">
              The service and its original content, features, and functionality are owned by QR STUDIO and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Payment and Billing</h2>
            <p className="text-slate-600">
              For premium features, you agree to provide accurate and complete billing information. Subscription fees are billed in advance and are non-refundable.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Limitation of Liability</h2>
            <p className="text-slate-600">
              In no event shall QR STUDIO be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Disclaimer</h2>
            <p className="text-slate-600">
              The service is provided on an "as is" and "as available" basis. QR STUDIO makes no representations or warranties of any kind, express or implied, regarding the accuracy, reliability, or completeness of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Indemnification</h2>
            <p className="text-slate-600">
              You agree to indemnify, defend, and hold harmless QR STUDIO and its officers, directors, employees, agents from and against any claims, liabilities, damages, losses, or expenses arising out of your use of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Governing Law</h2>
            <p className="text-slate-600">
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which QR STUDIO operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Changes to Terms</h2>
            <p className="text-slate-600">
              We reserve the right to modify these terms at any time. Your continued use of the service after any changes indicates your acceptance of the new terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase">Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about these Terms of Service, please contact us at support@qr.studio
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
