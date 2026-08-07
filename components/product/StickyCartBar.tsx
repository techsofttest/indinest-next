"use client";

interface StickyCartBarProps {
  isVisible: boolean;
  productName: string;
  productPrice: string;
  productImage: string;
  isAddedToBag: boolean;
  onAddToBag: () => void;
  onBuyNow: () => void;
  onClose: () => void;
}

export default function StickyCartBar({
  isVisible,
  productName,
  productPrice,
  productImage,
  isAddedToBag,
  onAddToBag,
  onBuyNow,
  onClose,
}: StickyCartBarProps) {

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#010526]/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 transition-transform duration-300 ease-out ${isVisible ? "translate-y-0" : "translate-y-full"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-5 flex items-center justify-between gap-6">
        {/* Product Info (desktop only) */}
        <div className="hidden md:flex items-center gap-4 flex-1 min-w-0">
          <img
            src={productImage}
            alt={productName}
            className="w-16 h-16 object-cover bg-[#F0F2FF]"
          />
          <div className="flex flex-col min-w-0">
            <p className="text-base font-bold text-[#010526] truncate">{productName}</p>
            <p className="text-base font-semibold text-[#010526]/80">{productPrice}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 flex items-center gap-3 max-w-md">
          <button
            onClick={onAddToBag}
            className={`flex-1 py-3.5 border-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${isAddedToBag
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-[#010526] hover:bg-[#010526] hover:text-white text-[#010526]"
              }`}
          >
            {isAddedToBag ? (
              "✓ Added"
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hidden sm:inline"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            onClick={onBuyNow}
            className="w-full sm:flex-1 py-3.5 bg-[#010526] text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hidden sm:inline"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Buy Now</span>
          </button>
        </div>

        {/* Close (mobile only) */}
        <button
          onClick={onClose}
          className="md:hidden p-1 text-[#010526]/50 hover:text-[#010526]"
          aria-label="Close sticky bar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
