/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { formatMonthYear } from "@/lib/main";
import {
  FolderRoot,
  MoreVertical,
  Trash2,
  FolderX,
  X,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/db/firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { toast } from "sonner";

export function FoldersView({ items }: { items: any[] }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const deleteFolderOnly = async (folder: any) => {
    if (!confirm(`Delete "${folder.name}"? Items will be moved to workspace.`))
      return;
    setIsProcessing(true);
    const batch = writeBatch(db);

    try {
      const q = query(
        collection(db, "qrcodes"),
        where("folderId", "==", folder.id),
      );
      const snapshot = await getDocs(q);

      snapshot.forEach((item) => {
        batch.update(doc(db, "qrcodes", item.id), { folderId: null });
      });

      batch.delete(doc(db, "folders", folder.id));

      await batch.commit();
      toast.success("Folder removed. Assets preserved.");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to delete folder");
    } finally {
      setIsProcessing(false);
      setActiveMenu(null);
    }
  };

  const deleteFolderAndItems = async (folder: any) => {
    const warning = `PERMANENT DELETION: This will destroy the folder "${folder.name}" and ALL ${folder.count} QR codes inside it. Continue?`;
    if (!confirm(warning)) return;

    setIsProcessing(true);
    const batch = writeBatch(db);

    try {
      const q = query(
        collection(db, "qrcodes"),
        where("folderId", "==", folder.id),
      );
      const snapshot = await getDocs(q);

      snapshot.forEach((item) => {
        batch.delete(doc(db, "qrcodes", item.id));
      });

      batch.delete(doc(db, "folders", folder.id));

      await batch.commit();
      toast.success("Folder and all contents deleted permanently");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Mass deletion failed");
    } finally {
      setIsProcessing(false);
      setActiveMenu(null);
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
      {items.map((folder) => (
        <div
          key={folder?.id}
          onClick={() =>
            !activeMenu && router.push(`/workspace/folder/${folder?.id}`)
          }
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer group flex flex-col justify-between relative"
        >
          {activeMenu === folder.id && (
            <div
              className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-6 flex flex-col justify-center animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Folder Options
                </p>
                <button
                  onClick={() => setActiveMenu(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  disabled={isProcessing}
                  onClick={() => deleteFolderOnly(folder)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-all group/btn"
                >
                  <FolderX size={18} />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase">
                      Delete Folder Only
                    </p>
                    <p className="text-[8px] font-bold opacity-60">
                      Keep QR codes in workspace
                    </p>
                  </div>
                </button>

                <button
                  disabled={isProcessing}
                  onClick={() => deleteFolderAndItems(folder)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase">
                      Nuke Everything
                    </p>
                    <p className="text-[8px] font-bold opacity-60">
                      Delete folder & all assets
                    </p>
                  </div>
                </button>
              </div>

              {isProcessing && (
                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500 font-bold text-[10px] uppercase">
                  <Loader2 size={14} className="animate-spin" /> Processing...
                </div>
              )}
            </div>
          )}

          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <FolderRoot size={24} />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(folder.id);
                }}
                className="text-slate-300 hover:text-slate-900 p-1 transition-colors"
              >
                <MoreVertical size={20} />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-800 uppercase mb-1 truncate">
              {folder.name}
            </h3>
            <p className="text-sm font-bold text-slate-400 mb-6">
              {folder.count} {folder.count === 1 ? "QR Code" : "QR Codes"}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Created{" "}
              {folder.createdAt
                ? formatMonthYear(folder.createdAt)
                : "Recently"}
            </span>

            <div className="flex -space-x-2">
              {[...Array(Math.min(folder.count, 3))].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400"
                >
                  QR
                </div>
              ))}
              {folder.count > 3 && (
                <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                  +{folder.count - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
