"use client";

import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Download,
  Link as LinkIcon,
  Palette,
  Image as ImageIcon,
  Sparkles,
  Layers,
  CopyPlus,
  Shield,
  ArrowRight,
  Zap,
} from "lucide-react";
import Footer from "../parts/Footer";
import Nav from "../parts/Nav";
import Link from "next/link";
import AdBanner from "../parts/AdBanner";

export default function QRGenerator() {
  const [url, setUrl] = useState("https://ubunifu.techinika.co.rw");
  const [fgColor, setFgColor] = useState("#10b981");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | undefined>(undefined);

  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-studio-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Nav />

      <main className="grow max-w-6xl mx-auto w-full px-6 py-12">
        <div className="max-w-2xl mb-12">
          <h1 className="text-5xl font-black text-slate-900 mb-4 leading-tight">
            QR <span className="text-emerald-500">Studio</span>
          </h1>
          <p className="text-lg text-slate-500">
            Create high-quality, branded QR codes with custom colors and logos.
          </p>
        </div>
        <AdBanner />

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <LinkIcon size={20} />
                </div>
                <h2 className="text-xl font-bold">Destination URL</h2>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg font-medium"
              />
            </div>

            {/* Step 2: Appearance */}
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <Palette size={20} />
                </div>
                <h2 className="text-xl font-bold">Design & Colors</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Pattern Color
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <span className="font-bold text-slate-600 uppercase">
                      {fgColor}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Background
                  </label>
                  <div className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <span className="font-bold text-slate-600 uppercase">
                      {bgColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Branding */}
            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <ImageIcon size={20} />
                </div>
                <h2 className="text-xl font-bold">Center Logo</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="relative group border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-3xl transition-all h-32 flex flex-col items-center justify-center bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Sparkles className="text-emerald-400 mb-2" size={24} />
                  <p className="text-sm font-bold text-slate-500">
                    Upload Icon
                  </p>
                </div>
                {logo && (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={logo}
                      alt="Preview"
                      className="w-16 h-16 object-contain rounded-xl border border-slate-100 p-2 bg-white"
                    />
                    <button
                      onClick={() => setLogo(undefined)}
                      className="text-xs font-bold text-red-400 hover:text-red-600"
                    >
                      Remove Logo
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-slate-900 rounded-4xl p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={120} />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">
                  Unlock Professional{" "}
                  <span className="text-emerald-400">QR Tools</span>
                </h3>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                      <Zap size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Dynamic Codes</p>
                      <p className="text-xs text-slate-400">
                        Change links anytime
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                      <CopyPlus size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Bulk Create</p>
                      <p className="text-xs text-slate-400">
                        100+ codes at once
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Passwords</p>
                      <p className="text-xs text-slate-400">Secure your data</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  Upgrade to Pro <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* PREVIEW STICKY (Right 1 Column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 text-center flex flex-col items-center">
                <div className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-8">
                  Live Rendering
                </div>

                <div
                  ref={qrRef}
                  className="p-6 rounded-4xl bg-white shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                >
                  <QRCodeCanvas
                    value={url || " "}
                    size={220}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    includeMargin={false}
                    imageSettings={
                      logo
                        ? {
                            src: logo,
                            height: 44,
                            width: 44,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <button
                  onClick={downloadQR}
                  className="w-full mt-10 flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  <Download size={22} />
                  DOWNLOAD PNG
                </button>
                <p className="mt-4 text-slate-500 text-xs font-medium uppercase tracking-widest">
                  High Resolution Export
                </p>
              </div>

              {/* Extra Tip Card */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-4xl">
                <div className="flex gap-3 items-start">
                  <Layers className="text-emerald-500 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">
                      Design Tip
                    </h4>
                    <p className="text-xs text-emerald-700/70 mt-1 leading-relaxed">
                      Ensure your logo does not cover more than 30% of the QR
                      code to keep it scannable across all devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AdBanner />

      <Footer />
    </div>
  );
}
