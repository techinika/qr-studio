/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ArrowRight,
  Zap,
  BarChart3,
} from "lucide-react";
import Footer from "../parts/Footer";
import Nav from "../parts/Nav";
import Link from "next/link";
import AdBanner from "../parts/AdBanner";
import { saveGeneratedQRCode } from "@/db/functions/QRServices";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

export default function QRGenerator() {
  const { user, workspace } = useAuth();
  const [url, setUrl] = useState("https://ubunifu.techinika.co.rw");
  const [fgColor, setFgColor] = useState("#10b981");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [uniqueHash] = useState(
    Math.random().toString(36).substring(2, 10) + Date.now(),
  );

  const qrRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getTrackableUrl = (baseUrl: string, hash: string) => {
    return `${baseUrl}#qr_studio_${hash}`;
  };

  const downloadQR = async () => {
    setIsSaving(true);

    const finalUrl = getTrackableUrl(url, uniqueHash);

    try {
      await saveGeneratedQRCode(
        {
          name: `QR_Code_${Date.now()}`,
          originalUrl: url,
          hashedUrl: finalUrl,
          hash: uniqueHash,
          workspaceId: workspace?.id ?? null,
          fgColor,
          bgColor,
          logo: logo ? "custom_logo_included" : "none",
        },
        user?.uid || null,
      );

      const canvas = qrRef.current?.querySelector("canvas");
      if (canvas) {
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qr_studio_${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save QR metadata");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <Nav />

      <main className="grow max-w-6xl mx-auto w-full px-6 py-12">
        <div className="max-w-2xl mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3 leading-tight uppercase tracking-tighter">
            QR <span className="text-emerald-500">Generator</span>
          </h1>
          <p className="text-lg text-slate-500">
            Create custom QR codes with your brand colors and logo.
          </p>
        </div>
        <AdBanner />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <LinkIcon size={18} />
                </div>
                <h2 className="text-lg font-bold">Destination URL</h2>
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
              />
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <Palette size={18} />
                </div>
                <h2 className="text-lg font-bold">Colors</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pattern Color
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="font-bold text-slate-600 uppercase text-sm">
                      {fgColor}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Background
                  </label>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <span className="font-bold text-slate-600 uppercase text-sm">
                      {bgColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                  <ImageIcon size={18} />
                </div>
                <h2 className="text-lg font-bold">Logo</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4 items-center">
                <div className="relative group border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-lg transition-all h-24 flex flex-col items-center justify-center bg-slate-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Sparkles className="text-emerald-400 mb-1" size={20} />
                  <p className="text-xs font-bold text-slate-500">Upload Icon</p>
                </div>
                {logo && (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={logo}
                      alt="Preview"
                      className="w-12 h-12 object-contain rounded-lg border border-slate-100 p-1 bg-white"
                    />
                    <button
                      onClick={() => setLogo(undefined)}
                      className="text-xs font-bold text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-6 text-white">
              <h3 className="text-lg font-black uppercase mb-4">
                Unlock Advanced <span className="text-emerald-400">QR Tools</span>
              </h3>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400">
                    <Zap size={14} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Dynamic Codes</p>
                    <p className="text-xs text-slate-400">Change links anytime</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400">
                    <BarChart3 size={14} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Analytics</p>
                    <p className="text-xs text-slate-400">Track scan activity</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400">
                    <Layers size={14} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Custom Branding</p>
                    <p className="text-xs text-slate-400">Add your logo</p>
                  </div>
                </div>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-black uppercase tracking-wider text-xs transition-all"
              >
                Sign In <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-slate-900 p-6 rounded-lg shadow-lg text-center flex flex-col items-center">
                <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">
                  Live Preview
                </div>

                <div
                  ref={qrRef}
                  className="p-4 rounded-lg bg-white"
                >
                  <QRCodeCanvas
                    value={getTrackableUrl(url || " ", uniqueHash)}
                    size={180}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level="H"
                    includeMargin={false}
                    imageSettings={
                      logo
                        ? {
                            src: logo,
                            height: 36,
                            width: 36,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <button
                  onClick={downloadQR}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-lg font-black text-sm transition-all shadow-lg"
                >
                  <Download size={18} />
                  {isSaving ? "SAVING..." : "DOWNLOAD PNG"}
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                <div className="flex gap-3 items-start">
                  <Layers className="text-emerald-500 shrink-0" size={18} />
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">Design Tip</h4>
                    <p className="text-xs text-emerald-700/70 mt-1">
                      Keep logo under 30% of QR code for best scanning.
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
