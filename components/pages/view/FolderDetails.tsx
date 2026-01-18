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
} from "lucide-react";
import Link from "next/link";
import { baseUrl } from "@/lib/main";
import { toast } from "sonner";
import Loading from "@/app/loading";

export default function FolderItemsPage({ folderId }: { folderId: string }) {
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderSnap = await getDoc(doc(db, "folders", folderId));
        if (!folderSnap.exists()) {
          toast.error("Folder not found");
          router.push("/workspace");
          return;
        }
        setFolder(folderSnap.data());

        const q = query(
          collection(db, "qrcodes"),
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
  }, [folderId, router]);

  const handleRemoveFromFolder = async (itemId: string) => {
    try {
      await updateDoc(doc(db, "qrcodes", itemId), { folderId: null });
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Asset moved to main workspace");
    } catch (err) {
      toast.error("Failed to remove");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to permanently delete this asset?"))
      return;
    try {
      await deleteDoc(doc(db, "qrcodes", itemId));
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Asset destroyed");
    } catch (err) {
      toast.error("Deletion failed");
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <Link
              href="/workspace"
              className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-emerald-500 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase rounded-md tracking-widest">
                  Folder
                </span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                {folder?.name}
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
                {items.length} High-Resolution Assets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* GRID VIEW */}
        {paginatedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 relative cursor-pointer"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setMenuConfig({ x: e.pageX, y: e.pageY, itemId: item.id });
                }}
                onClick={() => router.push(`/workspace/view/${item.id}`)}
              >
                <div className="bg-slate-50 rounded-[1.8rem] p-6 mb-6 flex items-center justify-center transition-all group-hover:bg-white border border-transparent group-hover:border-emerald-50">
                  <QRCodeCanvas
                    value={
                      item.isDynamic
                        ? `${baseUrl}/r/${item.uuid}`
                        : item.originalUrl
                    }
                    size={140}
                    fgColor={item.fgColor || "#000000"}
                    level="H"
                    imageSettings={
                      item.logo
                        ? {
                            src: item.logo,
                            height: 30,
                            width: 30,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="truncate">
                    <h3 className="font-black text-slate-800 uppercase text-xs truncate tracking-tight">
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
                    className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">
                      Scans
                    </span>
                    <span className="text-[11px] font-black text-slate-900 italic">
                      {item.scanCount || 0}
                    </span>
                  </div>
                  <div
                    className={`ml-auto px-2 py-1 rounded-md text-[7px] font-black uppercase tracking-widest ${item.isDynamic ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"}`}
                  >
                    {item.isDynamic ? "Dynamic" : "Static"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 border border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
              <LayoutGrid size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase">
              No assets found
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest">
              This folder is currently empty
            </p>
          </div>
        )}

        {filteredItems.length > itemsPerPage && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-4 bg-white border border-slate-100 rounded-2xl disabled:opacity-30 hover:text-emerald-500 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-slate-900 text-xs uppercase tracking-widest">
              Page {page}
            </span>
            <button
              disabled={page * itemsPerPage >= filteredItems.length}
              onClick={() => setPage((p) => p + 1)}
              className="p-4 bg-white border border-slate-100 rounded-2xl disabled:opacity-30 hover:text-emerald-500 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {menuConfig && (
        <div
          className="fixed z-[100] w-56 bg-white rounded-2xl border border-slate-100 shadow-2xl py-2 animate-in fade-in zoom-in-95"
          style={{ top: menuConfig.y, left: menuConfig.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => router.push(`/workspace/view/${menuConfig.itemId}`)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-slate-600 text-xs font-black uppercase tracking-tight"
          >
            <Edit3 size={16} className="text-emerald-500" /> Edit Asset
          </button>
          <button
            onClick={() => handleRemoveFromFolder(menuConfig.itemId)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-slate-600 text-xs font-black uppercase tracking-tight"
          >
            <FolderMinus size={16} className="text-amber-500" /> Remove from
            Folder
          </button>
          <div className="my-2 border-t border-slate-50" />
          <button
            onClick={() => handleDeleteItem(menuConfig.itemId)}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-500 text-xs font-black uppercase tracking-tight"
          >
            <Trash2 size={16} /> Delete Forever
          </button>
        </div>
      )}
    </div>
  );
}
