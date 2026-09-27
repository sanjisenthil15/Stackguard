import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserProfile,
  MarketRegime,
  StrategyName,
  TickerItem,
  IssuerConcentration,
  SectorConcentration,
  OrderBlotterItem,
  OrderOutcome,
  StrategyWeightHistoryPoint,
  TriggerScoreHistoryPoint,
  SequencerLogEntry,
  TaxLotInfo,
  RedemptionRequest,
  AuditLogEntry,
  ComplianceSettings
} from '../types';

interface OrderSubmitParams {
  strategy: StrategyName;
  symbol: string;
  side: 'BUY' | 'SELL';
  qty: number;
  orderType: 'MARKET' | 'LIMIT';
  limitPrice?: number;
}

interface OrderSubmitResult {
  outcome: OrderOutcome;
  outcomeReason: string;
  order: OrderBlotterItem;
  sttSavedInr: number;
  nettedAgainst?: StrategyName;
  projectedAggPct: number;
  limitPct: number;
}

interface AppContextType {
  // Auth
  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  logout: () => void;

  // Global fund state
  navCr: number;
  marketRegime: MarketRegime;
  setMarketRegime: (regime: MarketRegime) => void;
  cycleRegime: () => void;
  isPaused: boolean;
  togglePause: () => void;
  grossLeverage: number;

  // Market data
  tickers: TickerItem[];
  getTicker: (symbol: string) => TickerItem | undefined;

  // Settings / Rules
  settings: ComplianceSettings;
  updateSettings: (newSettings: Partial<ComplianceSettings>) => void;
  resetSettings: () => void;

  // M1: Netting & Exposure
  issuers: IssuerConcentration[];
  sectors: SectorConcentration[];
  orderBlotter: OrderBlotterItem[];
  submitOrder: (params: OrderSubmitParams) => OrderSubmitResult;
  rawVolume: number;
  nettedVolume: number;
  sttSavedLakhs: number;

  // M2: Allocation
  alphaWeight: number;
  betaWeight: number;
  gammaWeight: number;
  weightHistory: StrategyWeightHistoryPoint[];
  solverStatus: string;
  solveTimeMs: number;

  // M3: Rebalancing
  triggerScore: number;
  triggerCeiling: number;
  triggerHistory: TriggerScoreHistoryPoint[];
  taxLots: TaxLotInfo[];
  forceRebalance: () => void;
  isRebalancing: boolean;

  // M4: Liquidity
  currentLiquidityCr: number;
  targetLiquidityCr: number;
  trepsYieldPercent: number;
  outflowVarCr: number;
  redemptions: RedemptionRequest[];
  addRedemptionRequest: (lpName: string, amountCr: number) => void;

  // M5: Execution
  sequencerLogs: SequencerLogEntry[];
  impactSavedInr: number;
  washTradesCount: number;
  activeTwapSlices: Array<{ symbol: string; filled: number; total: number; strategy: string }>;

  // Audit
  auditLogs: AuditLogEntry[];
  exportAuditCsv: () => void;
}

const DEFAULT_SETTINGS: ComplianceSettings = {
  aaaLimitPct: 20.0,
  aaLimitPct: 16.0,
  aLimitPct: 12.0,
  sectorLimitPct: 30.0,
  rebalanceCeiling: 65.0,
  liquidityTargetCr: 12.19,
  grossLeverageLimit: 2.0,
  enableAutoNetting: true,
  enableTaxLockDefense: true
};

const INITIAL_TICKERS: TickerItem[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2948.40, changePercent: 0.84, changeAbsolute: 24.50, lotSize: 250, rating: 'AAA', sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4215.10, changePercent: -0.32, changeAbsolute: -13.50, lotSize: 175, rating: 'AAA', sector: 'Information Technology' },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1892.75, changePercent: 1.15, changeAbsolute: 21.50, lotSize: 400, rating: 'AAA', sector: 'Information Technology' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1644.30, changePercent: 0.42, changeAbsolute: 6.90, lotSize: 550, rating: 'AAA', sector: 'Financial Services' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', price: 1238.90, changePercent: 0.95, changeAbsolute: 11.65, lotSize: 700, rating: 'AAA', sector: 'Financial Services' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', price: 3624.50, changePercent: 0.45, changeAbsolute: 16.20, lotSize: 150, rating: 'AAA', sector: 'Industrials' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1582.00, changePercent: 1.28, changeAbsolute: 20.00, lotSize: 475, rating: 'AA', sector: 'Telecommunications' },
  { symbol: 'SBIN', name: 'State Bank of India', price: 812.40, changePercent: -0.65, changeAbsolute: -5.30, lotSize: 750, rating: 'AA', sector: 'Financial Services' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1785.60, changePercent: 0.35, changeAbsolute: 6.20, lotSize: 400, rating: 'AA', sector: 'Financial Services' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 984.30, changePercent: -1.12, changeAbsolute: -11.15, lotSize: 550, rating: 'A', sector: 'Automobile' }
];

const INITIAL_TAX_LOTS: TaxLotInfo[] = [
  { ticker: 'INFY', lots: 2, daysHeld: 358, daysToLtcg: 7, stcgTaxEstimated: 142500, ltcgTaxEstimated: 57750, potentialTaxSaved: 84750, taxLocked: true },
  { ticker: 'TCS', lots: 1, daysHeld: 354, daysToLtcg: 11, stcgTaxEstimated: 95000, ltcgTaxEstimated: 38500, potentialTaxSaved: 56500, taxLocked: true },
  { ticker: 'RELIANCE', lots: 3, daysHeld: 366, daysToLtcg: 0, stcgTaxEstimated: 0, ltcgTaxEstimated: 64200, potentialTaxSaved: 0, taxLocked: false }
];

const INITIAL_REDEMPTIONS: RedemptionRequest[] = [
  { id: 'RED-801', lpName: 'Kotak Wealth Multi-Family Office', amountCr: 1.50, requestDate: '2026-09-24', settlementDate: '2026-09-29', status: 'SCHEDULED' },
  { id: 'RED-802', lpName: 'Sundaram Ultra-HNI Syndicate', amountCr: 0.90, requestDate: '2026-09-25', settlementDate: '2026-09-30', status: 'SCHEDULED' }
];

const INITIAL_BLOTTER: OrderBlotterItem[] = [
  {
    id: 'ORD-9421',
    timestamp: '09:44:12',
    strategy: 'Alpha Momentum',
    symbol: 'RELIANCE',
    side: 'BUY',
    qty: 1000,
    orderType: 'MARKET',
    price: 2948.40,
    totalValueInr: 2948400,
    outcome: 'NETTED',
    outcomeReason: 'Offset 400 shares against Beta StatArb Short. Saved ₹1,179 STT, routed 600 net to TWAP.',
    sttSavedInr: 1179.36,
    nettedAgainstStrategy: 'Beta StatArb',
    nettedQty: 400
  },
  {
    id: 'ORD-9420',
    timestamp: '09:43:55',
    strategy: 'Beta StatArb',
    symbol: 'RELIANCE',
    side: 'SELL',
    qty: 400,
    orderType: 'MARKET',
    price: 2948.40,
    totalValueInr: 1179360,
    outcome: 'NETTED',
    outcomeReason: 'Crossed against Alpha Momentum Long. Avoided exchange routing footprint.',
    sttSavedInr: 1179.36,
    nettedAgainstStrategy: 'Alpha Momentum',
    nettedQty: 400
  },
  {
    id: 'ORD-9418',
    timestamp: '09:41:20',
    strategy: 'Alpha Momentum',
    symbol: 'TATAMOTORS',
    side: 'BUY',
    qty: 2500,
    orderType: 'LIMIT',
    price: 985.00,
    totalValueInr: 2462500,
    outcome: 'BLOCKED',
    outcomeReason: 'Breaches Rating A single-issuer concentration limit (projected 13.4% vs 12.0% limit).',
    sttSavedInr: 0
  },
  {
    id: 'ORD-9415',
    timestamp: '09:38:05',
    strategy: 'Gamma Delta-Neutral',
    symbol: 'INFY',
    side: 'SELL',
    qty: 500,
    orderType: 'MARKET',
    price: 1892.75,
    totalValueInr: 946375,
    outcome: 'ALLOWED',
    outcomeReason: 'Validated under IT sector limit (24.2% < 30.0%) and AAA rating limit. Dispatched to DMA pool.',
    sttSavedInr: 0
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-301',
    timestamp: '09:44:12',
    module: 'M1_NETTING',
    eventType: 'ORDER_NETTED_INTERNAL',
    decision: 'NETTED',
    actor: 'Pre-Trade Netting Gate',
    headline: 'RELIANCE: Alpha (+1000) vs Beta (-400) Netted',
    details: 'Internal cross executed. Prevented wash trade contravention under SEBI PFUTP Reg 4(2)(a). STT saved: ₹1,179.36.'
  },
  {
    id: 'AUD-300',
    timestamp: '09:41:20',
    module: 'M1_NETTING',
    eventType: 'ORDER_REJECTED_CONCENTRATION',
    decision: 'BLOCKED',
    actor: 'Pre-Trade Netting Gate',
    headline: 'TATAMOTORS: 2,500 Shares BUY Blocked',
    details: 'Projected exposure ₹6.71 Cr (13.42%) breaches Single Issuer Limit for Rating A (12.00%). Execution halted.'
  },
  {
    id: 'AUD-299',
    timestamp: '09:35:00',
    module: 'M3_REBALANCING',
    eventType: 'TAX_LOCK_ENGAGED',
    decision: 'WARNING',
    actor: 'Rebalance Trigger Scorer',
    headline: 'Tax Lock Active: INFY 2 Lots Approaching 365 Days',
    details: 'Urgency score penalizes liquidation within 7-day window. Estimated capital gains tax differential: ₹84,750 (LTCG 12.5% vs STCG 20%).'
  },
  {
    id: 'AUD-298',
    timestamp: '09:30:15',
    module: 'M4_LIQUIDITY',
    eventType: 'BAYESIAN_SLEEVE_EVAL',
    decision: 'WARNING',
    actor: 'Redemption Liquidity Sizer',
    headline: 'Liquidity Deficit Detected: Current ₹9.00 Cr vs Target ₹12.19 Cr',
    details: 'Outflow VaR 95% indicates potential trim required. Overnight TREPS yield 6.74%.'
  },
  {
    id: 'AUD-297',
    timestamp: '09:15:00',
    module: 'M2_ALLOCATION',
    eventType: 'SOLVER_CONVERGED',
    decision: 'EXECUTED',
    actor: 'CVXPY OSQP Solver',
    headline: 'Strategic Weights Optimized: Alpha 65.0%, Beta 25.0%, Gamma 10.0%',
    details: 'Quadratic program converged in 0.84ms. Zero constraint violations.'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Rajiv Sharma',
    email: 'r.sharma@stackguard-aif.in',
    role: 'Chief Investment Officer / Portfolio Manager',
    fund: 'StackGuard Alpha Prime Cat III SIF'
  });

  // Global state
  const [navCr, setNavCr] = useState<number>(50.0);
  const [marketRegime, setMarketRegime] = useState<MarketRegime>('BULLISH LOW-VOL');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [grossLeverage, setGrossLeverage] = useState<number>(1.2);
  const [settings, setSettings] = useState<ComplianceSettings>(DEFAULT_SETTINGS);

  // Market Tickers
  const [tickers, setTickers] = useState<TickerItem[]>(INITIAL_TICKERS);

  // M1: Netting & Exposure
  const [rawVolume, setRawVolume] = useState<number>(2974);
  const [nettedVolume, setNettedVolume] = useState<number>(1112);
  const [sttSavedLakhs, setSttSavedLakhs] = useState<number>(3.84);
  const [orderBlotter, setOrderBlotter] = useState<OrderBlotterItem[]>(INITIAL_BLOTTER);

  // M2: Allocation
  const [alphaWeight, setAlphaWeight] = useState<number>(65.0);
  const [betaWeight, setBetaWeight] = useState<number>(25.0);
  const [gammaWeight, setGammaWeight] = useState<number>(10.0);
  const [solverStatus, setSolverStatus] = useState<string>('OPTIMAL');
  const [solveTimeMs, setSolveTimeMs] = useState<number>(0.84);
  const [weightHistory, setWeightHistory] = useState<StrategyWeightHistoryPoint[]>(() => {
    const list: StrategyWeightHistoryPoint[] = [];
    const now = Date.now();
    for (let i = 35; i >= 0; i--) {
      list.push({
        time: new Date(now - i * 2000).toTimeString().substring(0, 8),
        alpha: Number((63.0 + Math.sin(i / 4) * 2.5).toFixed(1)),
        beta: Number((26.0 - Math.sin(i / 4) * 1.5).toFixed(1)),
        gamma: Number((11.0 - Math.cos(i / 4) * 1.0).toFixed(1))
      });
    }
    return list;
  });

  // M3: Rebalancing
  const [triggerScore, setTriggerScore] = useState<number>(35.86);
  const [taxLots, setTaxLots] = useState<TaxLotInfo[]>(INITIAL_TAX_LOTS);
  const [isRebalancing, setIsRebalancing] = useState<boolean>(false);
  const [triggerHistory, setTriggerHistory] = useState<TriggerScoreHistoryPoint[]>(() => {
    const list: TriggerScoreHistoryPoint[] = [];
    const now = Date.now();
    for (let i = 35; i >= 0; i--) {
      const s = 34 + Math.sin(i / 3) * 6;
      list.push({
        time: new Date(now - i * 2000).toTimeString().substring(0, 8),
        score: Number(s.toFixed(2)),
        ceiling: 65.0,
        driftComponent: Number((s * 0.45).toFixed(2)),
        liquidityComponent: Number((s * 0.35).toFixed(2)),
        taxComponent: Number((s * 0.20).toFixed(2))
      });
    }
    return list;
  });

  // M4: Liquidity
  const [currentLiquidityCr, setCurrentLiquidityCr] = useState<number>(9.0);
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>(INITIAL_REDEMPTIONS);
  const [trepsYieldPercent, setTrepsYieldPercent] = useState<number>(6.74);

  // Dynamic liquidity target: base setting + active redemption requests sum
  const activeRedemptionSum = redemptions.reduce((acc, r) => acc + r.amountCr, 0);
  const targetLiquidityCr = Number((settings.liquidityTargetCr + activeRedemptionSum * 0.6).toFixed(2));
  const outflowVarCr = Number((activeRedemptionSum * 0.8 + 1.25).toFixed(2));

  // M5: Execution
  const [impactSavedInr, setImpactSavedInr] = useState<number>(28450);
  const [washTradesCount, setWashTradesCount] = useState<number>(0);
  const [activeTwapSlices, setActiveTwapSlices] = useState([
    { symbol: 'RELIANCE', filled: 360, total: 600, strategy: 'Alpha Momentum' },
    { symbol: 'TCS', filled: 120, total: 350, strategy: 'Beta StatArb' },
    { symbol: 'INFY', filled: 450, total: 500, strategy: 'Gamma Delta-Neutral' }
  ]);
  const [sequencerLogs, setSequencerLogs] = useState<SequencerLogEntry[]>([
    {
      id: 'seq-1',
      timestamp: '09:44:15',
      type: 'WASH_BLOCKED',
      badgeColor: 'red',
      headline: 'WASH BLOCKED: RELIANCE BUY vs SELL',
      explanation: 'Alpha Momentum Long 400 vs Beta StatArb Short 400 internally netted. Zero exchange footprint, avoided SEBI PFUTP alert.',
      symbol: 'RELIANCE',
      impactSavedInr: 1420
    },
    {
      id: 'seq-2',
      timestamp: '09:44:12',
      type: 'TWAP_SLICE',
      badgeColor: 'blue',
      headline: 'TWAP SLICE #04 DISPATCHED (RELIANCE)',
      explanation: 'Child slice 120 shares routed to NSE DMA pool via Square-Root impact schedule. Estimated slippage 0.8 bps.',
      symbol: 'RELIANCE',
      impactSavedInr: 2850
    },
    {
      id: 'seq-3',
      timestamp: '09:44:08',
      type: 'NET_INTERNAL',
      badgeColor: 'green',
      headline: 'INTERNAL CROSS: TCS 800 SHS',
      explanation: 'Gamma Options Delta-Neutral paired against Alpha Short. Broker STT saving ₹1,686, exchange transaction fee saved ₹312.',
      symbol: 'TCS',
      impactSavedInr: 1998
    }
  ]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Dynamic Issuers Concentration based on active orders + baseline weights
  // Note: settings.aaaLimitPct, settings.aaLimitPct, settings.aLimitPct directly dictate the limits!
  const [issuers, setIssuers] = useState<IssuerConcentration[]>([
    { name: 'Reliance Industries (AAA)', rating: 'AAA', sector: 'Energy', currentAgg: 17.82, limit: DEFAULT_SETTINGS.aaaLimitPct, status: 'PASS', exposureCr: 8.91 },
    { name: 'Tata Group (AAA/A)', rating: 'AAA', sector: 'Information Technology', currentAgg: 15.40, limit: DEFAULT_SETTINGS.aaaLimitPct, status: 'PASS', exposureCr: 7.70 },
    { name: 'HDFC Group (AAA)', rating: 'AAA', sector: 'Financial Services', currentAgg: 14.12, limit: DEFAULT_SETTINGS.aaaLimitPct, status: 'PASS', exposureCr: 7.06 },
    { name: 'ICICI Group (AAA)', rating: 'AAA', sector: 'Financial Services', currentAgg: 11.20, limit: DEFAULT_SETTINGS.aaaLimitPct, status: 'PASS', exposureCr: 5.60 },
    { name: 'Larsen & Toubro (AAA)', rating: 'AAA', sector: 'Industrials', currentAgg: 9.80, limit: DEFAULT_SETTINGS.aaaLimitPct, status: 'PASS', exposureCr: 4.90 },
    { name: 'Bharti Telecom (AA)', rating: 'AA', sector: 'Telecommunications', currentAgg: 13.50, limit: DEFAULT_SETTINGS.aaLimitPct, status: 'PASS', exposureCr: 6.75 },
    { name: 'State Bank of India (AA)', rating: 'AA', sector: 'Financial Services', currentAgg: 10.40, limit: DEFAULT_SETTINGS.aaLimitPct, status: 'PASS', exposureCr: 5.20 },
    { name: 'Tata Motors High Yield (A)', rating: 'A', sector: 'Automobile', currentAgg: 8.85, limit: DEFAULT_SETTINGS.aLimitPct, status: 'PASS', exposureCr: 4.42 }
  ]);

  // Dynamic Sectors
  const [sectors, setSectors] = useState<SectorConcentration[]>([
    { sector: 'Financial Services', currentAgg: 28.50, limit: DEFAULT_SETTINGS.sectorLimitPct, status: 'PASS', exposureCr: 14.25 },
    { sector: 'Information Technology', currentAgg: 23.40, limit: DEFAULT_SETTINGS.sectorLimitPct, status: 'PASS', exposureCr: 11.70 },
    { sector: 'Energy', currentAgg: 17.82, limit: DEFAULT_SETTINGS.sectorLimitPct, status: 'PASS', exposureCr: 8.91 },
    { sector: 'Telecommunications', currentAgg: 13.50, limit: DEFAULT_SETTINGS.sectorLimitPct, status: 'PASS', exposureCr: 6.75 },
    { sector: 'Industrials', currentAgg: 9.80, limit: DEFAULT_SETTINGS.sectorLimitPct, status: 'PASS', exposureCr: 4.90 },
    { sector: 'Automobile', currentAgg: 8.85, limit: DEFAULT_SETTINGS.sectorLimitPct, status: 'PASS', exposureCr: 4.42 }
  ]);

  // Sync issuers and sectors whenever settings change!
  useEffect(() => {
    setIssuers((prev) =>
      prev.map((iss) => {
        let limit = settings.aaaLimitPct;
        if (iss.rating === 'AA') limit = settings.aaLimitPct;
        if (iss.rating === 'A') limit = settings.aLimitPct;
        const status = iss.currentAgg > limit ? 'BREACH' : (iss.currentAgg >= limit * 0.9 ? 'WATCH' : 'PASS');
        return { ...iss, limit, status };
      })
    );

    setSectors((prev) =>
      prev.map((sec) => {
        const limit = settings.sectorLimitPct;
        const status = sec.currentAgg > limit ? 'BREACH' : 'PASS';
        return { ...sec, limit, status };
      })
    );
  }, [settings]);

  // Helper to find ticker
  const getTicker = useCallback((symbol: string) => {
    return tickers.find((t) => t.symbol.toUpperCase() === symbol.toUpperCase());
  }, [tickers]);

  // Log to audit
  const addAuditLog = useCallback((
    module: AuditLogEntry['module'],
    eventType: string,
    decision: AuditLogEntry['decision'],
    headline: string,
    details: string
  ) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toTimeString().substring(0, 8),
      module,
      eventType,
      decision,
      actor: user?.name || 'System Auto-Engine',
      headline,
      details
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 99)]);
  }, [user]);

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<ComplianceSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      addAuditLog(
        'SYSTEM',
        'SETTINGS_UPDATED',
        'CONFIG_CHANGE',
        'Risk & Compliance Parameters Modified',
        `AAA: ${updated.aaaLimitPct}%, AA: ${updated.aaLimitPct}%, A: ${updated.aLimitPct}%, Sector: ${updated.sectorLimitPct}%, Rebalance Ceiling: ${updated.rebalanceCeiling}`
      );
      return updated;
    });
  }, [addAuditLog]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    addAuditLog('SYSTEM', 'SETTINGS_RESET', 'CONFIG_CHANGE', 'Compliance Parameters Reset', 'Restored SEBI standard Cat III default parameters.');
  }, [addAuditLog]);

  // Auth functions
  const login = (email: string, name?: string) => {
    const displayName = name || (email.split('@')[0].replace('.', ' ') || 'Portfolio Manager');
    setUser({
      name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      email,
      role: 'Chief Investment Officer / Portfolio Manager',
      fund: 'StackGuard Alpha Prime Cat III SIF'
    });
    addAuditLog('SYSTEM', 'USER_LOGIN', 'ALLOWED', `User Login: ${email}`, 'Manager authenticated to trading terminal.');
  };

  const logout = () => {
    addAuditLog('SYSTEM', 'USER_LOGOUT', 'ALLOWED', `User Logout: ${user?.email}`, 'Session concluded.');
    setUser(null);
  };

  const cycleRegime = useCallback(() => {
    setMarketRegime((prev) => {
      if (prev === 'BULLISH LOW-VOL') {
        addAuditLog('M3_REBALANCING', 'REGIME_SHIFT', 'WARNING', 'Market Regime: HIGH-VOL CHOPPY', 'Volatility spike detected. Trigger ceiling compressed to 55.0.');
        return 'HIGH-VOL CHOPPY';
      }
      if (prev === 'HIGH-VOL CHOPPY') {
        addAuditLog('M4_LIQUIDITY', 'REGIME_SHIFT', 'WARNING', 'Market Regime: BEARISH CRUNCH', 'Liquidity stress test active. Target liquidity raised to ₹14.0 Cr.');
        return 'BEARISH CRUNCH';
      }
      addAuditLog('M1_NETTING', 'REGIME_SHIFT', 'ALLOWED', 'Market Regime: BULLISH LOW-VOL', 'Normal market volatility restored. Standard ceilings applied.');
      return 'BULLISH LOW-VOL';
    });
  }, [addAuditLog]);

  const togglePause = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  // Force Rebalance action
  const forceRebalance = useCallback(() => {
    if (isRebalancing) return;
    setIsRebalancing(true);

    setTimeout(() => {
      setAlphaWeight(62.0);
      setBetaWeight(26.0);
      setGammaWeight(12.0);
      setTriggerScore(14.25);
      setCurrentLiquidityCr((prev) => Math.min(targetLiquidityCr + 0.4, prev + 1.1));

      const timeStr = new Date().toTimeString().substring(0, 8);
      const seqEntry: SequencerLogEntry = {
        id: `seq-${Date.now()}`,
        timestamp: timeStr,
        type: 'REBALANCE_EXEC',
        badgeColor: 'purple',
        headline: 'PORTFOLIO REBALANCED: CVXPY Target Weights Executed',
        explanation: 'All strategy drift neutralized. STT minimized via internal pool crosses.',
        impactSavedInr: 3840
      };
      setSequencerLogs((prev) => [seqEntry, ...prev.slice(0, 29)]);
      setImpactSavedInr((prev) => prev + 3840);
      setSttSavedLakhs((prev) => Number((prev + 0.24).toFixed(2)));

      addAuditLog(
        'M3_REBALANCING',
        'FORCE_REBALANCE_EXECUTED',
        'EXECUTED',
        'Manual Portfolio Rebalance Executed',
        'Target weights re-aligned: Alpha 62.0%, Beta 26.0%, Gamma 12.0%. Urgency score reset to 14.25.'
      );

      setIsRebalancing(false);
    }, 600);
  }, [isRebalancing, targetLiquidityCr, addAuditLog]);

  // Add Redemption Request
  const addRedemptionRequest = useCallback((lpName: string, amountCr: number) => {
    const today = new Date().toISOString().split('T')[0];
    const settlement = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const newReq: RedemptionRequest = {
      id: `RED-${Math.floor(100 + Math.random() * 900)}`,
      lpName: lpName || 'Institutional LP Partner',
      amountCr: Number(amountCr.toFixed(2)),
      requestDate: today,
      settlementDate: settlement,
      status: 'SCHEDULED'
    };
    setRedemptions((prev) => [newReq, ...prev]);

    addAuditLog(
      'M4_LIQUIDITY',
      'REDEMPTION_NOTICE_FILED',
      'WARNING',
      `Redemption Notice: ₹${amountCr.toFixed(2)} Cr from ${newReq.lpName}`,
      `Bayesian outflow forecast adjusted. Target liquidity sleeve expanded.`
    );
  }, [addAuditLog]);

  // CORE ORDER SUBMISSION ENGINE
  const submitOrder = useCallback((params: OrderSubmitParams): OrderSubmitResult => {
    const ticker = getTicker(params.symbol) || {
      symbol: params.symbol,
      name: params.symbol,
      price: 2500,
      changePercent: 0,
      changeAbsolute: 0,
      lotSize: 100,
      rating: 'AAA' as const,
      sector: 'General'
    };

    const execPrice = params.orderType === 'LIMIT' && params.limitPrice ? params.limitPrice : ticker.price;
    const orderValueInr = params.qty * execPrice;
    const orderValueCr = orderValueInr / 10000000;
    const orderValuePctOfNav = (orderValueCr / navCr) * 100;

    const timeStr = new Date().toTimeString().substring(0, 8);
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Check applicable limits from settings
    let ratingLimit = settings.aaaLimitPct;
    if (ticker.rating === 'AA') ratingLimit = settings.aaLimitPct;
    if (ticker.rating === 'A') ratingLimit = settings.aLimitPct;

    // Find current issuer concentration
    const currentIssuer = issuers.find((i) => i.name.toUpperCase().includes(ticker.symbol) || i.sector === ticker.sector) || {
      name: ticker.name,
      rating: ticker.rating,
      sector: ticker.sector,
      currentAgg: 10.0,
      limit: ratingLimit,
      status: 'PASS' as const,
      exposureCr: 5.0
    };

    // Find current sector concentration
    const currentSec = sectors.find((s) => s.sector === ticker.sector) || {
      sector: ticker.sector,
      currentAgg: 15.0,
      limit: settings.sectorLimitPct,
      status: 'PASS' as const,
      exposureCr: 7.5
    };

    const projectedIssuerPct = params.side === 'BUY'
      ? Number((currentIssuer.currentAgg + orderValuePctOfNav).toFixed(2))
      : Number((Math.max(0, currentIssuer.currentAgg - orderValuePctOfNav)).toFixed(2));

    const projectedSectorPct = params.side === 'BUY'
      ? Number((currentSec.currentAgg + orderValuePctOfNav).toFixed(2))
      : Number((Math.max(0, currentSec.currentAgg - orderValuePctOfNav)).toFixed(2));

    // CHECK 1: Limit Breaches (Blocked)
    if (params.side === 'BUY' && projectedIssuerPct > ratingLimit) {
      const breachPct = Number((projectedIssuerPct - ratingLimit).toFixed(2));
      const reason = `BREACH: Projected ${ticker.name} exposure would reach ${projectedIssuerPct}%, exceeding Rating ${ticker.rating} cap of ${ratingLimit}% by +${breachPct}% (₹${((breachPct/100)*navCr).toFixed(2)} Cr). Order blocked under SEBI Cat III norms.`;
      
      const blotterItem: OrderBlotterItem = {
        id: orderId,
        timestamp: timeStr,
        strategy: params.strategy,
        symbol: ticker.symbol,
        side: params.side,
        qty: params.qty,
        orderType: params.orderType,
        price: execPrice,
        totalValueInr: orderValueInr,
        outcome: 'BLOCKED',
        outcomeReason: reason,
        sttSavedInr: 0
      };

      setOrderBlotter((prev) => [blotterItem, ...prev]);
      addAuditLog(
        'M1_NETTING',
        'ORDER_BLOCKED_CONCENTRATION',
        'BLOCKED',
        `${ticker.symbol} ${params.side} ${params.qty} SHS BLOCKED`,
        reason
      );

      return {
        outcome: 'BLOCKED',
        outcomeReason: reason,
        order: blotterItem,
        sttSavedInr: 0,
        projectedAggPct: projectedIssuerPct,
        limitPct: ratingLimit
      };
    }

    if (params.side === 'BUY' && projectedSectorPct > settings.sectorLimitPct) {
      const breachPct = Number((projectedSectorPct - settings.sectorLimitPct).toFixed(2));
      const reason = `BREACH: Sector ${ticker.sector} exposure would reach ${projectedSectorPct}%, exceeding sector limit of ${settings.sectorLimitPct}% by +${breachPct}%. Order blocked.`;

      const blotterItem: OrderBlotterItem = {
        id: orderId,
        timestamp: timeStr,
        strategy: params.strategy,
        symbol: ticker.symbol,
        side: params.side,
        qty: params.qty,
        orderType: params.orderType,
        price: execPrice,
        totalValueInr: orderValueInr,
        outcome: 'BLOCKED',
        outcomeReason: reason,
        sttSavedInr: 0
      };

      setOrderBlotter((prev) => [blotterItem, ...prev]);
      addAuditLog(
        'M1_NETTING',
        'ORDER_BLOCKED_SECTOR',
        'BLOCKED',
        `${ticker.symbol} ${params.side} ${params.qty} SHS BLOCKED (Sector)`,
        reason
      );

      return {
        outcome: 'BLOCKED',
        outcomeReason: reason,
        order: blotterItem,
        sttSavedInr: 0,
        projectedAggPct: projectedSectorPct,
        limitPct: settings.sectorLimitPct
      };
    }

    // CHECK 2: Internal Netting Opportunity (Opposing order in order pool)
    const opposingOrder = orderBlotter.find(
      (b) => b.symbol === ticker.symbol && b.strategy !== params.strategy && b.side !== params.side && b.outcome !== 'BLOCKED'
    );

    if (settings.enableAutoNetting && opposingOrder) {
      const nettedUnits = Math.min(params.qty, opposingOrder.qty);
      const remainingUnits = params.qty - nettedUnits;
      const sttSaved = nettedUnits * execPrice * 0.001; // 0.1% STT savings on internal book match

      const reason = `INTERNAL NETTING: Successfully matched ${nettedUnits} units against ${opposingOrder.strategy} (${opposingOrder.side}). Saved ₹${sttSaved.toFixed(0)} STT. Prevented wash trades under SEBI PFUTP Reg 4(2)(a). ${remainingUnits > 0 ? `${remainingUnits} residual units queued for TWAP.` : '100% internal offset.'}`;

      const blotterItem: OrderBlotterItem = {
        id: orderId,
        timestamp: timeStr,
        strategy: params.strategy,
        symbol: ticker.symbol,
        side: params.side,
        qty: params.qty,
        orderType: params.orderType,
        price: execPrice,
        totalValueInr: orderValueInr,
        outcome: 'NETTED',
        outcomeReason: reason,
        sttSavedInr: sttSaved,
        nettedAgainstStrategy: opposingOrder.strategy,
        nettedQty: nettedUnits
      };

      setOrderBlotter((prev) => [blotterItem, ...prev]);
      setSttSavedLakhs((prev) => Number((prev + sttSaved / 100000).toFixed(2)));
      setRawVolume((prev) => prev + params.qty);
      setNettedVolume((prev) => prev + remainingUnits);

      // Add to sequencer logs
      const seqEntry: SequencerLogEntry = {
        id: `seq-${Date.now()}`,
        timestamp: timeStr,
        type: 'NET_INTERNAL',
        badgeColor: 'green',
        headline: `INTERNAL CROSS: ${ticker.symbol} ${nettedUnits} SHS`,
        explanation: `${params.strategy} matched internally with ${opposingOrder.strategy}. Zero market slippage, ₹${sttSaved.toFixed(0)} STT saved.`,
        symbol: ticker.symbol,
        impactSavedInr: Math.round(sttSaved * 1.2)
      };
      setSequencerLogs((prev) => [seqEntry, ...prev.slice(0, 29)]);
      setImpactSavedInr((prev) => prev + Math.round(sttSaved * 1.2));

      addAuditLog(
        'M1_NETTING',
        'ORDER_NETTED_CROSS',
        'NETTED',
        `${ticker.symbol}: ${nettedUnits} Shares Netted (${params.strategy} vs ${opposingOrder.strategy})`,
        reason
      );

      return {
        outcome: 'NETTED',
        outcomeReason: reason,
        order: blotterItem,
        sttSavedInr: sttSaved,
        nettedAgainst: opposingOrder.strategy,
        projectedAggPct: projectedIssuerPct,
        limitPct: ratingLimit
      };
    }

    // CHECK 3: Allowed (Compliant)
    const reason = `ALLOWED: Order compliant with Rating ${ticker.rating} limit (${projectedIssuerPct}% <= ${ratingLimit}%) and Sector ${ticker.sector} limit (${projectedSectorPct}% <= ${settings.sectorLimitPct}%). Dispatched to Execution Sequencer.`;

    const blotterItem: OrderBlotterItem = {
      id: orderId,
      timestamp: timeStr,
      strategy: params.strategy,
      symbol: ticker.symbol,
      side: params.side,
      qty: params.qty,
      orderType: params.orderType,
      price: execPrice,
      totalValueInr: orderValueInr,
      outcome: 'ALLOWED',
      outcomeReason: reason,
      sttSavedInr: 0
    };

    setOrderBlotter((prev) => [blotterItem, ...prev]);
    setRawVolume((prev) => prev + params.qty);
    setNettedVolume((prev) => prev + params.qty);

    // Update issuer exposure on allowed order
    setIssuers((prev) =>
      prev.map((iss) => {
        if (iss.name.toUpperCase().includes(ticker.symbol) || iss.sector === ticker.sector) {
          const newAgg = Math.min(iss.limit - 0.1, Number((iss.currentAgg + (params.side === 'BUY' ? orderValuePctOfNav * 0.4 : -orderValuePctOfNav * 0.4)).toFixed(2)));
          return {
            ...iss,
            currentAgg: Math.max(2.0, newAgg),
            exposureCr: Number(((newAgg / 100) * navCr).toFixed(2))
          };
        }
        return iss;
      })
    );

    // Add TWAP slice to sequencer
    const seqEntry: SequencerLogEntry = {
      id: `seq-${Date.now()}`,
      timestamp: timeStr,
      type: 'TWAP_SLICE',
      badgeColor: 'blue',
      headline: `TWAP DISPATCH: ${ticker.symbol} ${params.qty} SHS (${params.side})`,
      explanation: `Staggered into Almgren-Chriss square root schedule across 4 intervals.`,
      symbol: ticker.symbol,
      impactSavedInr: Math.round(params.qty * 1.8)
    };
    setSequencerLogs((prev) => [seqEntry, ...prev.slice(0, 29)]);
    setImpactSavedInr((prev) => prev + Math.round(params.qty * 1.8));

    addAuditLog(
      'M5_SEQUENCER',
      'ORDER_ALLOWED_DISPATCHED',
      'ALLOWED',
      `${ticker.symbol} ${params.side} ${params.qty} SHS Allowed`,
      reason
    );

    return {
      outcome: 'ALLOWED',
      outcomeReason: reason,
      order: blotterItem,
      sttSavedInr: 0,
      projectedAggPct: projectedIssuerPct,
      limitPct: ratingLimit
    };
  }, [getTicker, navCr, settings, issuers, sectors, orderBlotter, addAuditLog]);

  // Export Audit CSV
  const exportAuditCsv = useCallback(() => {
    const headers = ['ID', 'Timestamp', 'Module', 'Event Type', 'Decision', 'Actor', 'Headline', 'Details'];
    const rows = auditLogs.map((log) => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.module}"`,
      `"${log.eventType}"`,
      `"${log.decision}"`,
      `"${log.actor}"`,
      `"${log.headline.replace(/"/g, '""')}"`,
      `"${log.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stackguard_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addAuditLog('SYSTEM', 'AUDIT_EXPORT_CSV', 'ALLOWED', 'Audit Trail Exported to CSV', `Exported ${auditLogs.length} audit records.`);
  }, [auditLogs, addAuditLog]);

  // CONTINUOUS BACKGROUND TICK
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 8);

      // 1. Subtle price walk on tickers
      setTickers((prev) =>
        prev.map((t) => {
          const deltaPct = (Math.random() - 0.49) * 0.22;
          const newPrice = Math.max(10, t.price * (1 + deltaPct / 100));
          const newChangePct = t.changePercent + deltaPct * 0.35;
          const newChangeAbs = (newPrice * newChangePct) / 100;
          return {
            ...t,
            price: Number(newPrice.toFixed(2)),
            changePercent: Number(newChangePct.toFixed(2)),
            changeAbsolute: Number(newChangeAbs.toFixed(2))
          };
        })
      );

      // 2. M2: Capital weights drift
      setAlphaWeight((prevA) => {
        const deltaA = (Math.random() - 0.48) * 0.35;
        const targetA = Math.min(71.0, Math.max(56.0, prevA + deltaA));

        setBetaWeight((prevB) => {
          const deltaB = (Math.random() - 0.51) * 0.3;
          const targetB = Math.min(31.0, Math.max(19.0, prevB + deltaB));
          const targetG = Number((100.0 - targetA - targetB).toFixed(1));
          setGammaWeight(targetG);

          const newA = Number(targetA.toFixed(1));
          const newB = Number(targetB.toFixed(1));

          setWeightHistory((history) => [
            ...history.slice(1),
            { time: timeStr, alpha: newA, beta: newB, gamma: targetG }
          ]);

          return newB;
        });

        return Number(targetA.toFixed(1));
      });

      // 3. M3: Urgency Score drift
      setTriggerScore((prev) => {
        const step = (Math.random() - 0.46) * 1.1;
        const nextScore = Number(Math.min(75.0, Math.max(15.0, prev + step)).toFixed(2));
        const driftComp = Number((nextScore * 0.45).toFixed(2));
        const liqComp = Number((nextScore * 0.35).toFixed(2));
        const taxComp = Number((nextScore * 0.20).toFixed(2));

        setTriggerHistory((h) => [
          ...h.slice(1),
          {
            time: timeStr,
            score: nextScore,
            ceiling: settings.rebalanceCeiling,
            driftComponent: driftComp,
            liquidityComponent: liqComp,
            taxComponent: taxComp
          }
        ]);

        return nextScore;
      });

      // 4. Subtle liquidity movement
      setCurrentLiquidityCr((prev) => {
        const step = (Math.random() - 0.46) * 0.06;
        return Number(Math.min(14.5, Math.max(7.2, prev + step)).toFixed(2));
      });

      // 5. Update active TWAP slices progress
      setActiveTwapSlices((prev) =>
        prev.map((s) => {
          const increment = Math.round(Math.random() * 20);
          const newFilled = s.filled >= s.total ? 0 : Math.min(s.total, s.filled + increment);
          return { ...s, filled: newFilled };
        })
      );
    }, 1900);

    return () => clearInterval(interval);
  }, [isPaused, settings.rebalanceCeiling]);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        navCr,
        marketRegime,
        setMarketRegime,
        cycleRegime,
        isPaused,
        togglePause,
        grossLeverage,
        tickers,
        getTicker,
        settings,
        updateSettings,
        resetSettings,
        issuers,
        sectors,
        orderBlotter,
        submitOrder,
        rawVolume,
        nettedVolume,
        sttSavedLakhs,
        alphaWeight,
        betaWeight,
        gammaWeight,
        weightHistory,
        solverStatus,
        solveTimeMs,
        triggerScore,
        triggerCeiling: settings.rebalanceCeiling,
        triggerHistory,
        taxLots,
        forceRebalance,
        isRebalancing,
        currentLiquidityCr,
        targetLiquidityCr,
        trepsYieldPercent,
        outflowVarCr,
        redemptions,
        addRedemptionRequest,
        sequencerLogs,
        impactSavedInr,
        washTradesCount,
        activeTwapSlices,
        auditLogs,
        exportAuditCsv
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
