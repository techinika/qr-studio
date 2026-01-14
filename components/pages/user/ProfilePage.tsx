/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Bell,
  Camera,
  Check,
  Globe,
  Trash2,
  Lock,
} from "lucide-react";

export default function ProfileSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000); // Simulate API call
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <main className="grow max-w-4xl mx-auto w-full px-6 py-12">
        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />

          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-100">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-xl shadow-lg hover:bg-emerald-500 transition-all">
              <Camera size={18} />
            </button>
          </div>

          <div className="text-center md:text-left grow">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              John <span className="text-emerald-500">Doe</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
              Pro Member since Jan 2024
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase">
                Verified Creator
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase">
                Team Admin
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center gap-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={18} />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="grid gap-8">
          {/* SECTION 1: PERSONAL INFO */}
          <SettingsSection
            icon={<User size={20} className="text-emerald-500" />}
            title="Personal Details"
            desc="Manage your public identity and contact info."
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    disabled
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 border border-slate-100 text-slate-400 font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* SECTION 2: REGIONAL */}
          <SettingsSection
            icon={<Globe size={20} className="text-emerald-500" />}
            title="Preferences"
            desc="Set your default workspace language and timezone."
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Language
                </label>
                <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none">
                  <option>English (US)</option>
                  <option>French</option>
                  <option>Kinyarwanda</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Timezone
                </label>
                <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none">
                  <option>(GMT+02:00) Central Africa Time</option>
                  <option>(GMT-05:00) Eastern Time</option>
                </select>
              </div>
            </div>
          </SettingsSection>

          {/* SECTION 3: SECURITY & DANGER ZONE */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-2xl text-red-500">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="font-black uppercase text-slate-800">
                    Security & Privacy
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Protect your workspace and data.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <Lock
                    className="text-slate-400 group-hover:text-slate-900"
                    size={20}
                  />
                  <p className="text-sm font-bold text-slate-700">
                    Two-Factor Authentication
                  </p>
                </div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                  Disabled
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <Bell
                    className="text-slate-400 group-hover:text-slate-900"
                    size={20}
                  />
                  <p className="text-sm font-bold text-slate-700">
                    Email Notifications
                  </p>
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Active
                </span>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <button className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-all font-black uppercase text-[10px] tracking-widest">
                  <Trash2 size={14} /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SHARED UI COMPONENT ---

function SettingsSection({
  icon,
  title,
  desc,
  children,
}: {
  icon: any;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-slate-50 p-3 rounded-2xl">{icon}</div>
        <div>
          <h3 className="font-black uppercase text-slate-800">
            {title}
          </h3>
          <p className="text-xs text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
