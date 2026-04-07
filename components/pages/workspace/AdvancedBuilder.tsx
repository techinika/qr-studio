/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import {
  ArrowLeft,
  Save,
  Zap,
  Download,
  Info,
  Link as LinkIcon,
  Shield,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  FolderPlus,
  Folder,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { baseUrl } from "@/lib/main";
import { toast } from "sonner";

interface QRStyle {
  cornerColor: string;
  cornerStyle: "square" | "rounded" | "dot";
  dotColor: string;
  dotStyle: "square" | "rounded" | "dots";
}

export default function AdvancedBuilder() {
  const { user, workspace } = useAuth();
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(`Campaign - ${new Date().getTime()}`);
  const [url, setUrl] = useState("https://ubunifu.techinika.co.rw");
  const [password, setPassword] = useState("");
  const [isDynamic, setIsDynamic] = useState<boolean>(true);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [fgColor, setFgColor] = useState("#10b981");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isSaving, setIsSaving] = useState(false);
  const [singleUuid] = useState(crypto.randomUUID());

  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [qrStyle, setQrStyle] = useState<QRStyle>({
    cornerColor: "#10b981",
    cornerStyle: "rounded",
    dotColor: "#10b981",
    dotStyle: "rounded",
  });

  const qrValue = isDynamic ? `${baseUrl}/r/${singleUuid}` : url;

  useEffect(() => {
    if (workspace?.id) {
      const folderQuery = query(
        collection(db, "folders"),
      );
      getDocs(folderQuery).then((snap) => {
        const folderList = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((f: any) => f.workspaceId === workspace.id);
        setFolders(folderList);
      });
    }
  }, [workspace?.id]);

  const createFolder = async () => {
    if (!newFolderName.trim() || !workspace) return;
    const folderRef = doc(collection(db, "folders"));
    const batch = writeBatch(db);
    batch.set(folderRef, {
      name: newFolderName,
      workspaceId: workspace.id,
      ownerId: user?.uid,
      createdAt: serverTimestamp(),
      itemCount: 0,
    });
    await batch.commit();
    setFolders([...folders, { id: folderRef.id, name: newFolderName }]);
    setSelectedFolder(folderRef.id);
    setNewFolderName("");
    setShowFolderModal(false);
    toast.success("Folder created!");
  };

  const getHQImage = (canvasElement: HTMLCanvasElement): string => {
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

    const link = document.createElement("a");
    link.download = `${name}.png`;
    link.href = getHQImage(sourceCanvas);
    link.click();
  };

  const saveToUniverse = async () => {
    if (!user || !workspace) return;
    setIsSaving(true);
    const batch = writeBatch(db);

    try {
      const qrRefDoc = doc(collection(db, "qrcodes"));
      batch.set(qrRefDoc, {
        name,
        originalUrl: url,
        uuid: singleUuid,
        folderId: selectedFolder || null,
        workspaceId: workspace.id,
        ownerId: user.uid,
        isDynamic,
        isDisabled: false,
        isPasswordProtected,
        password: isPasswordProtected ? password : null,
        fgColor,
        bgColor,
        qrStyle,
        logo,
        createdAt: serverTimestamp(),
        scanCount: 0,
      });

      if (selectedFolder) {
        const folderRef = doc(db, "folders", selectedFolder);
        batch.update(folderRef, { itemCount: (folders.find(f => f.id === selectedFolder)?.itemCount || 0) + 1 });
      }

      await batch.commit();
      toast.success("QR code saved successfully!");
      router.push("/workspace");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save QR code.");
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
              className="p-2 hover:bg-slate-50 rounded-lg transition-all"
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
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50"
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
          <div className="grid md:grid-cols-2 gap-4">
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
              desc="Password Gate"
            />
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-100">
            <Folder size={18} className="text-slate-400" />
            <select
              value={selectedFolder || ""}
              onChange={(e) => setSelectedFolder(e.target.value || null)}
              className="flex-1 bg-transparent outline-none font-bold text-slate-700"
            >
              <option value="">No Folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFolderModal(true)}
              className="p-2 hover:bg-slate-50 rounded-lg transition-all"
            >
              <FolderPlus size={18} className="text-emerald-500" />
            </button>
          </div>

          {isDynamic && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-emerald-500 shrink-0" size={18} />
              <p className="text-[10px] font-bold text-emerald-700 uppercase leading-relaxed tracking-wide">
                Notice: Dynamic redirection is active. Destinations are managed
                via <span className="underline">{baseUrl}/r/[uuid]</span>
                .
              </p>
            </div>
          )}

          <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <LinkIcon size={18} className="text-emerald-500" /> Asset Data
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                  placeholder="https://..."
                />
              </div>
              {isPasswordProtected && (
                <div className="p-5 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">
                    Gate Password
                  </p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white px-4 py-3 rounded-lg border border-amber-200 outline-none font-bold"
                    placeholder="Enter password"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black uppercase tracking-tight text-slate-800">Colors</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Pattern Color
                </label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => {
                      setFgColor(e.target.value);
                      setQrStyle({ ...qrStyle, dotColor: e.target.value, cornerColor: e.target.value });
                    }}
                    className="w-12 h-12 cursor-pointer rounded-lg"
                  />
                  <span className="font-black text-slate-600 uppercase text-sm">
                    {fgColor}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Background
                </label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer rounded-lg"
                  />
                  <span className="font-black text-slate-600 uppercase text-sm">
                    {bgColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-black uppercase tracking-tight text-slate-800">Logo Branding</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all flex-1">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border overflow-hidden">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon size={24} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black text-slate-600 uppercase">
                    Upload Logo
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 2MB</p>
                </div>
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
              {logo && (
                <button
                  onClick={() => setLogo(null)}
                  className="p-3 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X size={18} className="text-red-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-slate-900 p-10 rounded-lg shadow-2xl text-center">
            <div className="bg-white p-6 rounded-lg inline-block shadow-2xl" ref={qrRef}>
              <QRCodeCanvas
                value={qrValue}
                size={220}
                fgColor={fgColor}
                bgColor={bgColor}
                level="H"
                imageSettings={
                  logo
                    ? { src: logo, height: 44, width: 44, excavate: true }
                    : undefined
                }
              />
            </div>
            <div className="mt-8 space-y-3">
              <button
                onClick={handleDownload}
                className="w-full bg-emerald-500 text-white py-4 rounded-lg font-black uppercase tracking-widest text-[11px] hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                <Download size={16} /> Download HQ PNG
              </button>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pt-2 flex items-center justify-center gap-2">
                <Info size={12} /> High-Resolution Render
              </p>
            </div>
          </div>
        </div>
      </main>

      {showFolderModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowFolderModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-8">
            <h3 className="text-xl font-black text-slate-900 mb-6">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 outline-none focus:border-emerald-500 font-bold mb-6"
              autoFocus
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowFolderModal(false)}
                className="flex-1 py-4 rounded-lg bg-slate-100 font-black uppercase text-sm hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                className="flex-1 py-4 rounded-lg bg-emerald-500 text-white font-black uppercase text-sm hover:bg-emerald-600 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureToggle({ active, onToggle, icon, label, desc }: any) {
  return (
    <button
      onClick={onToggle}
      className={`p-6 rounded-lg border transition-all text-left flex flex-col gap-3 relative overflow-hidden ${active ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/5" : "bg-white border-slate-100 hover:border-slate-300"}`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${active ? "bg-emerald-500 text-white" : "bg-slate-50 text-slate-400"}`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`font-black uppercase text-sm tracking-tight ${active ? "text-slate-900" : "text-slate-400"}`}
        >
          {label}
        </p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-tight">
          {desc}
        </p>
      </div>
    </button>
  );
}
