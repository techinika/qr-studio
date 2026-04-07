/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { X, AlertTriangle, CheckCircle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const typeStyles = {
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    info: "bg-emerald-500 hover:bg-emerald-600 text-white",
  };

  const typeIcons = {
    danger: <AlertTriangle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <CheckCircle size={20} />,
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-2 rounded-lg ${type === "danger" ? "bg-red-100 text-red-600" : type === "warning" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
            {typeIcons[type]}
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 uppercase text-lg">{title}</h3>
            <p className="text-slate-500 text-sm mt-1">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${typeStyles[type]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
