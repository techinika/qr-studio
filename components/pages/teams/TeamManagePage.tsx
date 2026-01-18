/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  UserPlus,
  MoreHorizontal,
  Mail,
  X,
  Check,
  Building2,
  Loader2,
  ShieldCheck,
  UserMinus,
  Users,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { db } from "@/db/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";
import Loading from "@/app/loading";

export default function TeamManagement() {
  const { workspace, user } = useAuth();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [isSending, setIsSending] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const MAX_SEATS = 5;

  // 1. RBAC LOGIC: Identify current user's role
  const currentUserMembership = useMemo(() => {
    return members.find((m) => m.email === user?.email);
  }, [members, user?.email]);

  const isAdminOrOwner =
    currentUserMembership?.role === "Owner" ||
    currentUserMembership?.role === "Admin";

  useEffect(() => {
    if (!workspace?.id) return;

    const q = query(
      collection(db, "workspaceMembers"),
      where("workspaceId", "==", workspace.id),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(membersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspace?.id]);

  const handleInvite = async () => {
    if (!isAdminOrOwner) return toast.error("Unauthorized action.");
    if (!inviteEmail.includes("@")) return toast.error("Valid email required");

    // Filter out rejected members to calculate available seats
    const nonRejectedMembers = members.filter((m) => m.status !== "rejected");
    if (nonRejectedMembers.length >= MAX_SEATS) {
      return toast.error("Workspace seat limit reached (5/5)");
    }

    setIsSending(true);
    try {
      await addDoc(collection(db, "workspaceMembers"), {
        email: inviteEmail.toLowerCase(),
        role: inviteRole,
        workspaceId: workspace?.id,
        workspaceName: workspace?.name,
        invitedBy: user?.email,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success(`Invitation sent to ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail("");
    } catch (err) {
      toast.error("Failed to send invitation");
    } finally {
      setIsSending(false);
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    if (!isAdminOrOwner) return;
    try {
      await updateDoc(doc(db, "workspaceMembers", memberId), { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      setActiveMenu(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update role");
    }
  };

  const removeMember = async (member: any) => {
    if (!isAdminOrOwner) return;
    if (member.role === "Owner") return toast.error("Cannot remove the Owner");

    const confirmMsg =
      member.status === "rejected"
        ? `Clear rejected invitation for ${member.email}?`
        : `Remove ${member.email} from workspace?`;

    if (!confirm(confirmMsg)) return;

    try {
      await deleteDoc(doc(db, "workspaceMembers", member.id));
      toast.success("Member record removed");
      setActiveMenu(null);
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col pb-20">
      <main className="grow max-w-6xl mx-auto w-full px-6 py-12">
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2 text-emerald-500 font-black uppercase text-[10px] tracking-[0.2em]">
              <Building2 size={16} /> {workspace?.name}
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
              Team <span className="text-emerald-500">Management</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {isAdminOrOwner
                ? "Control access and roles for your workspace."
                : "View your workspace collaborators."}
            </p>
          </div>

          {isAdminOrOwner && (
            <button
              disabled={
                members.filter((m) => m.status !== "rejected").length >=
                MAX_SEATS
              }
              onClick={() => setShowInviteModal(true)}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
            >
              <UserPlus size={18} /> Invite Member
            </button>
          )}
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Total Members"
            value={members
              .filter((m) => m.status === "active")
              .length.toString()
              .padStart(2, "0")}
          />
          <StatCard
            label="Pending Invites"
            value={members
              .filter((m) => m.status === "pending")
              .length.toString()
              .padStart(2, "0")}
          />
          <StatCard
            label="Seats Available"
            value={(
              MAX_SEATS - members.filter((m) => m.status !== "rejected").length
            )
              .toString()
              .padStart(2, "0")}
          />
        </div>

        {/* MEMBER LIST TABLE */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-visible relative">
          <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-black uppercase text-slate-800 text-sm flex items-center gap-2">
              Workspace Roster{" "}
              {!isAdminOrOwner && <Lock size={14} className="text-slate-300" />}
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {members.filter((m) => m.status !== "rejected").length} /{" "}
              {MAX_SEATS} Seats Used
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-50/50 transition-all relative"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border-2 border-white shadow-md flex items-center justify-center">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
                        alt="avatar"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                          {member.email.split("@")[0]}{" "}
                          {member.email === user?.email && (
                            <span className="text-emerald-500 ml-1">(You)</span>
                          )}
                        </h4>
                        {member.status === "pending" && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase rounded-md tracking-widest animate-pulse">
                            Invited
                          </span>
                        )}
                        {member.status === "rejected" && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black uppercase rounded-md tracking-widest">
                            Declined
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 mt-0.5">
                        <Mail size={12} />
                        <p className="text-xs font-bold">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${member.role === "Owner" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {member.role}
                    </span>

                    {isAdminOrOwner &&
                      member.role !== "Owner" &&
                      member.email !== user?.email && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === member.id ? null : member.id,
                              )
                            }
                            className="p-3 text-slate-300 hover:text-slate-900 transition-colors bg-white border border-slate-100 rounded-xl hover:shadow-md"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {activeMenu === member.id && (
                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                              {member.status !== "rejected" && (
                                <button
                                  onClick={() =>
                                    updateMemberRole(
                                      member.id,
                                      member.role === "Admin"
                                        ? "Member"
                                        : "Admin",
                                    )
                                  }
                                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-[10px] font-black uppercase text-slate-600"
                                >
                                  <ShieldCheck
                                    size={14}
                                    className="text-emerald-500"
                                  />
                                  {member.role === "Admin"
                                    ? "Revoke Admin"
                                    : "Make Admin"}
                                </button>
                              )}
                              <button
                                onClick={() => removeMember(member)}
                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-[10px] font-black uppercase text-red-500"
                              >
                                <UserMinus size={14} />{" "}
                                {member.status === "rejected"
                                  ? "Clear Record"
                                  : "Remove Member"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-24 flex flex-col items-center text-center">
                <Users size={64} className="text-slate-100 mb-6" />
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  Your Team Universe
                </h3>
                <p className="text-slate-400 text-sm font-medium mt-2 max-w-sm">
                  No collaborators found in this workspace yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* INVITATION MODAL */}
      {showInviteModal && isAdminOrOwner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            onClick={() => setShowInviteModal(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="bg-emerald-500 p-3 rounded-2xl text-white">
                  <UserPlus size={24} />
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-slate-300 hover:text-slate-900"
                >
                  <X size={24} />
                </button>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                Invite Colleague
              </h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">
                Assign a role and grant access to this workspace.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Role Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setInviteRole("Admin")}
                      className="w-full"
                    >
                      <RoleOption
                        label="Admin"
                        desc="Full Control"
                        active={inviteRole === "Admin"}
                      />
                    </button>
                    <button
                      onClick={() => setInviteRole("Member")}
                      className="w-full"
                    >
                      <RoleOption
                        label="Member"
                        desc="Limited Access"
                        active={inviteRole === "Member"}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleInvite}
                disabled={isSending}
                className="w-full mt-10 bg-slate-900 hover:bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Send Invitation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// HELPERS
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
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
      className={`p-4 rounded-2xl border-2 text-left transition-all ${active ? "border-emerald-500 bg-emerald-50/50" : "border-slate-50"}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-[10px] font-black uppercase ${active ? "text-emerald-700" : "text-slate-400"}`}
        >
          {label}
        </span>
        {active && <Check size={12} className="text-emerald-600" />}
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
        {desc}
      </p>
    </div>
  );
}
