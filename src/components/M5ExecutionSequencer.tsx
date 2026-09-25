import React, { useRef } from 'react';
import { SequencerLogEntry } from '../types';
import { Zap, ShieldCheck, Sliders, ChevronRight } from 'lucide-react';

interface M5ExecutionSequencerProps {
  totalImpactSavedInr: number;
  washTradeCount: number;
  logs: SequencerLogEntry[];
  activeSlicesCount: number;
  onSelectLog?: (log: SequencerLogEntry) => void;
}

export const M5ExecutionSequencer: React.FC<M5ExecutionSequencerProps> = ({
  totalImpactSavedInr,
  washTradeCount,
  logs,
  activeSlicesCount,
  onSelectLog
}) => {
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
    }
  };

  return (
    <div className="bg-[#0E1626] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between shadow-lg relative overflow-hidden h-full">
      {/* Top subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              M5: EXECUTION SEQUENCER
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#064E3B] text-[#34D399] border border-[#10B981]/40 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 inline mr-1 text-[#34D399]" />
            {washTradeCount} WASH TRADES
          </span>
        </div>

        {/* Hero metric */}
        <div className="mb-2">
          <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tracking-tight tabular-nums flex items-baseline space-x-2">
            <span>₹{totalImpactSavedInr.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-xs text-[#94A3B8] mt-1 font-medium">
            Saved via Sqrt Impact Staggering (Almgren-Chriss Optimal Schedule)
          </div>
        </div>

        {/* Supporting detail stats */}
        <div className="flex items-center justify-between bg-[#0A0F1A] border border-[#1E293B]/60 rounded px-3 py-1.5 mb-3 font-mono text-[11px] text-[#94A3B8]">
          <span>
            Active TWAP Slices: <strong className="text-[#38BDF8]">{activeSlicesCount}</strong>
          </span>
          <span className="text-[#64748B]">|</span>
          <span>
            Wash Defense: <strong className="text-[#10B981]">STRICT PASS</strong>
          </span>
          <span className="text-[#64748B]">|</span>
          <span>
            Vol Scaling: <strong className="text-amber-400">1.14x</strong>
          </span>
        </div>
      </div>

      {/* Live Scrolling Decision Log */}
      <div className="flex flex-col flex-1 min-h-[220px]">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase mb-2">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] live-dot" />
            <span>SEQUENCER DECISION LOG</span>
          </span>
          <span className="text-[10px] text-[#64748B] font-mono">
            Auto-stream ({logs.length} events)
          </span>
        </div>

        <div className="bg-[#0A0F1A] border border-[#1E293B]/80 rounded p-2 overflow-y-auto max-h-[270px] space-y-2 flex-1 scrollbar-thin">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => onSelectLog?.(log)}
              className="p-2 rounded bg-[#0D131F]/90 hover:bg-[#121B2E] border border-[#1E293B]/50 transition-all cursor-pointer group"
            >
              {/* Top line: Dot, Timestamp, Tag, Impact */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getDotStyle(log.badgeColor)}`} />
                  <span className="font-mono text-[10px] text-[#64748B] tabular-nums">
                    {log.timestamp}
                  </span>
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded border uppercase ${getTagStyle(log.type)}`}>
                    {log.type.replace('_', ' ')}
                  </span>
                </div>
                {log.impactSavedInr && (
                  <span className="font-mono text-[10px] text-[#34D399] font-medium tabular-nums">
                    +₹{log.impactSavedInr} saved
                  </span>
                )}
              </div>

              {/* Headline */}
              <div className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors flex items-center justify-between">
                <span>{log.headline}</span>
                <ChevronRight className="w-3 h-3 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Smaller gray explanation */}
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
