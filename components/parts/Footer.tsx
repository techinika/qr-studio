import { QrCodeIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <QrCodeIcon className="text-white w-4 h-4" />
          </div>
          <span className="font-black text-slate-800 tracking-tighter uppercase">
            QR MAN
          </span>
        </div>

        <p className="text-slate-400 text-sm font-medium">
          © {new Date().getFullYear()} A product of
          <Link
            href="https://ubunifu.techinika.co.rw"
            target="_blank"
            className="ml-1 font-bold text-emerald-600 hover:underline"
          >
            Ubunifu Labs
          </Link>
          .
        </p>

        <div className="flex gap-6 text-xs font-black text-slate-300 uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-emerald-500">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-emerald-500">
            Legal
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
