import React from "react";
import { QrCodeIcon } from "lucide-react";

function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl">
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 animate-ping duration-[2000ms]"></div>
        <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 animate-pulse scale-150"></div>

        <div className="relative bg-slate-900 p-6 rounded-4xl shadow-2xl shadow-emerald-500/20 flex flex-col items-center gap-4 border border-white/20">
          <div className="bg-emerald-500 p-3 rounded-2xl animate-bounce">
            <QrCodeIcon className="text-white w-8 h-8" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-white font-black italic uppercase tracking-tighter text-xl">
              QR STUDIO
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">
        Optimizing your experience...
      </p>
    </div>
  );
}

export default Loading;
