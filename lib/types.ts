export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  amount: number;
  open: number;
  high: number;
  low: number;
  preClose: number;
}

export interface KlineData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
}

export interface IndicatorData {
  date: string;
  [key: string]: number | string;
}

export interface DragonTigerItem {
  symbol: string;
  name: string;
  reason: string;
  buyAmount: number;
  sellAmount: number;
  netAmount: number;
  seats: DragonTigerSeat[];
}

export interface DragonTigerSeat {
  seatName: string;
  buyAmount: number;
  sellAmount: number;
  netAmount: number;
  type: "buy" | "sell";
}

export interface LimitUpStock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  concept: string;
  streakDays: number;
  firstLimitTime: string;
  lastLimitTime: string;
}

export interface LimitUpSummary {
  limitUpCount: number;
  limitDownCount: number;
  brokenCount: number;
  streakDistribution: Record<number, number>;
}

export interface ConceptCluster {
  concept: string;
  count: number;
  stocks: { symbol: string; name: string; streakDays: number }[];
}

export interface SectorFlow {
  sector: string;
  mainNetInflow: number;
  superLargeInflow: number;
  largeInflow: number;
  mediumInflow: number;
  smallInflow: number;
  changePercent: number;
}

export interface StockFlow {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  mainNetInflow: number;
  superLargeInflow: number;
  largeInflow: number;
}

export interface NorthFlow {
  date: string;
  totalNetInflow: number;
  shNetInflow: number;
  szNetInflow: number;
}

export interface NorthTopStock {
  symbol: string;
  name: string;
  shareCount: number;
  marketValue: number;
  changeFromPrev: number;
  changePercent: number;
}

export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export type Period = "5" | "15" | "30" | "60" | "daily" | "weekly" | "monthly";
export type FlowPeriod = "today" | "3day" | "5day" | "10day";
export type FlowDimension = "industry" | "concept";
