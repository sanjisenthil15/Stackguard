import {
  TickerItem,
  IssuerConcentration,
  NettedOrder,
  StrategyWeightHistoryPoint,
  TriggerScoreHistoryPoint,
  SequencerLogEntry,
  TaxLotInfo,
  MarketRegime
} from '../types';

export const INITIAL_TICKERS: TickerItem[] = [
  { symbol: 'RELIANCE', price: 2948.40, changePercent: 0.84, changeAbsolute: 24.50, lotSize: 250 },
  { symbol: 'TCS', price: 4215.10, changePercent: -0.32, changeAbsolute: -13.50, lotSize: 175 },
  { symbol: 'INFY', price: 1892.75, changePercent: 1.15, changeAbsolute: 21.50, lotSize: 400 },
  { symbol: 'HDFCBANK', price: 1644.30, changePercent: 0.42, changeAbsolute: 6.90, lotSize: 550 },
  { symbol: 'ICICIBANK', price: 1238.90, changePercent: 0.95, changeAbsolute: 11.65, lotSize: 700 },
  { symbol: 'NIFTY50_FUT', price: 24865.50, changePercent: 0.58, changeAbsolute: 142.80, lotSize: 25 },
  { symbol: 'BANKNIFTY_FUT', price: 52190.00, changePercent: 0.71, changeAbsolute: 368.50, lotSize: 15 },
];

export const INITIAL_ISSUERS: IssuerConcentration[] = [
  { name: 'Reliance AAA', rating: 'AAA (Crisil)', currentAgg: 17.82, limit: 20.0, status: 'PASS', exposureCr: 8.91 },
  { name: 'Tata Group AAA', rating: 'AAA (Icra)', currentAgg: 15.40, limit: 20.0, status: 'PASS', exposureCr: 7.70 },
  { name: 'HDFC Group AA', rating: 'AA+ (Care)', currentAgg: 14.12, limit: 16.0, status: 'PASS', exposureCr: 7.06 },
  { name: 'High Yield (A & below)', rating: 'A / A-', currentAgg: 8.85, limit: 12.0, status: 'PASS', exposureCr: 4.42 },
  { name: 'L&T Group AAA', rating: 'AAA (Crisil)', currentAgg: 11.20, limit: 20.0, status: 'PASS', exposureCr: 5.60 }
];

export const INITIAL_NETTED_ORDERS: NettedOrder[] = [
  {
    id: 'ord-101',
    symbol: 'RELIANCE',
    alphaQty: 1000,
    betaQty: -400,
    gammaQty: 0,
    netQty: 600,
    price: 2948.40,
    sttSavedInr: 1179.36,
    timestamp: '09:44:12',
    status: 'NETTED_INTERNAL'
  },
  {
    id: 'ord-102',
    symbol: 'TCS',
    alphaQty: -350,
    betaQty: -150,
    gammaQty: 400,
    netQty: -100,
    price: 4215.10,
    sttSavedInr: 1686.04,
    timestamp: '09:44:10',
    status: 'NETTED_INTERNAL'
  },
  {
    id: 'ord-103',
    symbol: 'HDFCBANK',
    alphaQty: 800,
    betaQty: 0,
    gammaQty: -750,
    netQty: 50,
    price: 1644.30,
    sttSavedInr: 1233.22,
    timestamp: '09:44:06',
    status: 'NETTED_INTERNAL'
  },
  {
    id: 'ord-104',
    symbol: 'INFY',
    alphaQty: 600,
    betaQty: -600,
    gammaQty: 0,
    netQty: 0,
    price: 1892.75,
    sttSavedInr: 2271.30,
    timestamp: '09:44:02',
    status: 'NETTED_INTERNAL'
  }
];

export const INITIAL_TAX_LOT: TaxLotInfo = {
  ticker: 'INFY',
  lots: 2,
  daysHeld: 358,
  daysToLtcg: 7,
  stcgTaxEstimated: 142500,
  ltcgTaxEstimated: 57750,
  potentialTaxSaved: 84750,
  taxLocked: true
};

export const INITIAL_LOGS: SequencerLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '09:44:15',
    type: 'WASH_BLOCKED',
    badgeColor: 'red',
    headline: 'WASH BLOCKED: LT BUY vs SELL',
    explanation: 'Alpha Momentum Long 400 vs Beta StatArb Short 400 internally netted. Zero exchange footprint, avoided SEBI PFUTP alert.',
    symbol: 'INFY',
    impactSavedInr: 1420
  },
  {
    id: 'log-2',
    timestamp: '09:44:12',
    type: 'TWAP_SLICE',
    badgeColor: 'blue',
    headline: 'TWAP SLICE #04 DISPATCHED (RELIANCE)',
    explanation: 'Child slice 120 shares routed to NSE DMA pool via Square-Root impact schedule. Estimated slippage 0.8 bps.',
    symbol: 'RELIANCE',
    impactSavedInr: 2850
  },
  {
    id: 'log-3',
    timestamp: '09:44:08',
    type: 'NET_INTERNAL',
    badgeColor: 'green',
    headline: 'INTERNAL CROSS: TCS 800 SHS',
    explanation: 'Gamma Options Delta-Neutral paired against Alpha Short. Broker STT saving ₹1,686, exchange transaction fee saved ₹312.',
    symbol: 'TCS',
    impactSavedInr: 1998
  },
  {
    id: 'log-4',
    timestamp: '09:44:02',
    type: 'THROTTLE_VOL',
    badgeColor: 'amber',
    headline: 'IMPACT THROTTLE: HDFCBANK SPREAD WIDENED',
    explanation: 'Order book depth thinned on Bid side. Execution sequencer delayed next 50-lot slice by 4.2 seconds.',
    symbol: 'HDFCBANK',
    impactSavedInr: 890
  },
  {
    id: 'log-5',
    timestamp: '09:43:55',
    type: 'TWAP_SLICE',
    badgeColor: 'blue',
    headline: 'TWAP SLICE #03 DISPATCHED (ICICIBANK)',
    explanation: 'Child slice 140 shares matched at VWAP benchmark 1,238.20 INR.',
    symbol: 'ICICIBANK',
    impactSavedInr: 1450
  }
];

// Helper to generate seed history for charts (35 points)
export function generateInitialWeightHistory(): StrategyWeightHistoryPoint[] {
  const points: StrategyWeightHistoryPoint[] = [];
  let a = 62.0;
  let b = 26.5;
  let g = 11.5;

  const now = Date.now();
  for (let i = 35; i >= 0; i--) {
    const timeStr = new Date(now - i * 2000).toTimeString().substring(0, 8);
    // gentle drift
    const deltaA = (Math.random() - 0.48) * 0.8;
    const deltaB = (Math.random() - 0.50) * 0.6;
    a = Math.min(72, Math.max(55, a + deltaA));
    b = Math.min(32, Math.max(18, b + deltaB));
    g = 100.0 - a - b;

    points.push({
      time: timeStr,
      alpha: Number(a.toFixed(1)),
      beta: Number(b.toFixed(1)),
      gamma: Number(g.toFixed(1)),
      rawSignalScore: Number((0.68 + Math.sin(i / 5) * 0.12).toFixed(2))
    });
  }
  return points;
}

export function generateInitialTriggerHistory(ceiling: number = 65.0): TriggerScoreHistoryPoint[] {
  const points: TriggerScoreHistoryPoint[] = [];
  let score = 33.5;
  const now = Date.now();

  for (let i = 35; i >= 0; i--) {
    const timeStr = new Date(now - i * 2000).toTimeString().substring(0, 8);
    const delta = (Math.random() - 0.49) * 1.8;
    score = Math.min(62.0, Math.max(18.0, score + delta));
    const drift = score * 0.45;
    const liq = score * 0.35;
    const tax = score * 0.20;

    points.push({
      time: timeStr,
      score: Number(score.toFixed(2)),
      ceiling,
      driftComponent: Number(drift.toFixed(2)),
      liquidityComponent: Number(liq.toFixed(2)),
      taxComponent: Number(tax.toFixed(2))
    });
  }
  return points;
}
