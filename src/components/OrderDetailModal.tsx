import React from 'react';
import { X, ArrowRightLeft, ShieldCheck, Check, DollarSign } from 'lucide-react';
import { NettedOrder } from '../types';

interface OrderDetailModalProps {
  order: NettedOrder | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const totalRaw = Math.abs(order.alphaQty) + Math.abs(order.betaQty) + Math.abs(order.gammaQty);
  const netVolume = Math.abs(order.netQty);
  const savingsPct = totalRaw > 0 ? ((1 - netVolume / totalRaw) * 100).toFixed(1) : '0';
  const turnoverInr = totalRaw * order.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-lg w-full max-w-lg shadow-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC] uppercase font-mono">
                Order Cross Breakdown: {order.symbol}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                ID: {order.id} | Timestamp: {order.timestamp}
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

        {/* Breakdown Card */}
        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2 bg-[#0A0F1A] border border-[#1E293B] rounded p-2.5 text-center font-mono">
            <div>
              <div className="text-[10px] text-[#38BDF8] font-sans font-semibold">Alpha Momentum</div>
              <div className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                {order.alphaQty > 0 ? `+${order.alphaQty}` : order.alphaQty}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-sans font-semibold">Beta StatArb</div>
              <div className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                {order.betaQty > 0 ? `+${order.betaQty}` : order.betaQty}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#A855F7] font-sans font-semibold">Gamma Neutral</div>
              <div className="text-sm font-bold text-[#F8FAFC] mt-0.5">
                {order.gammaQty > 0 ? `+${order.gammaQty}` : order.gammaQty}
              </div>
            </div>
          </div>

          {/* Outcome Flow */}
          <div className="bg-[#0A0F1A] border border-[#1E293B] rounded p-3">
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-[#94A3B8]">Gross Internal Volume:</span>
              <span className="text-[#F8FAFC] font-semibold">{totalRaw} units</span>
            </div>
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-[#94A3B8]">Exchange Market Order (Net):</span>
              <span className="text-[#38BDF8] font-bold">
                {order.netQty > 0 ? `+${order.netQty}` : order.netQty} units
              </span>
            </div>
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-[#94A3B8]">Internal Cross Reduction:</span>
              <span className="text-[#10B981] font-bold">{savingsPct}% Netting</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-2 border-t border-[#1E293B]">
              <span className="text-[#94A3B8]">Securities Transaction Tax Saved:</span>
              <span className="text-[#34D399] font-bold">₹{order.sttSavedInr.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-[#94A3B8] bg-[#064E3B]/30 border border-[#10B981]/30 rounded p-2">
            <ShieldCheck className="w-4 h-4 text-[#34D399] shrink-0" />
            <span>
              Internal ledger offset completed with zero market footprint and zero wash-trading contra-risk under SEBI regulations.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#1E293B] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold text-[#F8FAFC] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
