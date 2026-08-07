"use client";

import type { Product } from "@/components/data/products";

// Helper – compute delivery date 5 days from now
const getDeliveryDate = () => {
  const today = new Date();
  const delivery = new Date(today);
  delivery.setDate(today.getDate() + 5);
  return delivery.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

interface ProductInfoPanelProps {
  product: Product;
  discountPercent: number;
  variantOptions: string[];
  selectedVariantName: string | null;
  setSelectedVariantName: (variantName: string) => void;
  isAddedToBag: boolean;
  onAddToBag: () => void;
  onBuyNow: () => void;
  onOpenSizeGuide: () => void;
  openAccordions: Record<string, boolean>;
  toggleAccordion: (key: string) => void;
  actionButtonsRef: React.RefObject<HTMLDivElement | null>;
}

export default function ProductInfoPanel({
  product,
  discountPercent,
  variantOptions,
  selectedVariantName,
  setSelectedVariantName,
  isAddedToBag,
  onAddToBag,
  onBuyNow,
  onOpenSizeGuide,
  openAccordions,
  toggleAccordion,
  actionButtonsRef,
}: ProductInfoPanelProps) {
  const isAvailable = product.availability === "In Stock";

  return (
    <div className="lg:col-span-7 flex flex-col justify-start lg:pr-20">
      {/* Brand / Category */}
      {(product.brand || product.category) && (
        <p className="text-xs md:text-xs font-bold uppercase tracking-[0.25em] text-[#010526]/70 mb-2">
          {[product.brand, product.category].filter(Boolean).join(" • ")}
        </p>
      )}

      {/* Title */}
      {product.name && (
        <h1 className="text-2xl md:text-3xl font-light tracking-wide text-[#010526] leading-tight mb-4">
          {product.name}
        </h1>
      )}

      {/* Pricing */}
      {product.price && (
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-2xl md:text-3xl font-bold text-[#010526]">{product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-base md:text-lg text-[#010526]/40 line-through">
                {product.originalPrice}
              </span>
              {discountPercent > 0 && (
                <span className="text-xs md:text-sm font-bold text-emerald-600 uppercase tracking-widest">
                  {discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Variant Selection */}
      {variantOptions.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold uppercase tracking-wider text-[#010526]/80">
              Select Variant
            </span>
            <button
              onClick={onOpenSizeGuide}
              className="text-xs md:text-sm font-semibold tracking-wider text-[#010526]/60 hover:text-[#010526] underline transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              Size Guide
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {variantOptions.map((variantName) => (
              <button
                key={variantName}
                onClick={() => setSelectedVariantName(variantName)}
                className={`rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 border ${
                  selectedVariantName === variantName
                    ? "bg-[#010526] border-[#010526] text-white"
                    : "border-[#010526]/20 hover:border-[#010526] text-[#010526]"
                }`}
              >
                {variantName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Urgency Notice */}
      {(product.demand ?? 0) > 0 && (
        <div className="flex items-center gap-2.5 mb-6 text-[#010526]/90">
          <svg
            className="w-5 h-5 flex-shrink-0 text-red-600 animate-pulse"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
          </svg>
          <p className="text-xs md:text-sm font-medium leading-relaxed">
            <span className="font-bold">Highly Popular:</span>{" "}
            {product.demand} people have added this piece to their bag. Order soon!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div ref={actionButtonsRef} className="flex flex-col sm:flex-row gap-3 mb-8">
        <button
          onClick={onAddToBag}
          className={`group px-8 py-4 border-2 text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 ${isAddedToBag
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "border-[#010526] hover:bg-[#010526] hover:text-white text-[#010526]"
            }`}
        >
          {isAddedToBag ? (
            "✓ Added to Bag"
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="animate-breathe transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-6 group-hover:animate-none">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Add to Bag
            </>
          )}
        </button>
        <button
          onClick={onBuyNow}
          className="group px-8 py-4 bg-[#010526] text-white text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-breathe transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:scale-105 group-hover:animate-none">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Buy Now
        </button>
      </div>

      {/* Key Highlights */}
      {[product.fabric, product.colour, product.occasion].some(Boolean) && (
        <div className="py-6 border-t border-[#010526]/10 grid grid-cols-2 gap-x-6 gap-y-4">
          {product.fabric && (
            <div className="flex items-center gap-3 text-xs md:text-sm text-[#010526]">
              <div className="w-8 h-8 rounded-full border border-[#010526]/20 flex items-center justify-center text-[#010526]/90 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span>
                <strong className="font-semibold text-[#010526]">Fabric:</strong> {product.fabric}
              </span>
            </div>
          )}
          {product.colour && (
            <div className="flex items-center gap-3 text-xs md:text-sm text-[#010526]">
              <div className="w-8 h-8 rounded-full border border-[#010526]/20 flex items-center justify-center text-[#010526]/90 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
                </svg>
              </div>
              <span>
                <strong className="font-semibold text-[#010526]">Colour:</strong> {product.colour}
              </span>
            </div>
          )}
          {product.occasion && (
            <div className="flex items-center gap-3 text-xs md:text-sm text-[#010526]">
              <div className="w-8 h-8 rounded-full border border-[#010526]/20 flex items-center justify-center text-[#010526]/90 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="8" width="18" height="12" rx="2" />
                  <path d="M12 8V22M19 12H5M12 7a3 3 0 1 0-3-3M12 7a3 3 0 1 1 3-3" />
                </svg>
              </div>
              <span>
                <strong className="font-semibold text-[#010526]">Occasion:</strong> {product.occasion}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Estimated Delivery */}
      <div className="py-5 border-t border-[#010526]/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-[#010526]/20 flex items-center justify-center text-[#010526]/90 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#010526]">Estimated Delivery</p>
            <p className="text-xs md:text-sm text-[#010526]/75">
              Guaranteed delivery by{" "}
              <span className="font-bold text-[#010526]">{getDeliveryDate()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="border-t border-[#010526]/10 mt-2">
        {(product.styleNo || product.designNo || product.colour || product.fabric || product.packContains || product.manufacturedBy || product.speciality) && (
          <AccordionItem
            id="details"
            label="Product Details"
            isOpen={openAccordions.details}
            toggle={() => toggleAccordion("details")}
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
              {product.styleNo && <InfoRow label="Style No" value={product.styleNo} />}
              {product.designNo && <InfoRow label="Design No" value={product.designNo} />}
              {product.colour && <InfoRow label="Color" value={product.colour} />}
              {product.fabric && <InfoRow label="Fabric" value={product.fabric} />}
              {product.packContains && <InfoRow label="Pack Contains" value={product.packContains} />}
              {product.manufacturedBy && <InfoRow label="Manufactured / Packed by" value={product.manufacturedBy} />}
            </div>
            {product.speciality && (
              <>
                <p className="font-bold text-[#010526]/80 mb-2">Product Speciality :</p>
                <p className="leading-relaxed text-[#010526]/80 font-light">
                  {product.speciality}
                </p>
              </>
            )}
          </AccordionItem>
        )}

        <AccordionItem
          id="styleFit"
          label="Style & Fit Tips"
          isOpen={openAccordions.styleFit}
          toggle={() => toggleAccordion("styleFit")}
        >
          Ethnic wear outfits are designed to have a slightly looser silhouette. If you are in
          between sizes, we recommend ordering the larger size for a more relaxed and comfortable fit.
        </AccordionItem>

        <AccordionItem
          id="shippingReturns"
          label="Shipping & Returns"
          isOpen={openAccordions.shippingReturns}
          toggle={() => toggleAccordion("shippingReturns")}
        >
          Standard shipping takes 5–7 business days across our delivery regions. Easy returns and
          exchanges are available within 5 days of delivery for eligible items.
        </AccordionItem>

        <AccordionItem
          id="faqs"
          label="FAQs"
          isOpen={openAccordions.faqs}
          toggle={() => toggleAccordion("faqs")}
        >
          <div className="flex flex-col gap-3">
            <p>
              <strong>Q: Is custom tailoring available?</strong>
              <br />
              A: We currently offer standard sizes. For custom modifications, please consult our size
              guide or contact support.
            </p>
            <p>
              <strong>Q: What is the fabric care instruction?</strong>
              <br />
              A: Dry clean only is recommended to preserve the premium weave and embroidery details.
            </p>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function AccordionItem({
  id,
  label,
  isOpen,
  toggle,
  children,
}: {
  id: string;
  label: string;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#010526]/10">
      <button
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-${id}`}
        className="w-full flex justify-between items-center py-4 text-left text-base font-semibold text-[#010526] hover:opacity-85 transition-opacity"
      >
        <span>{label}</span>
        <span className="text-xl font-light text-[#010526]/70">{isOpen ? "—" : "+"}</span>
      </button>
      {isOpen && (
        <div
          id={`accordion-${id}`}
          className="pb-6 pt-2 text-xs md:text-sm text-[#010526]/80 leading-relaxed"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-bold text-[#010526]/80">{label}:</p>
      <p className="text-[#010526]/70 capitalize">{value}</p>
    </div>
  );
}