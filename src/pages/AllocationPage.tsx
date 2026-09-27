import React, { useState } from 'react';
import {
  Cpu,
  PieChart as PieIcon,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../context/AppContext';

export const AllocationPage: React.FC = () => {
  const {
    alphaWeight,
    betaWeight,
    gammaWeight,
    weightHistory,
    solverStatus,
    solveTimeMs
  } = useApp();

  const [alphaTilt, setAlphaTilt] = useState(1.0);
  const [betaTilt, setBetaTilt] = useState(1.0);

  const pieData = [
    { name: 'Alpha Momentum', value: alphaWeight, color: '#38BDF8' },
    { name: 'Beta StatArb', value: betaWeight, color: '#F59E0B' },
    { name: 'Gamma Delta-Neutral', value: gammaWeight, color: '#A855F7' }
  ];

  const signalMetrics = [
    {
      strategy: 'Alpha Momentum',
      type: 'Long-Bias Trend Following',
      infoRatio: '1.84',
      hitRate: '61.4%',
      sharpe30d: '2.42',
      annVol: '14.2%',
      factorTilt: 'High Momentum / Earnings Revisions',
      status: 'OVERWEIGHT',
      color: 'text-[#38BDF8]'
    },
    {
      strategy: 'Beta StatArb',
      type: 'Pairs & Mean Reversion',
      infoRatio: '1.42',
      hitRate: '56.8%',
      sharpe30d: '1.95',
      annVol: '8.6%',
      factorTilt: 'Co-integration Spread / Low Beta',
      status: 'NEUTRAL',
      color: 'text-amber-400'
    },
    {
      strategy: 'Gamma Delta-Neutral',
      type: 'Options Volatility Harvesting',
      infoRatio: '1.18',
      hitRate: '72.1%',
      sharpe30d: '1.68',
      annVol: '5.2%',
      factorTilt: 'Short Implied Vol / Weekly Strangles',
      status: 'UNDERWEIGHT',
      color: 'text-[#C084FC]'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-950/70 text-purple-300 border border-purple-500/30">
            MODULE 2
          </span>
          <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            Dynamic Capital Weights & CVXPY Allocator
          </h1>
        </div>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Convex quadratic program continuously balancing cross-strategy margin usage, factor tilts, and information ratios.
        </p>
      </div>

      {/* Top Hero Weights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg border-l-4 border-l-[#38BDF8]">
          <div className="text-xs text-[#94A3B8] font-sans font-semibold uppercase tracking-wider">
            Alpha Momentum Allocation
          </div>
          <div className="text-3xl font-extrabold text-[#38BDF8] mt-1 tabular-nums">
            {alphaWeight.toFixed(1)}%
          </div>
          <div className="text-xs text-[#64748B] mt-1 font-sans">
            Trailing 30D Return: +4.82% | Gross Exposure ₹32.5 Cr
          </div>
        </div>

        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg border-l-4 border-l-amber-400">
          <div className="text-xs text-[#94A3B8] font-sans font-semibold uppercase tracking-wider">
            Beta StatArb Allocation
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1 tabular-nums">
            {betaWeight.toFixed(1)}%
          </div>
          <div className="text-xs text-[#64748B] mt-1 font-sans">
            Trailing 30D Return: +1.94% | Gross Exposure ₹12.5 Cr
          </div>
        </div>

        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg border-l-4 border-l-purple-500">
          <div className="text-xs text-[#94A3B8] font-sans font-semibold uppercase tracking-wider">
            Gamma Delta-Neutral Allocation
          </div>
          <div className="text-3xl font-extrabold text-purple-400 mt-1 tabular-nums">
            {gammaWeight.toFixed(1)}%
          </div>
          <div className="text-xs text-[#64748B] mt-1 font-sans">
            Trailing 30D Return: +1.12% | Gross Exposure ₹5.0 Cr
          </div>
        </div>
      </div>

      {/* Charts Grid: Weights History Line Chart + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Line Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Rolling Strategy Weight Trajectory (Last 35 Ticks)
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Gradual drift responding to rolling signal confidence scores without sudden turnover spikes.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/40">
              OSQP {solverStatus} ({solveTimeMs}ms)
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  domain={[0, 85]}
                  tickLine={false}
                  axisLine={{ stroke: '#1E293B' }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0F1A',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px'
                  }}
                  formatter={(val: any, name: any) => [`${Number(val).toFixed(1)}%`, name]}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="alpha"
                  name="Alpha Momentum"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="beta"
                  name="Beta StatArb"
                  stroke="#F59E0B"
                  strokeWidth={2.2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="gamma"
                  name="Gamma Delta-Neutral"
                  stroke="#A855F7"
                  strokeWidth={2.2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] pb-2 border-b border-[#1E293B] mb-2">
              Current Capital Breakdown
            </h2>

            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0A0F1A',
                      borderColor: '#1E293B',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                    formatter={(v: any) => `${Number(v).toFixed(1)}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1E293B] font-mono text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-sans text-slate-300">{item.name}</span>
                </div>
                <span className="font-bold text-[#F8FAFC] tabular-nums">{item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signal Confidence Table */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Strategy Signal Confidence & Factor Tilt Ledger
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Real-time alpha characteristics fed into the CVXPY utility objective function.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">
            CONSTRAINTS: Σw = 1.0, w_i ∈ [0.05, 0.75]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-[#64748B] bg-[#0A0F1A]/80 font-sans">
                <th className="py-2.5 px-3 font-semibold">STRATEGY</th>
                <th className="py-2.5 px-3 font-semibold">METHODOLOGY</th>
                <th className="py-2.5 px-2 font-semibold text-right font-mono">INFO RATIO</th>
                <th className="py-2.5 px-2 font-semibold text-right font-mono">HIT RATE</th>
                <th className="py-2.5 px-2 font-semibold text-right font-mono">30D SHARPE</th>
                <th className="py-2.5 px-2 font-semibold text-right font-mono">ANN VOL</th>
                <th className="py-2.5 px-3 font-semibold">FACTOR DRIFT TILT</th>
                <th className="py-2.5 px-3 font-semibold text-center">SOLVER POSTURE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40 font-mono text-[11px]">
              {signalMetrics.map((sm) => (
                <tr key={sm.strategy} className="hover:bg-[#0A0F1A] transition-colors">
                  <td className="py-2.5 px-3 font-sans font-bold text-[#F8FAFC]">
                    {sm.strategy}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {sm.type}
                  </td>
                  <td className={`py-2.5 px-2 text-right font-bold ${sm.color}`}>
                    {sm.infoRatio}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    {sm.hitRate}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200">
                    {sm.sharpe30d}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {sm.annVol}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {sm.factorTilt}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold font-sans tracking-wider bg-[#0A0F1A] text-[#38BDF8] border border-[#1E293B]">
                      {sm.status}
                    </span>
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
