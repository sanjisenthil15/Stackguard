import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRightLeft,
  Cpu,
  Target,
  Wallet,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  PlusCircle,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    navCr,
    grossLeverage,
    rawVolume,
    nettedVolume,
    sttSavedLakhs,
    alphaWeight,
    betaWeight,
    gammaWeight,
    solverStatus,
    triggerScore,
    triggerCeiling,
    taxLots,
    currentLiquidityCr,
    targetLiquidityCr,
    impactSavedInr,
    washTradesCount,
    auditLogs,
    forceRebalance,
    isRebalancing
  } = useApp();

  const reductionPercent = rawVolume > 0 ? ((1 - nettedVolume / rawVolume) * 100).toFixed(1) : '0';
  const isLiquidityDeficit = currentLiquidityCr < targetLiquidityCr;
  const isTriggerBreached = triggerScore >= triggerCeiling;
  const hasTaxLock = taxLots.some((t) => t.taxLocked);

  return (
    <div className="space-y-5">
      {/* Header Banner: Fund Overview & Health Score */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
              SEBI CAT III SIF
            </span>
            <span className="text-xs text-[#64748B] font-mono">
              FUND ID: SG-AIF-PRIME-01
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            StackGuard Multi-Strategy Command Dashboard
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Real-time pre-trade netting, convex quadratic allocation, and SEBI compliance broker envelope.
          </p>
        </div>

        {/* Health Score Pill */}
        <div className="flex items-center space-x-4">
          <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3 text-right">
            <div className="text-[10px] uppercase font-sans font-semibold text-[#64748B]">
              Fund Compliance Health
            </div>
            <div className="font-mono text-2xl font-black text-[#10B981] flex items-center justify-end space-x-1 tabular-nums">
              <span>98.6</span>
              <span className="text-xs font-normal text-[#64748B]">/ 100</span>
            </div>
            <div className="text-[10px] text-[#34D399] font-mono">
              0 Breaches | Leverage {grossLeverage.toFixed(1)}x / 2.0x
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => navigate('/orders/new')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#080C14] text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Order</span>
            </button>
            <button
              onClick={forceRebalance}
              disabled={isRebalancing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0E1626] hover:bg-[#1E293B] border border-[#1E293B] text-[#F8FAFC] text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#38BDF8] ${isRebalancing ? 'animate-spin' : ''}`} />
              <span>{isRebalancing ? 'Rebalancing...' : 'Force Rebalance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 KPI Module Tiles (Clickable to deep-dive pages) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Tile 1: M1 Netting Gate */}
        <div
          onClick={() => navigate('/exposure')}
          className="bg-[#0E1626] hover:bg-[#121B2E] border border-[#1E293B] hover:border-[#38BDF8]/50 rounded-lg p-3.5 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              <span className="flex items-center space-x-1">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>M1: Netting Gate</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#38BDF8] transition-colors" />
            </div>
            <div className="font-mono text-2xl font-black text-[#38BDF8] mt-1 tabular-nums">
              {reductionPercent}%
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">
              Volume Reduction ({rawVolume} → {nettedVolume})
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B]/70 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span>STT Saved: ₹{sttSavedLakhs.toFixed(2)}L</span>
            <span className="text-[#34D399]">PASS</span>
          </div>
        </div>

        {/* Tile 2: M2 Capital Weights */}
        <div
          onClick={() => navigate('/allocation')}
          className="bg-[#0E1626] hover:bg-[#121B2E] border border-[#1E293B] hover:border-purple-500/50 rounded-lg p-3.5 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              <span className="flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>M2: Allocator</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-purple-400 transition-colors" />
            </div>
            <div className="font-mono text-2xl font-black text-[#38BDF8] mt-1 tabular-nums">
              {alphaWeight.toFixed(1)}%
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">
              Alpha Lead | Beta {betaWeight.toFixed(0)}% | G {gammaWeight.toFixed(0)}%
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B]/70 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span>OSQP: {solverStatus}</span>
            <span className="text-purple-400">CVXPY</span>
          </div>
        </div>

        {/* Tile 3: M3 Rebalance Urgency */}
        <div
          onClick={() => navigate('/rebalancing')}
          className="bg-[#0E1626] hover:bg-[#121B2E] border border-[#1E293B] hover:border-amber-500/50 rounded-lg p-3.5 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              <span className="flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>M3: Rebalancing</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-amber-400 transition-colors" />
            </div>
            <div className="font-mono text-2xl font-black text-[#38BDF8] mt-1 tabular-nums flex items-baseline space-x-1">
              <span>{triggerScore.toFixed(1)}</span>
              <span className="text-xs font-normal text-[#64748B]">/ {triggerCeiling.toFixed(0)}</span>
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">
              {isTriggerBreached ? 'Urgency Breach Active' : 'Urgency Sub-Threshold'}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B]/70 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span className={hasTaxLock ? 'text-amber-400 font-semibold' : 'text-[#64748B]'}>
              {hasTaxLock ? 'TAX LOCK ON' : 'TAX LOCK OFF'}
            </span>
            <span className={isTriggerBreached ? 'text-[#EF4444]' : 'text-[#34D399]'}>
              {isTriggerBreached ? 'REBAL NOW' : 'OK'}
            </span>
          </div>
        </div>

        {/* Tile 4: M4 Liquidity Sizer */}
        <div
          onClick={() => navigate('/liquidity')}
          className="bg-[#0E1626] hover:bg-[#121B2E] border border-[#1E293B] hover:border-sky-500/50 rounded-lg p-3.5 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              <span className="flex items-center space-x-1">
                <Wallet className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>M4: Liquidity</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#38BDF8] transition-colors" />
            </div>
            <div className="font-mono text-2xl font-black text-[#38BDF8] mt-1 tabular-nums">
              ₹{currentLiquidityCr.toFixed(1)} Cr
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">
              Target: ₹{targetLiquidityCr.toFixed(2)} Cr
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B]/70 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span className={isLiquidityDeficit ? 'text-[#EF4444]' : 'text-[#34D399]'}>
              {isLiquidityDeficit ? 'DEFICIT_TRIM' : 'SURPLUS'}
            </span>
            <span className="text-slate-400">{((currentLiquidityCr / navCr) * 100).toFixed(0)}% NAV</span>
          </div>
        </div>

        {/* Tile 5: M5 Execution Sequencer */}
        <div
          onClick={() => navigate('/execution')}
          className="bg-[#0E1626] hover:bg-[#121B2E] border border-[#1E293B] hover:border-emerald-500/50 rounded-lg p-3.5 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              <span className="flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                <span>M5: Sequencer</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#10B981] transition-colors" />
            </div>
            <div className="font-mono text-2xl font-black text-[#38BDF8] mt-1 tabular-nums">
              ₹{impactSavedInr.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#94A3B8] mt-0.5">
              Saved via Sqrt Staggering
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B]/70 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
            <span className="text-[#34D399]">0 WASH TRADES</span>
            <span>PFUTP PASS</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Multi-Module Activity Feed & Quick Blotter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity Feed (2 Cols) */}
        <div className="lg:col-span-2 bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Live System Event Stream (Across All Modules)
              </h2>
            </div>
            <button
              onClick={() => navigate('/audit')}
              className="text-xs font-semibold text-[#38BDF8] hover:underline flex items-center space-x-1"
            >
              <span>Full Audit Trail</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
            {auditLogs.slice(0, 9).map((entry) => {
              const getDecisionBadge = (d: string) => {
                switch (d) {
                  case 'ALLOWED':
                    return 'bg-[#064E3B] text-[#34D399] border-[#10B981]/30';
                  case 'NETTED':
                    return 'bg-sky-950/70 text-[#38BDF8] border-[#38BDF8]/30';
                  case 'BLOCKED':
                    return 'bg-red-950/70 text-[#EF4444] border-[#EF4444]/40';
                  case 'WARNING':
                    return 'bg-amber-950/70 text-amber-400 border-amber-500/40';
                  case 'EXECUTED':
                    return 'bg-purple-950/70 text-purple-300 border-purple-500/40';
                  default:
                    return 'bg-slate-800 text-slate-300 border-slate-700';
                }
              };

              return (
                <div
                  key={entry.id}
                  className="bg-[#0A0F1A] border border-[#1E293B]/70 hover:border-[#1E293B] rounded-lg p-3 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] text-[#64748B]">
                        {entry.timestamp}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#0E1626] text-[#94A3B8] border border-[#1E293B]">
                        {entry.module.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${getDecisionBadge(
                          entry.decision
                        )}`}
                      >
                        {entry.decision}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      {entry.actor}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#F8FAFC]">
                    {entry.headline}
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                    {entry.details}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Strategy Snapshot & Portfolio Risk Summary */}
        <div className="space-y-4">
          <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-3 pb-2 border-b border-[#1E293B] flex items-center justify-between">
              <span>Strategy Allocation Weights</span>
              <span className="text-[10px] font-mono text-purple-400">CVXPY OSQP</span>
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#38BDF8] font-sans font-medium">Alpha Momentum (Long-Bias)</span>
                  <span className="font-bold text-[#F8FAFC] tabular-nums">{alphaWeight.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#080C14] h-2 rounded overflow-hidden border border-[#1E293B]">
                  <div className="bg-[#38BDF8] h-full" style={{ width: `${alphaWeight}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-amber-400 font-sans font-medium">Beta StatArb (Pairs/Arb)</span>
                  <span className="font-bold text-[#F8FAFC] tabular-nums">{betaWeight.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#080C14] h-2 rounded overflow-hidden border border-[#1E293B]">
                  <div className="bg-amber-400 h-full" style={{ width: `${betaWeight}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-purple-400 font-sans font-medium">Gamma Delta-Neutral</span>
                  <span className="font-bold text-[#F8FAFC] tabular-nums">{gammaWeight.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-[#080C14] h-2 rounded overflow-hidden border border-[#1E293B]">
                  <div className="bg-purple-400 h-full" style={{ width: `${gammaWeight}%` }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/allocation')}
              className="w-full mt-4 py-2 bg-[#0A0F1A] hover:bg-[#121B2E] border border-[#1E293B] rounded text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              Analyze Solver Frontier & Hit Rates →
            </button>
          </div>

          {/* Quick Regulatory Summary */}
          <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg font-mono text-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-2 font-sans">
              SEBI Category III Regulatory Bounds
            </h2>
            <div className="space-y-2 text-[#94A3B8] pt-1">
              <div className="flex items-center justify-between py-1 border-b border-[#1E293B]/50">
                <span>Gross Leverage Cap:</span>
                <span className="text-[#34D399] font-bold">1.2x (Max 2.0x)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#1E293B]/50">
                <span>AAA Single Issuer Cap:</span>
                <span className="text-[#F8FAFC] font-bold">20.0% Max</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#1E293B]/50">
                <span>AA Single Issuer Cap:</span>
                <span className="text-[#F8FAFC] font-bold">16.0% Max</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Wash Trading Defense:</span>
                <span className="text-[#34D399] font-bold">SEBI PFUTP PASS</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="w-full mt-3 py-1.5 text-[11px] text-[#38BDF8] hover:underline text-center font-sans font-semibold"
            >
              Configure Compliance Thresholds →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
