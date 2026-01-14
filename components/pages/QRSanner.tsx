"use client";

import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  Upload,
  Copy,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Globe,
  Lock,
  BarChart3,
  Layers,
  ZapIcon,
  Crown,
} from "lucide-react";
import Link from "next/link";
import Footer from "../parts/Footer";
import Nav from "../parts/Nav";

export default function QRScannerHome() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-reader";

  // Helper to initialize scanner safely - ensures element exists first
  const getScanner = () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerId);
      }
      return scannerRef.current;
    } catch (e) {
      console.error("Scanner initialization failed", e);
      return null;
    }
  };

  const startScanner = async () => {
    setScanResult(null);
    setError(null);
    setIsCameraActive(true);

    // Give React a tiny beat to ensure the element is visible if it was hidden
    setTimeout(async () => {
      const scanner = getScanner();
      if (!scanner) return;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 20, qrbox: { width: 280, height: 280 } },
          (decodedText) => {
            setScanResult(decodedText);
            stopCamera();
          },
          undefined
        );
      } catch (err) {
        setError(
          "Camera access denied. Please check your browser permissions."
        );
        setIsCameraActive(false);
      }
    }, 100);
  };

  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanResult(null);
    setError(null);

    const scanner = getScanner();
    if (!scanner) return;

    try {
      const result = await scanner.scanFile(file, true);
      setScanResult(result);
    } catch (err) {
      setError("No QR code found in this image. Try a clearer photo.");
    }
  };

  const copyToClipboard = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Nav />

      <main className="grow max-w-6xl mx-auto w-full px-6 py-12">
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight italic uppercase tracking-tighter">
            Universal <span className="text-emerald-500">QR Scanner</span>
          </h1>
          <p className="text-lg text-slate-500">
            Fast, real-time scanning for all your QR codes. Built by Ubunifu
            Labs.
          </p>
        </div>

        {/* Scanner Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mb-24">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm h-full flex flex-col min-h-[450px]">
              {/* FIXED: The ID is now always present but hidden visually when not needed */}
              <div
                className={`${isCameraActive ? "block" : "hidden"} space-y-4`}
              >
                <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-500 bg-black aspect-square">
                  <div id={scannerId} className="w-full h-full"></div>
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-3/4 h-3/4 border-2 border-emerald-400/50 rounded-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)] animate-scan-line"></div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={stopCamera}
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  Cancel Scan
                </button>
              </div>

              {!isCameraActive && !scanResult && (
                <div className="space-y-4 my-auto">
                  <button
                    onClick={startScanner}
                    className="w-full flex flex-col items-center justify-center gap-4 bg-emerald-500 hover:bg-emerald-600 text-white p-10 rounded-[2rem] transition-all shadow-xl shadow-emerald-200 active:scale-95"
                  >
                    <Camera size={40} />
                    <span className="text-2xl font-black uppercase tracking-tight">
                      Open Camera
                    </span>
                  </button>

                  <div className="relative group/upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 py-6 rounded-[2rem] font-bold text-slate-400 group-hover/upload:border-emerald-300 group-hover/upload:text-emerald-500 transition-all">
                      <Upload size={20} /> Scan from File
                    </div>
                  </div>
                  {/* HIDDEN SCANNER FOR FILE UPLOAD TARGET */}
                  <div id={scannerId} className="hidden"></div>
                </div>
              )}

              {scanResult && !isCameraActive && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-10 my-auto">
                  <div className="bg-emerald-100 p-8 rounded-full border-4 border-emerald-50">
                    <CheckCircle2 size={56} className="text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 uppercase italic">
                    Success!
                  </h3>
                  <button
                    onClick={startScanner}
                    className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                  >
                    <RefreshCw size={20} /> Scan Next
                  </button>
                </div>
              )}

              {error && (
                <p className="mt-4 text-amber-600 text-sm text-center bg-amber-50 py-3 rounded-xl border border-amber-100 font-bold">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grow flex flex-col">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-4 py-1.5 rounded-full mb-6 self-start">
                Live Result
              </span>

              {scanResult ? (
                <div className="space-y-6">
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 break-all font-mono text-slate-700 leading-relaxed text-lg shadow-inner">
                    {scanResult}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-tighter hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}{" "}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    {scanResult.startsWith("http") && (
                      <a
                        href={scanResult}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 py-5 rounded-2xl font-black uppercase tracking-tighter hover:bg-slate-50 transition-all"
                      >
                        <ExternalLink size={20} /> Open Link
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grow flex flex-col items-center justify-center text-slate-300 py-20">
                  <Zap size={60} className="mb-4 opacity-10 animate-pulse" />
                  <p className="font-black uppercase tracking-widest text-slate-400">
                    Ready to scan
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <ShieldCheck className="text-emerald-500 mb-2" size={24} />
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Privacy First
                </span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                <Globe className="text-emerald-500 mb-2" size={24} />
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Secure Link
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* UPCOMING PRO FEATURES & PRICING */}
        <section className="mt-32 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase italic">
              Level up with <span className="text-emerald-500">QR Man Pro</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Access powerful tools designed for creators and businesses. Coming
              soon to Ubunifu Labs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Monthly Plan */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="mb-8">
                <h3 className="text-xl font-black uppercase mb-2">Monthly</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">$9.99</span>
                  <span className="text-slate-400 font-bold">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10">
                <FeatureItem text="Dynamic QR Codes" />
                <FeatureItem text="Scan Analytics" />
                <FeatureItem text="Bulk Generation" />
                <FeatureItem text="Password Protection" />
              </ul>
              <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase group-hover:bg-slate-900 group-hover:text-white transition-all">
                Get Started
              </button>
            </div>

            {/* Annual Plan - Featured */}
            <div className="bg-slate-900 p-10 rounded-[3rem] border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 relative transform lg:scale-110">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                Best Value
              </div>
              <div className="mb-8 text-white">
                <h3 className="text-xl font-black uppercase mb-2 text-emerald-400">
                  Annual
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">$96</span>
                  <span className="text-slate-400 font-bold">/yr</span>
                </div>
                <p className="text-emerald-500/60 text-xs font-bold uppercase mt-1">
                  Only $8 per month
                </p>
              </div>
              <ul className="space-y-4 mb-10 text-slate-300">
                <FeatureItem text="All Pro Features" />
                <FeatureItem text="Priority Support" />
                <FeatureItem text="Custom Branding" />
                <FeatureItem text="Ad-free Experience" />
              </ul>
              <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                Subscribe Now
              </button>
            </div>

            {/* Lifetime Plan */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="mb-8">
                <h3 className="text-xl font-black uppercase mb-2">Lifetime</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">$499</span>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase mt-1 text-nowrap">
                  One-time payment
                </p>
              </div>
              <ul className="space-y-4 mb-10">
                <FeatureItem text="Unlimited Lifetime Access" />
                <FeatureItem text="All Future Updates" />
                <FeatureItem text="Commercial License" />
                <FeatureItem text="White-label Exports" />
              </ul>
              <button className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase group-hover:bg-slate-900 group-hover:text-white transition-all">
                Own It Forever
              </button>
            </div>
          </div>

          {/* Feature Highlight Section */}
          <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-slate-100 pt-16">
            <FeatureCard
              icon={<Lock />}
              title="Password Protection"
              desc="Secure sensitive data with custom pins."
            />
            <FeatureCard
              icon={<Layers />}
              title="Bulk Generation"
              desc="Create hundreds of codes in seconds."
            />
            <FeatureCard
              icon={<BarChart3 />}
              title="Scan Analytics"
              desc="Track locations, devices, and times."
            />
            <FeatureCard
              icon={<ZapIcon />}
              title="Dynamic Codes"
              desc="Change URLs after you print them."
            />
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes scan-line {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan-line {
          animation: scan-line 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 font-bold text-sm">
      <Crown size={14} className="text-emerald-500" />
      {text}
    </li>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="space-y-4">
      <div className="text-emerald-500">{icon}</div>
      <h4 className="font-black uppercase italic text-slate-800 tracking-tight">
        {title}
      </h4>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
