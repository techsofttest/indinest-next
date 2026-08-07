"use client";

interface SizeGuideModalProps {
  onClose: () => void;
}

const sizeRows = [
  { size: "S",   chest: "36 - 38", waist: "30 - 32", length: "38" },
  { size: "M",   chest: "38 - 40", waist: "32 - 34", length: "39" },
  { size: "L",   chest: "40 - 42", waist: "34 - 36", length: "40" },
  { size: "XL",  chest: "42 - 44", waist: "36 - 38", length: "41" },
  { size: "XXL", chest: "44 - 46", waist: "38 - 40", length: "42" },
];

export default function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Body */}
      <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] bg-white z-50 shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[80vh] border border-[#010526]/10 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold uppercase tracking-wider text-[#010526]">
            Men's Size Guide
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#010526]/50 hover:text-[#010526] transition-colors"
            aria-label="Close size guide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm md:text-base border-collapse">
            <thead>
              <tr className="border-b border-[#010526]/20 text-[#010526]/60">
                <th className="py-3 font-bold uppercase tracking-wider">Size</th>
                <th className="py-3 font-bold uppercase tracking-wider">Chest (in)</th>
                <th className="py-3 font-bold uppercase tracking-wider">Waist (in)</th>
                <th className="py-3 font-bold uppercase tracking-wider">Length (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#010526]/10 text-[#010526]">
              {sizeRows.map((row) => (
                <tr key={row.size} className="hover:bg-[#F0F2FF]/20 transition-colors">
                  <td className="py-3 font-bold">{row.size}</td>
                  <td className="py-3">{row.chest}</td>
                  <td className="py-3">{row.waist}</td>
                  <td className="py-3">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fitting tips */}
        <div className="mt-8 text-xs text-[#010526]/60 leading-relaxed">
          <p className="font-bold mb-1">Fitting Tips:</p>
          <p>
            Ethnic wear outfits are designed to have a slightly looser silhouette. If you are in
            between sizes, we recommend ordering the larger size for a more relaxed and comfortable
            fit.
          </p>
        </div>
      </div>
    </>
  );
}
