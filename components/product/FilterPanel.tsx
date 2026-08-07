"use client";

import { useState } from "react";

interface FilterPanelProps {
  activeFilters: Record<string, string[]>;
  onToggle: (filterId: string, value: string) => void;
  onClear: () => void;
  filterConfig: {
    id: string;
    label: string;
    options: string[];
  }[];
}

export default function FilterPanel({ activeFilters, onToggle, onClear, filterConfig }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalActive = Object.values(activeFilters).flat().length;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-base font-bold uppercase tracking-widest text-[#010526]">
          Filters
        </span>
        {totalActive > 0 && (
          <button
            onClick={onClear}
            className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider"
          >
            Clear all ({totalActive})
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {totalActive > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(activeFilters).flatMap(([filterId, values]) =>
            values.map((val) => (
              <button
                key={`${filterId}-${val}`}
                onClick={() => onToggle(filterId, val)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#010526] text-white text-sm font-semibold tracking-wide"
              >
                {val}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ))
          )}
        </div>
      )}

      {/* Sections */}
      <div className="divide-y divide-[#010526]/10">
        {filterConfig.map((filter) => {
          const isOpen = !!openSections[filter.id];
          const activeCount = activeFilters[filter.id]?.length ?? 0;
          return (
            <div key={filter.id}>
              <button
                onClick={() => toggleSection(filter.id)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="text-base font-bold uppercase tracking-widest text-[#010526]">
                  {filter.label}
                  {activeCount > 0 && (
                    <span className="ml-2 text-xs font-bold bg-[#010526] text-white px-2 py-0.5 rounded-full">
                      {activeCount}
                    </span>
                  )}
                </span>
                {isOpen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-[400px] pb-4" : "max-h-0"
                }`}
              >
                <div className="flex flex-col gap-3">
                  {filter.options.map((option) => {
                    const checked = activeFilters[filter.id]?.includes(option) ?? false;
                    return (
                      <label
                        key={option}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => onToggle(filter.id, option)}
                      >
                        <span
                          className={`w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                            checked ? "bg-[#010526] border-[#010526]" : "border-[#010526]/30 group-hover:border-[#010526]"
                          }`}
                        >
                          {checked && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-base font-medium transition-colors ${
                            checked ? "text-[#010526]" : "text-[#010526]/70 group-hover:text-[#010526]"
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
