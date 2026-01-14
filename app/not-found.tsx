"use client";

import React from "react";
import Link from "next/link";
import { Ghost, RefreshCw, Home } from "lucide-react";
import Nav from "@/components/parts/Nav";
import Footer from "@/components/parts/Footer";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Nav />

      <main className="grow flex flex-col items-center justify-center px-6 py-20">
        <div className="relative">
          <h1 className="text-[12rem] md:text-[20rem] font-black text-slate-100 leading-none select-none">
            404
          </h1>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="bg-emerald-500 p-4 rounded-3xl shadow-2xl shadow-emerald-500/40 rotate-12 mb-6">
              <Ghost className="text-white w-12 h-12" />
            </div>

            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
              Link <span className="text-emerald-500">Not Found</span>
            </h2>

            <p className="text-slate-500 max-w-sm mb-10 font-medium">
              It seems this QR code/URL led to a dead end. The page you are
              looking for has been moved or does not exist.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                <Home size={18} /> Back Home
              </Link>

              <button
                onClick={() => router.refresh()}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:border-emerald-500 hover:text-emerald-500 transition-all active:scale-95"
              >
                <RefreshCw size={18} /> Retry
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-8 opacity-20">
          <div className="w-12 h-12 border-4 border-slate-300 rounded-lg"></div>
          <div className="w-12 h-12 border-4 border-emerald-500 rounded-lg rotate-45"></div>
          <div className="w-12 h-12 border-4 border-slate-300 rounded-lg"></div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
