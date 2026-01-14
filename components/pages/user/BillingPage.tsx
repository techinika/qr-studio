"use client";

import React from "react";
import {
  CreditCard,
  Receipt,
  Zap,
  CheckCircle2,
  Plus,
  Clock,
  Download,
} from "lucide-react";

export default function BillingPage() {
  // Mock Data
  const invoices = [
    { id: "INV-001", date: "Jan 12, 2026", amount: "$8.00", status: "Paid" },
    { id: "INV-002", date: "Dec 12, 2025", amount: "$8.00", status: "Paid" },
    { id: "INV-003", date: "Nov 12, 2025", amount: "$8.00", status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <main className="grow max-w-5xl mx-auto w-full px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Billing <span className="text-emerald-500">& Plans</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your subscription and invoices.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: CURRENT PLAN & CARDS (2 COLUMNS) */}
          <div className="lg:col-span-2 space-y-6">
            {/* CURRENT PLAN HERO */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Zap size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block">
                      Active Plan
                    </span>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">
                      Pro{" "}
                      <span className="text-emerald-400 font-normal">
                        Monthly
                      </span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emerald-400">
                      $8.00
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Per Month
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-10">
                  <PlanFeature text="Unlimited Dynamic QRs" />
                  <PlanFeature text="Advanced Analytics" />
                  <PlanFeature text="Bulk Generation" />
                  <PlanFeature text="Team Collaboration" />
                </div>

                <div className="flex gap-4">
                  <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 hover:text-white transition-all">
                    Upgrade to Yearly
                  </button>
                  <button className="bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 transition-all border border-white/10">
                    Cancel Plan
                  </button>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="font-black uppercase text-slate-800">
                    Payment Method
                  </h3>
                </div>
                <button className="text-emerald-500 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center gap-1">
                  <Plus size={14} /> Add New
                </button>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    Visa
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 tracking-tight leading-none">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                      Expires 12/28
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Primary
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: INVOICE HISTORY (1 COLUMN) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400">
                  <Receipt size={20} />
                </div>
                <h3 className="font-black uppercase text-slate-800">
                  Invoices
                </h3>
              </div>

              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                  >
                    <div>
                      <p className="font-black text-slate-800 text-sm">
                        {inv.amount}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        <Clock size={10} /> {inv.date}
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-4 border-2 border-dashed border-slate-100 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-emerald-200 hover:text-emerald-500 transition-all">
                Load More History
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function PlanFeature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 size={16} className="text-emerald-400" />
      <span className="text-xs font-bold text-slate-300 tracking-tight">
        {text}
      </span>
    </div>
  );
}
