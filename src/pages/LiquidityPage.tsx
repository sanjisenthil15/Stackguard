import React, { useState } from 'react';
import {
  Wallet,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiquidityPage: React.FC = () => {
  const {
    navCr,
    currentLiquidityCr,
    targetLiquidityCr,
    trepsYieldPercent,
    outflowVarCr,
    redemptions,
    addRedemptionRequest
  } = useApp();

  const [lpName, setLpName] = useState('Edelweiss Multi-Strategy Fund of Funds');
  const [amountCr, setAmountCr] = useState(1.20);
  const [successToast, setSuccessToast] = useState(false);

  const isDeficit = currentLiquidityCr < targetLiquidityCr;
  const deficitCr = targetLiquidityCr - currentLiquidityCr;
  const coveragePercent = targetLiquidityCr > 0 ? (currentLiquidityCr / targetLiquidityCr) * 100 : 100;

  const handleSimulateRedemption = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountCr <= 0) return;

    addRedemptionRequest(lpName, amountCr);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-950 text-[#38BDF8] border border-[#38BDF8]/30">
            MODULE 4
          </span>
          <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            Redemption Liquidity Sizer & Outflow VaR
          </h1>
        </div>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Bayesian forecasting model maintaining unencumbered cash & TREPS to honor LP redemptions without fire-sale slippage.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              <span>Current Liquid Sleeve</span>
              <Wallet className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tabular-nums">
              ₹{currentLiquidityCr.toFixed(2)} Cr
            </div>
            <div className="text-xs text-[#94A3B8] mt-1">
              {((currentLiquidityCr / navCr) * 100).toFixed(1)}% of total fund NAV (₹{navCr.toFixed(1)} Cr)
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#64748B]">
            TREPS Overnight Yield: <span className="text-[#34D399] font-bold">{trepsYieldPercent.toFixed(2)}% p.a.</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              <span>Bayesian Target Sleeve</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-amber-400 tabular-nums">
              ₹{targetLiquidityCr.toFixed(2)} Cr
            </div>
            <div className="text-xs text-[#94A3B8] mt-1">
              95% 5-Day Outflow VaR: ₹{outflowVarCr.toFixed(2)} Cr
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#64748B]">
            Active Redemptions Queued: <span className="text-[#F8FAFC] font-bold">{redemptions.length} notices</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              <span>Sleeve Health Status</span>
              {isDeficit ? (
                <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
              )}
            </div>
            <div className="mt-1">
              <span
                className={`inline-block px-2.5 py-1 rounded text-xs font-bold font-mono tracking-wider uppercase ${
                  isDeficit
                    ? 'bg-red-950 text-[#EF4444] border border-[#EF4444]/40 animate-pulse'
                    : 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/30'
                }`}
              >
                {isDeficit ? 'DEFICIT_TRIM_REQUIRED' : 'SURPLUS LIQUIDITY'}
              </span>
            </div>
            <div className="text-xs text-[#94A3B8] mt-2 font-mono">
              {isDeficit
                ? `Trim Required: ₹${deficitCr.toFixed(2)} Cr`
                : `Surplus Buffer: +₹${Math.abs(deficitCr).toFixed(2)} Cr`}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#64748B]">
            Coverage: <span className="text-[#F8FAFC] font-bold">{coveragePercent.toFixed(1)}% funded</span>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar & Tier Breakdown */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-3 pb-2 border-b border-[#1E293B] flex items-center justify-between">
          <span>Liquid Sleeve Allocation & Convergence Progress</span>
          <span className="text-[10px] font-mono text-[#64748B]">Target Convergence</span>
        </h2>

        {/* Multi-tier horizontal bar */}
        <div className="relative w-full h-7 bg-[#080C14] rounded-lg overflow-hidden border border-[#1E293B]">
          {/* Target marker line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-400 z-20 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
            style={{ left: `${Math.min(98, Math.max(2, (targetLiquidityCr / 18.0) * 100))}%` }}
            title={`Bayesian Target: ₹${targetLiquidityCr.toFixed(2)} Cr`}
          />

          {/* Current progress fill */}
          <div
            className={`h-full transition-all duration-700 ${
              isDeficit
                ? 'bg-gradient-to-r from-sky-500/70 via-amber-500/80 to-[#EF4444]'
                : 'bg-gradient-to-r from-sky-500/80 via-emerald-500/80 to-[#10B981]'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, (currentLiquidityCr / 18.0) * 100))}%` }}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#94A3B8] mt-3 pt-2 border-t border-[#1E293B]/70">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-400 inline-block" />
            <span>Overnight Clearing TREPS (₹{(currentLiquidityCr * 0.65).toFixed(2)} Cr)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981] inline-block" />
            <span>Nifty Liquid Bees ETF (₹{(currentLiquidityCr * 0.35).toFixed(2)} Cr)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
            <span className="w-2.5 h-1 bg-amber-400 inline-block" />
            <span>Target Line (₹{targetLiquidityCr.toFixed(2)} Cr)</span>
          </div>
        </div>
      </div>

      {/* Redemption Simulation Form & Notice Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Simulation Form (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-[#38BDF8]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                  Simulate LP Redemption Request
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#38BDF8]">
                DYNAMIC TEST
              </span>
            </div>

            <form onSubmit={handleSimulateRedemption} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Institutional LP Name
                </label>
                <input
                  type="text"
                  required
                  value={lpName}
                  onChange={(e) => setLpName(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-2.5 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Redemption Amount (₹ Crores)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-xs text-[#64748B]">₹</span>
                  <input
                    type="number"
                    step="0.10"
                    min="0.1"
                    max="10.0"
                    required
                    value={amountCr}
                    onChange={(e) => setAmountCr(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg py-2.5 pl-7 pr-3 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3 text-xs font-mono text-[#94A3B8] space-y-1">
                <div>Settlement: T+2 Working Days</div>
                <div>Impact: Bayesian Forecast Target will expand by ~₹{(amountCr * 0.6).toFixed(2)} Cr</div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#080C14] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all active:scale-[0.99]"
              >
                Simulate Redemption Request
              </button>
            </form>

            {successToast && (
              <div className="mt-3 p-2 bg-[#064E3B] border border-[#10B981]/40 rounded text-xs text-[#34D399] font-mono flex items-center space-x-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Notice queued! Target liquidity sleeve expanded live.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E293B] text-[10px] text-[#64748B] font-mono">
            SEBI AIF Liquidity Management Framework (Circular SEBI/HO/IMD/DF6/CIR/P/2021/632)
          </div>
        </div>

        {/* Active Notices Queue (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Active LP Redemption Notice Queue ({redemptions.length})
            </h2>
            <span className="text-[10px] font-mono text-[#64748B]">
              T+2 SETTLEMENT CYCLE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-[#64748B] bg-[#0A0F1A]/80 font-sans">
                  <th className="py-2 px-3 font-semibold">NOTICE ID</th>
                  <th className="py-2 px-3 font-semibold">LP ENTITY</th>
                  <th className="py-2 px-3 font-semibold text-right font-mono">AMOUNT</th>
                  <th className="py-2 px-3 font-semibold font-mono">REQUEST DATE</th>
                  <th className="py-2 px-3 font-semibold font-mono">SETTLEMENT</th>
                  <th className="py-2 px-3 font-semibold text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/40 font-mono text-[11px]">
                {redemptions.map((red) => (
                  <tr key={red.id} className="hover:bg-[#0A0F1A] transition-colors">
                    <td className="py-2.5 px-3 text-[#38BDF8] font-bold">
                      {red.id}
                    </td>
                    <td className="py-2.5 px-3 font-sans font-medium text-[#F8FAFC]">
                      {red.lpName}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums text-amber-400">
                      ₹{red.amountCr.toFixed(2)} Cr
                    </td>
                    <td className="py-2.5 px-3 text-[#64748B]">
                      {red.requestDate}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {red.settlementDate}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold font-sans tracking-wider uppercase bg-amber-950 text-amber-300 border border-amber-500/30">
                        {red.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
