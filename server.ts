import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// -------------------------------------------------------------
// IN-MEMORY BACKEND DATA STORE
// -------------------------------------------------------------
interface Ticker {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  changeAbsolute: number;
  lotSize: number;
  rating: 'AAA' | 'AA' | 'A';
  sector: string;
}

interface IssuerLimit {
  name: string;
  rating: 'AAA' | 'AA' | 'A';
  sector: string;
  currentAgg: number;
  limit: number;
  status: 'PASS' | 'BREACH' | 'WATCH';
  exposureCr: number;
}

interface SectorLimit {
  sector: string;
  currentAgg: number;
  limit: number;
  status: 'PASS' | 'BREACH';
  exposureCr: number;
}

interface OrderRecord {
  id: string;
  timestamp: string;
  strategy: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  qty: number;
  orderType: 'MARKET' | 'LIMIT';
  price: number;
  totalValueInr: number;
  outcome: 'ALLOWED' | 'NETTED' | 'BLOCKED';
  outcomeReason: string;
  sttSavedInr?: number;
  nettedAgainstStrategy?: string;
  nettedQty?: number;
}

interface AuditRecord {
  id: string;
  timestamp: string;
  module: string;
  eventType: string;
  decision: string;
  actor: string;
  headline: string;
  details: string;
}

const fundState = {
  navCr: 50.0,
  marketRegime: 'BULLISH LOW-VOL',
  grossLeverage: 1.2,
  alphaWeight: 65.0,
  betaWeight: 25.0,
  gammaWeight: 10.0,
  triggerScore: 35.86,
  rawVolume: 2974,
  nettedVolume: 1112,
  sttSavedLakhs: 3.84,
  impactSavedInr: 28450,
  washTradesCount: 0,
  currentLiquidityCr: 9.0,
  targetLiquidityCr: 12.19,
  trepsYieldPercent: 6.74,
  outflowVarCr: 3.19
};

const settings = {
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

const tickers: Ticker[] = [
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

let issuers: IssuerLimit[] = [
  { name: 'Reliance Industries (AAA)', rating: 'AAA', sector: 'Energy', currentAgg: 17.82, limit: 20.0, status: 'PASS', exposureCr: 8.91 },
  { name: 'Tata Group (AAA/A)', rating: 'AAA', sector: 'Information Technology', currentAgg: 15.40, limit: 20.0, status: 'PASS', exposureCr: 7.70 },
  { name: 'HDFC Group (AAA)', rating: 'AAA', sector: 'Financial Services', currentAgg: 14.12, limit: 20.0, status: 'PASS', exposureCr: 7.06 },
  { name: 'ICICI Group (AAA)', rating: 'AAA', sector: 'Financial Services', currentAgg: 11.20, limit: 20.0, status: 'PASS', exposureCr: 5.60 },
  { name: 'Larsen & Toubro (AAA)', rating: 'AAA', sector: 'Industrials', currentAgg: 9.80, limit: 20.0, status: 'PASS', exposureCr: 4.90 },
  { name: 'Bharti Telecom (AA)', rating: 'AA', sector: 'Telecommunications', currentAgg: 13.50, limit: 16.0, status: 'PASS', exposureCr: 6.75 },
  { name: 'State Bank of India (AA)', rating: 'AA', sector: 'Financial Services', currentAgg: 10.40, limit: 16.0, status: 'PASS', exposureCr: 5.20 },
  { name: 'Tata Motors High Yield (A)', rating: 'A', sector: 'Automobile', currentAgg: 8.85, limit: 12.0, status: 'PASS', exposureCr: 4.42 }
];

let sectors: SectorLimit[] = [
  { sector: 'Financial Services', currentAgg: 28.50, limit: 30.0, status: 'PASS', exposureCr: 14.25 },
  { sector: 'Information Technology', currentAgg: 23.40, limit: 30.0, status: 'PASS', exposureCr: 11.70 },
  { sector: 'Energy', currentAgg: 17.82, limit: 30.0, status: 'PASS', exposureCr: 8.91 },
  { sector: 'Telecommunications', currentAgg: 13.50, limit: 30.0, status: 'PASS', exposureCr: 6.75 },
  { sector: 'Industrials', currentAgg: 9.80, limit: 30.0, status: 'PASS', exposureCr: 4.90 },
  { sector: 'Automobile', currentAgg: 8.85, limit: 30.0, status: 'PASS', exposureCr: 4.42 }
];

const orders: OrderRecord[] = [
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

const auditLogs: AuditRecord[] = [
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

const redemptions = [
  { id: 'RED-801', lpName: 'Kotak Wealth Multi-Family Office', amountCr: 1.50, requestDate: '2026-09-24', settlementDate: '2026-09-29', status: 'SCHEDULED' },
  { id: 'RED-802', lpName: 'Sundaram Ultra-HNI Syndicate', amountCr: 0.90, requestDate: '2026-09-25', settlementDate: '2026-09-30', status: 'SCHEDULED' }
];

function addAudit(module: string, eventType: string, decision: string, actor: string, headline: string, details: string) {
  const record: AuditRecord = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toTimeString().substring(0, 8),
    module,
    eventType,
    decision,
    actor,
    headline,
    details
  };
  auditLogs.unshift(record);
  if (auditLogs.length > 200) auditLogs.pop();
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. System Health & Fund Summary
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    complianceEnvelope: 'SEBI CAT III / SIF',
    healthScore: 98.6,
    grossLeverage: fundState.grossLeverage,
    leverageLimit: settings.grossLeverageLimit,
    activeOrdersCount: orders.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/fund', (req: Request, res: Response) => {
  res.json({
    ...fundState,
    settings
  });
});

// 2. Market Data & Tickers
app.get('/api/tickers', (req: Request, res: Response) => {
  res.json(tickers);
});

// 3. Exposure & Limits
app.get('/api/exposure/issuers', (req: Request, res: Response) => {
  const synced = issuers.map((iss) => {
    let limit = settings.aaaLimitPct;
    if (iss.rating === 'AA') limit = settings.aaLimitPct;
    if (iss.rating === 'A') limit = settings.aLimitPct;
    const status = iss.currentAgg > limit ? 'BREACH' : (iss.currentAgg >= limit * 0.9 ? 'WATCH' : 'PASS');
    return { ...iss, limit, status };
  });
  res.json(synced);
});

app.get('/api/exposure/sectors', (req: Request, res: Response) => {
  const synced = sectors.map((sec) => ({
    ...sec,
    limit: settings.sectorLimitPct,
    status: (sec.currentAgg > settings.sectorLimitPct ? 'BREACH' : 'PASS') as 'BREACH' | 'PASS'
  }));
  res.json(synced);
});

// 4. Order Evaluation & Routing (M1 Pre-Trade Netting Gate)
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});

app.post('/api/orders/evaluate', (req: Request, res: Response) => {
  const { strategy, symbol, side, qty, orderType, limitPrice } = req.body;

  if (!strategy || !symbol || !side || !qty) {
    return res.status(400).json({ error: 'Missing required order fields: strategy, symbol, side, qty' });
  }

  const ticker = tickers.find((t) => t.symbol.toUpperCase() === symbol.toUpperCase()) || {
    symbol,
    name: symbol,
    price: 2500.0,
    rating: 'AAA' as const,
    sector: 'General'
  };

  const execPrice = orderType === 'LIMIT' && limitPrice ? Number(limitPrice) : ticker.price;
  const totalValueInr = Number((qty * execPrice).toFixed(2));
  const orderValueCr = totalValueInr / 10000000;
  const orderValuePctOfNav = (orderValueCr / fundState.navCr) * 100;
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const timeStr = new Date().toTimeString().substring(0, 8);

  // Applicable limits
  let ratingLimit = settings.aaaLimitPct;
  if (ticker.rating === 'AA') ratingLimit = settings.aaLimitPct;
  if (ticker.rating === 'A') ratingLimit = settings.aLimitPct;

  const currentIssuer = issuers.find((i) => i.name.toUpperCase().includes(ticker.symbol) || i.sector === ticker.sector) || {
    name: ticker.name,
    rating: ticker.rating,
    sector: ticker.sector,
    currentAgg: 10.0,
    limit: ratingLimit
  };

  const projectedIssuerPct = side === 'BUY'
    ? Number((currentIssuer.currentAgg + orderValuePctOfNav).toFixed(2))
    : Number((Math.max(0, currentIssuer.currentAgg - orderValuePctOfNav)).toFixed(2));

  // 1. Concentration Breach Check
  if (side === 'BUY' && projectedIssuerPct > ratingLimit) {
    const breachPct = Number((projectedIssuerPct - ratingLimit).toFixed(2));
    const reason = `BREACH: Projected ${ticker.name} exposure would reach ${projectedIssuerPct}%, exceeding Rating ${ticker.rating} cap of ${ratingLimit}% by +${breachPct}%. Order blocked under SEBI Cat III norms.`;

    const blotterItem: OrderRecord = {
      id: orderId,
      timestamp: timeStr,
      strategy,
      symbol: ticker.symbol,
      side,
      qty,
      orderType: orderType || 'MARKET',
      price: execPrice,
      totalValueInr,
      outcome: 'BLOCKED',
      outcomeReason: reason,
      sttSavedInr: 0
    };
    orders.unshift(blotterItem);

    addAudit('M1_NETTING', 'ORDER_BLOCKED_CONCENTRATION', 'BLOCKED', 'Pre-Trade Netting Gate', `${ticker.symbol} ${side} ${qty} SHS BLOCKED`, reason);

    return res.json({
      outcome: 'BLOCKED',
      outcomeReason: reason,
      order: blotterItem,
      projectedAggPct: projectedIssuerPct,
      limitPct: ratingLimit,
      sttSavedInr: 0
    });
  }

  // 2. Netting Opportunity Check (against opposite order in queue)
  const opposingOrder = orders.find(
    (o) => o.symbol === ticker.symbol && o.strategy !== strategy && o.side !== side && o.outcome !== 'BLOCKED'
  );

  if (settings.enableAutoNetting && opposingOrder) {
    const nettedUnits = Math.min(qty, opposingOrder.qty);
    const remainingUnits = qty - nettedUnits;
    const sttSavedInr = Number((nettedUnits * execPrice * 0.001).toFixed(2)); // 0.1% STT savings

    const reason = `INTERNAL NETTING: Successfully matched ${nettedUnits} units against ${opposingOrder.strategy} (${opposingOrder.side}). Saved ₹${sttSavedInr.toFixed(0)} STT. Prevented wash trades under SEBI PFUTP Reg 4(2)(a). ${remainingUnits > 0 ? `${remainingUnits} residual units queued for TWAP.` : '100% internal offset.'}`;

    const blotterItem: OrderRecord = {
      id: orderId,
      timestamp: timeStr,
      strategy,
      symbol: ticker.symbol,
      side,
      qty,
      orderType: orderType || 'MARKET',
      price: execPrice,
      totalValueInr,
      outcome: 'NETTED',
      outcomeReason: reason,
      sttSavedInr,
      nettedAgainstStrategy: opposingOrder.strategy,
      nettedQty: nettedUnits
    };
    orders.unshift(blotterItem);

    fundState.sttSavedLakhs = Number((fundState.sttSavedLakhs + sttSavedInr / 100000).toFixed(2));
    fundState.rawVolume += qty;
    fundState.nettedVolume += remainingUnits;

    addAudit('M1_NETTING', 'ORDER_NETTED_CROSS', 'NETTED', 'Pre-Trade Netting Gate', `${ticker.symbol}: ${nettedUnits} Shares Netted (${strategy} vs ${opposingOrder.strategy})`, reason);

    return res.json({
      outcome: 'NETTED',
      outcomeReason: reason,
      order: blotterItem,
      projectedAggPct: projectedIssuerPct,
      limitPct: ratingLimit,
      sttSavedInr,
      nettedAgainst: opposingOrder.strategy
    });
  }

  // 3. Clean Allowed Order
  const reason = `ALLOWED: Order compliant with Rating ${ticker.rating} limit (${projectedIssuerPct}% <= ${ratingLimit}%). Dispatched to Execution Sequencer.`;

  const blotterItem: OrderRecord = {
    id: orderId,
    timestamp: timeStr,
    strategy,
    symbol: ticker.symbol,
    side,
    qty,
    orderType: orderType || 'MARKET',
    price: execPrice,
    totalValueInr,
    outcome: 'ALLOWED',
    outcomeReason: reason,
    sttSavedInr: 0
  };
  orders.unshift(blotterItem);

  fundState.rawVolume += qty;
  fundState.nettedVolume += qty;

  addAudit('M5_SEQUENCER', 'ORDER_ALLOWED_DISPATCHED', 'ALLOWED', 'Pre-Trade Netting Gate', `${ticker.symbol} ${side} ${qty} SHS Allowed`, reason);

  return res.json({
    outcome: 'ALLOWED',
    outcomeReason: reason,
    order: blotterItem,
    projectedAggPct: projectedIssuerPct,
    limitPct: ratingLimit,
    sttSavedInr: 0
  });
});

// 5. Rebalancing & CVXPY Optimization Trigger
app.post('/api/rebalance', (req: Request, res: Response) => {
  fundState.alphaWeight = 62.0;
  fundState.betaWeight = 26.0;
  fundState.gammaWeight = 12.0;
  fundState.triggerScore = 14.25;
  fundState.currentLiquidityCr = Math.min(fundState.targetLiquidityCr + 0.4, fundState.currentLiquidityCr + 1.1);

  addAudit(
    'M3_REBALANCING',
    'FORCE_REBALANCE_EXECUTED',
    'EXECUTED',
    'CVXPY OSQP Solver Engine',
    'Portfolio Rebalance Executed Server-Side',
    'Strategic target weights re-aligned: Alpha 62.0%, Beta 26.0%, Gamma 12.0%. Urgency score neutralized.'
  );

  res.json({
    success: true,
    alphaWeight: fundState.alphaWeight,
    betaWeight: fundState.betaWeight,
    gammaWeight: fundState.gammaWeight,
    triggerScore: fundState.triggerScore,
    currentLiquidityCr: fundState.currentLiquidityCr,
    message: 'CVXPY optimal frontier weights dispatched to execution sequencer.'
  });
});

// 6. Liquidity & Redemption Window
app.get('/api/liquidity', (req: Request, res: Response) => {
  res.json({
    currentLiquidityCr: fundState.currentLiquidityCr,
    targetLiquidityCr: fundState.targetLiquidityCr,
    trepsYieldPercent: fundState.trepsYieldPercent,
    outflowVarCr: fundState.outflowVarCr,
    redemptions
  });
});

app.post('/api/liquidity/redemption', (req: Request, res: Response) => {
  const { lpName, amountCr } = req.body;
  if (!amountCr || amountCr <= 0) {
    return res.status(400).json({ error: 'Valid redemption amountCr required' });
  }

  const today = new Date().toISOString().split('T')[0];
  const settlement = new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const newNotice = {
    id: `RED-${Math.floor(100 + Math.random() * 900)}`,
    lpName: lpName || 'Institutional LP Partner',
    amountCr: Number(amountCr.toFixed(2)),
    requestDate: today,
    settlementDate: settlement,
    status: 'SCHEDULED'
  };

  redemptions.unshift(newNotice);
  fundState.targetLiquidityCr = Number((fundState.targetLiquidityCr + amountCr * 0.6).toFixed(2));
  fundState.outflowVarCr = Number((fundState.outflowVarCr + amountCr * 0.4).toFixed(2));

  addAudit(
    'M4_LIQUIDITY',
    'REDEMPTION_NOTICE_FILED',
    'WARNING',
    'Liquidity Management Sizer',
    `Redemption Notice: ₹${amountCr} Cr from ${newNotice.lpName}`,
    'Bayesian outflow forecast expanded. Target liquid sleeve adjusted.'
  );

  res.json({ success: true, notice: newNotice, targetLiquidityCr: fundState.targetLiquidityCr });
});

// 7. Settings / Risk Rules Configuration
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  Object.assign(settings, req.body);
  addAudit(
    'SYSTEM',
    'SETTINGS_UPDATED',
    'CONFIG_CHANGE',
    'Compliance Officer',
    'Risk & Compliance Parameters Modified via API',
    `AAA: ${settings.aaaLimitPct}%, AA: ${settings.aaLimitPct}%, A: ${settings.aLimitPct}%, Sector: ${settings.sectorLimitPct}%, Rebalance Ceiling: ${settings.rebalanceCeiling}`
  );
  res.json({ success: true, settings });
});

// 8. Audit Trail & CSV Export
app.get('/api/audit', (req: Request, res: Response) => {
  const { module, decision, search } = req.query;
  let filtered = [...auditLogs];

  if (module && module !== 'ALL') {
    filtered = filtered.filter((a) => a.module === module);
  }
  if (decision && decision !== 'ALL') {
    filtered = filtered.filter((a) => a.decision === decision);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (a) => a.headline.toLowerCase().includes(q) || a.details.toLowerCase().includes(q) || a.actor.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

app.get('/api/audit/export.csv', (req: Request, res: Response) => {
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

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=stackguard_audit_${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

// 9. Authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, name } = req.body;
  const user = {
    name: name || (email ? email.split('@')[0] : 'Portfolio Manager'),
    email: email || 'r.sharma@stackguard-aif.in',
    role: 'Chief Investment Officer / Portfolio Manager',
    fund: 'StackGuard Alpha Prime Cat III SIF'
  };
  addAudit('SYSTEM', 'USER_LOGIN', 'ALLOWED', 'Auth Gateway', `User Authenticated: ${user.email}`, 'Session initiated.');
  res.json({ success: true, user });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[StackGuard AIF] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
