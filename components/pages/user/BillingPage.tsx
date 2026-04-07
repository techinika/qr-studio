/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Receipt,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/db/firebase";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/parts/ConfirmModal";

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancel = async () => {
    if (!subscription?.subscriberId) return;

    setCancelling(true);
    try {
      const response = await fetch(
        "https://api.taag.cc/v1/subscribers/unsubscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_TAAG_SECRET_KEY!,
          },
          body: JSON.stringify({ subscriberId: subscription.subscriberId }),
        },
      );

      if (response.ok) {
        toast.success("Subscription cancelled successfully.");
      } else {
        toast.error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Cancellation error", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelling(false);
      setConfirmCancel(false);
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
      <main className="grow max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Billing <span className="text-emerald-500">& Plans</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your subscription and invoices.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${subscription?.status === "SUBSCRIBED" ? "bg-slate-900" : "bg-slate-200"} rounded-lg p-8 text-white relative overflow-hidden shadow-xl`}>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                  Current Plan
                </p>
                <h2 className="text-3xl font-black uppercase">
                  {subscription?.status === "SUBSCRIBED" ? "Pro Plan" : "Free Plan"}
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  {subscription?.status === "SUBSCRIBED"
                    ? `Started on ${new Date(subscription.createdAt).toLocaleDateString()}`
                    : "Upgrade to unlock more features"}
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
            </div>

            {subscription?.status === "SUBSCRIBED" && (
              <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
                <h3 className="font-black text-slate-800 uppercase text-sm mb-4">
                  Subscription Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Status</span>
                    <span className="text-emerald-600 font-bold text-sm uppercase">
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-sm">Started</span>
                    <span className="text-slate-800 font-bold text-sm">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500 text-sm">Next Billing</span>
                    <span className="text-slate-800 font-bold text-sm">
                      {subscription.nextBillingDate
                        ? new Date(subscription.nextBillingDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmCancel(true)}
                  className="w-full mt-6 py-3 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-all"
                >
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Payment Method</p>
                  <p className="text-slate-400 text-xs">Visa ending in 4242</p>
                </div>
              </div>
              <button className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-100 transition-all">
                Update
              </button>
            </div>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <Receipt size={20} />
                </div>
                <p className="font-bold text-slate-800 text-sm">Billing History</p>
              </div>
              <p className="text-slate-400 text-xs">No invoices yet</p>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        open={confirmCancel}
        title="Cancel Subscription"
        message="Are you sure you want to cancel? You will lose Pro access at the end of your billing period."
        confirmLabel="Cancel Subscription"
        type="danger"
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
    </div>
  );
}
