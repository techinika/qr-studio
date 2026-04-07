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
import { ConfirmModal } from "../ConfirmModal";

export function FoldersView({ items }: { items: any[] }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    type: "delete" | "deleteAll";
    folder: any;
  } | null>(null);

  const deleteFolderOnly = async () => {
    if (!confirmState?.folder) return;
    setIsProcessing(true);
    const folder = confirmState.folder;
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
      setConfirmState(null);
    }
  };

  const deleteFolderAndItems = async () => {
    if (!confirmState?.folder) return;
    const folder = confirmState.folder;
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
      setConfirmState(null);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {items.map((folder) => (
          <div
            key={folder?.id}
            onClick={() =>
              !activeMenu && router.push(`/workspace/folder/${folder?.id}`)
            }
            className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all cursor-pointer group flex flex-col justify-between relative"
          >
            {activeMenu === folder.id && (
              <div
                className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm rounded-lg p-4 flex flex-col justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Folder Options
                  </p>
                  <button
                    onClick={() => setActiveMenu(null)}
                    className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmState({ type: "delete", folder });
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-600 transition-all"
                  >
                    <FolderX size={16} />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmState({ type: "deleteAll", folder });
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase">
                        Delete Everything
                      </p>
                      <p className="text-[8px] font-bold opacity-60">
                        Delete folder & all assets
                      </p>
                    </div>
                  </button>
                </div>

                {isProcessing && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-emerald-500 font-bold text-[10px] uppercase">
                    <Loader2 size={12} className="animate-spin" /> Processing...
                  </div>
                )}
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <FolderRoot size={20} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(folder.id);
                  }}
                  className="text-slate-300 hover:text-slate-900 p-1 transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <h3 className="text-lg font-black text-slate-800 uppercase mb-1 truncate">
                {folder.name}
              </h3>
              <p className="text-sm font-bold text-slate-400 mb-4">
                {folder.count} {folder.count === 1 ? "QR Code" : "QR Codes"}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Created{" "}
                {folder.createdAt
                  ? formatMonthYear(folder.createdAt)
                  : "Recently"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmState?.type === "delete"}
        title="Delete Folder"
        message={`Delete "${confirmState?.folder?.name}"? All QR codes will be moved to your workspace.`}
        confirmLabel="Delete"
        type="warning"
        onConfirm={deleteFolderOnly}
        onCancel={() => setConfirmState(null)}
      />

      <ConfirmModal
        open={confirmState?.type === "deleteAll"}
        title="Delete Everything"
        message={`This will permanently delete "${confirmState?.folder?.name}" and all ${confirmState?.folder?.count} QR codes inside it. This action cannot be undone.`}
        confirmLabel="Delete All"
        type="danger"
        onConfirm={deleteFolderAndItems}
        onCancel={() => setConfirmState(null)}
      />
    </>
  );
}
