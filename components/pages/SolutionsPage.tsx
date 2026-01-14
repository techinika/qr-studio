"use client";

import React from "react";
import {
  Utensils,
  Home,
  ShoppingBag,
  Ticket,
  ArrowRight,
  Zap,
  BarChart3,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Nav from "../parts/Nav";
import Footer from "../parts/Footer";
import AdBanner from "../parts/AdBanner";

const industries = [
  {
    id: "restaurants",
    title: "Restaurants & Cafés",
    icon: <Utensils className="text-orange-500" size={32} />,
    keyword: "QR codes for restaurants",
    description:
      "Replace paper menus with dynamic, contactless digital menus that update in real-time.",
    features: [
      "Instant Menu Updates",
      "Table-Specific Tracking",
      "Tip & Review Integration",
    ],
    color: "bg-orange-50",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    icon: <Home className="text-blue-500" size={32} />,
    keyword: "Real estate QR tracking",
    description:
      "Capture leads directly from yard signs. Link to virtual tours and agent contact cards.",
    features: [
      "Virtual Tour Links",
      "Lead Capture Forms",
      "Dynamic Yard Signs",
    ],
    color: "bg-blue-50",
  },
  {
    id: "retail",
    title: "Retail & E-commerce",
    icon: <ShoppingBag className="text-emerald-500" size={32} />,
    keyword: "Retail QR marketing",
    description:
      "Bridge the gap between windows and checkouts. Link products to video reviews.",
    features: ["Product Info QR", "Discount Coupons", "Inventory Management"],
    color: "bg-emerald-50",
  },
  {
    id: "events",
    title: "Events & Festivals",
    icon: <Ticket className="text-purple-500" size={32} />,
    keyword: "Event check-in QR",
    description:
      "Seamless ticketing and entry management with secure, encrypted scanning.",
    features: ["Digital Ticketing", "Schedule Access", "Real-time Attendance"],
    color: "bg-purple-50",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Nav />
      <section className="pt-32 pb-20 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/10 blur-[120px] rounded-full -mr-20" />
        <div className="max-w-6xl mx-auto relative z-10 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Industry <span className="text-emerald-400">Solutions</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
            From contactless menus to real-estate lead capture,{" "}
            <span className="text-white">QR STUDIO</span> provides the
            professional tools needed to track and optimize your
            physical-to-digital journey.
          </p>
        </div>
      </section>

      {/* INDUSTRY GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {industries.map((item) => (
            <div
              key={item.id}
              className="group p-1 bg-slate-50 rounded-[3.5rem] hover:bg-emerald-500 transition-all duration-500"
            >
              <div className="bg-white p-10 md:p-14 rounded-[3.2rem] h-full flex flex-col">
                <div
                  className={`w-20 h-20 ${item.color} rounded-3xl flex items-center justify-center mb-8`}
                >
                  {item.icon}
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h2>

                <p className="text-slate-500 font-bold mb-8 text-lg leading-snug">
                  {item.description}
                </p>

                <ul className="space-y-4 mb-10 flex-grow">
                  {item.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400"
                    >
                      <Zap size={14} className="text-emerald-500" /> {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/solutions/${item.id}`}
                  className="inline-flex items-center gap-2 text-slate-900 font-black uppercase text-xs tracking-[0.2em] group-hover:gap-4 transition-all"
                >
                  Explore {item.title} Solution{" "}
                  <ArrowRight size={16} className="text-emerald-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO CONTENT MOAT - "Why Choose Us" Section for Search Crawlers */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-8">
            Why professional industries choose{" "}
            <span className="text-emerald-500">QR STUDIO</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <Globe size={20} />{" "}
                <span className="font-black uppercase text-[10px]">
                  Global Scalability
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Deploy thousands of dynamic codes across multiple locations with
                bulk generation tools.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <BarChart3 size={20} />{" "}
                <span className="font-black uppercase text-[10px]">
                  Advanced Analytics
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Know exactly when, where, and on what device your QR codes are
                being scanned.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <Zap size={20} />{" "}
                <span className="font-black uppercase text-[10px]">
                  Dynamic Logic
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Change the destination URL of your printed QR codes instantly
                without reprinting.
              </p>
            </div>
          </div>
        </div>
      </section>
      <AdBanner />
      <Footer />
    </div>
  );
}
