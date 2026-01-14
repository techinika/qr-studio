"use client";

import { useAuth } from "@/lib/AuthContext";
import {
  QrCodeIcon,
  Scan,
  PlusSquare,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function Nav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
              <QrCodeIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              QR STUDIO
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isActive("/")
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-emerald-500"
              }`}
            >
              Scan
            </Link>
            <Link
              href="/generate"
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isActive("/generate")
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-emerald-500"
              }`}
            >
              Generate
            </Link>
            <Link
              href="/solutions"
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isActive("/solutions")
                  ? "text-emerald-600"
                  : "text-slate-500 hover:text-emerald-500"
              }`}
            >
              Solutions
            </Link>
          </div>

          {user ? (
            <Link
              href="/workspace"
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200"
            >
              <UserCircle size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-100">
        <div className="bg-slate-900/90 backdrop-blur-lg rounded-3xl p-2 shadow-2xl border border-white/10 flex items-center justify-around">
          <Link
            href="/"
            className={`flex flex-1 items-center justify-center gap-3 py-4 rounded-2xl transition-all ${
              isActive("/")
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Scan size={20} />
            <span className="font-black uppercase text-xs tracking-tighter">
              Scan
            </span>
          </Link>

          <div className="w-px h-8 bg-white/10"></div>

          <Link
            href="/generate"
            className={`flex flex-1 items-center justify-center gap-3 py-4 rounded-2xl transition-all ${
              isActive("/generate")
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PlusSquare size={20} />
            <span className="font-black uppercase text-xs tracking-tighter">
              Generate
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Nav;
