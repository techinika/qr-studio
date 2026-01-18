/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  LogOut,
  Settings,
  Plus,
  Check,
  Building2,
  Users,
  CreditCard,
  LayoutDashboard,
  QrCodeIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { auth, db } from "@/db/firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import CreateTeamModal from "./CreateTeamModal";
import { toast } from "sonner";

export default function WorkspaceNav() {
  const { profile, workspace, allWorkspaces, setActiveWorkspace, user } =
    useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [pendingInvite, setPendingInvite] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => auth.signOut().then(() => router.push("/login"));
  const isActive = (path: string) => pathname === path;

  const handleInviteResponse = async (accept: boolean) => {
    if (!user || !pendingInvite) return;
    setIsActionLoading(true);

    try {
      const q = query(
        collection(db, "workspaceMembers"),
        where("workspaceId", "==", pendingInvite.id),
        where("email", "==", user.email),
        limit(1),
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) throw new Error("Membership record not found");

      const membershipDocId = querySnapshot.docs[0].id;
      const membershipRef = doc(db, "workspaceMembers", membershipDocId);

      if (accept) {
        // 1. Update status to active
        await updateDoc(membershipRef, {
          status: "active",
          uid: user.uid, // Link their UID now that they've joined
        });

        // 2. Add user UID to the main workspace members array
        const workspaceRef = doc(db, "workspaces", pendingInvite.id);
        // Note: For simplicity, we are assuming security rules allow this or handle it via Cloud Function
        // For now, we update the local active state
        await setActiveWorkspace(pendingInvite.id);
        toast.success(`Welcome to ${pendingInvite.name}!`);
      } else {
        // Update status to rejected
        await updateDoc(membershipRef, { status: "rejected" });
        toast.info(`Invitation to ${pendingInvite.name} declined.`);
      }
    } catch (error: any) {
      toast.error("Failed to process invitation.");
    } finally {
      setIsActionLoading(false);
      setPendingInvite(null);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 h-16 sticky top-0 z-[60] px-6 font-sans">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/workspace" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
              <QrCodeIcon className="text-white w-5 h-5" />
            </div>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsTeamMenuOpen(!isTeamMenuOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-all border border-transparent hover:border-slate-100"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-xs uppercase">
                {workspace?.name?.charAt(0) || "W"}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Active Team
                </p>
                <p className="text-sm font-bold text-slate-800 leading-none flex items-center gap-1">
                  {workspace?.name || "Select..."}
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${isTeamMenuOpen ? "rotate-180" : ""}`}
                  />
                </p>
              </div>
            </button>

            {isTeamMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95">
                <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Your Workspaces
                </p>
                <div className="max-h-72 overflow-y-auto">
                  {allWorkspaces
                    .filter((t) => t.status !== "rejected")
                    .map((team) => (
                      <button
                        key={team?.id}
                        onClick={() => {
                          if (team.status === "pending") {
                            setPendingInvite(team);
                            setIsTeamMenuOpen(false);
                          } else {
                            setActiveWorkspace(team.id);
                            setIsTeamMenuOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all mb-1 group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${workspace?.id === team.id ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                          >
                            <Building2 size={16} />
                          </div>
                          <div className="text-left">
                            <p
                              className={`text-sm font-bold ${workspace?.id === team.id ? "text-emerald-600" : "text-slate-700"}`}
                            >
                              {team.name}
                            </p>
                            {team.status === "pending" && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-100 text-amber-600 uppercase tracking-widest mt-1">
                                Pending Invite
                              </span>
                            )}
                          </div>
                        </div>
                        {workspace?.id === team.id && (
                          <Check size={16} className="text-emerald-500" />
                        )}
                      </button>
                    ))}
                </div>
                <div className="h-px bg-slate-50 my-2" />
                <button
                  onClick={() => {
                    setIsTeamMenuOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  <Plus size={16} />
                  <span className="text-sm font-bold uppercase">New Team</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/workspace"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isActive("/workspace") ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 group"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-800 leading-none">
                  {profile?.name}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                  Pro Member
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md group-hover:border-emerald-500 overflow-hidden bg-slate-200 transition-all">
                <img
                  src={
                    profile?.profilePicture ??
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
                  }
                  alt="User"
                />
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Logged in as
                  </p>
                  <p className="text-xs font-bold text-slate-700 truncate">
                    {user?.email}
                  </p>
                </div>

                <Link
                  href="/workspace/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
                >
                  <Settings size={18} className="text-slate-400" /> Account
                  Settings
                </Link>

                <Link
                  href="/workspace/team"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
                >
                  <Users size={18} className="text-slate-400" /> Team Management
                </Link>

                <Link
                  href="/workspace/profile/billing"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-sm transition-all"
                >
                  <CreditCard size={18} className="text-slate-400" /> Billing &
                  Plan
                </Link>

                <div className="h-px bg-slate-50 my-2" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-all"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {pendingInvite && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Building2 size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
              Team Invitation
            </h3>
            <p className="text-slate-500 text-sm font-medium mb-8">
              You have been invited to join{" "}
              <span className="text-slate-900 font-bold">
                &quot;{pendingInvite.name}&ldquo;
              </span>
              . Accept to start collaborating on QR codes.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleInviteResponse(true)}
                disabled={isActionLoading}
                className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
              >
                Accept & Join
              </button>
              <button
                onClick={() => handleInviteResponse(false)}
                disabled={isActionLoading}
                className="w-full bg-white text-red-400 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-50 transition-all disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </nav>
  );
}
