"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isVerifying && status === "successful") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
          Confirming Payment
        </h2>
        <p className="text-slate-500 text-sm font-medium mt-2">
          Finalizing your premium access...
        </p>
      </div>
    );
  }

  if (status === "successful") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-12 rounded-lg shadow-xl shadow-slate-200/60 border border-slate-100 max-w-md w-full text-center">
          <div className="bg-emerald-50 w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>

          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Welcome to <span className="text-emerald-500">Pro</span>
          </h1>

          <p className="text-slate-500 font-medium mb-10">
            Your payment was successful. Your account has been upgraded and all
            premium features are now unlocked.
          </p>

          <button
            onClick={() => router.push("/workspace")}
            className="w-full bg-slate-900 text-white py-5 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group"
          >
            Enter Workspace
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    );
  }

  // 3. CANCELLED / ERROR STATE
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
      <div className="bg-white p-12 rounded-lg shadow-xl shadow-slate-200/60 border border-slate-100 max-w-md w-full text-center">
        <div className="bg-red-50 w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-8">
          <XCircle className="text-red-500" size={40} />
        </div>

        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Action <span className="text-red-500">Cancelled</span>
        </h1>

        <p className="text-slate-500 font-medium mb-10">
          The payment process was interrupted. No charges were made to your
          account.
        </p>

        <button
          onClick={() => router.push("/subscribe")}
          className="w-full bg-slate-100 text-slate-900 py-5 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCcw size={16} />
          Back to Pricing
        </button>
      </div>
    </div>
  );
}
