import React, { useState } from 'react';
import {
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Info,
  DollarSign,
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StrategyName, OrderOutcome } from '../types';

export const NewOrderPage: React.FC = () => {
  const { tickers, submitOrder, orderBlotter, settings, navCr } = useApp();

  const [strategy, setStrategy] = useState<StrategyName>('Alpha Momentum');
  const [symbol, setSymbol] = useState<string>('RELIANCE');
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [qty, setQty] = useState<number>(500);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState<number>(2950);

  // Result panel state
  const [lastResult, setLastResult] = useState<{
    outcome: OrderOutcome;
    outcomeReason: string;
    sttSavedInr: number;
    projectedAggPct: number;
    limitPct: number;
    symbol: string;
    qty: number;
    side: 'BUY' | 'SELL';
    totalValueInr: number;
  } | null>(null);

  const selectedTicker = tickers.find((t) => t.symbol === symbol) || tickers[0];
  const effectivePrice = orderType === 'LIMIT' ? limitPrice : selectedTicker.price;
  const estimatedValueInr = qty * effectivePrice;
  const estimatedValueCr = estimatedValueInr / 10000000;
  const estimatedNavPct = (estimatedValueCr / navCr) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) return;

    const res = submitOrder({
      strategy,
      symbol,
      side,
      qty,
      orderType,
      limitPrice: orderType === 'LIMIT' ? limitPrice : undefined
    });

    setLastResult({
      outcome: res.outcome,
      outcomeReason: res.outcomeReason,
      sttSavedInr: res.sttSavedInr,
      projectedAggPct: res.projectedAggPct,
      limitPct: res.limitPct,
      symbol,
      qty,
      side,
      totalValueInr: estimatedValueInr
    });
  };

  // Helper quick presets
  const handleTestScenario = (type: 'BREACH' | 'NET' | 'ALLOW') => {
    if (type === 'BREACH') {
      // TATAMOTORS rating A (limit is 12% by default), order 30,000 units pushes way over limit
      setStrategy('Alpha Momentum');
      setSymbol('TATAMOTORS');
      setSide('BUY');
      setQty(45000);
      setOrderType('MARKET');
    } else if (type === 'NET') {
      // Choose TCS or RELIANCE with opposite side to open orders
      setStrategy('Beta StatArb');
      setSymbol('RELIANCE');
      setSide('SELL');
      setQty(600);
      setOrderType('MARKET');
    } else {
      // Normal safe compliant order
      setStrategy('Alpha Momentum');
      setSymbol('INFY');
      setSide('BUY');
      setQty(250);
      setOrderType('MARKET');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
          Pre-Trade Order Submission & Risk Gate
        </h1>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Submit live strategy orders through the simulated M1 pre-trade netting gate and SEBI Cat III concentration limits.
        </p>
      </div>

      {/* Main Order Form & Result Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Order Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
            <div className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4 text-[#38BDF8]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                Institutional Order Ticket
              </h2>
            </div>
            {/* Quick Test Preset Buttons */}
            <div className="flex items-center space-x-1.5 text-[10px]">
              <span className="text-[#64748B] font-mono">Test Presets:</span>
              <button
                type="button"
                onClick={() => handleTestScenario('NET')}
                className="px-2 py-0.5 rounded bg-sky-950/70 text-[#38BDF8] border border-[#38BDF8]/40 hover:bg-sky-900 transition-colors"
                title="Fill opposite order to trigger Netting"
              >
                Trigger Netting
              </button>
              <button
                type="button"
                onClick={() => handleTestScenario('BREACH')}
                className="px-2 py-0.5 rounded bg-red-950/70 text-[#EF4444] border border-[#EF4444]/40 hover:bg-red-900 transition-colors"
                title="Fill oversized order to trigger Concentration Breach"
              >
                Trigger Breach
              </button>
              <button
                type="button"
                onClick={() => handleTestScenario('ALLOW')}
                className="px-2 py-0.5 rounded bg-emerald-950/70 text-[#34D399] border border-emerald-500/40 hover:bg-emerald-900 transition-colors"
                title="Fill clean order"
              >
                Clean Pass
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Strategy Select */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Sub-Strategy Mandate
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as StrategyName)}
                className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-2.5 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="Alpha Momentum">Alpha Momentum (Trend Following / Long-Bias)</option>
                <option value="Beta StatArb">Beta StatArb (Mean Reversion / Statistical Arbitrage)</option>
                <option value="Gamma Delta-Neutral">Gamma Delta-Neutral (Options Volatility Harvesting)</option>
              </select>
            </div>

            {/* Instrument Select */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Instrument / ISIN
                </label>
                <select
                  value={symbol}
                  onChange={(e) => {
                    setSymbol(e.target.value);
                    const t = tickers.find((x) => x.symbol === e.target.value);
                    if (t) setLimitPrice(t.price);
                  }}
                  className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-2.5 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
                >
                  {tickers.map((t) => (
                    <option key={t.symbol} value={t.symbol}>
                      {t.symbol} — ₹{t.price.toFixed(2)} ({t.rating}, {t.sector})
                    </option>
                  ))}
                </select>
              </div>

              {/* Side (Buy / Sell) */}
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Order Side
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSide('BUY')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                      side === 'BUY'
                        ? 'bg-[#10B981] text-[#080C14] shadow-md shadow-emerald-500/20'
                        : 'bg-[#0A0F1A] text-[#94A3B8] border border-[#1E293B] hover:text-[#F8FAFC]'
                    }`}
                  >
                    BUY / LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setSide('SELL')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                      side === 'SELL'
                        ? 'bg-[#EF4444] text-[#F8FAFC] shadow-md shadow-red-500/20'
                        : 'bg-[#0A0F1A] text-[#94A3B8] border border-[#1E293B] hover:text-[#F8FAFC]'
                    }`}
                  >
                    SELL / SHORT
                  </button>
                </div>
              </div>
            </div>

            {/* Quantity and Shortcuts */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#94A3B8]">
                  Quantity (Units)
                </label>
                <div className="flex items-center space-x-1.5">
                  {[100, 250, 500, 1000, 5000].map((lot) => (
                    <button
                      key={lot}
                      type="button"
                      onClick={() => setQty(lot)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#0A0F1A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-[#38BDF8] border border-[#1E293B] transition-colors"
                    >
                      {lot}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={qty}
                onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-2.5 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            {/* Order Type & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Execution Order Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('MARKET')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                      orderType === 'MARKET'
                        ? 'bg-[#38BDF8] text-[#080C14]'
                        : 'bg-[#0A0F1A] text-[#94A3B8] border border-[#1E293B] hover:text-[#F8FAFC]'
                    }`}
                  >
                    MARKET
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('LIMIT')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold font-mono transition-all ${
                      orderType === 'LIMIT'
                        ? 'bg-[#38BDF8] text-[#080C14]'
                        : 'bg-[#0A0F1A] text-[#94A3B8] border border-[#1E293B] hover:text-[#F8FAFC]'
                    }`}
                  >
                    LIMIT
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Execution Price (INR)
                </label>
                <input
                  type="number"
                  step="0.05"
                  disabled={orderType === 'MARKET'}
                  value={orderType === 'MARKET' ? selectedTicker.price : limitPrice}
                  onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                  className={`w-full border rounded-lg p-2.5 text-xs font-mono text-[#F8FAFC] focus:outline-none ${
                    orderType === 'MARKET'
                      ? 'bg-[#080C14] border-[#1E293B]/50 text-[#64748B] cursor-not-allowed'
                      : 'bg-[#0A0F1A] border-[#1E293B] focus:border-[#38BDF8]'
                  }`}
                />
              </div>
            </div>

            {/* Projected Notional & SEBI Envelope Checks */}
            <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3 font-mono text-xs space-y-1.5">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Projected Notional Turn:</span>
                <span className="text-[#F8FAFC] font-bold tabular-nums">
                  ₹{estimatedValueInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (₹{estimatedValueCr.toFixed(3)} Cr)
                </span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Impact on Portfolio NAV:</span>
                <span className="text-[#38BDF8] font-bold tabular-nums">
                  {estimatedNavPct.toFixed(2)}% of NAV
                </span>
              </div>
              <div className="flex justify-between text-[#64748B] text-[10px] pt-1 border-t border-[#1E293B]/60 font-sans">
                <span>Rating Rule Applied:</span>
                <span className="font-mono text-slate-300">
                  {selectedTicker.rating} Limit: {selectedTicker.rating === 'AAA' ? settings.aaaLimitPct : selectedTicker.rating === 'AA' ? settings.aaLimitPct : settings.aLimitPct}%
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full py-3 bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-[#080C14] font-black text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Evaluate & Route to Netting Gate</span>
            </button>
          </form>
        </div>

        {/* Right: Live Risk Evaluation Result Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
                  Pre-Trade Netting Result
                </h2>
                <span className="text-[10px] font-mono text-[#64748B]">
                  SEBI GATE ENGINE
                </span>
              </div>

              {lastResult ? (
                <div className="space-y-4">
                  {/* Outcome Hero Banner */}
                  <div
                    className={`rounded-xl p-4 border text-center ${
                      lastResult.outcome === 'ALLOWED'
                        ? 'bg-[#064E3B]/80 border-[#10B981]/50 text-[#34D399]'
                        : lastResult.outcome === 'NETTED'
                        ? 'bg-sky-950/80 border-[#38BDF8]/50 text-[#38BDF8]'
                        : 'bg-red-950/80 border-[#EF4444]/50 text-[#EF4444]'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {lastResult.outcome === 'ALLOWED' && <CheckCircle2 className="w-6 h-6" />}
                      {lastResult.outcome === 'NETTED' && <ArrowRightLeft className="w-6 h-6" />}
                      {lastResult.outcome === 'BLOCKED' && <XCircle className="w-6 h-6" />}
                      <span className="text-2xl font-black font-mono tracking-wider">
                        {lastResult.outcome}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-sans text-slate-200 leading-relaxed text-left bg-[#0A0F1A]/80 p-2.5 rounded border border-white/10">
                      {lastResult.outcomeReason}
                    </div>
                  </div>

                  {/* Outcome Metrics */}
                  <div className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg p-3 space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Executed Turn:</span>
                      <span className="text-[#F8FAFC] font-bold">
                        {lastResult.qty} {lastResult.symbol} ({lastResult.side})
                      </span>
                    </div>
                    {lastResult.sttSavedInr > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">STT Tax Saved:</span>
                        <span className="text-[#34D399] font-bold">
                          ₹{lastResult.sttSavedInr.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Projected Issuer Agg:</span>
                      <span className={lastResult.outcome === 'BLOCKED' ? 'text-[#EF4444] font-bold' : 'text-slate-200'}>
                        {lastResult.projectedAggPct.toFixed(2)}% (Limit: {lastResult.limitPct.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-[#64748B]">
                  <ArrowRightLeft className="w-10 h-10 mx-auto text-[#1E293B] mb-2" />
                  <p className="text-xs font-semibold text-[#94A3B8]">
                    No order evaluated yet
                  </p>
                  <p className="text-[11px] mt-1 text-[#64748B] max-w-xs mx-auto">
                    Fill the form on the left or click a test preset button to see the Pre-Trade Netting Gate evaluate limits in real time.
                  </p>
                </div>
              )}
            </div>

            {/* SEBI PFUTP Compliance Note */}
            <div className="mt-4 pt-3 border-t border-[#1E293B] text-[10px] text-[#64748B] flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              <span>
                Netting Gate eliminates cross-sub-fund wash trading under SEBI PFUTP Reg 4(2)(a).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Running Order Blotter Table */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Session Order Blotter ({orderBlotter.length} Orders Logged)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">
            Real-time execution log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-[#64748B] bg-[#0A0F1A]/80 font-sans">
                <th className="py-2 px-3 font-semibold">ORDER ID</th>
                <th className="py-2 px-2 font-semibold">TIME</th>
                <th className="py-2 px-2 font-semibold">STRATEGY</th>
                <th className="py-2 px-2 font-semibold">SYMBOL</th>
                <th className="py-2 px-2 font-semibold">SIDE</th>
                <th className="py-2 px-2 font-semibold text-right">QTY</th>
                <th className="py-2 px-2 font-semibold text-right">PRICE</th>
                <th className="py-2 px-2 font-semibold text-right">NOTIONAL</th>
                <th className="py-2 px-3 font-semibold text-center">OUTCOME</th>
                <th className="py-2 px-3 font-semibold">RATIONALE / NETTING INFO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40 font-mono text-[11px]">
              {orderBlotter.map((ord) => {
                return (
                  <tr key={ord.id} className="hover:bg-[#0A0F1A] transition-colors">
                    <td className="py-2 px-3 text-[#38BDF8] font-bold">
                      {ord.id}
                    </td>
                    <td className="py-2 px-2 text-[#64748B]">
                      {ord.timestamp}
                    </td>
                    <td className="py-2 px-2 font-sans font-medium text-slate-300">
                      {ord.strategy}
                    </td>
                    <td className="py-2 px-2 font-bold text-[#F8FAFC]">
                      {ord.symbol}
                    </td>
                    <td className="py-2 px-2">
                      <span className={`font-bold ${ord.side === 'BUY' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {ord.side}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-slate-200">
                      {ord.qty.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-slate-400">
                      ₹{ord.price.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums text-[#F8FAFC] font-semibold">
                      ₹{ord.totalValueInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold font-sans tracking-wider uppercase ${
                          ord.outcome === 'ALLOWED'
                            ? 'bg-[#064E3B] text-[#34D399] border border-[#10B981]/30'
                            : ord.outcome === 'NETTED'
                            ? 'bg-sky-950 text-[#38BDF8] border border-[#38BDF8]/40'
                            : 'bg-red-950 text-[#EF4444] border border-[#EF4444]/40'
                        }`}
                      >
                        {ord.outcome}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-sans text-[11px] text-[#94A3B8] max-w-sm truncate" title={ord.outcomeReason}>
                      {ord.outcomeReason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
