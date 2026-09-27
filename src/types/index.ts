export type MarketRegime = 'BULLISH LOW-VOL' | 'HIGH-VOL CHOPPY' | 'BEARISH CRUNCH';

export type StrategyName = 'Alpha Momentum' | 'Beta StatArb' | 'Gamma Delta-Neutral';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  fund: string;
}

export interface TickerItem {
  symbol: string;
  name?: string;
  price: number;
  changePercent: number;
  changeAbsolute: number;
  lotSize: number;
  rating?: 'AAA' | 'AA' | 'A' | string;
  sector?: string;
}

export interface IssuerConcentration {
  name: string;
  rating: string;
  sector?: string;
  currentAgg: number; // in %
  limit: number;      // in %
  status: 'PASS' | 'BREACH' | 'WATCH';
  exposureCr: number; // in ₹ Cr
}

export interface NettedOrder {
  id: string;
  symbol: string;
  alphaQty: number;
  betaQty: number;
  gammaQty: number;
  netQty: number;
  price: number;
  sttSavedInr: number;
  timestamp: string;
  status: 'NETTED_INTERNAL' | 'EXECUTING_TWAP' | 'COMPLETED';
}

export interface SectorConcentration {
  sector: string;
  currentAgg: number; // in %
  limit: number;      // in %
  status: 'PASS' | 'BREACH';
  exposureCr: number;
}

export type OrderOutcome = 'ALLOWED' | 'NETTED' | 'BLOCKED';

export interface OrderBlotterItem {
  id: string;
  timestamp: string;
  strategy: StrategyName;
  symbol: string;
  side: 'BUY' | 'SELL';
  qty: number;
  orderType: 'MARKET' | 'LIMIT';
  price: number;
  totalValueInr: number;
  outcome: OrderOutcome;
  outcomeReason: string;
  sttSavedInr?: number;
  nettedAgainstStrategy?: StrategyName;
  nettedQty?: number;
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
  type: 'WASH_BLOCKED' | 'TWAP_SLICE' | 'NET_INTERNAL' | 'THROTTLE_VOL' | 'REBALANCE_EXEC' | 'ORDER_PROCESSED';
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

export interface RedemptionRequest {
  id: string;
  lpName: string;
  amountCr: number;
  requestDate: string;
  settlementDate: string;
  status: 'PENDING' | 'SCHEDULED' | 'FUNDED';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  module: 'M1_NETTING' | 'M2_ALLOCATION' | 'M3_REBALANCING' | 'M4_LIQUIDITY' | 'M5_SEQUENCER' | 'SYSTEM';
  eventType: string;
  decision: 'ALLOWED' | 'BLOCKED' | 'NETTED' | 'EXECUTED' | 'WARNING' | 'CONFIG_CHANGE';
  actor: string;
  headline: string;
  details: string;
}

export interface ComplianceSettings {
  aaaLimitPct: number;      // default 20.0%
  aaLimitPct: number;       // default 16.0%
  aLimitPct: number;        // default 12.0%
  sectorLimitPct: number;   // default 30.0%
  rebalanceCeiling: number; // default 65.0
  liquidityTargetCr: number;// default 12.0 Cr
  grossLeverageLimit: number;// default 2.0x
  enableAutoNetting: boolean;
  enableTaxLockDefense: boolean;
}
