import React from 'react';
import { StrategyWeightHistoryPoint } from '../types';
import { Cpu, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface M2CapitalWeightsProps {
  currentAlpha: number;
  currentBeta: number;
  currentGamma: number;
  history: StrategyWeightHistoryPoint[];
  solverStatus?: string;
  solveTimeMs?: number;
}

export const M2CapitalWeights: React.FC<M2CapitalWeightsProps> = ({
  currentAlpha,
  currentBeta,
  currentGamma,
  history,
  solverStatus = 'OPTIMAL',
  solveTimeMs = 0.84
}) => {
  // Determine leading strategy
  const strategies = [
    { name: 'Alpha Momentum', weight: currentAlpha, color: '#38BDF8' },
    { name: 'Beta StatArb', weight: currentBeta, color: '#F59E0B' },
    { name: 'Gamma Delta-Neutral', weight: currentGamma, color: '#A855F7' }
  ];
  strategies.sort((a, b) => b.weight - a.weight);

  const leading = strategies[0];
  const secondary = strategies.slice(1);

  return (
    <div className="bg-[#0E1626] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between shadow-lg relative overflow-hidden">
      {/* Top subtle glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#A855F7]/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#A855F7]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              M2: DYNAMIC CAPITAL WEIGHTS
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#3B0764]/70 text-[#C084FC] border border-[#A855F7]/40 flex items-center space-x-1">
            <Activity className="w-3 h-3 inline mr-1 text-[#C084FC]" />
            CVXPY SOLVER
          </span>
        </div>

        {/* Hero metric */}
        <div className="mb-2">
          <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tracking-tight tabular-nums flex items-baseline space-x-2">
            <span>{leading.weight.toFixed(1)}%</span>
            <span className="text-sm font-sans font-semibold text-[#F8FAFC]">
              {leading.name}
            </span>
          </div>
          <div className="font-mono text-xs text-[#94A3B8] mt-1 tabular-nums">
            {secondary.map((s, idx) => (
              <span key={s.name}>
                <span className="text-slate-400 font-sans font-medium">{s.name.split(' ')[0]}:</span>{' '}
                <span className="text-[#F8FAFC] font-semibold">{s.weight.toFixed(1)}%</span>
                {idx < secondary.length - 1 && <span className="text-[#64748B] mx-2">|</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Solver Telemetry line */}
        <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] bg-[#0A0F1A] px-2.5 py-1 rounded border border-[#1E293B]/60 mb-3">
          <span>OSQP Status: <span className="text-[#10B981] font-semibold">{solverStatus}</span> ({solveTimeMs.toFixed(2)}ms)</span>
          <span>Constraints: Σw = 1.0, w_i ∈ [0.05, 0.70]</span>
        </div>
      </div>

      {/* Smooth Line Chart */}
      <div className="h-[160px] w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
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
              domain={[0, 80]}
              tickCount={5}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
              tickFormatter={(v) => `${v}%`}
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
              formatter={(val: any, name: any) => [`${Number(val).toFixed(1)}%`, name]}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '10px', paddingTop: '-8px', paddingBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="alpha"
              name="Alpha"
              stroke="#38BDF8"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="beta"
              name="Beta"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="gamma"
              name="Gamma"
              stroke="#A855F7"
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
