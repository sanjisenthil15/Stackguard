import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ShieldAlert,
  PieChart,
  Target,
  Wallet,
  Zap,
  Sliders,
  FileSpreadsheet,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { grossLeverage, orderBlotter, triggerScore, triggerCeiling } = useApp();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { to: '/orders/new', label: 'New Order', icon: PlusCircle, badge: 'GATE', badgeColor: 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30' },
    { to: '/exposure', label: 'Exposure & Compliance', icon: ShieldAlert, badge: 'M1' },
    { to: '/allocation', label: 'Capital Allocation', icon: PieChart, badge: 'M2' },
    { to: '/rebalancing', label: 'Rebalancing', icon: Target, badge: triggerScore >= triggerCeiling ? 'TRIGGER' : 'M3', badgeColor: triggerScore >= triggerCeiling ? 'bg-red-950 text-[#EF4444] border-red-500/40 animate-pulse' : undefined },
    { to: '/liquidity', label: 'Liquidity', icon: Wallet, badge: 'M4' },
    { to: '/execution', label: 'Execution Log', icon: Zap, badge: 'M5' },
    { to: '/settings', label: 'Rules & Settings', icon: Sliders, badge: null },
    { to: '/audit', label: 'Audit Trail', icon: FileSpreadsheet, badge: 'CSV', badgeColor: 'bg-emerald-950/60 text-[#34D399] border-emerald-500/30' },
  ];

  return (
    <aside className="w-64 bg-[#0D131F] border-r border-[#1E293B] flex flex-col shrink-0 min-h-screen select-none z-30">
      {/* Brand Header */}
      <div className="h-[50px] px-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0B101B]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-extrabold text-sm tracking-wider text-[#F8FAFC]">
              STACK<span className="text-[#38BDF8]">GUARD</span>
            </span>
            <span className="text-[10px] font-semibold text-[#94A3B8] tracking-widest uppercase">
              AIF
            </span>
          </div>
        </div>

        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold bg-[#0E1626] text-[#38BDF8] border border-[#1E293B]">
          SIF III
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
          Risk & Execution Engine
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#0E1626] text-[#38BDF8] border-l-2 border-[#38BDF8] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1626]/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center space-x-2.5">
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#38BDF8]' : 'text-[#64748B] group-hover:text-[#94A3B8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                        item.badgeColor || 'bg-[#0A0F1A] text-[#64748B] border-[#1E293B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#38BDF8]" />}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Fund Status Footer Capsule */}
      <div className="p-3 border-t border-[#1E293B] bg-[#0A0F1A]/80 font-mono text-[11px]">
        <div className="flex items-center justify-between text-[#64748B] text-[10px] uppercase font-sans font-semibold mb-1.5">
          <span>Envelope Status</span>
          <span className="text-[#34D399] flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block mr-1 live-dot" />
            Active
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300 py-0.5">
          <span>Gross Leverage:</span>
          <span className="text-[#F8FAFC] font-semibold tabular-nums">{grossLeverage.toFixed(1)}x / 2.0x</span>
        </div>
        <div className="flex items-center justify-between text-slate-300 py-0.5">
          <span>Session Orders:</span>
          <span className="text-[#38BDF8] font-semibold tabular-nums">{orderBlotter.length} logged</span>
        </div>
      </div>
    </aside>
  );
};
