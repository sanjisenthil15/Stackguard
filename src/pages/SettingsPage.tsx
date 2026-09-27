import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Percent,
  Wallet,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    resetSettings();
    setFormData({
      aaaLimitPct: 20.0,
      aaLimitPct: 16.0,
      aLimitPct: 12.0,
      sectorLimitPct: 30.0,
      rebalanceCeiling: 65.0,
      liquidityTargetCr: 12.19,
      grossLeverageLimit: 2.0,
      enableAutoNetting: true,
      enableTaxLockDefense: true
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
              CONFIG
            </span>
            <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
              Rules & Compliance Threshold Parameters
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Modify regulatory limits, rebalance urgency triggers, and liquidity reserve boundaries. Changes instantly take effect in the Pre-Trade Netting Gate.
          </p>
        </div>

        {/* Reset button */}
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0E1626] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to SEBI Defaults</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-[#064E3B] border border-[#10B981]/50 rounded-xl p-3.5 text-xs text-[#34D399] font-mono flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
            <span>
              Risk parameters updated successfully! Limits instantly propagated to Order Gate & Exposure modules.
            </span>
          </div>
          <span className="font-bold uppercase tracking-wider text-[10px]">LIVE SYNCED</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Section 1: Single Issuer Concentration Limits */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#1E293B] mb-4">
            <Scale className="w-4 h-4 text-[#38BDF8]" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Single Issuer Concentration Limits (By Rating Tier)
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Maximum allowed percentage of fund NAV per corporate issuer under Category III AIF guidelines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* AAA Limit */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F8FAFC]">
                  AAA Rated Issuer Limit
                </label>
                <span className="font-mono text-sm font-bold text-[#38BDF8]">
                  {formData.aaaLimitPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="25"
                step="0.5"
                value={formData.aaaLimitPct}
                onChange={(e) => setFormData({ ...formData, aaaLimitPct: parseFloat(e.target.value) })}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>10% (Strict)</span>
                <span>SEBI Standard: 20%</span>
                <span>25% (Relaxed)</span>
              </div>
            </div>

            {/* AA Limit */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F8FAFC]">
                  AA Rated Issuer Limit
                </label>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {formData.aaLimitPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="20"
                step="0.5"
                value={formData.aaLimitPct}
                onChange={(e) => setFormData({ ...formData, aaLimitPct: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>8% (Strict)</span>
                <span>SEBI Standard: 16%</span>
                <span>20% (Max)</span>
              </div>
            </div>

            {/* A & Below Limit */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F8FAFC]">
                  A & Below Issuer Limit
                </label>
                <span className="font-mono text-sm font-bold text-[#EF4444]">
                  {formData.aLimitPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={formData.aLimitPct}
                onChange={(e) => setFormData({ ...formData, aLimitPct: parseFloat(e.target.value) })}
                className="w-full accent-[#EF4444] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>5% (Strict)</span>
                <span>SEBI Standard: 12%</span>
                <span>15% (High Risk)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Sector & Leverage Limits */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#1E293B] mb-4">
            <Percent className="w-4 h-4 text-[#34D399]" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Sector Exposure & Gross Leverage Envelopes
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Maximum sectoral concentration and total fund gross derivatives leverage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Sector Concentration */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F8FAFC]">
                  Max Sector Concentration Limit
                </label>
                <span className="font-mono text-sm font-bold text-[#38BDF8]">
                  {formData.sectorLimitPct.toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                step="1"
                value={formData.sectorLimitPct}
                onChange={(e) => setFormData({ ...formData, sectorLimitPct: parseInt(e.target.value) })}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>20% (Diversified)</span>
                <span>Default: 30%</span>
                <span>45% (Concentrated)</span>
              </div>
            </div>

            {/* Gross Leverage Limit */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F8FAFC]">
                  Gross Leverage Cap (SEBI Max: 2.0x)
                </label>
                <span className="font-mono text-sm font-bold text-[#34D399]">
                  {formData.grossLeverageLimit.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={formData.grossLeverageLimit}
                onChange={(e) => setFormData({ ...formData, grossLeverageLimit: parseFloat(e.target.value) })}
                className="w-full accent-[#34D399] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>1.0x (Unlevered)</span>
                <span>1.5x</span>
                <span>2.0x (SEBI Cap)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Rebalance Trigger & Liquidity Reserve */}
        <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#1E293B] mb-4">
            <Target className="w-4 h-4 text-amber-400" />
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Rebalance Urgency Ceiling & Liquidity Buffer Target
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Configure when automated rebalance child baskets fire and minimum unencumbered cash.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Rebalance Urgency Ceiling */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F8FAFC]">
                  Rebalance Urgency Ceiling (Points)
                </label>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {formData.rebalanceCeiling.toFixed(0)} pts
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="85"
                step="1"
                value={formData.rebalanceCeiling}
                onChange={(e) => setFormData({ ...formData, rebalanceCeiling: parseInt(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>40 pts (Frequent Rebalancing)</span>
                <span>Default: 65</span>
                <span>85 pts (Patient Turnover)</span>
              </div>
            </div>

            {/* Liquidity Target */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#F8FAFC]">
                  Baseline Liquidity Sleeve Target (₹ Cr)
                </label>
                <span className="font-mono text-sm font-bold text-[#38BDF8]">
                  ₹{formData.liquidityTargetCr.toFixed(2)} Cr
                </span>
              </div>
              <input
                type="range"
                min="6.0"
                max="20.0"
                step="0.5"
                value={formData.liquidityTargetCr}
                onChange={(e) => setFormData({ ...formData, liquidityTargetCr: parseFloat(e.target.value) })}
                className="w-full accent-[#38BDF8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1">
                <span>₹6.0 Cr</span>
                <span>Default: ₹12.19 Cr</span>
                <span>₹20.0 Cr</span>
              </div>
            </div>
          </div>

          {/* Toggle Checkboxes */}
          <div className="mt-4 pt-3 border-t border-[#1E293B] grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableAutoNetting}
                onChange={(e) => setFormData({ ...formData, enableAutoNetting: e.target.checked })}
                className="w-4 h-4 rounded accent-[#38BDF8]"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#F8FAFC]">Enable Pre-Trade Cross Netting</div>
                <div className="text-[#64748B] text-[10px]">Automatically match contra-orders across strategies before exchange routing.</div>
              </div>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableTaxLockDefense}
                onChange={(e) => setFormData({ ...formData, enableTaxLockDefense: e.target.checked })}
                className="w-4 h-4 rounded accent-amber-400"
              />
              <div className="text-xs">
                <div className="font-semibold text-[#F8FAFC]">Enable Section 112A Tax-Lock Barrier</div>
                <div className="text-[#64748B] text-[10px]">Penalize sales of positions within 14 days of 365-day LTCG qualification.</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#080C14] font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Apply & Save Rules
          </button>
        </div>
      </form>
    </div>
  );
};
