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
import { ConfirmModal } from "@/components/parts/ConfirmModal";

export default function TeamManagement() {
  const { workspace, user } = useAuth();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [isSending, setIsSending] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [confirmState, setConfirmState] = useState<{
    member: any;
    type: "remove" | "clear";
  } | null>(null);

  const MAX_SEATS = 5;

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

  const handleRemoveMember = async () => {
    if (!confirmState?.member) return;
    const member = confirmState.member;
    
    if (!isAdminOrOwner) return toast.error("Unauthorized");
    if (member.role === "Owner") return toast.error("Cannot remove the Owner");

    try {
      await deleteDoc(doc(db, "workspaceMembers", member.id));
      toast.success("Member record removed");
      setActiveMenu(null);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to remove member");
    } finally {
      setConfirmState(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col pb-16">
      <main className="grow max-w-6xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2 text-emerald-500 font-black uppercase text-[10px] tracking-[0.2em]">
              <Building2 size={16} /> {workspace?.name}
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
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
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-black uppercase tracking-wider text-xs hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-50"
            >
              <UserPlus size={16} /> Invite
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Total Members
            </p>
            <p className="text-2xl font-black text-slate-900">
              {members.filter((m) => m.status === "active").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Pending
            </p>
            <p className="text-2xl font-black text-slate-900">
              {members.filter((m) => m.status === "pending").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Seats
            </p>
            <p className="text-2xl font-black text-slate-900">
              {MAX_SEATS - members.filter((m) => m.status !== "rejected").length} / {MAX_SEATS}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-black uppercase text-slate-800 text-sm">
              Workspace Roster
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {members.filter((m) => m.status !== "rejected").length} / {MAX_SEATS} Seats
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-50/50 transition-all relative"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border-2 border-white shadow-md flex items-center justify-center">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
                        alt="avatar"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 uppercase text-sm">
                          {member.email.split("@")[0]}{" "}
                          {member.email === user?.email && (
                            <span className="text-emerald-500 ml-1">(You)</span>
                          )}
                        </h4>
                        {member.status === "pending" && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase rounded-md tracking-widest">
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

                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${member.role === "Owner" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-700"}`}
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
                            className="p-2 text-slate-300 hover:text-slate-900 transition-colors bg-white border border-slate-100 rounded-lg hover:shadow-md"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {activeMenu === member.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50">
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
                                  className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold"
                                >
                                  <ShieldCheck size={14} className="text-emerald-500" />
                                  {member.role === "Admin" ? "Revoke Admin" : "Make Admin"}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setConfirmState({
                                    member,
                                    type: member.status === "rejected" ? "clear" : "remove",
                                  });
                                  setActiveMenu(null);
                                }}
                                className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-red-50 transition-colors text-red-500 text-xs font-bold"
                              >
                                <UserMinus size={14} />
                                {member.status === "rejected" ? "Clear Record" : "Remove"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 flex flex-col items-center text-center">
                <Users size={48} className="text-slate-100 mb-4" />
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  Your Team
                </h3>
                <p className="text-slate-400 text-sm font-medium mt-2 max-w-sm">
                  No collaborators found in this workspace yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showInviteModal && isAdminOrOwner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
            onClick={() => setShowInviteModal(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="bg-emerald-500 p-2.5 rounded-lg text-white">
                  <UserPlus size={20} />
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-slate-300 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                Invite Colleague
              </h3>
              <p className="text-slate-500 text-sm mb-6 font-medium">
                Assign a role and grant access to this workspace.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-5 py-3 rounded-lg bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Role Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setInviteRole("Admin")}>
                      <RoleOption
                        label="Admin"
                        desc="Full Control"
                        active={inviteRole === "Admin"}
                      />
                    </button>
                    <button onClick={() => setInviteRole("Member")}>
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
                className="w-full mt-8 bg-slate-900 hover:bg-emerald-600 text-white py-4 rounded-lg font-black uppercase tracking-wider text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isSending ? <Loader2 className="animate-spin" size={14} /> : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={confirmState?.type === "remove"}
        title="Remove Member"
        message={`Are you sure you want to remove ${confirmState?.member?.email} from this workspace?`}
        confirmLabel="Remove"
        type="danger"
        onConfirm={handleRemoveMember}
        onCancel={() => setConfirmState(null)}
      />

      <ConfirmModal
        open={confirmState?.type === "clear"}
        title="Clear Record"
        message={`Clear the rejected invitation for ${confirmState?.member?.email}?`}
        confirmLabel="Clear"
        type="warning"
        onConfirm={handleRemoveMember}
        onCancel={() => setConfirmState(null)}
      />
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
      className={`p-4 rounded-lg border-2 text-left transition-all ${active ? "border-emerald-500 bg-emerald-50/50" : "border-slate-50"}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-[10px] font-black uppercase ${active ? "text-emerald-700" : "text-slate-400"}`}
        >
          {label}
        </span>
        {active && <Check size={12} className="text-emerald-600" />}
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase">{desc}</p>
    </div>
  );
}
