/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Save,
  Download,
  Shield,
  ShieldOff,
  Link as LinkIcon,
  Loader2,
  ExternalLink,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { baseUrl } from "@/lib/main";
import { toast } from "sonner";
import Loading from "@/app/loading";

export default function EditQRPage() {
  const { id } = useParams();
  const router = useRouter();
  const { workspace } = useAuth();
  const qrRef = useRef<HTMLDivElement>(null);

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrData, setQrData] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const docRef = doc(db, "qrcodes", id as string);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setQrData(data);
          setUrl(data.originalUrl);
          setPassword(data.password || "");
          setIsProtected(data.isPasswordProtected || false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load asset");
      } finally {
        setLoading(false);
      }
    };
    fetchQR();
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const docRef = doc(db, "qrcodes", id as string);
      await updateDoc(docRef, {
        originalUrl: url,
        isPasswordProtected: isProtected,
        password: isProtected ? password : null,
        updatedAt: serverTimestamp(),
      });
      setSuccess(true);
      toast.success("Settings updated");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, "qrcodes", id as string);
      await deleteDoc(docRef);
      toast.success("Asset deleted permanently");
      router.push("/workspace");
    } catch (err) {
      toast.error("Deletion failed");
      setSaving(false);
    }
  };

  const downloadHQQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      // Create a high-res hidden canvas (2000x2000)
      const hqCanvas = document.createElement("canvas");
      hqCanvas.width = 2000;
      hqCanvas.height = 2000;
      const ctx = hqCanvas.getContext("2d");

      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, 2000, 2000);
        const link = document.createElement("a");
        link.download = `${qrData.name}-hq.png`;
        link.href = hqCanvas.toDataURL("image/png", 1.0);
        link.click();
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div
              onClick={() => router.back()}
              className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all"
            >
              <ArrowLeft size={20} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                Edit Asset
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                {qrData?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {success ? "Saved!" : "Update Settings"}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* LEFT: SETTINGS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800">
                  <LinkIcon size={18} className="text-emerald-500" />
                  <h3 className="font-black uppercase tracking-tight">
                    Configuration
                  </h3>
                </div>
                {qrData?.isDynamic && (
                  <button
                    onClick={() => setIsProtected(!isProtected)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase transition-all ${
                      isProtected
                        ? "bg-amber-50 border-amber-200 text-amber-600"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isProtected ? (
                      <Shield size={14} />
                    ) : (
                      <ShieldOff size={14} />
                    )}
                    {isProtected ? "Protected" : "No Password"}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Original Destination
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                    />
                    <a
                      href={url}
                      target="_blank"
                      className="absolute right-4 top-4 text-slate-300 hover:text-emerald-500"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>

                {isProtected && (
                  <div className="p-6 bg-amber-50 rounded-4xl border border-amber-100 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      Access Key
                    </p>
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white px-5 py-3 rounded-xl border border-amber-200 outline-none font-bold"
                      placeholder="Enter password..."
                    />
                  </div>
                )}
              </div>

              {!qrData?.isDynamic && (
                <div className="p-6 bg-slate-50 rounded-3xl flex gap-3 items-start border border-slate-100">
                  <AlertCircle className="text-slate-400 shrink-0" size={20} />
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                    This is a <span className="text-slate-900">Static QR</span>.
                    Remote redirection is disabled.
                  </p>
                </div>
              )}
            </div>

            {/* DANGER ZONE */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-900 uppercase text-xs">
                  Danger Zone
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Destroy this asset forever
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 bg-slate-900 p-12 rounded-[4rem] text-center shadow-2xl">
              <div
                className="bg-white p-8 rounded-[3rem] inline-block shadow-2xl"
                ref={qrRef}
              >
                <QRCodeCanvas
                  value={qrData.isDynamic ? `${baseUrl}/r/${qrData.uuid}` : url}
                  size={240}
                  fgColor={qrData.fgColor || "#000000"}
                  level="H"
                  imageSettings={
                    qrData.logo
                      ? {
                          src: qrData.logo,
                          height: 50,
                          width: 50,
                          excavate: true,
                        }
                      : undefined
                  }
                />
              </div>

              <div className="mt-10 space-y-4">
                <button
                  onClick={downloadHQQR}
                  className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Download size={16} /> Download High-Res
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-white/30 uppercase mb-1">
                      Scans
                    </p>
                    <p className="text-xl font-black text-white italic">
                      {qrData.scanCount || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-white/30 uppercase mb-1">
                      Status
                    </p>
                    <p className="text-xl font-black text-emerald-400 italic uppercase">
                      Live
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl scale-in-center">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
                <Trash2 size={24} />
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-300 hover:text-slate-900 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              Delete Asset?
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              This action is{" "}
              <span className="text-red-500 font-bold uppercase underline">
                irreversible
              </span>
              . The QR code will stop working immediately and all scan data will
              be lost.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={saving}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Confirm Destruction"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all"
              >
                Keep Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
