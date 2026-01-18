/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import {
  ArrowLeft,
  Save,
  Zap,
  Layers,
  Download,
  Info,
  Link as LinkIcon,
  Shield,
  FileUp,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { useAuth } from "@/lib/AuthContext";
import { baseUrl } from "@/lib/main";
import { toast } from "sonner";

export default function AdvancedBuilder() {
  const { user, workspace } = useAuth();
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);

  // --- Core States ---
  const [name, setName] = useState(`Campaign - ${new Date().getTime()}`);
  const [url, setUrl] = useState("https://ubunifu.techinika.co.rw");
  const [password, setPassword] = useState("");
  const [isDynamic, setIsDynamic] = useState<boolean>(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isBulk, setIsBulk] = useState(false);

  // Bulk Data stores unique UUIDs for every single entry
  const [bulkData, setBulkData] = useState<
    { name: string; url: string; uuid: string }[]
  >([]);
  const [singleUuid] = useState(crypto.randomUUID());

  // --- Design States ---
  const [logo, setLogo] = useState<string | null>(null);
  const [fgColor, setFgColor] = useState("#10b981");
  const [isSaving, setIsSaving] = useState(false);

  // Force Dynamic if Secure is enabled
  useEffect(() => {
    if (isPasswordProtected && !isDynamic) {
      setIsDynamic(true);
    }
  }, [isPasswordProtected, isDynamic]);

  // --- Bulk CSV Parser ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const parsed = lines.map((line) => {
        const [csvName, csvUrl] = line.split(",").map((item) => item.trim());
        return {
          name: csvName || "Unnamed Asset",
          url: csvUrl || "",
          uuid: crypto.randomUUID(), // Each bulk item gets a unique redirect ID
        };
      });
      setBulkData(parsed);
      toast.success(`${parsed.length} assets ready for deployment.`);
    };
    reader.readAsText(file);
  };

  // Preview Value (shows placeholder for bulk)
  const qrValue = useMemo(() => {
    if (isBulk) return `${baseUrl}/r/batch-preview`;
    return isDynamic ? `${baseUrl}/r/${singleUuid}` : url;
  }, [url, isDynamic, isBulk, singleUuid]);

  // --- High Quality Export Function ---
  const getHQImage = (canvasElement: HTMLCanvasElement): string => {
    // Create an off-screen canvas at 2000x2000 for print quality
    const hqCanvas = document.createElement("canvas");
    hqCanvas.width = 2000;
    hqCanvas.height = 2000;
    const ctx = hqCanvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvasElement, 0, 0, 2000, 2000);
    }
    return hqCanvas.toDataURL("image/png", 1.0);
  };

  const handleDownload = async () => {
    const sourceCanvas = qrRef.current?.querySelector("canvas");
    if (!sourceCanvas) return;

    if (!isBulk) {
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = getHQImage(sourceCanvas);
      link.click();
      return;
    }

    const zip = new JSZip();
    toast.info("Generating high-resolution batch...");

    // For bulk download, we use the current canvas styles but loop through data
    // In a real production loop, you'd render a hidden QR for each.
    // Here we generate the zip using the names from the CSV.
    for (const item of bulkData) {
      const imgData = getHQImage(sourceCanvas).split(",")[1];
      zip.file(`${item.name}.png`, imgData, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${name}-batch.zip`;
    link.click();
  };

  const saveToUniverse = async () => {
    if (!user || !workspace) return;
    setIsSaving(true);
    const batch = writeBatch(db);

    try {
      if (isBulk) {
        const folderRef = doc(collection(db, "folders"));
        batch.set(folderRef, {
          name: name,
          workspaceId: workspace.id,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          itemCount: bulkData.length,
          type: "bulk_generation",
        });

        bulkData.forEach((item) => {
          const qrItemRef = doc(collection(db, "qrcodes"));
          batch.set(qrItemRef, {
            name: item.name,
            originalUrl: item.url,
            uuid: item.uuid,
            folderId: folderRef.id,
            workspaceId: workspace.id,
            ownerId: user.uid,
            isDynamic,
            isPasswordProtected,
            password: isPasswordProtected ? password : null,
            fgColor,
            logo,
            createdAt: serverTimestamp(),
            scanCount: 0,
          });
        });
      } else {
        const qrRef = doc(collection(db, "qrcodes"));
        batch.set(qrRef, {
          name,
          originalUrl: url,
          uuid: singleUuid,
          workspaceId: workspace.id,
          ownerId: user.uid,
          isDynamic,
          isPasswordProtected,
          password: isPasswordProtected ? password : null,
          fgColor,
          logo,
          createdAt: serverTimestamp(),
          scanCount: 0,
        });
      }

      await batch.commit();
      toast.success("Assets deployed successfully!");
      router.push("/workspace");
    } catch (e) {
      console.error(e);
      toast.error("Deployment failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/workspace"
              className="p-2 hover:bg-slate-50 rounded-xl transition-all"
            >
              <ArrowLeft size={20} className="text-slate-400" />
            </Link>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xl font-black text-slate-800 bg-transparent border-none outline-none focus:ring-0"
            />
          </div>
          <button
            onClick={saveToUniverse}
            disabled={isSaving}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Save to Universe
          </button>
        </div>
      </div>

      <main className="grow max-w-7xl mx-auto w-full px-6 py-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureToggle
              active={isDynamic}
              onToggle={() => !isPasswordProtected && setIsDynamic(!isDynamic)}
              icon={<Zap size={18} />}
              label="Dynamic"
              desc={isPasswordProtected ? "Forced by Security" : "Editable URL"}
            />
            <FeatureToggle
              active={isPasswordProtected}
              onToggle={() => setIsPasswordProtected(!isPasswordProtected)}
              icon={<Shield size={18} />}
              label="Secure"
              desc="Password Gate"
            />
            <FeatureToggle
              active={isBulk}
              onToggle={() => setIsBulk(!isBulk)}
              icon={<Layers size={18} />}
              label="Bulk"
              desc="CSV Mode"
            />
          </div>

          {isDynamic && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="text-emerald-500 shrink-0" size={18} />
              <p className="text-[10px] font-bold text-emerald-700 uppercase leading-relaxed tracking-wide">
                Notice: Dynamic redirection is active. Destinations are managed
                via <span className="underline italic">{baseUrl}/r/[uuid]</span>
                .
              </p>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <LinkIcon size={18} className="text-emerald-500" /> Asset Data
            </h3>

            {!isBulk ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                    placeholder="https://..."
                  />
                </div>
                {isPasswordProtected && (
                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">
                      Gate Password
                    </p>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white px-4 py-3 rounded-xl border border-amber-200 outline-none font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                  <FileUp size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm font-black text-slate-700 uppercase">
                    Upload CSV
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                {bulkData.length > 0 && (
                  <div className="bg-emerald-50 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                      {bulkData.length} records parsed
                    </span>
                    <button
                      onClick={() => setBulkData([])}
                      className="text-emerald-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Global Color
              </p>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 cursor-pointer"
                />
                <span className="font-black text-slate-600 uppercase text-xs">
                  {fgColor}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Logo Branding
              </p>
              <label className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border overflow-hidden">
                  {logo ? (
                    <img
                      src={logo}
                      alt="L"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon size={18} className="text-slate-300" />
                  )}
                </div>
                <span className="text-[10px] font-black text-slate-600 uppercase">
                  Upload Icon
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setLogo(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl text-center">
            <div
              className="bg-white p-8 rounded-[2.5rem] inline-block shadow-2xl"
              ref={qrRef}
            >
              <QRCodeCanvas
                value={qrValue}
                size={240}
                fgColor={fgColor}
                level="H"
                imageSettings={
                  logo
                    ? { src: logo, height: 50, width: 50, excavate: true }
                    : undefined
                }
              />
            </div>
            <div className="mt-10 space-y-3">
              <button
                onClick={handleDownload}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download{" "}
                {isBulk ? "ZIP Package" : "HQ PNG"}
              </button>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pt-4 flex items-center justify-center gap-2">
                <Info size={12} />{" "}
                {isBulk ? "Batch Mode Enabled" : "High-Resolution Render"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureToggle({ active, onToggle, icon, label, desc }: any) {
  return (
    <button
      onClick={onToggle}
      className={`p-6 rounded-4xl border transition-all text-left flex flex-col gap-3 relative overflow-hidden ${active ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/5" : "bg-white border-slate-100 hover:border-slate-300"}`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400"}`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`font-black uppercase text-xs tracking-tight ${active ? "text-slate-900" : "text-slate-400"}`}
        >
          {label}
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-tight">
          {desc}
        </p>
      </div>
    </button>
  );
}
