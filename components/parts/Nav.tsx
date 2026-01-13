import { QrCodeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function Nav() {
  return (
    <nav className=" bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100">
      <div className="flex items-center justify-between px-6 py-4 container mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
            <QrCodeIcon className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800">
            QR MAN
          </span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <ul className="flex items-center justify-center gap-3">
            <li>
              <Link href="/">Scan Code</Link>
            </li>
            <li>
              <Link href="/generate">Generate Code</Link>
            </li>
          </ul>
          <Link
            href="/login"
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-5 py-2 rounded-xl font-bold transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
