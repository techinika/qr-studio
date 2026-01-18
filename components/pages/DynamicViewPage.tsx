/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  increment,
  query,
  collection,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { Lock, ArrowRight, AlertTriangle, QrCodeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loading from "@/app/loading";

export default function RedirectGate({ qrcode }: { qrcode: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<any>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [id, setId] = useState("");

  const performRedirect = async (targetUrl: string, qrId: string) => {
    const docRef = doc(db, "qrcodes", qrId);
    await updateDoc(docRef, {
      scanCount: increment(1),
    });

    router.replace(targetUrl);
  };

  const fetchQR = async () => {
    try {
      const q = query(
        collection(db, "qrcodes"),
        where("uuid", "==", qrcode),
        limit(1),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        const firestoreId = docSnap.id;
        setId(firestoreId);

        setQrData(data);

        if (!data?.isPasswordProtected) {
          performRedirect(data.originalUrl, firestoreId);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("Invalid QR Code");
        toast.error("Invalid QR Code");
      }
    } catch (err: any) {
      console.error("Query Error:", err);
      toast.error(err?.message ?? "Connection Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQR();
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    if (passwordInput === qrData.password) {
      performRedirect(qrData.originalUrl, id);
    } else {
      toast.error("Incorrect Access Key");
      setIsVerifying(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error === "Invalid QR Code") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-4xl flex items-center justify-center mx-auto text-red-500">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic">
            404: Broken Link
          </h1>
          <p className="text-slate-500 font-medium">
            This QR code does not exist in our universe or has been deactivated
            by the owner.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-emerald-500 font-black uppercase text-xs tracking-widest border-b-2 border-emerald-500 pb-1"
          >
            Back to Hub <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-12 text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-slate-900 p-4 rounded-2xl text-emerald-400 shadow-xl shadow-emerald-500/20 rotate-3">
                <Lock size={28} />
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">
              Secure Access Required
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">
              Data: {qrData?.name || "Protected Asset"}
            </p>

            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4 text-left"
            >
              <div className="space-y-2">
                <label
                  htmlFor="pass"
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
                >
                  Access Key
                </label>
                <input
                  autoFocus
                  id="pass"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full px-6 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold transition-all text-center tracking-[0.5em]"
                />
              </div>

              {error && (
                <p className="text-[10px] font-black text-red-500 uppercase text-center animate-shake">
                  {error}
                </p>
              )}

              <button
                disabled={isVerifying}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
              >
                {isVerifying ? (
                  <>Verifying Identity...</>
                ) : (
                  <>
                    Unlock Destination <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 py-6 px-12 border-t border-slate-100 flex items-center justify-center gap-3">
            <QrCodeIcon size={14} className="text-slate-300" />
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Powered by QR STUDIO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
