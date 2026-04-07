/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  QrCodeIcon,
  Scan,
  Wand2,
  BarChart3,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  Globe,
  Lock,
  Layers,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/parts/Footer";
import Nav from "@/components/parts/Nav";
import AdBanner from "@/components/parts/AdBanner";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Nav />

      <section className="pt-28 pb-16 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
                Create & Track <span className="text-emerald-500">QR Codes</span> Instantly
              </h1>

              <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                Professional QR code generator with real-time analytics, custom branding, and password protection.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/generate"
                  className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all shadow-lg"
                >
                  <Wand2 size={18} />
                  Create QR Code
                </Link>
                <Link
                  href="/scan"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-6 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all border border-slate-200"
                >
                  <Scan size={18} />
                  Scan QR Code
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-6 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">10K+</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">QR Codes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-900">50K+</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scans</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg blur opacity-20"></div>
              <div className="relative bg-slate-900 rounded-lg p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                  <div className="w-40 h-40 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <QrCodeIcon className="text-white w-20 h-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">
              Everything You Need for <span className="text-emerald-500">QR Success</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Professional tools to create, track, and manage your QR codes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Wand2 className="w-6 h-6" />}
              title="Custom QR Codes"
              description="Create branded QR codes with custom colors and logos."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Dynamic URLs"
              description="Change the destination URL anytime, even after printing."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Analytics"
              description="Track scans, locations, devices, and times."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Password Protection"
              description="Secure sensitive content with custom password gates."
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Organization"
              description="Organize your QR codes into folders."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Team Collaboration"
              description="Work together with your team."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">
              How It <span className="text-emerald-500">Works</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Create professional QR codes in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-black text-emerald-600">1</span>
              </div>
              <h3 className="text-lg font-black mb-2">Enter URL</h3>
              <p className="text-slate-500 text-sm">Paste the link you want to encode.</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-black text-emerald-600">2</span>
              </div>
              <h3 className="text-lg font-black mb-2">Customize</h3>
              <p className="text-slate-500 text-sm">Add your brand colors and logo.</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-black text-emerald-600">3</span>
              </div>
              <h3 className="text-lg font-black mb-2">Download</h3>
              <p className="text-slate-500 text-sm">Get your high-resolution QR code.</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all shadow-lg"
            >
              Start Creating <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            Ready to <span className="text-emerald-400">Get Started</span>?
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join thousands of users who trust QR Studio for their QR code needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/generate"
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all shadow-lg"
            >
              Create QR Code
            </Link>
            <Link
              href="/scan"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-lg font-black uppercase tracking-wider text-sm transition-all border border-white/20"
            >
              Scan a QR Code
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Note */}
      <section className="py-10 px-6 bg-amber-50 border-t border-amber-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Globe className="text-amber-600" size={18} />
            <span className="font-bold text-amber-800 uppercase text-sm">Important Note</span>
          </div>
          <p className="text-amber-800 text-sm">
            Statistics are only accurately recorded for <strong>Dynamic QR Codes</strong>. Static QR codes use client-side tracking which may not capture all scans. For accurate analytics, create an account and use Dynamic QR codes.
          </p>
        </div>
      </section>

      <AdBanner />

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-6 hover:bg-slate-100 transition-all">
      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
        {icon}
      </div>
      <h3 className="text-base font-black mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  );
}
