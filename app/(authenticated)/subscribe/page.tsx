import Nav from "@/components/parts/Nav";
import Footer from "@/components/parts/Footer";
import AdBanner from "@/components/parts/AdBanner";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "All Plans | QR STUDIO - 100% Free",
  description: "All QR Studio features are completely free. No subscription required.",
};

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <Nav />
      
      <main className="grow max-w-5xl mx-auto w-full px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full mb-6">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            100% Free Forever
          </span>
        </div>
        
        <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          All Features, <span className="text-emerald-500">Completely Free</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto mb-12">
          QR Studio is free to use with all features included. No hidden fees, no subscription, no payment required.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {["Dynamic QR Codes", "Scan Analytics", "Password Protection"].map((feature) => (
            <div key={feature} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckIcon />
              </div>
              <h3 className="text-lg font-black uppercase">{feature}</h3>
            </div>
          ))}
        </div>

        <Link
          href="/workspace"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-200"
        >
          Go to Dashboard
        </Link>
      </main>

      <AdBanner />
      <Footer />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
