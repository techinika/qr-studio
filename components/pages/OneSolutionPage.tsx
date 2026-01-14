/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { CheckCircle2, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import Nav from "../parts/Nav";
import Footer from "../parts/Footer";

export const industryContent: any = {
  restaurants: {
    title: "Restaurants & Hospitality",
    subtitle: "Contactless Menus & Table Analytics",
    heroImage:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
    description:
      "Eliminate printing costs and update your menu in real-time. QR STUDIO allows restaurants to track which tables are scanning and at what time of day.",
    features: [
      {
        title: "Dynamic Menus",
        desc: "Change prices or remove out-of-stock items instantly without reprinting codes.",
      },
      {
        title: "Table-ID Tracking",
        desc: "Assign unique IDs to every table to see which areas of your restaurant are most active.",
      },
      {
        title: "Review Booster",
        desc: "Automatically redirect users to your Google Maps or Yelp page after they view the menu.",
      },
    ],
    cta: "Start Your Digital Menu",
    color: "emerald",
  },
  "real-estate": {
    title: "Real Estate & Agencies",
    subtitle: "Yard Sign Tracking & Virtual Tours",
    heroImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200",
    description:
      "Turn every yard sign into a lead generator. Connect buyers to 3D tours and capture their contact info before they even step inside.",
    features: [
      {
        title: "Instant Virtual Tours",
        desc: "Link directly to Matterport or video walkthroughs with high-resolution QR codes.",
      },
      {
        title: "Lead Notifications",
        desc: "Get an email alert every time someone scans a sign at a specific property address.",
      },
      {
        title: "Agent vCards",
        desc: "Let potential buyers save your contact details to their phone with a single scan.",
      },
    ],
    cta: "List Your Properties",
    color: "blue",
  },
  retail: {
    title: "Retail & E-commerce",
    subtitle: "Bridge Physical Stores to Digital Sales",
    heroImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200",
    description:
      "Convert window shoppers into customers. Use QR codes to show video reviews, check stock levels, or offer instant coupons.",
    features: [
      {
        title: "Product Storytelling",
        desc: "Link tags to 'How-to' videos or influencer reviews to build trust at the shelf.",
      },
      {
        title: "Discount Triggers",
        desc: "Generate unique, trackable coupons that users can only claim by scanning in-store.",
      },
      {
        title: "Stock Requests",
        desc: "Allow customers to scan an out-of-stock item and buy it online for home delivery.",
      },
    ],
    cta: "Connect Your Store",
    color: "purple",
  },
  events: {
    title: "Events & Festivals",
    subtitle: "Secure Ticketing & Entry Management",
    heroImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200",
    description:
      "Handle thousands of attendees with ease. QR STUDIO provides encrypted, unique QR codes for tickets that prevent duplication and make check-in a 1-second process.",
    features: [
      {
        title: "Encrypted Ticketing",
        desc: "Each ticket is unique and cryptographically signed, making it impossible for scammers to duplicate or forge entry passes.",
      },
      {
        title: "Real-time Attendance",
        desc: "Monitor live entry stats from your dashboard to manage crowd flow and security personnel effectively.",
      },
      {
        title: "Dynamic Schedules",
        desc: "Link badges to a dynamic schedule page. If a speaker or set-time changes, the QR code on the physical badge updates instantly.",
      },
    ],
    cta: "Launch Your Event",
    color: "purple",
  },
};

export default function IndustryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = industryContent[slug];

  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">
              {data.subtitle}
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900 mb-8 leading-[0.9]">
              QR Codes For <br />
              <span className="text-emerald-500">
                {data.title.split(" ")[0]}
              </span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-lg">
              {data.description}
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
            >
              {data.cta} <ChevronRight size={18} />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] rotate-3"></div>
            <img
              src={data.heroImage}
              alt={data.title}
              className="relative rounded-[2.5rem] object-cover h-[500px] w-full shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">
              Why it works for {data.title.split(" ")[0]}
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              Built for the modern {slug} environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.features.map((f: any, i: number) => (
              <div
                key={i}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-slate-900 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-black uppercase italic text-xl text-slate-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-slate-900 p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] -mr-32 -mt-32"></div>
          <Zap className="mx-auto mb-8 text-emerald-400" size={48} />
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 leading-tight">
            Ready to automate your <br /> {data.title.split(" ")[0]} experience?
          </h2>
          <Link
            href="/generate"
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all inline-block"
          >
            Create My First Code
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
