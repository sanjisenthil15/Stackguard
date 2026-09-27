import React from 'react';
import {
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Layers,
  Percent,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExposurePage: React.FC = () => {
  const {
    navCr,
    grossLeverage,
    rawVolume,
    nettedVolume,
    sttSavedLakhs,
    issuers,
    sectors,
    orderBlotter
  } = useApp();

  const reductionPercent = rawVolume > 0 ? ((1 - nettedVolume / rawVolume) * 100).toFixed(2) : '0';
  const nettedOrders = orderBlotter.filter((o) => o.outcome === 'NETTED');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
            MODULE 1
          </span>
          <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            Exposure & Compliance (Pre-Trade Netting Gate)
          </h1>
        </div>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          SEBI Category III Single Issuer Concentration, Sector Risk Allocations, and Internal Crossing Volume Reduction.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            <span>Netting Volume Reduction</span>
            <ArrowRightLeft className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tabular-nums">
            {reductionPercent}%
          </div>
          <div className="text-xs text-[#94A3B8] mt-1 font-medium">
            Raw {rawVolume.toLocaleString()} → Netted {nettedVolume.toLocaleString()} units
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            <span>Cumulative STT & Fees Saved</span>
            <Percent className="w-4 h-4 text-[#34D399]" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#34D399] tabular-nums">
            ₹{sttSavedLakhs.toFixed(2)} Lakhs
          </div>
          <div className="text-xs text-[#94A3B8] mt-1 font-medium">
            0.1% STT savings on internal book match vs exchange
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
            <span>Portfolio Gross Leverage</span>
            <Scale className="w-4 h-4 text-[#F8FAFC]" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-[#F8FAFC] tabular-nums">
            {grossLeverage.toFixed(1)}x
          </div>
          <div className="text-xs text-[#94A3B8] mt-1 font-medium">
            SEBI Regulatory Limit: 2.0x (Category III AIF)
          </div>
        </div>
      </div>

      {/* Issuer Concentration Table */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              SEBI Single Issuer Concentration Monitor
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Real-time aggregate percentage of fund NAV vs rating-tiered statutory limits.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0F1A] text-[#34D399] border border-[#10B981]/30">
            ALL PASS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-[#64748B] bg-[#0A0F1A]/80 font-sans">
                <th className="py-2.5 px-3 font-semibold">ISSUER ENTITY</th>
                <th className="py-2.5 px-2 font-semibold">RATING</th>
                <th className="py-2.5 px-2 font-semibold">SECTOR</th>
                <th className="py-2.5 px-3 font-semibold text-right">EXPOSURE (₹ CR)</th>
                <th className="py-2.5 px-3 font-semibold text-right">CURRENT AGG (%)</th>
                <th className="py-2.5 px-3 font-semibold text-right">REGULATORY LIMIT</th>
                <th className="py-2.5 px-3 font-semibold text-right">BUFFER TO LIMIT</th>
                <th className="py-2.5 px-3 font-semibold text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40 font-mono text-[11px]">
              {issuers.map((iss) => {
                const buffer = Number((iss.limit - iss.currentAgg).toFixed(2));
                const isPass = iss.status === 'PASS';
                const isWatch = iss.status === 'WATCH';

                return (
                  <tr key={iss.name} className="hover:bg-[#0A0F1A] transition-colors">
                    <td className="py-2.5 px-3 font-sans font-semibold text-[#F8FAFC]">
                      {iss.name}
                    </td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#0A0F1A] text-slate-300 border border-[#1E293B]">
                        {iss.rating}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 font-sans text-slate-300">
                      {iss.sector}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#F8FAFC]">
                      ₹{iss.exposureCr.toFixed(2)} Cr
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-bold text-[#38BDF8]">
                      {iss.currentAgg.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#64748B]">
                      {iss.limit.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-slate-300">
                      +{buffer.toFixed(2)}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold font-sans tracking-wider uppercase ${
                          !isPass
                            ? 'bg-red-950 text-[#EF4444] border border-[#EF4444]/40'
                            : isWatch
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            : 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/30'
                        }`}
                      >
                        {iss.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sector Concentration & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-3 pb-2 border-b border-[#1E293B]">
            Sector Concentration Heatmap (Max Limit: {sectors[0]?.limit}%)
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {sectors.map((sec) => {
              const pctOfLimit = (sec.currentAgg / sec.limit) * 100;
              return (
                <div key={sec.sector}>
                  <div className="flex items-center justify-between mb-1 font-sans">
                    <span className="text-slate-200 font-medium text-xs">{sec.sector}</span>
                    <span className="font-mono text-xs text-[#38BDF8] font-bold">
                      {sec.currentAgg.toFixed(2)}% <span className="text-[#64748B] font-normal">/ {sec.limit.toFixed(0)}%</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#080C14] h-2.5 rounded overflow-hidden border border-[#1E293B]">
                    <div
                      className={`h-full transition-all duration-500 ${
                        pctOfLimit > 90
                          ? 'bg-amber-500'
                          : pctOfLimit > 100
                          ? 'bg-[#EF4444]'
                          : 'bg-[#38BDF8]'
                      }`}
                      style={{ width: `${Math.min(100, pctOfLimit)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Netted Internal Crossings History */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-3 pb-2 border-b border-[#1E293B] flex items-center justify-between">
              <span>Netted Orders Audit Feed</span>
              <span className="text-[10px] text-[#34D399] font-mono">SEBI PFUTP Defense</span>
            </h2>

            <div className="space-y-2 overflow-y-auto max-h-[280px] pr-1">
              {nettedOrders.length > 0 ? (
                nettedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-[#0A0F1A] border border-[#1E293B]/70 rounded-lg p-2.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#F8FAFC]">{ord.symbol}</span>
                      <span className="text-[10px] text-[#34D399] font-bold">
                        Saved STT: ₹{ord.sttSavedInr?.toFixed(0)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-sans">
                      {ord.strategy} ({ord.side} {ord.qty}) matched against {ord.nettedAgainstStrategy || 'Opposing Mandate'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#64748B] text-xs font-sans">
                  No internal netted orders recorded yet. Submit opposing strategy orders to trigger automatic crossing.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E293B] text-[10px] text-[#64748B] font-mono">
            Direct Internal Ledger Transfer | Zero Exchange STP Fee
          </div>
        </div>
      </div>
    </div>
  );
};
