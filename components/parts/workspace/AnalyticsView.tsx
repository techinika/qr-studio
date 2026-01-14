/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  BarChart3,
  MousePointer2,
  TrendingUp,
  QrCode,
  Loader2,
} from "lucide-react";
import { QRCodes } from "@/types/qrcodes";

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

export function AnalyticsView({
  qrCodes,
  loading,
}: {
  qrCodes: QRCodes[];
  loading: boolean;
}) {
  const stats = useMemo(() => {
    const totalScans = qrCodes.reduce(
      (acc, curr) => acc + (curr.scanCount || 0),
      0
    );
    const activeAssets = qrCodes.filter((qr) => (qr.scanCount || 0) > 0).length;
    const avgEngagement =
      qrCodes.length > 0 ? (totalScans / qrCodes.length).toFixed(1) : "0";

    const chartData = qrCodes
      .sort((a, b) => (b.scanCount || 0) - (a.scanCount || 0))
      .slice(0, 6)
      .map((qr) => ({
        name: qr.name?.substring(0, 10) || "Unnamed",
        scans: qr.scanCount || 0,
      }));

    return { totalScans, activeAssets, avgEngagement, chartData };
  }, [qrCodes]);

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard
          icon={<TrendingUp />}
          label="Total Workspace Scans"
          value={stats.totalScans.toLocaleString()}
          color="emerald"
        />
        <StatsCard
          icon={<QrCode />}
          label="Active Assets"
          value={stats.activeAssets}
          color="slate"
        />
        <StatsCard
          icon={<MousePointer2 />}
          label="Avg. Scans / Code"
          value={stats.avgEngagement}
          color="slate"
        />
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="mb-8">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Top Performing Assets
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Distribution of scans by QR name
          </p>
        </div>

        <div className="h-80 w-full">
          {qrCodes.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 800 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 800 }}
                />
                <Tooltip
                  cursor={{ fill: "#F8FAFC" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="scans" radius={[10, 10, 10, 10]} barSize={40}>
                  {stats.chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#10B981" : "#E2E8F0"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <BarChart3 size={48} className="mb-4 opacity-10" />
              <p className="font-black uppercase tracking-widest text-[10px]">
                No scan data available yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
