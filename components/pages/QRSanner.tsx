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
  Zap,
  ShieldCheck,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Footer from "../parts/Footer";
import Nav from "../parts/Nav";

export default function QRScannerHome() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We use a ref to persist the scanner instance
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-reader";

  // Helper to initialize scanner safely
  const getScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerId);
    }
    return scannerRef.current;
  };

  // 1. Camera Scanning Logic
  const startScanner = async () => {
    setScanResult(null);
    setError(null);
    setIsCameraActive(true);

    const scanner = getScanner();
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
      setError("Camera access denied or failed to initialize.");
      setIsCameraActive(false);
    }
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
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
            Universal <span className="text-emerald-500">QR Scanner</span>
          </h1>
          <p className="text-lg text-slate-500">
            Fast, real-time scanning for all your QR codes. Built by Ubunifu
            Labs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white p-8 rounded-4xl border border-emerald-50 shadow-sm h-full flex flex-col">
              {!isCameraActive && !scanResult && (
                <div className="space-y-4 my-auto">
                  <button
                    onClick={startScanner}
                    className="w-full flex flex-col items-center justify-center gap-4 bg-emerald-500 hover:bg-emerald-600 text-white p-10 rounded-3xl transition-all shadow-xl shadow-emerald-200"
                  >
                    <Camera size={32} />
                    <span className="text-xl font-bold">Open Camera</span>
                  </button>

                  <div className="relative group/upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 py-6 rounded-3xl font-bold text-slate-400 group-hover/upload:border-emerald-300 group-hover/upload:text-emerald-500 transition-all">
                      <Upload size={20} /> Scan from File
                    </div>
                  </div>
                </div>
              )}

              {isCameraActive && (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-4 border-emerald-500 bg-black aspect-square">
                    <div id={scannerId} className="w-full h-full"></div>

                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <div className="w-3/4 h-3/4 border-2 border-emerald-400/50 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)] animate-scan-line"></div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCameraActive(false)}
                    className="w-full py-3 text-slate-400 font-medium hover:text-red-500 transition-colors"
                  >
                    Cancel Scan
                  </button>
                </div>
              )}

              {scanResult && !isCameraActive && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-10 my-auto">
                  <div className="bg-emerald-100 p-6 rounded-full">
                    <CheckCircle2 size={48} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Scan Successful
                  </h3>
                  <button
                    onClick={startScanner}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all"
                  >
                    <RefreshCw size={20} /> Scan Another
                  </button>
                </div>
              )}

              {error && (
                <p className="mt-4 text-amber-600 text-sm text-center bg-amber-50 py-2 rounded-lg">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm grow">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-6 inline-block">
                Result
              </span>

              {scanResult ? (
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 break-all font-mono text-slate-700 leading-relaxed">
                    {scanResult}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all"
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}{" "}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    {scanResult.startsWith("http") && (
                      <a
                        href={scanResult}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border-2 border-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                      >
                        <ExternalLink size={20} /> Visit
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                  <Zap size={40} className="mb-4 opacity-20" />
                  <p>Awaiting data...</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-4xl border border-slate-100 flex flex-col items-center text-center">
                <ShieldCheck className="text-emerald-500 mb-2" size={24} />
                <span className="text-xs font-bold text-slate-700">
                  Privacy First
                </span>
              </div>
              <div className="bg-white p-6 rounded-4xl border border-slate-100 flex flex-col items-center text-center">
                <Globe className="text-emerald-500 mb-2" size={24} />
                <span className="text-xs font-bold text-slate-700">
                  Universal Link
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
