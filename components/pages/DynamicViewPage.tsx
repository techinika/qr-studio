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
import { Lock, AlertTriangle, QrCodeIcon, XCircle } from "lucide-react";
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
  const [isDisabled, setIsDisabled] = useState(false);

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

        if (data.isDisabled) {
          setIsDisabled(true);
          setLoading(false);
          return;
        }

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

    if (passwordInput === qrData?.password) {
      performRedirect(qrData.originalUrl, id);
    } else {
      setError("Incorrect password. Please try again.");
      setIsVerifying(false);
    }
  };

  if (loading) return <Loading />;

  if (isDisabled) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-lg p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-500" size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            QR Code <span className="text-red-500">Discontinued</span>
          </h1>
          <p className="text-slate-500 font-medium mb-6">
            This QR code has been deactivated and is no longer accessible. 
            Please contact the content owner for more information.
          </p>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              QR ID
            </p>
            <p className="text-sm font-mono text-slate-600 mt-1">{qrcode}</p>
          </div>
        </div>
      </div>
    );
  }

  if (qrData?.isPasswordProtected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-lg p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-amber-50 rounded-lg flex items-center justify-center mx-auto mb-6">
            <Lock className="text-amber-500" size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Protected <span className="text-emerald-500">Content</span>
          </h1>
          <p className="text-slate-500 font-medium mb-8">
            This content is password protected. Enter the password to continue.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full px-6 py-4 rounded-lg bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-center tracking-[0.5em]"
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-bold">
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !passwordInput}
              className="w-full bg-slate-900 text-white py-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Access Content"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Loading />;
}
