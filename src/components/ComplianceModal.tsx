import React from 'react';
import { X, ShieldCheck, Scale, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  grossLeverage: number;
  navCr: number;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  grossLeverage,
  navCr
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
                SEBI Category III AIF / SIF Regulatory Envelope
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Real-time risk boundary enforcement & tax gate parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-4 text-xs">
          {/* Section 1: Leverage Envelope */}
          <div className="bg-[#0A0F1A] border border-[#1E293B] rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#F8FAFC] flex items-center space-x-1.5">
                <Scale className="w-4 h-4 text-[#38BDF8]" />
                <span>Gross Leverage Cap (SEBI Circular CIR/IMD/DF/10/2013)</span>
              </span>
              <span className="font-mono text-[#34D399] font-bold">
                Current: {grossLeverage.toFixed(1)}x / 2.0x Max
              </span>
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              Cat III AIFs are permitted leverage up to 200% of Net Asset Value (NAV). StackGuard's Pre-Trade Netting Gate verifies all pending delta and derivatives exposure across Alpha, Beta, and Gamma strategies prior to child slice routing.
            </p>
          </div>

          {/* Section 2: Single Issuer Concentration */}
          <div className="bg-[#0A0F1A] border border-[#1E293B] rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#F8FAFC] flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Concentration Limits by Rating</span>
              </span>
              <span className="font-mono text-[#38BDF8]">Strict Portfolio Level</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px] text-center">
              <div className="p-2 rounded bg-[#0D131F] border border-[#1E293B]/70">
                <div className="text-[10px] text-[#64748B] font-sans">AAA Rated</div>
                <div className="text-[#F8FAFC] font-bold mt-0.5">20.0% Limit</div>
              </div>
              <div className="p-2 rounded bg-[#0D131F] border border-[#1E293B]/70">
                <div className="text-[10px] text-[#64748B] font-sans">AA Rated</div>
                <div className="text-amber-400 font-bold mt-0.5">16.0% Limit</div>
              </div>
              <div className="p-2 rounded bg-[#0D131F] border border-[#1E293B]/70">
                <div className="text-[10px] text-[#64748B] font-sans">A & Below</div>
                <div className="text-[#EF4444] font-bold mt-0.5">12.0% Limit</div>
              </div>
            </div>
          </div>

          {/* Section 3: Wash Trade Prevention (PFUTP) */}
          <div className="bg-[#0A0F1A] border border-[#1E293B] rounded p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#F8FAFC]">
                SEBI PFUTP Regulation 4(2)(a) — Zero Wash Trading
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#064E3B] text-[#34D399]">
                ZERO TOLERANCE
              </span>
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              When Strategy Alpha places a BUY order and Strategy Beta concurrently requests a SELL on the same ISIN, sending both to the exchange creates simulated artificial volume (wash trading violation). StackGuard intercepts and executes an <strong>internal book transfer</strong>, avoiding exchange STT, clearing charges, and regulatory audit scrutiny.
            </p>
          </div>

          {/* Section 4: Tax Barrier Lock */}
          <div className="bg-[#0A0F1A] border border-[#1E293B] rounded p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-[#F8FAFC]">
                Section 112A vs 111A Tax-Loss & Gain Barrier Optimization
              </span>
              <span className="font-mono text-amber-400 font-semibold">12.5% vs 20%</span>
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              Equities held past 365 days qualify for Long-Term Capital Gains (LTCG @ 12.5% post-Finance Act 2024) instead of Short-Term Capital Gains (STCG @ 20%). The Rebalance Trigger Scorer penalizes rebalance urgency if liquidating a lot within 14 days of the 365-day boundary saves more in taxes than the expected alpha drift.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-mono">
            Compliance Engine: Real-time Pre-Trade OMS Hook
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#38BDF8] text-[#080C14] font-semibold hover:bg-[#38BDF8]/90 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
