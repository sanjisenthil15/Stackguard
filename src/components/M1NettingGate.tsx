import React from 'react';
import { IssuerConcentration, NettedOrder } from '../types';
import { ShieldCheck, ArrowRightLeft, CheckCircle2, AlertOctagon, TrendingDown, Layers } from 'lucide-react';

interface M1NettingGateProps {
  rawVolume: number;
  nettedVolume: number;
  sttSavedLakhs: number;
  grossLeverage: number;
  issuers: IssuerConcentration[];
  activeOrders: NettedOrder[];
  onSelectOrder?: (order: NettedOrder) => void;
}

export const M1NettingGate: React.FC<M1NettingGateProps> = ({
  rawVolume,
  nettedVolume,
  sttSavedLakhs,
  grossLeverage,
  issuers,
  activeOrders,
  onSelectOrder
}) => {
  const reductionPercent = rawVolume > 0 ? (1 - nettedVolume / rawVolume) * 100 : 0;
  const isLeverageCompliant = grossLeverage <= 2.0;

  return (
    <div className="bg-[#0E1626] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between h-full shadow-lg relative overflow-hidden">
      {/* Top subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header row */}
        <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-3 mb-3.5">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              M1: PRE-TRADE NETTING GATE
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#064E3B] text-[#34D399] border border-[#10B981]/40 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 inline mr-1" />
            SEBI COMPLIANT
          </span>
        </div>

        {/* Hero metric */}
        <div className="mb-3">
          <div className="font-mono text-3xl font-extrabold text-[#38BDF8] tracking-tight tabular-nums">
            {reductionPercent.toFixed(2)}%
          </div>
          <div className="text-xs text-[#94A3B8] mt-1 font-medium">
            Netting Volume Reduction ({rawVolume.toLocaleString()} → {nettedVolume.toLocaleString()} units)
          </div>
        </div>

        {/* Supporting detail lines */}
        <div className="grid grid-cols-2 gap-2 bg-[#0A0F1A] border border-[#1E293B]/60 rounded p-2.5 mb-4 font-mono text-xs">
          <div>
            <div className="text-[10px] uppercase font-sans text-[#64748B] font-semibold tracking-wider">
              STT & Fees Saved
            </div>
            <div className="text-[#34D399] font-bold text-sm mt-0.5 tabular-nums">
              ₹{sttSavedLakhs.toFixed(2)} Lakhs
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-sans text-[#64748B] font-semibold tracking-wider">
              Gross Leverage
            </div>
            <div className={`font-bold text-sm mt-0.5 tabular-nums ${isLeverageCompliant ? 'text-[#F8FAFC]' : 'text-[#EF4444]'}`}>
              {grossLeverage.toFixed(1)}x <span className="text-[#64748B] font-normal text-xs">/ 2.0x limit</span>
            </div>
          </div>
        </div>

        {/* Issuer Concentration Table */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase mb-1.5">
            <span>SEBI Issuer Concentration Limits</span>
            <span className="text-[10px] text-[#64748B]">Norm: AIF Cat III</span>
          </div>

          <div className="bg-[#0A0F1A] rounded border border-[#1E293B]/80 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-[#64748B] bg-[#0D131F]/70">
                  <th className="py-1.5 px-2.5 font-semibold">ISSUER</th>
                  <th className="py-1.5 px-2 font-semibold font-mono text-right">AGG (%)</th>
                  <th className="py-1.5 px-2 font-semibold font-mono text-right">LIMIT</th>
                  <th className="py-1.5 px-2.5 font-semibold text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/50 font-mono text-[11px]">
                {issuers.map((iss) => {
                  const isPass = iss.status === 'PASS';
                  const isWarning = iss.currentAgg >= iss.limit * 0.9 && isPass;

                  return (
                    <tr key={iss.name} className="hover:bg-[#0E1626]/60 transition-colors">
                      <td className="py-1.5 px-2.5 font-sans font-medium text-[#F8FAFC]">
                        <div>{iss.name}</div>
                        <div className="text-[9px] text-[#64748B]">{iss.rating}</div>
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-slate-200">
                        {iss.currentAgg.toFixed(2)}%
                      </td>
                      <td className="py-1.5 px-2 text-right tabular-nums text-[#64748B]">
                        {iss.limit.toFixed(1)}%
                      </td>
                      <td className="py-1.5 px-2.5 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase font-sans ${
                            !isPass
                              ? 'bg-red-950 text-[#EF4444] border border-[#EF4444]/40'
                              : isWarning
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
      </div>

      {/* Active Netted Orders Section */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase mb-1.5">
          <span>Active Netted Orders (Internal Crossing)</span>
          <span className="text-[10px] text-[#38BDF8] flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] inline-block mr-1 animate-pulse" />
            Live Cross
          </span>
        </div>

        <div className="space-y-1.5">
          {activeOrders.slice(0, 3).map((ord) => {
            const netSign = ord.netQty > 0 ? '+' : ord.netQty < 0 ? '' : '±';
            const isZero = ord.netQty === 0;

            return (
              <div
                key={ord.id}
                onClick={() => onSelectOrder?.(ord)}
                className="bg-[#0A0F1A] hover:bg-[#121B2E] cursor-pointer transition-colors border border-[#1E293B]/70 rounded px-2.5 py-2 flex items-center justify-between text-xs"
              >
                <div className="flex flex-col">
                  <div className="font-mono font-bold text-[#F8FAFC] flex items-center space-x-1.5">
                    <span>{ord.symbol}</span>
                    <span className="text-[10px] text-[#64748B] font-normal">
                      @{ord.price.toFixed(1)}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-[#94A3B8] tracking-tight mt-0.5">
                    <span className="text-[#38BDF8]">A:{ord.alphaQty > 0 ? `+${ord.alphaQty}` : ord.alphaQty}</span>
                    {' '}|{' '}
                    <span className="text-amber-400">B:{ord.betaQty > 0 ? `+${ord.betaQty}` : ord.betaQty}</span>
                    {ord.gammaQty !== 0 && (
                      <>
                        {' '}|{' '}
                        <span className="text-purple-400">G:{ord.gammaQty > 0 ? `+${ord.gammaQty}` : ord.gammaQty}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold text-xs tabular-nums px-2 py-0.5 rounded ${
                    isZero 
                      ? 'bg-[#064E3B]/70 text-[#34D399] border border-[#10B981]/30'
                      : ord.netQty > 0
                      ? 'bg-sky-950/60 text-[#38BDF8] border border-[#38BDF8]/30'
                      : 'bg-rose-950/60 text-[#EF4444] border border-[#EF4444]/30'
                  }`}>
                    NET: {isZero ? '0 (100% CROSS)' : `${netSign}${ord.netQty}`}
                  </div>
                  <div className="text-[9px] font-mono text-[#64748B] mt-0.5">
                    Saved STT: ₹{ord.sttSavedInr.toFixed(0)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
