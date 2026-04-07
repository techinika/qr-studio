import React from "react";
import { QrCodeIcon } from "lucide-react";

function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-emerald-500/20 animate-pulse"></div>
        <div className="relative bg-slate-900 p-4 rounded-lg shadow-xl flex flex-col items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg animate-bounce">
            <QrCodeIcon className="text-white w-6 h-6" />
          </div>
          <span className="text-white font-bold text-xs uppercase tracking-wide">
            QR STUDIO
          </span>
        </div>
      </div>
      <div className="flex gap-1 mt-6">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
      </div>
    </div>
  );
}

export default Loading;
