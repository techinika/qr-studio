/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  MoreVertical,
  Trash2,
  FolderMinus,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  FolderPlus,
} from "lucide-react";
import Link from "next/link";
import { baseUrl } from "@/lib/main";
import { toast } from "sonner";
import Loading from "@/app/loading";
import { ConfirmModal } from "@/components/parts/ConfirmModal";
import { useAuth } from "@/lib/AuthContext";

export default function FolderItemsPage({ folderId }: { folderId: string }) {
  const router = useRouter();
  const { workspace } = useAuth();

  const [folder, setFolder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const [menuConfig, setMenuConfig] = useState<{
    x: number;
    y: number;
    itemId: string;
  } | null>(null);

  const [confirmState, setConfirmState] = useState<{
    type: "remove" | "delete";
    itemId: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!workspace?.id) return;
      
      try {
        const folderSnap = await getDoc(doc(db, "folders", folderId));
        if (!folderSnap.exists()) {
          toast.error("Folder not found");
          router.push("/workspace");
          return;
        }
        
        const folderData = folderSnap.data();
        if (folderData.workspaceId !== workspace.id) {
          toast.error("Access denied");
          router.push("/workspace");
          return;
        }
        
        setFolder(folderData);

        const q = query(
          collection(db, "qrcodes"),
          where("workspaceId", "==", workspace.id),
          where("folderId", "==", folderId),
        );
        const itemsSnap = await getDocs(q);
        const fetchedItems = itemsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [folderId, router, workspace?.id]);

  const handleRemoveFromFolder = async () => {
    if (!confirmState?.itemId) return;
    try {
      await updateDoc(doc(db, "qrcodes", confirmState.itemId), { folderId: null });
      setItems((prev) => prev.filter((i) => i.id !== confirmState.itemId));
      toast.success("Asset moved to main workspace");
    } catch (err) {
      toast.error("Failed to remove");
    } finally {
      setConfirmState(null);
    }
  };

  const handleDeleteItem = async () => {
    if (!confirmState?.itemId) return;
    try {
      await deleteDoc(doc(db, "qrcodes", confirmState.itemId));
      setItems((prev) => prev.filter((i) => i.id !== confirmState.itemId));
      toast.success("Asset destroyed");
    } catch (err) {
      toast.error("Deletion failed");
    } finally {
      setConfirmState(null);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [items, searchQuery]);

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  if (loading) return <Loading />;

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 font-sans"
      onClick={() => setMenuConfig(null)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/workspace"
              className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-emerald-500 transition-all shadow-sm"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded-md tracking-widest">
                  Folder
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                {folder?.name}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                {items.length} QR Codes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-lg outline-none focus:border-emerald-500 font-bold text-sm w-56 shadow-sm"
              />
            </div>
          </div>
        </div>

        {paginatedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-lg border border-slate-100 p-4 transition-all hover:shadow-lg hover:border-emerald-100 relative cursor-pointer"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenuConfig({ x: e.pageX, y: e.pageY, itemId: item.id });
                }}
                onClick={() => router.push(`/workspace/view/${item.id}`)}
              >
                <div className="bg-slate-50 rounded-lg p-4 mb-4 flex items-center justify-center">
                  <QRCodeCanvas
                    value={
                      item.isDynamic
                        ? `${baseUrl}/r/${item.uuid}`
                        : item.originalUrl
                    }
                    size={100}
                    fgColor={item.fgColor || "#000000"}
                    level="H"
                    imageSettings={
                      item.logo
                        ? {
                            src: item.logo,
                            height: 24,
                            width: 24,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <h3 className="font-black text-slate-800 uppercase text-xs truncate">
                      {item.name}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase truncate mt-0.5">
                      {item.originalUrl}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuConfig({
                        x: e.pageX,
                        y: e.pageY,
                        itemId: item.id,
                      });
                    }}
                    className="p-1.5 text-slate-300 hover:text-slate-900 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-50">
                  <span className="text-[7px] font-black text-slate-300 uppercase">
                    {item.scanCount || 0} scans
                  </span>
                  <span
                    className={`ml-auto px-2 py-0.5 rounded text-[7px] font-black uppercase ${item.isDynamic ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"}`}
                  >
                    {item.isDynamic ? "Dynamic" : "Static"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-16 border border-dashed border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-slate-200">
              <FolderPlus size={32} />
            </div>
            <h2 className="text-lg font-black text-slate-900 uppercase">
              No assets found
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest">
              This folder is currently empty
            </p>
          </div>
        )}

        {filteredItems.length > itemsPerPage && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-3 bg-white border border-slate-100 rounded-lg disabled:opacity-30 hover:text-emerald-500 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-black text-slate-900 text-xs uppercase tracking-widest">
              Page {page}
            </span>
            <button
              disabled={page * itemsPerPage >= filteredItems.length}
              onClick={() => setPage((p) => p + 1)}
              className="p-3 bg-white border border-slate-100 rounded-lg disabled:opacity-30 hover:text-emerald-500 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {menuConfig && (
        <div
          className="fixed z-[100] w-48 bg-white rounded-lg border border-slate-100 shadow-xl py-1"
          style={{ top: menuConfig.y, left: menuConfig.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => router.push(`/workspace/view/${menuConfig.itemId}`)}
            className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold"
          >
            <Edit3 size={14} className="text-emerald-500" /> View
          </button>
          <button
            onClick={() => {
              setConfirmState({ type: "remove", itemId: menuConfig.itemId });
              setMenuConfig(null);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold"
          >
            <FolderMinus size={14} className="text-amber-500" /> Remove
          </button>
          <div className="my-1 border-t border-slate-50" />
          <button
            onClick={() => {
              setConfirmState({ type: "delete", itemId: menuConfig.itemId });
              setMenuConfig(null);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-red-50 transition-colors text-red-500 text-xs font-bold"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}

      <ConfirmModal
        open={confirmState?.type === "remove"}
        title="Remove from Folder"
        message="Are you sure you want to remove this QR code from the folder? It will be moved to your main workspace."
        confirmLabel="Remove"
        type="warning"
        onConfirm={handleRemoveFromFolder}
        onCancel={() => setConfirmState(null)}
      />

      <ConfirmModal
        open={confirmState?.type === "delete"}
        title="Delete QR Code"
        message="Are you sure you want to permanently delete this QR code? This action cannot be undone."
        confirmLabel="Delete"
        type="danger"
        onConfirm={handleDeleteItem}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}
