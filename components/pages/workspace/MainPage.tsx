/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FolderRoot,
  History,
  Plus,
  Search,
  BarChart3,
  LayoutGrid,
  FolderPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { HistoryView } from "@/components/parts/workspace/HistoryView";
import { useAuth } from "@/lib/AuthContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  addDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/db/firebase";
import Loading from "@/app/loading";
import { AnalyticsView } from "@/components/parts/workspace/AnalyticsView";
import { FoldersView } from "@/components/parts/workspace/FoldersView";
import { toast } from "sonner";

export default function Workspace() {
  const { workspace, user } = useAuth();
  const [activeTab, setActiveTab] = useState("history");
  const [searchQuery, setSearchQuery] = useState("");
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<any[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    if (!workspace?.id) return;

    const getData = async () => {
      setLoading(true);
      const q = query(
        collection(db, "qrcodes"),
        where("workspaceId", "==", workspace.id),
        orderBy("createdAt", "desc"),
      );

      const folderQuery = query(
        collection(db, "folders"),
        where("workspaceId", "==", workspace.id),
      );

      const unsubFolders = onSnapshot(folderQuery, (snap) => {
        setFolders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQrCodes(items);
        setLoading(false);
      });

      return () => {
        unsubFolders();
        unsubscribe();
      };
    };
    getData();
  }, [workspace?.id]);

  const createFolder = async () => {
    if (!newFolderName.trim() || !workspace) return;
    
    try {
      await addDoc(collection(db, "folders"), {
        name: newFolderName,
        workspaceId: workspace.id,
        ownerId: user?.uid,
        createdAt: serverTimestamp(),
        itemCount: 0,
      });
      toast.success("Folder created!");
      setNewFolderName("");
      setShowFolderModal(false);
    } catch (err) {
      toast.error("Failed to create folder");
    }
  };

  const processedFolders = folders.map((folder) => ({
    ...folder,
    count: qrCodes.filter((qr) => qr.folderId === folder.id).length,
  }));

  const filteredHistory = useMemo(() => {
    return qrCodes.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [qrCodes, searchQuery]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <main className="grow max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              My <span className="text-emerald-500">Universe</span>
            </h1>
            <p className="text-slate-500 font-medium">Professional Workspace</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFolderModal(true)}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-lg font-black uppercase tracking-wider text-xs hover:bg-slate-50 transition-all shadow-sm"
            >
              <FolderPlus size={18} /> New Folder
            </button>
            <Link
              href="/workspace/generate"
              className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg"
            >
              <Plus size={18} /> Advanced Builder
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-4">
            <div className="space-y-1">
              <SidebarItem
                icon={<History size={18} />}
                label="All History"
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              />
              <SidebarItem
                icon={<FolderRoot size={18} />}
                label="Folders"
                active={activeTab === "folders"}
                onClick={() => setActiveTab("folders")}
              />
              <SidebarItem
                icon={<BarChart3 size={18} />}
                label="Analytics"
                active={activeTab === "analytics"}
                onClick={() => setActiveTab("analytics")}
              />
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            {activeTab !== "analytics" && (
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg bg-white border border-slate-100 outline-none focus:border-emerald-500 transition-all font-medium text-sm shadow-sm"
                  />
                </div>
              </div>
            )}

            <div>
              {activeTab === "history" && (
                <div>
                  {qrCodes.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-100 rounded-lg p-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 mb-4 mx-auto">
                        <LayoutGrid size={32} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-2">
                        No QR Codes Yet
                      </h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                        Create your first branded QR code to start tracking.
                      </p>
                      <Link
                        href="/workspace/generate"
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all inline-flex items-center gap-2"
                      >
                        <Plus size={18} /> Create First QR
                      </Link>
                    </div>
                  ) : (
                    <HistoryView items={filteredHistory} folders={folders} />
                  )}
                </div>
              )}
              {activeTab === "folders" && (
                <div>
                  {processedFolders.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-100 rounded-lg p-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 mb-4 mx-auto">
                        <FolderPlus size={32} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-2">
                        No Folders Yet
                      </h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                        Create folders to organize your QR codes.
                      </p>
                      <button
                        onClick={() => setShowFolderModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all inline-flex items-center gap-2"
                      >
                        <Plus size={18} /> Create Folder
                      </button>
                    </div>
                  ) : (
                    <FoldersView items={processedFolders} />
                  )}
                </div>
              )}
              {activeTab === "analytics" && (
                <AnalyticsView qrCodes={qrCodes} loading={loading} />
              )}
            </div>
          </div>
        </div>
      </main>

      {showFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowFolderModal(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase text-slate-900">
                Create Folder
              </h3>
              <button
                onClick={() => setShowFolderModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., Marketing Campaigns"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                autoFocus
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFolderModal(false)}
                className="flex-1 py-3 rounded-lg bg-slate-100 font-bold text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 py-3 rounded-lg bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-bold text-sm ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-500 hover:bg-white hover:text-slate-700"
      }`}
    >
      {icon} {label}
    </button>
  );
}
