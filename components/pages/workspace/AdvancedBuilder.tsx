/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Zap,
  Layers,
  Eye,
  Download,
  Info,
  Sparkles,
  Link as LinkIcon,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function AdvancedBuilder() {
  // Builder State
  const [name, setName] = useState(`Campaign - ${new Date().getTime()}`);
  const [url, setUrl] = useState("https://ubunifu.techinika.co.rw");
  const [isDynamic, setIsDynamic] = useState(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isBulk, setIsBulk] = useState(false);

  const [fgColor, setFgColor] = useState("#10b981");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/workspace"
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-black text-slate-800 bg-transparent border-none outline-none focus:ring-0 w-full p-0 leading-none"
              />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Editing Draft
              </p>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
            <Save size={16} /> Save to Universe
          </button>
        </div>
      </div>

      <main className="grow max-w-7xl mx-auto w-full px-6 py-10 grid lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: CONFIGURATION (7 COLUMNS) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. ADVANCED TOGGLES */}
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureToggle
              active={isDynamic}
              onToggle={() => setIsDynamic(!isDynamic)}
              icon={<Zap size={18} />}
              label="Dynamic"
              desc="Editable URL"
            />
            <FeatureToggle
              active={isPasswordProtected}
              onToggle={() => setIsPasswordProtected(!isPasswordProtected)}
              icon={<Shield size={18} />}
              label="Secure"
              desc="Password Lock"
            />
            <FeatureToggle
              active={isBulk}
              onToggle={() => setIsBulk(!isBulk)}
              icon={<Layers size={18} />}
              label="Bulk"
              desc="Multi-Create"
            />
          </div>

          {/* 2. CORE SETTINGS */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-slate-800 mb-2">
              <LinkIcon size={18} className="text-emerald-500" />
              <h3 className="font-black uppercase tracking-tight">
                Core Content
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-destination.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                />
              </div>

              {isPasswordProtected && (
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-black text-amber-600 uppercase mb-3 tracking-widest">
                    Set Access Password
                  </p>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white px-4 py-3 rounded-xl border border-amber-200 outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. BRANDING STUDIO */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-slate-800">
                <Sparkles size={18} className="text-emerald-500" />
                <h3 className="font-black uppercase tracking-tight">
                  Design Studio
                </h3>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-tighter">
                Vector High-Res
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Global Color
                </p>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                  />
                  <span className="font-black text-slate-600 uppercase">
                    {fgColor}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Error Correction
                </p>
                <select className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold text-slate-600 outline-none">
                  <option>High (30% damage proof)</option>
                  <option>Medium (15% damage proof)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW (5 COLUMNS) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-emerald-900/20 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                  Advanced Preview
                </span>
                <button className="text-emerald-400 hover:text-white transition-colors">
                  <Eye size={18} />
                </button>
              </div>

              <div className="bg-white p-8 rounded-[2rem] inline-block shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                <QRCodeCanvas
                  value={url}
                  size={240}
                  fgColor={fgColor}
                  level="H"
                />
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                  <Download size={14} /> Download SVG
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all border border-white/10">
                  Get API Snippet
                </button>
              </div>

              <p className="mt-6 text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Info size={12} /> Scannable at 12 meters
              </p>
            </div>

            {/* AI Optimization Tip */}
            <div className="bg-emerald-500 p-6 rounded-[2rem] text-white">
              <div className="flex gap-4">
                <Sparkles size={24} className="shrink-0" />
                <div>
                  <h4 className="font-black uppercase text-sm mb-1">
                    AI Optimization
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed font-medium">
                    We have optimized your dot pattern for OLED screens.
                    Scannability is currently 100%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FeatureToggle({ active, onToggle, icon, label, desc }: any) {
  return (
    <button
      onClick={onToggle}
      className={`p-6 rounded-[2rem] border transition-all text-left flex flex-col gap-3 relative overflow-hidden group ${
        active
          ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/5"
          : "bg-white border-slate-100 hover:border-slate-300"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          active ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400"
        }`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`font-black uppercase text-xs tracking-tight ${
            active ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {label}
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          {desc}
        </p>
      </div>
      {active && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      )}
    </button>
  );
}
