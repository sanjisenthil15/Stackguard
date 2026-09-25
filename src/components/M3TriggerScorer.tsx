import React from 'react';
import { TriggerScoreHistoryPoint, TaxLotInfo } from '../types';
import { Target, Lock, Unlock, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';

interface M3TriggerScorerProps {
  currentScore: number;
  ceiling: number;
  history: TriggerScoreHistoryPoint[];
  taxLot: TaxLotInfo;
  isHighVol: boolean;
}

export const M3TriggerScorer: React.FC<M3TriggerScorerProps> = ({
  currentScore,
  ceiling,
  history,
  taxLot,
  isHighVol
}) => {
  const isTriggered = currentScore >= ceiling;
  const driftPart = currentScore * 0.45;
  const liqPart = currentScore * 0.35;
  const taxPart = currentScore * 0.20;

  return (
    <div className="bg-[#0E1626] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
      {/* Top subtle glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              M3: REBALANCE TRIGGER SCORER
            </h2>
          </div>
          {taxLot.taxLocked ? (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-950/70 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
              <Lock className="w-3 h-3 inline mr-1 text-amber-300" />
              TAX LOCK ON
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1">
              <Unlock className="w-3 h-3 inline mr-1 text-slate-400" />
              TAX LOCK OFF
            </span>
          )}
        </div>

        {/* Hero metric */}
        <div className="mb-2">
          <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tracking-tight tabular-nums flex items-baseline space-x-2">
            <span>{currentScore.toFixed(2)}</span>
            <span className="text-base font-medium text-[#64748B]">
              / {ceiling.toFixed(0)} Ceiling
            </span>
            {isTriggered && (
              <span className="text-[10px] font-sans font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 px-2 py-0.5 rounded animate-pulse">
                AUTO-TRIGGER BREACH
              </span>
            )}
          </div>
          <div className="text-xs text-[#94A3B8] mt-1 font-medium flex items-center space-x-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span>
              Delaying sale of {taxLot.lots} lots ({taxLot.ticker}) saves ₹{taxLot.potentialTaxSaved.toLocaleString('en-IN')} via LTCG ({taxLot.daysToLtcg}d to 365d)
            </span>
          </div>
        </div>

        {/* Supporting detail stat line */}
        <div className="grid grid-cols-3 gap-2 bg-[#0A0F1A] border border-[#1E293B]/60 rounded p-2 mb-3 font-mono text-[11px] text-center">
          <div>
            <div className="text-[9px] uppercase font-sans text-[#64748B] font-semibold">Drift (45%)</div>
            <div className="text-[#F8FAFC] font-semibold mt-0.5 tabular-nums">{driftPart.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase font-sans text-[#64748B] font-semibold">Liquidity (35%)</div>
            <div className="text-[#F8FAFC] font-semibold mt-0.5 tabular-nums">{liqPart.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-[9px] uppercase font-sans text-[#64748B] font-semibold">Tax Barrier (20%)</div>
            <div className="text-amber-400 font-semibold mt-0.5 tabular-nums">{taxPart.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-[150px] w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 8, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isTriggered ? "#EF4444" : "#38BDF8"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isTriggered ? "#EF4444" : "#38BDF8"} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
              tickFormatter={(v) => v ? v.slice(3) : ''}
            />
            <YAxis
              stroke="#64748B"
              fontSize={9}
              domain={[0, Math.max(ceiling + 10, 80)]}
              tickCount={5}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0A0F1A',
                borderColor: '#1E293B',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                padding: '6px 10px'
              }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
              formatter={(val: any) => [`${Number(val).toFixed(2)} pts`, 'Urgency Score']}
            />
            <ReferenceLine
              y={ceiling}
              stroke="#EF4444"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{
                value: `Ceiling: ${ceiling}`,
                fill: '#EF4444',
                fontSize: 9,
                position: 'insideTopRight'
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke={isTriggered ? "#EF4444" : "#38BDF8"}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#scoreGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
