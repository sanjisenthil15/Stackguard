export type MarketRegime = 'BULLISH LOW-VOL' | 'HIGH-VOL CHOPPY' | 'BEARISH CRUNCH';

export interface TickerItem {
  symbol: string;
  price: number;
  changePercent: number;
  changeAbsolute: number;
  lotSize: number;
}

export interface IssuerConcentration {
  name: string;
  rating: string;
  currentAgg: number; // e.g. 17.8%
  limit: number;      // e.g. 20.0%
  status: 'PASS' | 'BREACH' | 'WATCH';
  exposureCr: number; // in ₹ Cr
}

export interface NettedOrder {
  id: string;
  symbol: string;
  alphaQty: number; // e.g. +1000
  betaQty: number;  // e.g. -400
  gammaQty: number; // e.g. 0
  netQty: number;   // +600
  price: number;
  sttSavedInr: number;
  timestamp: string;
  status: 'NETTED_INTERNAL' | 'EXECUTING_TWAP' | 'COMPLETED';
}

export interface StrategyWeightHistoryPoint {
  time: string;
  alpha: number;
  beta: number;
  gamma: number;
  rawSignalScore?: number;
}

export interface TriggerScoreHistoryPoint {
  time: string;
  score: number;
  ceiling: number;
  driftComponent: number;
  liquidityComponent: number;
  taxComponent: number;
}

export interface SequencerLogEntry {
  id: string;
  timestamp: string;
  type: 'WASH_BLOCKED' | 'TWAP_SLICE' | 'NET_INTERNAL' | 'THROTTLE_VOL' | 'REBALANCE_EXEC';
  badgeColor: 'red' | 'blue' | 'amber' | 'green' | 'purple';
  headline: string;
  explanation: string;
  symbol?: string;
  impactSavedInr?: number;
}

export interface TaxLotInfo {
  ticker: string;
  lots: number;
  daysHeld: number;
  daysToLtcg: number;
  stcgTaxEstimated: number;
  ltcgTaxEstimated: number;
  potentialTaxSaved: number;
  taxLocked: boolean;
}
