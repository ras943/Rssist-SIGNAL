
import { TradingSettings } from './types';

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const today = new Date();
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);

export const DEFAULT_SETTINGS: TradingSettings = {
  symbol: "BTC",
  timeframe: "h1",
  maPeriod: 14,
  startDate: formatDate(thirtyDaysAgo),
  endDate: formatDate(today),
};

export const SYMBOLS = ["BTC", "ETH", "SOL", "DOGE"];
export const TIMEFRAMES = ["m15", "h1", "h4", "d1"];
