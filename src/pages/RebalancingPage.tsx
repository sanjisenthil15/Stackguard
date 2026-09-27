import React from 'react';
import {
  Target,
  Lock,
  Unlock,
  RefreshCw,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingDown,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { useApp } from '../context/AppContext';

export const RebalancingPage: React.FC = () => {
  const {
    triggerScore,
    triggerCeiling,
    triggerHistory,
    taxLots,
    forceRebalance,
    isRebalancing,
    marketRegime
  } = useApp();

  const isTriggered = triggerScore >= triggerCeiling;
  const driftPart = triggerScore * 0.45;
  const liqPart = triggerScore * 0.35;
  const taxPart = triggerScore * 0.20;

  const totalTaxSavedPotential = taxLots.reduce((acc, t) => acc + (t.taxLocked ? t.potentialTaxSaved : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950/70 text-amber-300 border border-amber-500/30">
              MODULE 3
            </span>
            <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
              Rebalance Trigger Scorer & Tax-Lot Gate
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Composite urgency gate balancing portfolio drift, execution friction, and Indian Income Tax Section 112A/111A LTCG barriers.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={forceRebalance}
          disabled={isRebalancing}
          className="flex items-center space-x-2 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#080C14] font-black text-xs px-4 py-2.5 rounded-lg shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRebalancing ? 'animate-spin' : ''}`} />
          <span>{isRebalancing ? 'Executing Portfolio Rebalance...' : 'Force Rebalance Now'}</span>
        </button>
      </div>

      {/* Top Hero Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Composite Urgency Gauge Card */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              <span>Urgency Score</span>
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tabular-nums flex items-baseline space-x-1">
              <span>{triggerScore.toFixed(2)}</span>
              <span className="text-xs font-normal text-[#64748B]">/ {triggerCeiling.toFixed(0)}</span>
            </div>
            <div className="mt-1">
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-sans tracking-wider uppercase ${
                  isTriggered
                    ? 'bg-red-950 text-[#EF4444] border border-[#EF4444]/40 animate-pulse'
                    : 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/30'
                }`}
              >
                {isTriggered ? 'AUTO-TRIGGER BREACH' : 'SUB-THRESHOLD OK'}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B] text-[10px] text-[#64748B] font-mono">
            Market Regime: <span className="text-[#F8FAFC]">{marketRegime}</span>
          </div>
        </div>

        {/* Component 1: Drift */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between font-mono">
          <div>
            <div className="text-xs text-[#94A3B8] font-sans font-semibold uppercase tracking-wider mb-1">
              Drift Component (45%)
            </div>
            <div className="text-2xl font-extrabold text-[#F8FAFC] tabular-nums">
              {driftPart.toFixed(2)} pts
            </div>
            <p className="text-[11px] text-[#64748B] font-sans mt-1">
              Deviation from CVXPY target allocations across strategies.
            </p>
          </div>
          <div className="w-full bg-[#080C14] h-1.5 rounded overflow-hidden mt-3 border border-[#1E293B]">
            <div className="bg-[#38BDF8] h-full" style={{ width: `${Math.min(100, (driftPart / 30) * 100)}%` }} />
          </div>
        </div>

        {/* Component 2: Liquidity */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between font-mono">
          <div>
            <div className="text-xs text-[#94A3B8] font-sans font-semibold uppercase tracking-wider mb-1">
              Liquidity Friction (35%)
            </div>
            <div className="text-2xl font-extrabold text-[#F8FAFC] tabular-nums">
              {liqPart.toFixed(2)} pts
            </div>
            <p className="text-[11px] text-[#64748B] font-sans mt-1">
              Bid-ask spread costs and market depth impedance penalty.
            </p>
          </div>
          <div className="w-full bg-[#080C14] h-1.5 rounded overflow-hidden mt-3 border border-[#1E293B]">
            <div className="bg-amber-400 h-full" style={{ width: `${Math.min(100, (liqPart / 25) * 100)}%` }} />
          </div>
        </div>

        {/* Component 3: Tax-Lot */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between text-xs text-[#94A3B8] font-sans font-semibold uppercase tracking-wider mb-1">
              <span>Tax Barrier (20%)</span>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400 tabular-nums">
              {taxPart.toFixed(2)} pts
            </div>
            <p className="text-[11px] text-[#64748B] font-sans mt-1">
              Potential tax saved if delayed: <strong className="text-[#34D399]">₹{totalTaxSavedPotential.toLocaleString('en-IN')}</strong>
            </p>
          </div>
          <div className="w-full bg-[#080C14] h-1.5 rounded overflow-hidden mt-3 border border-[#1E293B]">
            <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, (taxPart / 20) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Area Chart: Score vs Ceiling */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Historical Urgency Trajectory vs Rebalance Ceiling
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Execution gate only dispenses rebalance child baskets when the composite curve pierces the red ceiling.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#EF4444] font-bold">
            CEILING: {triggerCeiling.toFixed(0)} PTS
          </span>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={triggerHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rebalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isTriggered ? "#EF4444" : "#38BDF8"} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={isTriggered ? "#EF4444" : "#38BDF8"} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#1E293B' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={10}
                domain={[0, Math.max(triggerCeiling + 15, 80)]}
                tickLine={false}
                axisLine={{ stroke: '#1E293B' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0F1A',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px'
                }}
                formatter={(val: any) => [`${Number(val).toFixed(2)} pts`, 'Urgency Score']}
              />
              <ReferenceLine
                y={triggerCeiling}
                stroke="#EF4444"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Rebalance Ceiling: ${triggerCeiling}`,
                  fill: '#EF4444',
                  fontSize: 10,
                  position: 'insideTopRight'
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke={isTriggered ? "#EF4444" : "#38BDF8"}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rebalGrad)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tax-Lot Timing Ledger (LTCG vs STCG Optimization) */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Indian Income Tax Section 112A / 111A Tax-Lot Ledger
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Positions approaching the 365-day holding threshold are locked against premature liquidation to capture 12.5% LTCG vs 20% STCG.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/40">
            TAX LOCK DEFENSE ACTIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-[#64748B] bg-[#0A0F1A]/80 font-sans">
                <th className="py-2.5 px-3 font-semibold">TICKER</th>
                <th className="py-2.5 px-2 font-semibold text-right font-mono">LOTS</th>
                <th className="py-2.5 px-3 font-semibold text-right font-mono">DAYS HELD</th>
                <th className="py-2.5 px-3 font-semibold text-right font-mono">DAYS TO 365D (LTCG)</th>
                <th className="py-2.5 px-3 font-semibold text-right font-mono">EST. STCG (20%)</th>
                <th className="py-2.5 px-3 font-semibold text-right font-mono">EST. LTCG (12.5%)</th>
                <th className="py-2.5 px-3 font-semibold text-right font-mono">TAX SAVED IF DELAYED</th>
                <th className="py-2.5 px-3 font-semibold text-center">LOCK STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40 font-mono text-[11px]">
              {taxLots.map((lot) => (
                <tr key={lot.ticker} className="hover:bg-[#0A0F1A] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#F8FAFC]">
                    {lot.ticker}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-300">
                    {lot.lots}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-200">
                    {lot.daysHeld} days
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-amber-400">
                    {lot.daysToLtcg > 0 ? `${lot.daysToLtcg} days remaining` : 'Matured (LTCG)'}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                    ₹{lot.stcgTaxEstimated.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-400">
                    ₹{lot.ltcgTaxEstimated.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-bold text-[#34D399]">
                    {lot.potentialTaxSaved > 0 ? `+₹${lot.potentialTaxSaved.toLocaleString('en-IN')}` : '₹0'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {lot.taxLocked ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold font-sans tracking-wider bg-amber-950 text-amber-300 border border-amber-500/40">
                        <Lock className="w-2.5 h-2.5" />
                        <span>TAX LOCKED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold font-sans tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                        <Unlock className="w-2.5 h-2.5" />
                        <span>UNLOCKED</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
