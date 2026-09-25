import React from 'react';
import { ShieldCheck, RefreshCw, Play, Pause, AlertTriangle, Layers, ChevronDown } from 'lucide-react';
import { MarketRegime } from '../types';

interface NavbarProps {
  navCr: number;
  marketRegime: MarketRegime;
  onCycleRegime: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onForceRebalance: () => void;
  isRebalancing: boolean;
  onOpenComplianceModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  navCr,
  marketRegime,
  onCycleRegime,
  isPaused,
  onTogglePause,
  onForceRebalance,
  isRebalancing,
  onOpenComplianceModal
}) => {
  const getRegimeColor = (regime: MarketRegime) => {
    switch (regime) {
      case 'BULLISH LOW-VOL':
        return 'text-[#10B981] bg-[#064E3B]/60 border-[#10B981]/30';
      case 'HIGH-VOL CHOPPY':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'BEARISH CRUNCH':
        return 'text-[#EF4444] bg-red-950/60 border-[#EF4444]/30';
    }
  };

  const getDotColor = (regime: MarketRegime) => {
    switch (regime) {
      case 'BULLISH LOW-VOL':
        return 'bg-[#10B981]';
      case 'HIGH-VOL CHOPPY':
        return 'bg-amber-400';
      case 'BEARISH CRUNCH':
        return 'bg-[#EF4444]';
    }
  };

  return (
    <header className="h-[50px] bg-[#0D131F] border-b border-[#1E293B] px-4 flex items-center justify-between sticky top-0 z-50 select-none">
      {/* Left: Brand + SEBI Pill */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-extrabold text-base tracking-wider text-[#F8FAFC]">
              STACK<span className="text-[#38BDF8]">GUARD</span>
            </span>
            <span className="text-xs font-semibold text-[#94A3B8] tracking-widest uppercase">
              AIF
            </span>
          </div>
        </div>

        <button
          onClick={onOpenComplianceModal}
          title="Click to view Category III AIF Regulatory Envelope"
          className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-[#0E1626] text-[#38BDF8] border border-[#1E293B] hover:border-[#38BDF8]/50 transition-colors"
        >
          SEBI CAT III / SIF
        </button>
      </div>

      {/* Center: NAV Monospace + Market Regime */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-xs text-[#94A3B8]">
          <span className="hidden md:inline uppercase text-[11px] font-medium tracking-wider">Fund NAV:</span>
          <span className="font-mono text-[#F8FAFC] font-bold text-sm bg-[#080C14] px-2 py-0.5 rounded border border-[#1E293B]/70 tabular-nums">
            ₹{navCr.toFixed(2)} Cr
          </span>
        </div>

        {/* Regime Indicator / Switcher */}
        <button
          onClick={onCycleRegime}
          title="Click to switch market regime simulation"
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-semibold tracking-wide border cursor-pointer hover:opacity-90 transition-all ${getRegimeColor(
            marketRegime
          )}`}
        >
          <span className={`w-2 h-2 rounded-full live-dot ${getDotColor(marketRegime)}`} />
          <span className="uppercase">{marketRegime}</span>
          <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
        </button>
      </div>

      {/* Right: Simulation Controls + Force Rebalance */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onTogglePause}
          title={isPaused ? "Resume Live Tick Simulation" : "Pause Live Tick Simulation"}
          className={`p-1.5 rounded text-xs border transition-colors flex items-center justify-center ${
            isPaused
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
              : 'bg-[#0E1626] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-slate-600'
          }`}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onForceRebalance}
          disabled={isRebalancing}
          className={`flex items-center space-x-1.5 bg-[#38BDF8] text-[#080C14] font-semibold text-xs px-3.5 py-1.5 rounded shadow-sm transition-all duration-150 hover:bg-[#38BDF8]/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRebalancing ? 'animate-spin' : ''}`} />
          <span>{isRebalancing ? 'Rebalancing...' : 'Force Rebalance'}</span>
        </button>
      </div>
    </header>
  );
};
