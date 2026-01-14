"use client";

import React, { useState } from "react";
import {
  UserPlus,
  MoreHorizontal,
  Mail,
  X,
  Check,
  Building2,
} from "lucide-react";

export default function TeamManagement() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Mock Data
  const members = [
    {
      id: 1,
      name: "John Doe",
      email: "john@ubunifu.tech",
      role: "Owner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@ubunifu.tech",
      role: "Admin",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      id: 3,
      name: "Mike Ross",
      email: "mike@ubunifu.tech",
      role: "Editor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <main className="grow max-w-6xl mx-auto w-full px-6 py-12">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2 text-emerald-500 font-black uppercase text-[10px] tracking-[0.2em]">
              <Building2 size={16} /> Ubunifu Labs Workspace
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Team <span className="text-emerald-500">Management</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage collaborators and permissions.
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <UserPlus size={18} /> Invite Member
          </button>
        </div>

        {/* TEAM STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Members" value="03" />
          <StatCard label="Active Invites" value="00" />
          <StatCard label="Remaining Seats" value="02" />
        </div>

        {/* MEMBERS LIST */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-black uppercase text-slate-800 text-sm">
              Active Members
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              3 of 5 Seats Used
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-50/50 transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md">
                    <img src={member.avatar} alt={member.name} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                      {member.name}
                    </h4>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={12} />
                      <p className="text-xs font-bold">{member.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        member.role === "Owner"
                          ? "bg-slate-900 text-white"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>

                  {member.role !== "Owner" && (
                    <div className="flex items-center gap-2">
                      <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors bg-white border border-slate-100 rounded-xl">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* INVITE MODAL OVERLAY */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowInviteModal(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                  <UserPlus size={24} />
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-slate-300 hover:text-slate-900"
                >
                  <X size={24} />
                </button>
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                Invite Collaborator
              </h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">
                Empower your team by inviting them to manage QR Universes
                together.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Assigned Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <RoleOption
                      label="Admin"
                      desc="Full access"
                      active={true}
                    />
                    <RoleOption
                      label="Editor"
                      desc="Edit only"
                      active={false}
                    />
                  </div>
                </div>
              </div>

              <button className="w-full mt-10 bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-emerald-200">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">
        {value}
      </p>
    </div>
  );
}

function RoleOption({
  label,
  desc,
  active,
}: {
  label: string;
  desc: string;
  active: boolean;
}) {
  return (
    <div
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
        active
          ? "border-emerald-500 bg-emerald-50/50"
          : "border-slate-50 hover:border-slate-100"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-xs font-black uppercase ${
            active ? "text-emerald-700" : "text-slate-400"
          }`}
        >
          {label}
        </span>
        {active && <Check size={12} className="text-emerald-600" />}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        {desc}
      </p>
    </div>
  );
}
