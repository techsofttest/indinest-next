"use client";

interface SizeGuideModalProps {
  onClose: () => void;
  sizeChartHtml?: string;
}

export default function SizeGuideModal({ onClose, sizeChartHtml }: SizeGuideModalProps) {
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
            Size Guide
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

        {/* Dynamic size chart */}
        <div 
          className="prose max-w-none text-sm text-[#010526] leading-relaxed dynamic-size-chart"
          dangerouslySetInnerHTML={{ __html: sizeChartHtml || "" }}
        />

        <style dangerouslySetInnerHTML={{ __html: `
          .dynamic-size-chart table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
          }
          .dynamic-size-chart th, 
          .dynamic-size-chart td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid rgba(1, 5, 38, 0.1);
            text-align: left;
          }
          .dynamic-size-chart th {
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: rgba(1, 5, 38, 0.6);
            border-bottom: 2px solid rgba(1, 5, 38, 0.2);
          }
          .dynamic-size-chart tr:hover {
            background-color: rgba(240, 242, 255, 0.4);
          }
        `}} />
      </div>
    </>
  );
}
