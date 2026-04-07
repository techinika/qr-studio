/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Check, Zap, Building2, Loader2, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export default function SubscribePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("");

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch("https://api.taag.cc/v1/verify/pricing", {
          method: "GET",
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TAAG_API_KEY ?? "",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch pricing");

        const data = await response.json();
        setPlans(data.plans);
        setCountry(data.countryCode);
      } catch (error) {
        console.error("Pricing Error:", error);
        toast.error("Could not load local pricing.");
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const handleSelectPlan = (plan: any) => {
    const baseUrl = "https://billing.taag.cc/checkout";

    const params = new URLSearchParams({
      planId: plan.planId,
      email: user?.email || "",
      firstname: user?.displayName?.split(" ")[0] || "",
      lastname: user?.displayName?.split(" ")[1] || "",
    });

    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Detecting Local Pricing...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-100 px-4 py-2 rounded-full mb-6 shadow-sm">
            <Globe size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Pricing for {country || "Global"}
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
            Upgrade your <span className="text-emerald-500">Universe</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">
            Choose the plan that fits your team. All plans include 256-bit
            encryption and 99.9% uptime.
          </p>
        </div>

        {/* DYNAMIC PLANS GRID */}
        <div
          className={`grid grid-cols-1 md:grid-cols-${Math.min(plans.length, 3)} gap-8`}
        >
          {plans.map((plan) => (
            <div
              key={plan.planId}
              className="bg-white rounded-lg p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 group"
            >
              <div className="mb-8">
                <div className="bg-emerald-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="text-emerald-500" size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {plan.planName}
                </h3>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                  {plan.interval}
                </span>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-900 font-bold text-xl">
                    {plan.currency}
                  </span>
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">
                    {plan.formatedPrice}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                <PlanFeature text="5 Team Members Included" />
                <PlanFeature text="Unlimited Workspace Access" />
                <PlanFeature text="Advanced Analytics" />
                <PlanFeature text="Dynamic QR Management" />
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className="w-full bg-slate-900 text-white py-5 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-slate-100 active:scale-95"
              >
                Choose {plan.planName}
              </button>
            </div>
          ))}
        </div>

        {/* TRUST FOOTER */}
        <div className="mt-20 border-t border-slate-100 pt-12 text-center">
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all">
            <Building2 size={32} />
            {/* Add other trust icons here */}
          </div>
          <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Securely processed via TAAG Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-slate-600 font-bold text-sm">
      <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full">
        <Check size={12} strokeWidth={4} />
      </div>
      {text}
    </li>
  );
}
