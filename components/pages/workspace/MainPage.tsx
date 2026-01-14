/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  FolderRoot,
  History,
  Plus,
  Search,
  MoreVertical,
  Lock,
  BarChart3,
  CreditCard,
  Calendar,
  ExternalLink,
  QrCode,
  TrendingUp,
  MousePointer2,
  Users,
} from "lucide-react";
import Link from "next/link";
import WorkspaceNav from "@/components/parts/workspace/AuthNav";

export default function Workspace() {
  const [hasSubscription, setHasSubscription] = useState(true); // Toggle to see paywall
  const [activeTab, setActiveTab] = useState("history");
  const [searchQuery, setSearchQuery] = useState("");

  // --- MOCK DATA ---
  const subInfo = {
    plan: "Annual Pro",
    expires: "Dec 12, 2026",
    status: "Active",
  };

  const qrHistory = [
    {
      id: 1,
      name: "January Campaign",
      type: "Dynamic",
      scans: 1240,
      date: "2026-01-12",
      url: "https://shop.com/sale",
    },
    {
      id: 2,
      name: "Office Guest WiFi",
      type: "Static",
      scans: 45,
      date: "2026-01-10",
      url: "WIFI:S:Office;P:1234;;",
    },
    {
      id: 3,
      name: "Personal Portfolio",
      type: "Dynamic",
      scans: 890,
      date: "2026-01-05",
      url: "https://portfolio.me",
    },
  ];

  const folders = [
    { id: 1, name: "Product Launch Q4", count: 150, date: "2025-11-20" },
    { id: 2, name: "Restaurant Menus", count: 12, date: "2025-12-15" },
    { id: 3, name: "Event Badges", count: 500, date: "2026-01-02" },
  ];

  const filteredHistory = useMemo(() => {
    return qrHistory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

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

            {/* SUBSCRIPTION STATUS CARD */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
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
                href="/#pricing"
                className="block text-center py-3 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
              >
                Manage Billing
              </Link>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3 space-y-6">
            {!hasSubscription ? (
              <PaywallOverlay />
            ) : (
              <>
                {/* Search Header (Hidden in Analytics) */}
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

                {/* DYNAMIC CONTENT VIEWS */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {activeTab === "history" && (
                    <HistoryView items={filteredHistory} />
                  )}
                  {activeTab === "folders" && <FoldersView items={folders} />}
                  {activeTab === "analytics" && <AnalyticsView />}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function HistoryView({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              QR Name
            </th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Destination
            </th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
              Engagement
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((qr) => (
            <tr
              key={qr.id}
              className="hover:bg-slate-50/50 transition-colors group"
            >
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <QrCode size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 leading-tight">
                      {qr.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                      {qr.type} • {qr.date}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium truncate max-w-[200px]">
                  <ExternalLink size={14} className="shrink-0" />
                  {qr.url}
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  {qr.scans.toLocaleString()} Scans
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FoldersView({ items }: { items: any[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((folder) => (
        <div
          key={folder.id}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <FolderRoot size={24} />
            </div>
            <button className="text-slate-300 hover:text-slate-900">
              <MoreVertical size={20} />
            </button>
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase mb-1">
            {folder.name}
          </h3>
          <p className="text-sm font-bold text-slate-400 mb-6">
            {folder.count} QR Codes
          </p>
          <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Created {folder.date}
            </span>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard
          icon={<TrendingUp />}
          label="Total Scans"
          value="24.8k"
          color="emerald"
        />
        <StatsCard
          icon={<Users />}
          label="Unique Visitors"
          value="12.2k"
          color="slate"
        />
        <StatsCard
          icon={<MousePointer2 />}
          label="Avg. CTR"
          value="18.4%"
          color="slate"
        />
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 h-64 flex items-center justify-center flex-col text-slate-300">
        <BarChart3 size={48} className="mb-4 opacity-10" />
        <p className="font-black uppercase tracking-widest text-xs">
          Engagement Chart coming soon
        </p>
      </div>
    </div>
  );
}

// --- SHARED UI COMPONENTS ---

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

function StatsCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div
        className={`${
          color === "emerald" ? "text-emerald-500" : "text-slate-400"
        } mb-4`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
        {value}
      </p>
    </div>
  );
}

function PaywallOverlay() {
  return (
    <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl text-center border border-emerald-500/30">
      <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock size={28} />
      </div>
      <h3 className="text-2xl font-black uppercase mb-3">
        Workspace Locked
      </h3>
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
