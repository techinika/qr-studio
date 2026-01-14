"use client";

import React, { useEffect, useState } from "react";
import {
  QrCodeIcon,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  Loader,
} from "lucide-react";
import Link from "next/link";
import Nav from "../parts/Nav";
import AdBanner from "../parts/AdBanner";
import { loginWithGoogle } from "@/db/functions/googleLogin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const authVerify = () => {
      if (user) {
        toast.info("You are already logged in. Redirecting to the workspace...");
        return router.push("/workspace");
      }
    };
    authVerify();
  }, [user]);

  const handleGoogleLogin = async () => {
    setLoggingIn(true);
    try {
      await loginWithGoogle();
      router.push("/workspace");
    } catch (err) {
      toast.error("Something went wrong with Google Login");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <Nav />

      <main className="grow flex items-center justify-center px-6 py-12">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-500/5 border border-slate-100">
          <div className="bg-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <div className="bg-emerald-500 p-2 rounded-xl shadow-lg">
                  <QrCodeIcon className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase">
                  QR STUDIO{" "}
                  <span className="text-emerald-500 text-sm align-top ml-1">
                    PRO
                  </span>
                </span>
              </div>

              <h1 className="text-4xl font-black leading-tight mb-8 uppercase">
                Manage your{" "}
                <span className="text-emerald-500">QR Universe</span> from one
                place.
              </h1>

              <div className="space-y-6">
                <BenefitItem
                  title="Dynamic Tracking"
                  desc="Edit links after printing."
                />
                <BenefitItem
                  title="Bulk Export"
                  desc="Generate 100+ codes instantly."
                />
                <BenefitItem
                  title="Secure Storage"
                  desc="Save and organize your scan history."
                />
              </div>
            </div>

            <p className="relative z-10 text-slate-500 text-xs font-bold uppercase tracking-widest mt-12">
              Product of Ubunifu Labs
            </p>
          </div>

          <div className="p-12 md:p-20 flex flex-col justify-center items-center text-center">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase">
                Welcome Back
              </h2>
              <p className="text-slate-400 font-medium">
                No passwords needed. Just your Google account.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full max-w-sm flex items-center justify-center gap-4 bg-white border-2 border-slate-100 hover:border-emerald-500 py-4 px-6 rounded-2xl transition-all active:scale-95 group"
            >
              {loggingIn ? (
                <Loader className="animate-spin text-emerald-600" />
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.64,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
              )}
              <span className="font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">
                Continue with Google
              </span>
            </button>

            <div className="mt-12 flex items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
              <ShieldCheck size={20} />
              <Zap size={20} />
              <Globe size={20} />
            </div>

            <p className="mt-12 text-slate-400 text-[10px] uppercase font-bold tracking-widest max-w-xs leading-relaxed">
              {`By continuing, you agree to QR Studio's Terms of Service and Privacy
              Policy.`}
            </p>
          </div>
        </div>
      </main>

      <div className="p-8 text-center">
        <Link
          href="/"
          className="text-slate-400 hover:text-emerald-500 font-bold text-sm transition-all uppercase tracking-tighter"
        >
          ← Back to Scanner
        </Link>
      </div>
      <AdBanner />
    </div>
  );
}

function BenefitItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start">
      <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
      <div>
        <p className="font-bold text-sm uppercase tracking-tight">{title}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
