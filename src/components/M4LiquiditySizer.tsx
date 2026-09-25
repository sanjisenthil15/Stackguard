import React from 'react';
import { ShieldAlert, CheckCircle2, TrendingUp, DollarSign, Wallet } from 'lucide-react';

interface M4LiquiditySizerProps {
  currentLiquidityCr: number;
  targetLiquidityCr: number;
  trepsYieldPercent: number;
  outflowVarCr: number;
  totalNavCr: number;
}

export const M4LiquiditySizer: React.FC<M4LiquiditySizerProps> = ({
  currentLiquidityCr,
  targetLiquidityCr,
  trepsYieldPercent,
  outflowVarCr,
  totalNavCr
}) => {
  const isDeficit = currentLiquidityCr < targetLiquidityCr;
  const deficitCr = targetLiquidityCr - currentLiquidityCr;
  const coveragePercent = targetLiquidityCr > 0 ? (currentLiquidityCr / targetLiquidityCr) * 100 : 100;
  
  // Percent of total fund in liquid sleeve
  const sleeveNavPercent = totalNavCr > 0 ? (currentLiquidityCr / totalNavCr) * 100 : 0;
  const targetNavPercent = totalNavCr > 0 ? (targetLiquidityCr / totalNavCr) * 100 : 0;

  return (
    <div className="bg-[#0E1626] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
      {/* Top subtle glow */}
      <div className={`absolute top-0 right-0 w-28 h-28 ${isDeficit ? 'bg-red-500/5' : 'bg-emerald-500/5'} rounded-full blur-2xl pointer-events-none`} />

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              M4: REDEMPTION LIQUIDITY SIZER
            </h2>
          </div>
          {isDeficit ? (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-red-950/70 text-[#EF4444] border border-[#EF4444]/40 flex items-center space-x-1 animate-pulse">
              <ShieldAlert className="w-3 h-3 inline mr-1 text-[#EF4444]" />
              DEFICIT_TRIM_REQUIRED
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#064E3B] text-[#34D399] border border-[#10B981]/40 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 inline mr-1 text-[#34D399]" />
              SURPLUS LIQUIDITY
            </span>
          )}
        </div>

        {/* Hero metric */}
        <div className="mb-2">
          <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tracking-tight tabular-nums flex items-baseline space-x-2">
            <span>₹{currentLiquidityCr.toFixed(2)} Cr</span>
            <span className="text-base font-medium text-[#64748B]">
              / ₹{targetLiquidityCr.toFixed(2)} Cr Target
            </span>
          </div>
          <div className="text-xs text-[#94A3B8] mt-1 font-medium flex items-center justify-between">
            <span>
              {isDeficit ? (
                <span className="text-[#EF4444] font-semibold">
                  Trim Required: ₹{deficitCr.toFixed(2)} Cr to meet Bayesian outflow VaR
                </span>
              ) : (
                <span className="text-[#34D399] font-semibold">
                  Sleeve Buffer Healthy (+₹{Math.abs(deficitCr).toFixed(2)} Cr above target)
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] text-[#64748B]">
              {coveragePercent.toFixed(1)}% Funded
            </span>
          </div>
        </div>

        {/* Supporting detail stats */}
        <div className="grid grid-cols-2 gap-2 bg-[#0A0F1A] border border-[#1E293B]/60 rounded p-2 mb-3.5 font-mono text-xs">
          <div>
            <div className="text-[10px] uppercase font-sans text-[#64748B] font-semibold tracking-wider">
              95% 5D Outflow VaR
            </div>
            <div className="text-[#F8FAFC] font-semibold mt-0.5 tabular-nums">
              ₹{outflowVarCr.toFixed(2)} Cr ({((outflowVarCr / totalNavCr) * 100).toFixed(1)}% NAV)
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-sans text-[#64748B] font-semibold tracking-wider">
              TREPS / Overnight Yield
            </div>
            <div className="text-[#34D399] font-semibold mt-0.5 tabular-nums">
              {trepsYieldPercent.toFixed(2)}% p.a.
            </div>
          </div>
        </div>
      </div>

      {/* Progress / Area bar visualization */}
      <div className="bg-[#0A0F1A] border border-[#1E293B]/70 rounded p-3">
        <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-[#64748B] tracking-wider mb-2 font-mono">
          <span>Current Sleeve ({sleeveNavPercent.toFixed(1)}% NAV)</span>
          <span className="text-amber-400">Target ({targetNavPercent.toFixed(1)}% NAV)</span>
        </div>

        {/* Multi-tier horizontal bar */}
        <div className="relative w-full h-5 bg-[#080C14] rounded overflow-hidden border border-[#1E293B]">
          {/* Target marker line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            style={{ left: `${Math.min(100, Math.max(0, (targetLiquidityCr / 16.0) * 100))}%` }}
            title={`Target: ₹${targetLiquidityCr.toFixed(2)} Cr`}
          />

          {/* Current progress fill */}
          <div
            className={`h-full transition-all duration-700 rounded-sm ${
              isDeficit
                ? 'bg-gradient-to-r from-sky-500/60 via-amber-500/70 to-[#EF4444]'
                : 'bg-gradient-to-r from-sky-500/70 via-emerald-500/70 to-[#10B981]'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, (currentLiquidityCr / 16.0) * 100))}%` }}
          />
        </div>

        {/* Legend / Tiers */}
        <div className="flex items-center justify-between text-[9px] text-[#64748B] font-mono mt-2">
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-xs bg-sky-400 inline-block" />
            <span>Overnight TREPS (₹{(currentLiquidityCr * 0.65).toFixed(1)} Cr)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-xs bg-[#10B981] inline-block" />
            <span>Liquid Bees ETF (₹{(currentLiquidityCr * 0.35).toFixed(1)} Cr)</span>
          </div>
          <div className="flex items-center space-x-1 text-amber-400">
            <span className="w-2 h-0.5 bg-amber-400 inline-block" />
            <span>Target Line</span>
          </div>
        </div>
      </div>
    </div>
  );
};
