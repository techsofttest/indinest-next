import React from 'react';
import { Check } from 'lucide-react';

export type CheckoutStep = 'Information' | 'Shipping' | 'Payment' | 'Confirmation';

interface CheckoutProgressBarProps {
  currentStep: CheckoutStep;
  steps: CheckoutStep[];
}

export default function CheckoutProgressBar({ currentStep, steps }: CheckoutProgressBarProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full flex items-center justify-between relative mb-10 mt-4">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#010526]/10 -translate-y-1/2 z-0" />

      {/* Active Line (progress) */}
      <div
        className="absolute top-1/2 left-0 h-[1px] bg-[#010526] -translate-y-1/2 z-0 transition-all duration-500"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2 md:px-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${isCompleted
                  ? 'bg-[#010526] text-white border border-[#010526]'
                  : isActive
                    ? 'bg-white text-[#010526] border-[2px] border-[#010526]'
                    : 'bg-white text-[#010526]/40 border border-[#010526]/20'
                }`}
            >
              {isCompleted ? <Check size={14} strokeWidth={3} /> : index + 1}
            </div>
            <span
              className={`text-[10px] md:text-xs uppercase tracking-widest font-bold transition-colors duration-300 ${isActive || isCompleted ? 'text-[#010526]' : 'text-[#010526]/40'
                }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
