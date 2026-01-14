/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FolderRoot,
  History,
  Plus,
  Search,
  Lock,
  BarChart3,
  CreditCard,
  Calendar,
  LayoutGrid,
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
} from "firebase/firestore";
import { db } from "@/db/firebase";
import Loading from "@/app/loading";
import { AnalyticsView } from "@/components/parts/workspace/AnalyticsView";
import { FoldersView } from "@/components/parts/workspace/FoldersView";

export default function Workspace() {
  const { workspace } = useAuth();
  const [hasSubscription, setHasSubscription] = useState(true);
  const [activeTab, setActiveTab] = useState("history");
  const [searchQuery, setSearchQuery] = useState("");
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<any[]>([]);

  const subInfo = {
    plan: "Annual Pro",
    expires: "Dec 12, 2026",
    status: "Active",
  };

  useEffect(() => {
    if (!workspace?.id) return;

    const getData = async () => {
      setLoading(true);
      const q = query(
        collection(db, "qrcodes"),
        where("workspaceId", "==", workspace.id),
        orderBy("createdAt", "desc")
      );

      const folderQuery = query(
        collection(db, "QRFolders"),
        where("workspaceId", "==", workspace.id)
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

  const processedFolders = folders.map((folder) => ({
    ...folder,
    count: qrCodes.filter((qr) => qr.folderId === folder.id).length,
  }));

  const filteredHistory = useMemo(() => {
    return qrCodes.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [qrCodes, searchQuery]);

  if (loading) return <Loading />;

  console.log(qrCodes);

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
          <Link
            href="/workspace/generate"
            className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 active:scale-95"
          >
            <Plus size={18} /> Advanced Builder
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 relative">
          <aside className="lg:col-span-1 space-y-6">
            <div className="space-y-2">
              <SidebarItem
                icon={<History size={18} />}
                label="All History"
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              />
              <SidebarItem
                icon={<FolderRoot size={18} />}
                label="Batch Folders"
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

            <div className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Subscription
                </p>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {subInfo.status}
                </span>
              </div>
              <div>
                <p className="text-lg font-black text-slate-800 tracking-tight uppercase">
                  {subInfo.plan}
                </p>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <Calendar size={12} />
                  <p className="text-[10px] font-bold">
                    Renews: {subInfo.expires}
                  </p>
                </div>
              </div>
              <Link
                href="/workspace/profile/billing"
                className="block text-center py-3 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
              >
                Manage Billing
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            {!hasSubscription ? (
              <PaywallOverlay />
            ) : (
              <>
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
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:border-emerald-500 transition-all font-medium text-sm shadow-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {activeTab === "history" && (
                    <div>
                      {qrCodes.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center flex flex-col items-center">
                          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                            <LayoutGrid size={40} />
                          </div>
                          <h3 className="text-xl font-black text-slate-900 mb-2">
                            No QR Codes Yet
                          </h3>
                          <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">
                            This workspace is empty. Create your first branded
                            QR code to start tracking engagements.
                          </p>
                          <Link
                            href="/workspace/generate"
                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all inline-flex items-center gap-2"
                          >
                            <Plus size={18} /> Create First QR
                          </Link>
                        </div>
                      ) : (
                        <HistoryView items={filteredHistory} />
                      )}
                    </div>
                  )}
                  {activeTab === "folders" && (
                    <div>
                      {processedFolders.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                            No folders created yet
                          </p>
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-[0.2em] ${
        active
          ? "bg-slate-900 text-white shadow-xl"
          : "text-slate-400 hover:bg-white hover:text-slate-600"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function PaywallOverlay() {
  return (
    <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl text-center border border-emerald-500/30">
      <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock size={28} />
      </div>
      <h3 className="text-2xl font-black uppercase mb-3">Workspace Locked</h3>
      <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
        Access scan history, folders, and pro analytics with an active
        subscription.
      </p>
      <Link
        href="/#pricing"
        className="bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all inline-flex items-center gap-2"
      >
        <CreditCard size={18} /> View Plans
      </Link>
    </div>
  );
}
