"use client";

import React from "react";
import {
  Sparkles,
  Crown,
  Mail,
  ShieldCheck,
  Zap,
  Lock,
  QrCode,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function WaitlistPage() {
  const { profile, user } = useAuth();

  return (
    <div className=" flex items-center justify-center p-6 mt-3">
      <div className="max-w-3xl w-full">
        <div className="flex justify-center mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full flex items-center gap-3 animate-bounce">
            <Sparkles className="text-emerald-500" size={16} />
            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
              Priority Access Confirmed
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />

          <div className="p-12 md:p-16 text-center relative z-10">
            <div className="w-20 h-20 bg-slate-900 rounded-4xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-900/20 rotate-3">
              <QrCode className="text-emerald-400" size={32} />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
              Welcome to the <br />
              <span className="text-emerald-500">Inner Circle,</span>{" "}
              {profile?.name?.split(" ")[0]}
            </h1>

            <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto mb-10">
              You have successfully joined the <b>QR STUDIO Premium Waitlist</b>
              . We are currently fine-tuning our engine to give you the most
              powerful QR code tools tools on the planet.
            </p>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-10 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Mail className="text-slate-400" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Notification Email
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 hidden md:block" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <ShieldCheck className="text-emerald-500" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Position
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    Early Adopter
                  </p>
                </div>
              </div>
            </div>

            <button
              disabled
              className="w-full bg-slate-100 text-slate-400 py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 cursor-not-allowed border border-slate-200"
            >
              <Lock size={16} /> Workspace Locked During Maintenance
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 opacity-50">
          <div className="flex items-center gap-3">
            <Zap className="text-emerald-500" size={20} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Batch Generation
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="text-emerald-500" size={20} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Team Collab
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="text-emerald-500" size={20} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Protected QR Codes{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
