import React from 'react';
import { RefreshCw, Play, Pause, ChevronDown, User, LogOut, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const TopHeader: React.FC = () => {
  const {
    navCr,
    marketRegime,
    cycleRegime,
    isPaused,
    togglePause,
    forceRebalance,
    isRebalancing,
    user,
    logout
  } = useApp();

  const navigate = useNavigate();

  const getRegimeColor = (regime: string) => {
    switch (regime) {
      case 'BULLISH LOW-VOL':
        return 'text-[#10B981] bg-[#064E3B]/60 border-[#10B981]/30';
      case 'HIGH-VOL CHOPPY':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'BEARISH CRUNCH':
        return 'text-[#EF4444] bg-red-950/60 border-[#EF4444]/30';
      default:
        return 'text-sky-400 bg-sky-950/60 border-sky-500/30';
    }
  };

  const getDotColor = (regime: string) => {
    switch (regime) {
      case 'BULLISH LOW-VOL':
        return 'bg-[#10B981]';
      case 'HIGH-VOL CHOPPY':
        return 'bg-amber-400';
      case 'BEARISH CRUNCH':
        return 'bg-[#EF4444]';
      default:
        return 'bg-sky-400';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-[50px] bg-[#0D131F] border-b border-[#1E293B] px-4 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left: Fund NAV + Regime */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
          <span className="hidden sm:inline uppercase text-[11px] font-semibold tracking-wider text-[#64748B]">
            Portfolio NAV:
          </span>
          <span className="font-mono text-[#F8FAFC] font-bold text-sm bg-[#080C14] px-2.5 py-0.5 rounded border border-[#1E293B] tabular-nums">
            ₹{navCr.toFixed(2)} Cr
          </span>
        </div>

        {/* Regime Toggle */}
        <button
          onClick={cycleRegime}
          title="Click to cycle market regime (affects ceilings and liquidity forecasts)"
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[11px] font-semibold tracking-wide border cursor-pointer hover:opacity-90 transition-all ${getRegimeColor(
            marketRegime
          )}`}
        >
          <span className={`w-2 h-2 rounded-full live-dot ${getDotColor(marketRegime)}`} />
          <span className="uppercase">{marketRegime}</span>
          <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
        </button>
      </div>

      {/* Right: Simulation Controls, Force Rebalance, Manager Profile */}
      <div className="flex items-center space-x-3">
        {/* Pause / Play */}
        <button
          onClick={togglePause}
          title={isPaused ? "Resume real-time tick" : "Pause real-time tick"}
          className={`p-1.5 rounded text-xs border transition-colors flex items-center justify-center ${
            isPaused
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              : 'bg-[#0E1626] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Force Rebalance */}
        <button
          onClick={forceRebalance}
          disabled={isRebalancing}
          title="Trigger instantaneous CVXPY quadratic optimization"
          className="flex items-center space-x-1.5 bg-[#38BDF8] text-[#080C14] font-semibold text-xs px-3 py-1.5 rounded shadow-sm hover:bg-[#38BDF8]/90 active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRebalancing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRebalancing ? 'Rebalancing...' : 'Force Rebalance'}</span>
          <span className="sm:hidden">Rebal</span>
        </button>

        {/* Manager Profile Pill */}
        {user ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-[#1E293B]">
            <div className="w-6 h-6 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8] text-xs font-bold font-mono">
              {user.name.charAt(0)}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#F8FAFC] leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-[#64748B] leading-none mt-0.5">
                {user.role.split('/')[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1 rounded text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1E293B] transition-colors ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-xs text-[#38BDF8] hover:underline font-semibold"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
