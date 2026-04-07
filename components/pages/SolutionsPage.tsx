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
  Phone,
  MapPin,
  Calendar,
  Star,
  QrCode,
  FileText,
  Users,
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
      "Transform your dining experience with contactless digital menus. Update prices, remove sold-out items, and showcase daily specials instantly without reprinting.",
    useCases: [
      {
        title: "Digital Menu QR Codes",
        description: "Replace paper menus with interactive digital versions. Update items, prices, and photos in real-time.",
        icon: <FileText size={20} />,
      },
      {
        title: "Table-Talk Marketing",
        description: "Place QR codes on tables for customers to view promotions, leave reviews, or reorder.",
        icon: <Star size={20} />,
      },
      {
        title: "Staff Management",
        description: "QR codes for employee schedules, training materials, and internal communications.",
        icon: <Users size={20} />,
      },
    ],
    color: "bg-orange-50",
  },
  {
    id: "real-estate",
    title: "Real Estate",
    icon: <Home className="text-blue-500" size={32} />,
    keyword: "Real estate QR tracking",
    description:
      "Capture leads effortlessly with smart yard signs and property flyers. Connect potential buyers directly to virtual tours and agent contacts.",
    useCases: [
      {
        title: "Yard Sign Leads",
        description: "Prospective buyers scan the sign to see property details, photos, and schedule a showing instantly.",
        icon: <Home size={20} />,
      },
      {
        title: "Virtual Tours",
        description: "Link to 360° virtual tours, video walkthroughs, and drone footage of properties.",
        icon: <Globe size={20} />,
      },
      {
        title: "Agent Contact Cards",
        description: "Buyers save your contact info directly to their phone with one scan.",
        icon: <Phone size={20} />,
      },
    ],
    color: "bg-blue-50",
  },
  {
    id: "retail",
    title: "Retail & E-commerce",
    icon: <ShoppingBag className="text-emerald-500" size={32} />,
    keyword: "Retail QR marketing",
    description:
      "Bridge the gap between physical stores and online shopping. Engage customers with product information, reviews, and exclusive discounts.",
    useCases: [
      {
        title: "Product Information",
        description: "Customers scan items to view specs, reviews, and compare prices online.",
        icon: <QrCode size={20} />,
      },
      {
        title: "Loyalty Programs",
        description: "Offer digital loyalty cards and exclusive deals to repeat customers.",
        icon: <Star size={20} />,
      },
      {
        title: "Inventory Tracking",
        description: "Internal QR codes for stock management and restocking alerts.",
        icon: <FileText size={20} />,
      },
    ],
    color: "bg-emerald-50",
  },
  {
    id: "events",
    title: "Events & Festivals",
    icon: <Ticket className="text-purple-500" size={32} />,
    keyword: "Event check-in QR",
    description:
      "Streamline ticketing and check-in with secure, encrypted QR codes. Track attendance in real-time and enhance attendee experiences.",
    useCases: [
      {
        title: "Digital Ticketing",
        description: "Generate unique QR tickets that can be scanned at entry points instantly.",
        icon: <Ticket size={20} />,
      },
      {
        title: "Schedule Access",
        description: "Attendees scan to view event schedules, speaker bios, and session locations.",
        icon: <Calendar size={20} />,
      },
      {
        title: "Sponsorships",
        description: "Create scan points for sponsor activations and lead capture from attendees.",
        icon: <Users size={20} />,
      },
    ],
    color: "bg-purple-50",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    icon: <BarChart3 className="text-red-500" size={32} />,
    keyword: "Healthcare QR codes",
    description:
      "Improve patient experiences with QR codes for appointment scheduling, medical records access, and health information.",
    useCases: [
      {
        title: "Appointment Check-in",
        description: "Patients scan to check in, complete forms, and receive wait time updates.",
        icon: <Calendar size={20} />,
      },
      {
        title: "Patient Education",
        description: "Link to post-care instructions, medication guides, and follow-up scheduling.",
        icon: <FileText size={20} />,
      },
      {
        title: "Wayfinding",
        description: "Help patients navigate to departments, labs, and waiting areas.",
        icon: <MapPin size={20} />,
      },
    ],
    color: "bg-red-50",
  },
  {
    id: "education",
    title: "Education",
    icon: <Globe className="text-indigo-500" size={32} />,
    keyword: "Education QR codes",
    description:
      "Enhance learning experiences with QR codes linking to educational content, virtual resources, and interactive materials.",
    useCases: [
      {
        title: "Interactive Learning",
        description: "Students scan textbooks to access videos, quizzes, and supplementary materials.",
        icon: <FileText size={20} />,
      },
      {
        title: "Attendance Tracking",
        description: "Teachers scan student IDs for quick and accurate attendance records.",
        icon: <Users size={20} />,
      },
      {
        title: "Campus Navigation",
        description: "Visitors scan for campus maps, building directories, and event locations.",
        icon: <MapPin size={20} />,
      },
    ],
    color: "bg-indigo-50",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((item) => (
            <div
              key={item.id}
              className="group p-1 bg-slate-50 rounded-lg hover:bg-emerald-500 transition-all duration-500"
            >
              <div className="bg-white p-8 rounded-lg h-full flex flex-col">
                <div
                  className={`w-16 h-16 ${item.color} rounded-lg flex items-center justify-center mb-6`}
                >
                  {item.icon}
                </div>

                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h2>

                <p className="text-slate-500 font-bold mb-6 text-sm leading-snug">
                  {item.description}
                </p>

                <Link
                  href={`/solutions/${item.id}`}
                  className="inline-flex items-center gap-2 text-slate-900 font-black uppercase text-xs tracking-[0.2em] group-hover:gap-4 transition-all mt-auto"
                >
                  Explore {item.title} Solution{" "}
                  <ArrowRight size={16} className="text-emerald-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-4">
            Real-World <span className="text-emerald-500">Use Cases</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            See how businesses across industries are using QR STUDIO to grow their reach
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
              <Zap size={24} />
            </div>
            <h3 className="font-black text-slate-900 uppercase text-sm mb-2">
              Instant Updates
            </h3>
            <p className="text-slate-500 text-sm">
              Change your QR code destination anytime without reprinting. Perfect for limited-time offers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-black text-slate-900 uppercase text-sm mb-2">
              Track Everything
            </h3>
            <p className="text-slate-500 text-sm">
              Know exactly when, where, and how your QR codes are being scanned with detailed analytics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
              <Globe size={24} />
            </div>
            <h3 className="font-black text-slate-900 uppercase text-sm mb-2">
              Global Scale
            </h3>
            <p className="text-slate-500 text-sm">
              Deploy thousands of QR codes across multiple locations with centralized management.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">
            Ready to <span className="text-emerald-400">Get Started</span>?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Create your first QR code in seconds. No signup required for basic QR codes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/generate"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all shadow-xl"
            >
              Create QR Code
            </Link>
            <Link
              href="/solutions/restaurants"
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all border border-white/20"
            >
              View Examples
            </Link>
          </div>
        </div>
      </section>

      <AdBanner />
      <Footer />
    </div>
  );
}
