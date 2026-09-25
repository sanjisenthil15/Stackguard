import React from 'react';
import { TickerItem } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerRibbonProps {
  tickers: TickerItem[];
}

export const TickerRibbon: React.FC<TickerRibbonProps> = ({ tickers }) => {
  return (
    <div className="h-[26px] bg-[#05080F] border-b border-[#1E293B] overflow-hidden flex items-center relative select-none z-40">
      {/* Live Badge */}
      <div className="h-full px-2.5 bg-[#0D131F] border-r border-[#1E293B] flex items-center space-x-1.5 shrink-0 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
        <span className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase">
          NSE LIVE
        </span>
      </div>

      {/* Marquee Container */}
      <div className="flex overflow-hidden w-full">
        <div className="animate-ticker flex items-center">
          {/* First set */}
          {tickers.map((t) => (
            <TickerBlock key={`t1-${t.symbol}`} ticker={t} />
          ))}
          {/* Duplicate set for seamless continuous marquee loop */}
          {tickers.map((t) => (
            <TickerBlock key={`t2-${t.symbol}`} ticker={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

const TickerBlock: React.FC<{ ticker: TickerItem }> = ({ ticker }) => {
  const isPositive = ticker.changePercent >= 0;
  const colorClass = isPositive ? 'text-[#10B981]' : 'text-[#EF4444]';

  return (
    <div className="flex items-center space-x-2 px-4 shrink-0 text-[11px] border-r border-[#1E293B]/40">
      <span className="font-mono font-semibold text-[#F8FAFC]">
        {ticker.symbol}
      </span>
      <span className="font-mono text-slate-300 tabular-nums">
        ₹{ticker.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
      <div className={`flex items-center space-x-0.5 font-mono text-[10px] font-medium tabular-nums ${colorClass}`}>
        {isPositive ? (
          <TrendingUp className="w-2.5 h-2.5 inline" />
        ) : (
          <TrendingDown className="w-2.5 h-2.5 inline" />
        )}
        <span>{isPositive ? '+' : ''}{ticker.changePercent.toFixed(2)}%</span>
      </div>
    </div>
  );
};
