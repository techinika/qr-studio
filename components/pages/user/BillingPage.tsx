/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Receipt,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/db/firebase";

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "subscriptions", user.uid), (doc) => {
      if (doc.exists()) {
        setSubscription(doc.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  // 2. HANDLE CANCELLATION
  const handleCancel = async () => {
    if (!subscription?.subscriberId) return;

    const confirm = window.confirm(
      "Are you sure you want to cancel? You will lose Pro access.",
    );
    if (!confirm) return;

    try {
      const response = await fetch(
        "https://api.taag.cc/v1/subscribers/unsubscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_TAAG_SECRET_KEY!, // Usually done via backend for security
          },
          body: JSON.stringify({ subscriberId: subscription.subscriberId }),
        },
      );

      if (response.ok) alert("Subscription cancelled successfully.");
    } catch (error) {
      console.error("Cancellation error", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
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
          <div className="lg:col-span-2 space-y-6">
            {/* DYNAMIC CURRENT PLAN HERO */}
            <div
              className={`${subscription?.status === "SUBSCRIBED" ? "bg-slate-900" : "bg-slate-200"} rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span
                      className={`${subscription?.status === "SUBSCRIBED" ? "bg-emerald-500" : "bg-slate-400"} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block`}
                    >
                      {subscription?.status || "Free Plan"}
                    </span>
                    <h2
                      className={`text-4xl font-black uppercase tracking-tighter ${subscription?.status !== "SUBSCRIBED" && "text-slate-600"}`}
                    >
                      {subscription?.planName || "Free Tier"}
                    </h2>
                  </div>
                  {subscription?.status === "SUBSCRIBED" && (
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Renews On
                      </p>
                      <p className="text-xl font-black text-emerald-400">
                        {subscription.expiresAt?.toDate().toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {subscription?.status === "SUBSCRIBED" ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => (window.location.href = "/subscribe")}
                      className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 hover:text-white transition-all"
                    >
                      Change Plan
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 transition-all border border-white/10"
                    >
                      Cancel Plan
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => (window.location.href = "/subscribe")}
                    className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>

            {/* PAYMENT METHOD (Displaying static info from DB if stored, or prompt to update) */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="font-black uppercase text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} /> Payment Method
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Payment methods are managed securely through Taag Checkout
                during your next billing cycle.
              </p>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-6 bg-slate-800 rounded text-[8px] flex items-center justify-center text-white">
                  CARD
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {subscription?.email || user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* INVOICE HISTORY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-28">
              <h3 className="font-black uppercase text-slate-800 mb-6 flex items-center gap-2">
                <Receipt size={18} /> Invoices
              </h3>
              {/* In production, you would fetch these from Taag's GET /subscribers/all or a dedicated invoices table */}
              <div className="text-center py-10">
                <AlertCircle
                  className="mx-auto text-slate-200 mb-2"
                  size={32}
                />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Invoice history is sent to your email directly by Taag.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
