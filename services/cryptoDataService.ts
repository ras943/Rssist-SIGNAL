
import { MarketData, TradingSettings } from '../types';

const getTimeframeInMs = (timeframe: string): number => {
  switch (timeframe) {
    case 'm15': return 15 * 60 * 1000;
    case 'h1': return 60 * 60 * 1000;
    case 'h4': return 4 * 60 * 60 * 1000;
    case 'd1': return 24 * 60 * 60 * 1000;
    default: return 60 * 60 * 1000; // Default to 1 hour
  }
}

// This function mocks fetching data from an API like CoinGlass.
// In a real application, this would be an actual API call.
export const mockCoinGlassData = (settings: TradingSettings): MarketData[] => {
  const { startDate, endDate, timeframe } = settings;
  const data: MarketData[] = [];
  let rate = 10 + Math.random() * 5; // Starting rate

  const start = new Date(startDate).getTime();
  // Set end time to the end of the selected day
  const end = new Date(endDate).getTime() + (23 * 60 * 60 * 1000) + (59 * 60 * 1000);
  const intervalMs = getTimeframeInMs(timeframe);
  
  if (start >= end || !intervalMs) return [];
  
  const totalPoints = Math.floor((end - start) / intervalMs);
  
  for (let i = 0; i <= totalPoints; i++) {
    const currentTime = start + i * intervalMs;
    
    // Introduce some volatility and trend
    const volatility = (Math.random() - 0.5) * 0.5;
    const trend = Math.sin(i / (20 * (intervalMs / (60 * 60 * 1000)))) * 0.2; // Adjust trend to timeframe
    rate += volatility + trend;

    // Ensure rate stays within a reasonable range
    if (rate < 5) rate = 5;
    if (rate > 25) rate = 25;

    data.push({
      time: currentTime,
      rate: parseFloat(rate.toFixed(4)),
    });
  }

  return data;
};
