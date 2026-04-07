import { QrCodeIcon, Mail, Twitter, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <QrCodeIcon className="text-white w-4 h-4" />
              </div>
              <span className="font-black text-slate-800 tracking-tighter uppercase text-sm">
                QR STUDIO
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-md">
              Professional QR code generator with real-time analytics, custom branding, 
              and team collaboration. Create, track, and manage your QR codes with ease.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Contact</h4>
            <a 
              href="mailto:products@techinika.com" 
              className="flex items-center gap-2 text-slate-500 text-sm hover:text-emerald-500 transition-colors mb-2"
            >
              <Mail size={14} />
              products@techinika.com
            </a>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/privacy" className="text-slate-500 text-sm hover:text-emerald-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 text-sm hover:text-emerald-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} QR STUDIO. A product of{" "}
            <Link
              href="https://ubunifu.techinika.co.rw"
              target="_blank"
              className="font-bold text-emerald-600 hover:underline"
            >
              Ubunifu Labs
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
