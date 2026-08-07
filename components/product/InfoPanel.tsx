"use client";

export default function InfoPanel() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {/* Box 1: No Returns */}
      <div className="flex flex-col items-center text-center p-5 bg-[#F0F2FF]/40 rounded text-[#010526]">
        <div className="w-10 h-10 flex items-center justify-center text-[#010526] mb-3 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#010526] mb-1.5">No Returns or Refunds</h4>
        <p className="text-xs text-[#010526]/75 leading-relaxed font-medium">All sales are final. Please review product details.</p>
      </div>

      {/* Box 2: Shipping Regions */}
      <div className="flex flex-col items-center text-center p-5 bg-[#F0F2FF]/40 rounded text-[#010526]">
        <div className="w-10 h-10 flex items-center justify-center text-[#010526] mb-3 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#010526] mb-1.5">Shipping Regions</h4>
        <p className="text-xs text-[#010526]/75 leading-relaxed font-medium">We ship across the UK, Ireland & Germany.</p>
      </div>

      {/* Box 3: Delivery Rates */}
      <div className="flex flex-col items-center text-center p-5 bg-[#F0F2FF]/40 rounded text-[#010526]">
        <div className="w-10 h-10 flex items-center justify-center text-[#010526] mb-3 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#010526] mb-1.5">Delivery Rates</h4>
        <p className="text-xs text-[#010526]/75 leading-relaxed font-medium">Standard UK: £4.45<br />Express: £5.95 <span className="line-through opacity-55 font-normal">£9.95</span></p>
      </div>

      {/* Box 4: No COD */}
      <div className="flex flex-col items-center text-center p-5 bg-[#F0F2FF]/40 rounded text-[#010526]">
        <div className="w-10 h-10 flex items-center justify-center text-[#010526] mb-3 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-[#010526] mb-1.5">No Cash on Delivery</h4>
        <p className="text-xs text-[#010526]/75 leading-relaxed font-medium">Secure online payment methods only.</p>
      </div>
    </div>
  );
}
