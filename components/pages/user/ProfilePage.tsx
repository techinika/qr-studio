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
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { formatMonthYear } from "@/lib/main";
import { db } from "@/db/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileSettings() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState(profile?.name || "");
  const [language, setLanguage] = useState(profile?.language || "English (US)");
  const [timezone, setTimezone] = useState(
    profile?.timezone || "(GMT+02:00) Central Africa Time",
  );
  const [notifications, setNotifications] = useState(
    profile?.notificationsEnabled ?? true,
  );

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const profileRef = doc(db, "profiles", user.uid);
      await updateDoc(profileRef, {
        name,
        language,
        timezone,
        notificationsEnabled: notifications,
        updatedAt: new Date(),
      });
      toast.success("Profile synchronized successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "profiles", user.uid));
      toast.success("Profile data purged.");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.message ?? "Cleanup failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const timezones = [
    "(GMT-11:00) Midway Island",
    "(GMT-10:00) Hawaii",
    "(GMT-08:00) Pacific Time",
    "(GMT-07:00) Mountain Time",
    "(GMT-06:00) Central Time",
    "(GMT-05:00) Eastern Time",
    "(GMT-04:00) Atlantic Time",
    "(GMT-03:00) Brasilia",
    "(GMT+00:00) London / UTC",
    "(GMT+01:00) Paris / Berlin",
    "(GMT+02:00) Central Africa Time",
    "(GMT+03:00) Moscow",
    "(GMT+04:00) Abu Dhabi",
    "(GMT+05:30) Mumbai / New Delhi",
    "(GMT+07:00) Bangkok",
    "(GMT+08:00) Singapore / Beijing",
    "(GMT+09:00) Tokyo",
    "(GMT+10:00) Sydney",
    "(GMT+12:00) Fiji",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
      <main className="grow max-w-4xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />

          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-100">
              <img
                src={
                  profile?.profilePicture ??
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                }
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
              {profile?.name}
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
              Member since{" "}
              {profile?.createdAt
                ? formatMonthYear(profile?.createdAt)
                : "Recently"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full uppercase tracking-widest">
                Verified
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded-full uppercase tracking-widest">
                Admin
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Check size={18} />
            )}
            {isSaving ? "Syncing..." : "Save Changes"}
          </button>
        </div>

        <div className="grid gap-8">
          <SettingsSection
            icon={<User size={20} className="text-emerald-500" />}
            title="Personal Details"
            desc="Your public identity across the QR ecosystem."
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email (OAuth Protected)
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100 border border-slate-100 text-slate-400 font-bold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection
            icon={<Globe size={20} className="text-emerald-500" />}
            title="Global Preferences"
            desc="Configure your interface language and localization."
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  <option>English (US)</option>
                  <option>French</option>
                  <option>Kinyarwanda</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Universal Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SettingsSection>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-500">
                  <Shield size={22} />
                </div>
                <div>
                  <h3 className="font-black uppercase text-slate-800 text-sm">
                    Security & Privacy
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Active Data Protection
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div
                onClick={() => setNotifications(!notifications)}
                className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-xl transition-all ${notifications ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                  >
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                      Email Notifications
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      System updates and scan alerts
                    </p>
                  </div>
                </div>
                <div
                  className={`w-12 h-6 rounded-full relative transition-all ${notifications ? "bg-emerald-500" : "bg-slate-200"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? "left-7" : "left-1"}`}
                  />
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-50">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-all font-black uppercase text-[10px] tracking-widest"
                >
                  <Trash2 size={14} /> Purge Profile Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              Are you sure?
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-8">
              This will permanently delete your <b>profile metadata</b>. Your
              created QR codes and workspace assets will remain intact, but you
              will lose your custom settings.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteProfile}
                disabled={isDeleting}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting && <Loader2 className="animate-spin" size={14} />}
                Confirm Purge
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
          <h3 className="font-black uppercase text-slate-800 text-sm">
            {title}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {desc}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
