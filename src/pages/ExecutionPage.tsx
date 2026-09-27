import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Filter,
  ArrowRightLeft,
  Clock,
  Layers,
  ChevronRight,
  TrendingDown,
  Activity,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SequencerLogEntry } from '../types';

export const ExecutionPage: React.FC = () => {
  const {
    sequencerLogs,
    impactSavedInr,
    washTradesCount,
    activeTwapSlices
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WASH_BLOCKED' | 'TWAP_SLICE' | 'NET_INTERNAL'>('ALL');

  const filteredLogs = sequencerLogs.filter((log) => {
    if (activeFilter === 'ALL') return true;
    return log.type === activeFilter;
  });

  const getDotStyle = (color: SequencerLogEntry['badgeColor']) => {
    switch (color) {
      case 'red':
        return 'bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.7)]';
      case 'blue':
        return 'bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.7)]';
      case 'amber':
        return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]';
      case 'green':
        return 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.7)]';
      case 'purple':
        return 'bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.7)]';
    }
  };

  const getTagStyle = (type: SequencerLogEntry['type']) => {
    switch (type) {
      case 'WASH_BLOCKED':
        return 'text-[#EF4444] bg-red-950/60 border-[#EF4444]/30';
      case 'TWAP_SLICE':
        return 'text-[#38BDF8] bg-sky-950/60 border-[#38BDF8]/30';
      case 'THROTTLE_VOL':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'NET_INTERNAL':
        return 'text-[#34D399] bg-[#064E3B]/60 border-[#10B981]/30';
      case 'REBALANCE_EXEC':
        return 'text-[#C084FC] bg-[#3B0764]/60 border-[#A855F7]/30';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950 text-[#34D399] border border-[#10B981]/30">
            MODULE 5
          </span>
          <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            Execution Sequencer & Wash-Trade Defense
          </h1>
        </div>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Square-Root Market Impact schedule (Almgren-Chriss) and real-time contra-order wash trade block under SEBI PFUTP.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              <span>Cumulative Impact Saved</span>
              <Zap className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tabular-nums">
              ₹{impactSavedInr.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-[#94A3B8] mt-1">
              Saved via Sqrt Staggering schedule across child slices
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#64748B]">
            Algorithm: <span className="text-[#F8FAFC]">Almgren-Chriss Sqrt Optimal Schedule</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              <span>Wash Trading Defense</span>
              <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-[#34D399] tabular-nums">
              {washTradesCount} WASH TRADES
            </div>
            <div className="text-xs text-[#94A3B8] mt-1">
              Strict Zero-Tolerance contra-crossing block
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#64748B]">
            Regulatory Mandate: <span className="text-[#34D399]">SEBI PFUTP Reg 4(2)(a) PASS</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
              <span>Active TWAP Child Baskets</span>
              <Layers className="w-4 h-4 text-[#F8FAFC]" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
              {activeTwapSlices.length} Active
            </div>
            <div className="text-xs text-[#94A3B8] mt-1">
              Dispatched across NSE DMA algorithms
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#64748B]">
            Execution Benchmark: <span className="text-[#38BDF8]">VWAP / Interval DMA</span>
          </div>
        </div>
      </div>

      {/* Active TWAP Slice Progress Bars */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-3 pb-2 border-b border-[#1E293B] flex items-center justify-between">
          <span>Active Child Basket TWAP Progress</span>
          <span className="text-[10px] font-mono text-[#38BDF8]">Real-Time DMA Slice Fill</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTwapSlices.map((slice) => {
            const pct = Math.round((slice.filled / slice.total) * 100);
            return (
              <div key={slice.symbol} className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3 font-mono text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#F8FAFC] font-sans">{slice.symbol}</span>
                  <span className="text-[#38BDF8] font-bold">{pct}% Fill</span>
                </div>
                <div className="text-[11px] text-[#64748B] mb-2 font-sans">
                  Mandate: {slice.strategy}
                </div>
                <div className="w-full bg-[#080C14] h-2 rounded overflow-hidden border border-[#1E293B]">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-[#38BDF8] h-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1.5">
                  <span>Filled: {slice.filled} units</span>
                  <span>Total: {slice.total} units</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Sequencer Decision Stream */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E293B] mb-3 gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Sequencer Decision Stream ({filteredLogs.length} Events)
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Sub-second algorithmic audit of staggered child dispatches and cross-mandate netting.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-[11px] font-mono">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'ALL'
                  ? 'bg-[#38BDF8] text-[#080C14] font-bold'
                  : 'bg-[#0A0F1A] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setActiveFilter('WASH_BLOCKED')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'WASH_BLOCKED'
                  ? 'bg-[#EF4444] text-white font-bold'
                  : 'bg-[#0A0F1A] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              WASH BLOCKED
            </button>
            <button
              onClick={() => setActiveFilter('TWAP_SLICE')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'TWAP_SLICE'
                  ? 'bg-[#38BDF8] text-[#080C14] font-bold'
                  : 'bg-[#0A0F1A] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              TWAP
            </button>
            <button
              onClick={() => setActiveFilter('NET_INTERNAL')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'NET_INTERNAL'
                  ? 'bg-[#10B981] text-[#080C14] font-bold'
                  : 'bg-[#0A0F1A] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              INTERNAL CROSS
            </button>
          </div>
        </div>

        <div className="space-y-2.5 overflow-y-auto max-h-[440px] pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-[#0A0F1A] border border-[#1E293B]/70 rounded-lg p-3 hover:border-[#1E293B] transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getDotStyle(log.badgeColor)}`} />
                  <span className="font-mono text-[10px] text-[#64748B]">{log.timestamp}</span>
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded border uppercase ${getTagStyle(log.type)}`}>
                    {log.type.replace('_', ' ')}
                  </span>
                  {log.symbol && (
                    <span className="font-mono text-xs font-bold text-[#F8FAFC]">
                      {log.symbol}
                    </span>
                  )}
                </div>
                {log.impactSavedInr && (
                  <span className="font-mono text-xs text-[#34D399] font-bold tabular-nums">
                    +₹{log.impactSavedInr} saved
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-[#F8FAFC] mt-1">
                {log.headline}
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed font-sans">
                {log.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
