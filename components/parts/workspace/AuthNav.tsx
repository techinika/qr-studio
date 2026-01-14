"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  LogOut,
  Settings,
  CreditCard,
  User,
  Plus,
  Check,
  Users,
  Building2,
} from "lucide-react";
import Link from "next/link";

export default function WorkspaceNav() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);

  // Mock Data
  const [currentTeam, setCurrentTeam] = useState({
    id: 1,
    name: "Personal Workspace",
    type: "Personal",
  });
  const teams = [
    { id: 1, name: "Personal Workspace", type: "Personal" },
    { id: 2, name: "Ubunifu Labs", type: "Team" },
    { id: 3, name: "Techinika Marketing", type: "Team" },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 h-16 sticky top-0 z-[60] px-6">
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between">
        {/* LEFT: TEAM SWITCHER */}
        <div className="relative">
          <button
            onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
            className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-all border border-transparent hover:border-slate-100"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-emerald-200">
              {currentTeam.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                Workspace
              </p>
              <p className="text-sm font-bold text-slate-800 leading-none flex items-center gap-1">
                {currentTeam.name}{" "}
                <ChevronDown size={14} className="text-slate-400" />
              </p>
            </div>
          </button>

          {isTeamMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
              <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Switch Team
              </p>
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => {
                    setCurrentTeam(team);
                    setIsTeamMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    {team.type === "Personal" ? (
                      <User size={16} className="text-slate-400" />
                    ) : (
                      <Building2 size={16} className="text-slate-400" />
                    )}
                    <span
                      className={`text-sm font-bold ${
                        currentTeam.id === team.id
                          ? "text-emerald-600"
                          : "text-slate-600"
                      }`}
                    >
                      {team.name}
                    </span>
                  </div>
                  {currentTeam.id === team.id && (
                    <Check size={16} className="text-emerald-500" />
                  )}
                </button>
              ))}
              <div className="h-[1px] bg-slate-50 my-2" />
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all">
                <Plus size={16} />
                <span className="text-sm font-bold">Create New Team</span>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: USER PROFILE */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-slate-800 leading-none">
                John Doe
              </p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                Pro Member
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:border-emerald-500 transition-all overflow-hidden bg-slate-200">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="User Avatar"
              />
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/profile"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
              >
                <Settings size={18} /> Profile Settings
              </Link>
              <Link
                href="/profile/billing"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
              >
                <CreditCard size={18} /> Billing & Plans
              </Link>
              <Link
                href="/workspace/team"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
              >
                <Users size={18} /> Team Management
              </Link>
              <div className="h-[1px] bg-slate-50 my-2" />
              <button
                onClick={() => console.log("Logging out...")}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-all"
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
