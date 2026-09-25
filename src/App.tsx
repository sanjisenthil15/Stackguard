/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { TickerRibbon } from './components/TickerRibbon';
import { M1NettingGate } from './components/M1NettingGate';
import { M2CapitalWeights } from './components/M2CapitalWeights';
import { M3TriggerScorer } from './components/M3TriggerScorer';
import { M4LiquiditySizer } from './components/M4LiquiditySizer';
import { M5ExecutionSequencer } from './components/M5ExecutionSequencer';
import { ComplianceModal } from './components/ComplianceModal';
import { OrderDetailModal } from './components/OrderDetailModal';

import {
  TickerItem,
  IssuerConcentration,
  NettedOrder,
  StrategyWeightHistoryPoint,
  TriggerScoreHistoryPoint,
  SequencerLogEntry,
  TaxLotInfo,
  MarketRegime
} from './types';

import {
  INITIAL_TICKERS,
  INITIAL_ISSUERS,
  INITIAL_NETTED_ORDERS,
  INITIAL_TAX_LOT,
  INITIAL_LOGS,
  generateInitialWeightHistory,
  generateInitialTriggerHistory
} from './data/simulation';

export default function App() {
  // Navigation & Global Fund State
  const [navCr, setNavCr] = useState<number>(50.0);
  const [marketRegime, setMarketRegime] = useState<MarketRegime>('BULLISH LOW-VOL');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  const [showComplianceModal, setShowComplianceModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<NettedOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tickers State
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);

  // M1: Pre-Trade Netting Gate State
  const [rawVolume, setRawVolume] = useState<number>(2974);
  const [nettedVolume, setNettedVolume] = useState<number>(1112);
  const [sttSavedLakhs, setSttSavedLakhs] = useState<number>(3.84);
  const [grossLeverage, setGrossLeverage] = useState<number>(1.2);
  const [issuers, setIssuers] = useState<IssuerConcentration[]>(INITIAL_ISSUERS);
  const [activeOrders, setActiveOrders] = useState<NettedOrder[]>(INITIAL_NETTED_ORDERS);

  // M2: Dynamic Capital Weights State
  const [alphaWeight, setAlphaWeight] = useState<number>(65.0);
  const [betaWeight, setBetaWeight] = useState<number>(25.0);
  const [gammaWeight, setGammaWeight] = useState<number>(10.0);
  const [weightHistory, setWeightHistory] = useState<StrategyWeightHistoryPoint[]>(() =>
    generateInitialWeightHistory()
  );
  const [solverStatus, setSolverStatus] = useState<string>('OPTIMAL');
  const [solveTimeMs, setSolveTimeMs] = useState<number>(0.84);

  // M3: Rebalance Trigger Scorer State
  const [triggerCeiling, setTriggerCeiling] = useState<number>(65.0);
  const [triggerScore, setTriggerScore] = useState<number>(35.86);
  const [triggerHistory, setTriggerHistory] = useState<TriggerScoreHistoryPoint[]>(() =>
    generateInitialTriggerHistory(65.0)
  );
  const [taxLot, setTaxLot] = useState<TaxLotInfo>(INITIAL_TAX_LOT);

  // M4: Redemption Liquidity Sizer State
  const [currentLiquidityCr, setCurrentLiquidityCr] = useState<number>(9.0);
  const [targetLiquidityCr, setTargetLiquidityCr] = useState<number>(12.19);
  const [trepsYieldPercent, setTrepsYieldPercent] = useState<number>(6.74);
  const [outflowVarCr, setOutflowVarCr] = useState<number>(3.19);

  // M5: Execution Sequencer State
  const [impactSavedInr, setImpactSavedInr] = useState<number>(28450);
  const [washTradesCount, setWashTradesCount] = useState<number>(0);
  const [activeSlicesCount, setActiveSlicesCount] = useState<number>(8);
  const [logs, setLogs] = useState<SequencerLogEntry[]>(INITIAL_LOGS);

  // Helper for toast popup
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Cycle market regime
  const handleCycleRegime = () => {
    if (marketRegime === 'BULLISH LOW-VOL') {
      setMarketRegime('HIGH-VOL CHOPPY');
      setTriggerCeiling(55.0);
      setTargetLiquidityCr(13.45);
      showToast('Switched regime to HIGH-VOL CHOPPY: Trigger ceiling reduced to 55.0');
    } else if (marketRegime === 'HIGH-VOL CHOPPY') {
      setMarketRegime('BEARISH CRUNCH');
      setTriggerCeiling(50.0);
      setTargetLiquidityCr(14.20);
      showToast('Switched regime to BEARISH CRUNCH: Liquidity sleeve target increased to ₹14.20 Cr');
    } else {
      setMarketRegime('BULLISH LOW-VOL');
      setTriggerCeiling(65.0);
      setTargetLiquidityCr(12.19);
      showToast('Switched regime to BULLISH LOW-VOL: Baseline ceiling restored to 65.0');
    }
  };

  // Force Rebalance handler
  const handleForceRebalance = () => {
    if (isRebalancing) return;
    setIsRebalancing(true);

    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 8);

    // Rebalance effect
    setTimeout(() => {
      // Re-center weights closer to strategic targets
      const newAlpha = 60.0;
      const newBeta = 27.5;
      const newGamma = 12.5;

      setAlphaWeight(newAlpha);
      setBetaWeight(newBeta);
      setGammaWeight(newGamma);

      // Reset trigger urgency score
      const newScore = 14.25;
      setTriggerScore(newScore);

      // Replenish liquidity sleeve slightly
      setCurrentLiquidityCr((prev) => Math.min(targetLiquidityCr + 0.3, prev + 1.2));

      // Append log entry to M5
      const newLog: SequencerLogEntry = {
        id: `log-reb-${Date.now()}`,
        timestamp: timeStr,
        type: 'REBALANCE_EXEC',
        badgeColor: 'purple',
        headline: 'PORTFOLIO REBALANCED: CVXPY Optimal Frontier Dispatched',
        explanation: 'Strategic target weights executed via TWAP schedule. Drift zeroed, STT minimized via internal book cross.',
        impactSavedInr: 3450
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 24)]);
      setImpactSavedInr((prev) => prev + 3450);
      setSttSavedLakhs((prev) => prev + 0.18);
      setIsRebalancing(false);
      showToast('Manual Force Rebalance Complete: CVXPY weights aligned, urgency reset.');
    }, 700);
  };

  // Main simulation tick loop (every 1.6 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 8);

      // 1. Tick Tickers with realistic random walk
      setTickers((prev) =>
        prev.map((t) => {
          const deltaPct = (Math.random() - 0.49) * 0.28;
          const newPrice = Math.max(10, t.price * (1 + deltaPct / 100));
          const newChangePct = t.changePercent + deltaPct * 0.4;
          const newChangeAbs = (newPrice * newChangePct) / 100;
          return {
            ...t,
            price: Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePct.toFixed(2)),
            changeAbsolute: Number(newChangeAbs.toFixed(2))
          };
        })
      );

      // 2. M1: Raw and netted volumes gradual drift
      setRawVolume((prev) => {
        const delta = Math.round((Math.random() - 0.48) * 80);
        const nextRaw = Math.min(3350, Math.max(2450, prev + delta));
        
        // Netted volume: 38% to 62% reduction
        const reductionRatio = 0.58 + (Math.random() - 0.5) * 0.08;
        const nextNetted = Math.round(nextRaw * (1 - reductionRatio));
        setNettedVolume(nextNetted);

        // STT Saved calculation: 0.1% on the netted volume value (avg price ~₹2,200)
        const currentSavedLakhs = (nextRaw - nextNetted) * 2200 * 0.001 / 100000;
        setSttSavedLakhs((prevSaved) => Number((prevSaved + currentSavedLakhs * 0.04).toFixed(2)));

        return nextRaw;
      });

      // Subtle drift in gross leverage (1.18x to 1.32x)
      setGrossLeverage((prev) => {
        const delta = (Math.random() - 0.5) * 0.04;
        return Number(Math.min(1.85, Math.max(1.05, prev + delta)).toFixed(1));
      });

      // Subtle fluctuation in issuer concentrations
      setIssuers((prev) =>
        prev.map((iss) => {
          const delta = (Math.random() - 0.49) * 0.14;
          const newAgg = Math.min(iss.limit - 0.2, Math.max(4.0, iss.currentAgg + delta));
          return {
            ...iss,
            currentAgg: Number(newAgg.toFixed(2)),
            exposureCr: Number(((newAgg / 100) * navCr).toFixed(2))
          };
        })
      );

      // 3. M2: Capital weights drift & CVXPY simulation
      setAlphaWeight((prevA) => {
        const deltaA = (Math.random() - 0.48) * 0.45;
        const targetA = Math.min(72.0, Math.max(54.0, prevA + deltaA));

        setBetaWeight((prevB) => {
          const deltaB = (Math.random() - 0.51) * 0.35;
          const targetB = Math.min(32.0, Math.max(18.0, prevB + deltaB));
          const targetG = Number((100.0 - targetA - targetB).toFixed(1));
          setGammaWeight(targetG);

          const newA = Number(targetA.toFixed(1));
          const newB = Number(targetB.toFixed(1));

          // Append to history
          setWeightHistory((history) => {
            const nextHistory = [
              ...history.slice(1),
              {
                time: timeStr,
                alpha: newA,
                beta: newB,
                gamma: targetG,
                rawSignalScore: Number((0.65 + Math.random() * 0.15).toFixed(2))
              }
            ];
            return nextHistory;
          });

          return newB;
        });

        return Number(targetA.toFixed(1));
      });

      setSolveTimeMs(Number((0.78 + Math.random() * 0.16).toFixed(2)));

      // 4. M3: Urgency score drift
      setTriggerScore((prevScore) => {
        const step = (Math.random() - 0.46) * 1.4;
        let nextScore = Number(Math.min(78.0, Math.max(12.0, prevScore + step)).toFixed(2));

        // Auto-rebalance if it spikes way over ceiling
        if (nextScore > triggerCeiling + 8) {
          nextScore = 22.4;
          showToast(`Urgency score breached ${triggerCeiling}! Auto-hedged drift exposure.`);
        }

        const driftComp = Number((nextScore * 0.45).toFixed(2));
        const liqComp = Number((nextScore * 0.35).toFixed(2));
        const taxComp = Number((nextScore * 0.20).toFixed(2));

        setTriggerHistory((h) => [
          ...h.slice(1),
          {
            time: timeStr,
            score: nextScore,
            ceiling: triggerCeiling,
            driftComponent: driftComp,
            liquidityComponent: liqComp,
            taxComponent: taxComp
          }
        ]);

        return nextScore;
      });

      // 5. M4: Liquidity sleeve slight convergence
      setCurrentLiquidityCr((prev) => {
        // Slow random walk
        const step = (Math.random() - 0.45) * 0.08;
        return Number(Math.min(15.0, Math.max(6.5, prev + step)).toFixed(2));
      });

      setTrepsYieldPercent((prev) => {
        const step = (Math.random() - 0.5) * 0.02;
        return Number(Math.min(7.15, Math.max(6.45, prev + step)).toFixed(2));
      });

      // 6. M5: Execution sequencer log generator (occasional events)
      if (Math.random() < 0.45) {
        const eventTypes: Array<{
          type: SequencerLogEntry['type'];
          badgeColor: SequencerLogEntry['badgeColor'];
          headline: string;
          explanation: string;
          symbol: string;
          impact: number;
        }> = [
          {
            type: 'WASH_BLOCKED',
            badgeColor: 'red',
            headline: 'WASH BLOCKED: LT BUY vs SELL (INFY)',
            explanation: 'Alpha Momentum Long 300 vs Beta StatArb Short 300 matched internally. Avoided cross-market exchange wash contravention.',
            symbol: 'INFY',
            impact: 1640
          },
          {
            type: 'TWAP_SLICE',
            badgeColor: 'blue',
            headline: 'TWAP SLICE #07 DISPATCHED (RELIANCE)',
            explanation: 'Dispatched 85 units via Almgren-Chriss schedule to NSE DMA. Spread capture 0.45 INR.',
            symbol: 'RELIANCE',
            impact: 2150
          },
          {
            type: 'NET_INTERNAL',
            badgeColor: 'green',
            headline: 'INTERNAL CROSS: HDFCBANK 600 SHS',
            explanation: 'Crossed internal pool book. Saved ₹986 STT and eliminated market impact slippage.',
            symbol: 'HDFCBANK',
            impact: 1820
          },
          {
            type: 'THROTTLE_VOL',
            badgeColor: 'amber',
            headline: 'IMPACT THROTTLE: TCS SPREAD WIDENED',
            explanation: 'Order book depth thinned on Bid side. Execution sequencer delayed next 50-lot slice by 3.8s.',
            symbol: 'TCS',
            impact: 950
          },
          {
            type: 'TWAP_SLICE',
            badgeColor: 'blue',
            headline: 'TWAP SLICE #05 DISPATCHED (ICICIBANK)',
            explanation: 'Matched at VWAP benchmark 1,239.10 INR. Zero reversion detected.',
            symbol: 'ICICIBANK',
            impact: 1320
          }
        ];

        const chosen = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const newLogEntry: SequencerLogEntry = {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          type: chosen.type,
          badgeColor: chosen.badgeColor,
          headline: chosen.headline,
          explanation: chosen.explanation,
          symbol: chosen.symbol,
          impactSavedInr: chosen.impact
        };

        setLogs((prev) => [newLogEntry, ...prev.slice(0, 29)]);
        setImpactSavedInr((prev) => prev + chosen.impact);
      }
    }, 1700);

    return () => clearInterval(interval);
  }, [isPaused, triggerCeiling, navCr, targetLiquidityCr]);

  return (
    <div className="min-h-screen bg-[#080C14] text-[#F8FAFC] flex flex-col font-sans">
      {/* 1. Top Navigation Bar (50px tall, fixed) */}
      <Navbar
        navCr={navCr}
        marketRegime={marketRegime}
        onCycleRegime={handleCycleRegime}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onForceRebalance={handleForceRebalance}
        isRebalancing={isRebalancing}
        onOpenComplianceModal={() => setShowComplianceModal(true)}
      />

      {/* 2. Live Ticker Ribbon directly below nav (26px tall, #05080F) */}
      <TickerRibbon tickers={tickers} />

      {/* 3. Main Dashboard Content Grid */}
      <main className="flex-1 p-4 lg:p-5 max-w-[1720px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 items-stretch">
          {/* Column 1: M1 (tall card spanning more vertical space) */}
          <div className="flex flex-col h-full">
            <M1NettingGate
              rawVolume={rawVolume}
              nettedVolume={nettedVolume}
              sttSavedLakhs={sttSavedLakhs}
              grossLeverage={grossLeverage}
              issuers={issuers}
              activeOrders={activeOrders}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
            />
          </div>

          {/* Column 2: M2 (top), M3 (below) */}
          <div className="flex flex-col gap-4 lg:gap-5 h-full">
            <div className="flex-1">
              <M2CapitalWeights
                currentAlpha={alphaWeight}
                currentBeta={betaWeight}
                currentGamma={gammaWeight}
                history={weightHistory}
                solverStatus={solverStatus}
                solveTimeMs={solveTimeMs}
              />
            </div>
            <div className="flex-1">
              <M3TriggerScorer
                currentScore={triggerScore}
                ceiling={triggerCeiling}
                history={triggerHistory}
                taxLot={taxLot}
                isHighVol={marketRegime !== 'BULLISH LOW-VOL'}
              />
            </div>
          </div>

          {/* Column 3: M4 (top), M5 (below, taller) */}
          <div className="flex flex-col gap-4 lg:gap-5 h-full">
            <div className="shrink-0">
              <M4LiquiditySizer
                currentLiquidityCr={currentLiquidityCr}
                targetLiquidityCr={targetLiquidityCr}
                trepsYieldPercent={trepsYieldPercent}
                outflowVarCr={outflowVarCr}
                totalNavCr={navCr}
              />
            </div>
            <div className="flex-1">
              <M5ExecutionSequencer
                totalImpactSavedInr={impactSavedInr}
                washTradeCount={washTradesCount}
                logs={logs}
                activeSlicesCount={activeSlicesCount}
                onSelectLog={(log) => {
                  showToast(`Selected Log: ${log.headline}`);
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0E1626] border border-[#38BDF8]/50 text-[#F8FAFC] px-4 py-2.5 rounded shadow-xl font-mono text-xs flex items-center space-x-2 animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ComplianceModal
        isOpen={showComplianceModal}
        onClose={() => setShowComplianceModal(false)}
        grossLeverage={grossLeverage}
        navCr={navCr}
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
