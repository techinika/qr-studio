/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { X, Users, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
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

    setLoading(true);
    try {
      const inviteList = emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "");

      const newId = await createNewTeam(teamName, user.uid, inviteList);

      await setActiveWorkspace(newId);

      onClose();
      setTeamName("");
      setEmails("");
      toast.success("New Team Created Successfully!");
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to create team");
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

          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Create New Team
          </h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            Build a shared workspace to manage QR codes with your colleagues.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                Team Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Marketing Dept"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
                Invite Members (Emails, comma separated)
              </label>
              <textarea
                placeholder="alex@company.com, sam@company.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium h-24 resize-none"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Send size={18} /> Create & Invite
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
