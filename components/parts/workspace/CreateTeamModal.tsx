/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { X, Users, Send, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { db } from "@/db/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  writeBatch,
  doc,
} from "firebase/firestore";
import { createNewTeam } from "@/db/functions/teamService";

export default function CreateTeamModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user, setActiveWorkspace } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !user) return;

    // 1. Process and validate email list
    const inviteList = emails
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email !== "" && email !== user.email);

    if (inviteList.length > 5) {
      return toast.error("You can only invite up to 5 members at once.");
    }

    setLoading(true);
    try {
      // 2. Create the Workspace (using your existing function)
      // Assuming createNewTeam returns the new workspace ID
      const newWorkspaceId = await createNewTeam(
        teamName,
        user.uid,
        inviteList,
      );

      // 3. Update workspaceMembers collection using a Batch for efficiency
      const batch = writeBatch(db);

      // Add the Owner (the current user)
      const ownerRef = doc(collection(db, "workspaceMembers"));
      batch.set(ownerRef, {
        workspaceId: newWorkspaceId,
        workspaceName: teamName,
        email: user.email,
        uid: user.uid,
        role: "Owner",
        status: "active",
        createdAt: serverTimestamp(),
      });

      // Add the invited members
      inviteList.forEach((email) => {
        const memberRef = doc(collection(db, "workspaceMembers"));
        batch.set(memberRef, {
          workspaceId: newWorkspaceId,
          workspaceName: teamName,
          email: email,
          role: "Member", // Default role
          status: "pending",
          invitedBy: user.email,
          createdAt: serverTimestamp(),
        });
      });

      await batch.commit();

      // 4. Switch to the new workspace
      await setActiveWorkspace(newWorkspaceId);

      onClose();
      setTeamName("");
      setEmails("");
      toast.success("Workspace and Invitations Created!");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Failed to create team and members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
              <Users size={24} />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
            New <span className="text-emerald-500">Universe</span>
          </h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            Set up a collaborative workspace. Invite up to 5 teammates to get
            started.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block ml-1">
                Workspace Name
              </label>
              <input
                required
                type="text"
                placeholder="Marketing Team, Design Hub..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Invite Teammates
                </label>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest ${emails.split(",").filter((e) => e.trim()).length > 5 ? "text-red-500" : "text-slate-300"}`}
                >
                  {emails.split(",").filter((e) => e.trim()).length} / 5 Seats
                </span>
              </div>
              <textarea
                placeholder="email1@company.com, email2@company.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-emerald-500 outline-none transition-all font-medium h-28 resize-none text-slate-600"
              />
              <div className="flex items-start gap-2 mt-2 ml-1 text-slate-400">
                <AlertCircle size={12} className="mt-0.5 shrink-0" />
                <p className="text-[9px] font-bold leading-relaxed uppercase tracking-tighter">
                  Separate emails with commas. Invited members will receive a
                  &quot;Pending&ldquo; status until they join.
                </p>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={18} /> Launch Workspace
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
