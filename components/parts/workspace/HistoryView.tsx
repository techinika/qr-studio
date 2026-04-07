import { QRCodes } from "@/types/qrcodes";
import { ExternalLink, QrCode, Folder, FolderPlus, MoreVertical, X } from "lucide-react";
import { formatDateFull } from "../../../lib/main";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/db/firebase";
import { toast } from "sonner";

export function HistoryView({ items, folders }: { items: QRCodes[]; folders?: any[] }) {
  const router = useRouter();
  const [menuConfig, setMenuConfig] = useState<{ x: number; y: number; itemId: string } | null>(null);
  const [showFolderModal, setShowFolderModal] = useState<string | null>(null);

  const handleMoveToFolder = async (itemId: string, folderId: string | null) => {
    try {
      await updateDoc(doc(db, "qrcodes", itemId), { folderId });
      toast.success(folderId ? "Moved to folder" : "Removed from folder");
    } catch (err) {
      toast.error("Failed to move QR code");
    } finally {
      setShowFolderModal(null);
      setMenuConfig(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              QR Name
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Folder
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Destination
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
              Scans
            </th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {items.map((qr) => (
            <tr
              key={qr?.id}
              onClick={() => router.push(`/workspace/view/${qr?.id}`)}
              className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
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
              <td className="px-6 py-4">
                {qr.folderId ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
                    <Folder size={12} />
                    {folders?.find(f => f.id === qr.folderId)?.name || "Folder"}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Unassigned</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium truncate max-w-[200px]">
                  <ExternalLink size={14} className="shrink-0" />
                  {qr.originalUrl}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  {qr.scanCount.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuConfig({ x: e.pageX, y: e.pageY, itemId: qr.id });
                  }}
                  className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {menuConfig && (
        <div
          className="fixed z-[100] w-48 bg-white rounded-lg border border-slate-100 shadow-xl py-1"
          style={{ top: menuConfig.y, left: menuConfig.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setShowFolderModal(menuConfig.itemId);
              setMenuConfig(null);
            }}
            className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 text-sm font-medium"
          >
            <FolderPlus size={16} className="text-emerald-500" /> Move to Folder
          </button>
          {items.find(i => i.id === menuConfig.itemId)?.folderId && (
            <button
              onClick={() => handleMoveToFolder(menuConfig.itemId, null)}
              className="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 text-sm font-medium"
            >
              <Folder size={16} className="text-amber-500" /> Remove from Folder
            </button>
          )}
        </div>
      )}

      {showFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowFolderModal(null)}
          />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase text-slate-900">
                Move to Folder
              </h3>
              <button
                onClick={() => setShowFolderModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleMoveToFolder(showFolderModal, null)}
                className="w-full p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 text-left"
              >
                <FolderPlus size={18} className="text-slate-400" />
                <span className="font-medium text-slate-600">No Folder</span>
              </button>
              {folders?.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleMoveToFolder(showFolderModal, folder.id)}
                  className="w-full p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 text-left"
                >
                  <Folder size={18} className="text-emerald-500" />
                  <div>
                    <p className="font-medium text-slate-800">{folder.name}</p>
                    <p className="text-xs text-slate-400">{folder.itemCount || 0} items</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
