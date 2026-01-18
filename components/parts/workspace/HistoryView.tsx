import { QRCodes } from "@/types/qrcodes";
import { ExternalLink, QrCode } from "lucide-react";
import { formatDateFull } from "../../../lib/main";
import { useRouter } from "next/navigation";

export function HistoryView({ items }: { items: QRCodes[] }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              QR Name
            </th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Destination
            </th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
              Engagement
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {items.map((qr) => (
            <tr
              key={qr?.id}
              onClick={() => router.push(`/workspace/view/${qr?.id}`)}
              className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
            >
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <QrCode size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 leading-tight">
                      {qr.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                      {formatDateFull(qr.createdAt)}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium truncate max-w-50">
                  <ExternalLink size={14} className="shrink-0" />
                  {qr.originalUrl}
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  {qr.scanCount.toLocaleString()} Scans
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
