/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  Upload,
  Copy,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Lock,
  BarChart3,
  Layers,
  Zap,
} from "lucide-react";
import Footer from "../parts/Footer";
import Nav from "../parts/Nav";
import AdBanner from "../parts/AdBanner";
import Link from "next/link";
import { identifyAndRecordScan } from "@/db/functions/QRServices";
import { useAuth } from "@/lib/AuthContext";

export default function QRScannerHome() {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-reader";

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

  async function onScanSuccess() {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await identifyAndRecordScan(scanResult, user?.uid || null);
    } catch (err) {
      console.error("Tracking failed:", err);
    } finally {
      setIsProcessing(false);
    }
  }

  const startScanner = async () => {
    setScanResult("");
    setError(null);
    setIsCameraActive(true);

    setTimeout(async () => {
      const scanner = getScanner();
      if (!scanner) return;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 20, qrbox: { width: 280, height: 280 } },
          (decodedText) => {
            setScanResult(decodedText);
            onScanSuccess();
            stopCamera();
          },
          undefined,
        );
      } catch (err) {
        setError("Camera access denied. Please check your browser permissions.");
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

    setScanResult("");
    setError(null);

    const scanner = getScanner();
    if (!scanner) return;

    try {
      const result = await scanner.scanFile(file, true);
      setScanResult(result);
      onScanSuccess();
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <Nav />

      <main className="grow max-w-6xl mx-auto w-full px-6 py-12">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight uppercase tracking-tighter">
            QR <span className="text-emerald-500">Scanner</span>
          </h1>
          <p className="text-lg text-slate-500">
            Scan QR codes instantly with your camera or from an image.
          </p>
        </div>

        <AdBanner />

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm h-full flex flex-col min-h-[400px]">
            <div className={`${isCameraActive ? "block" : "hidden"} space-y-4`}>
              <div className="relative rounded-lg overflow-hidden border-4 border-emerald-500 bg-black aspect-square">
                <div id={scannerId} className="w-full h-full"></div>
              </div>
              <button
                onClick={stopCamera}
                className="w-full py-3 bg-slate-100 text-slate-500 rounded-lg font-bold hover:bg-red-50 hover:text-red-500 transition-all"
              >
                Cancel
              </button>
            </div>

            {!isCameraActive && !scanResult && (
              <div className="space-y-4 my-auto">
                <button
                  onClick={startScanner}
                  className="w-full flex flex-col items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white p-8 rounded-lg transition-all shadow-lg shadow-emerald-200"
                >
                  <Camera size={32} />
                  <span className="text-xl font-black uppercase">Open Camera</span>
                </button>

                <div className="relative group/upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 py-4 rounded-lg font-bold text-slate-400 group-hover/upload:border-emerald-300 group-hover/upload:text-emerald-500 transition-all">
                    <Upload size={18} /> Scan from File
                  </div>
                </div>
                <div id={scannerId} className="hidden"></div>
              </div>
            )}

            {scanResult && !isCameraActive && (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 my-auto">
                <div className="bg-emerald-100 p-6 rounded-full border-4 border-emerald-50">
                  <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase">
                  Scanned!
                </h3>
                <button
                  onClick={startScanner}
                  className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-black uppercase tracking-wider hover:bg-emerald-600 transition-all"
                >
                  <RefreshCw size={18} /> Scan Next
                </button>
              </div>
            )}

            {error && (
              <p className="mt-4 text-amber-600 text-sm text-center bg-amber-50 py-2 rounded-lg border border-amber-100 font-bold">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex flex-col flex-1">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full mb-4 self-start">
                Result
              </span>

              {scanResult ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg break-all text-slate-700 text-sm">
                    {scanResult}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-emerald-600 transition-all"
                    >
                      {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    {scanResult.startsWith("http") && (
                      <Link
                        href={scanResult}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-slate-50 transition-all"
                      >
                        <ExternalLink size={18} /> Open
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grow flex flex-col items-center justify-center text-slate-300 py-16">
                  <Zap size={48} className="mb-3 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-slate-400">
                    Ready to scan
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-lg border border-slate-100 flex flex-col items-center text-center">
                <ShieldCheck className="text-emerald-500 mb-2" size={20} />
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Privacy First
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-100 flex flex-col items-center text-center">
                <Globe className="text-emerald-500 mb-2" size={20} />
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Secure
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3 uppercase">
              Powerful <span className="text-emerald-500">Features</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Create, track, and manage QR codes with professional-grade tools.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-base font-black uppercase mb-2">Dynamic QR Codes</h3>
              <p className="text-slate-500 text-sm">Change destination URLs anytime.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-base font-black uppercase mb-2">Analytics</h3>
              <p className="text-slate-500 text-sm">Track scans in real-time.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lock className="text-emerald-500" size={24} />
              </div>
              <h3 className="text-base font-black uppercase mb-2">Password Protection</h3>
              <p className="text-slate-500 text-sm">Secure your content.</p>
            </div>
          </div>
        </section>

        <AdBanner />
      </main>

      <Footer />
    </div>
  );
}
