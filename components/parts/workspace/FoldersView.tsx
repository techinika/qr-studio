import { formatMonthYear } from "@/lib/main";
import { FolderRoot, MoreVertical } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function FoldersView({ items }: { items: any[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((folder) => (
        <div
          key={folder.id}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <FolderRoot size={24} />
              </div>
              <button className="text-slate-300 hover:text-slate-900 p-1">
                <MoreVertical size={20} />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-800 uppercase mb-1 truncate">
              {folder.name}
            </h3>
            <p className="text-sm font-bold text-slate-400 mb-6">
              {folder.count} {folder.count === 1 ? "QR Code" : "QR Codes"}
            </p>
          </div>

          <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Created{" "}
              {folder.createdAt
                ? formatMonthYear(folder.createdAt)
                : "Recently"}
            </span>

            <div className="flex -space-x-2">
              {[...Array(Math.min(folder.count, 3))].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400"
                >
                  QR
                </div>
              ))}
              {folder.count > 3 && (
                <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                  +{folder.count - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
