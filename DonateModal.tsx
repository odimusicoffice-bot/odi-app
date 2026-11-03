import { X } from 'lucide-react';

interface DonateModalProps {
  open: boolean;
  artistName: string;
  onClose: () => void;
}

export default function DonateModal({ open, artistName, onClose }: DonateModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Donate to ${artistName}`}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#111111]/90 p-6 text-center backdrop-blur-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#888888] transition-colors hover:text-white"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        <h2 className="font-anton text-2xl uppercase text-white">Donate to {artistName}</h2>
        <p className="mt-2 text-sm text-[#888888]">Scan the code to support the artist.</p>

        <div className="mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-4">
          <svg viewBox="0 0 21 21" className="h-full w-full text-[#0A0A0A]" shapeRendering="crispEdges" aria-hidden="true">
            <rect x="0" y="0" width="7" height="7" fill="currentColor" />
            <rect x="14" y="0" width="7" height="7" fill="currentColor" />
            <rect x="0" y="14" width="7" height="7" fill="currentColor" />
            <rect x="2" y="2" width="3" height="3" fill="#FFFFFF" />
            <rect x="16" y="2" width="3" height="3" fill="#FFFFFF" />
            <rect x="2" y="16" width="3" height="3" fill="#FFFFFF" />
            <rect x="9" y="2" width="2" height="2" fill="currentColor" />
            <rect x="9" y="9" width="3" height="3" fill="currentColor" />
            <rect x="13" y="13" width="2" height="2" fill="currentColor" />
            <rect x="17" y="10" width="2" height="2" fill="currentColor" />
            <rect x="10" y="17" width="2" height="2" fill="currentColor" />
            <rect x="15" y="16" width="4" height="2" fill="currentColor" />
          </svg>
        </div>
        <p className="mt-4 text-xs uppercase tracking-wider text-[#555555]">QR code placeholder</p>
      </div>
    </div>
  );
}
