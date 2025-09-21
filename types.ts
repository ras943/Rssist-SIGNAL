
export interface TradingSettings {
  symbol: string;
  timeframe: string;
  maPeriod: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface MarketData {
  time: number; // Unix timestamp in ms
  rate: number;
}

export interface IndicatorData extends MarketData {
  rsi?: number;
  macd?: number;
  signalLine?: number;
}

export enum SignalAction {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}

export interface Signal {
  action: SignalAction;
  rationale: string;
}

export interface BacktestResults {
  initialBalance: number;
  finalBalance: number;
  profit: number;
  profitPercentage: number;
  totalTrades: number;
  winningTrades: number;
  winRate: number;
}
