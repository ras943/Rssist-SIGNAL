
import { MarketData, IndicatorData } from '../types';

const calculateEma = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const emaArray: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    emaArray.push(data[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
};

export const calculateIndicators = (data: MarketData[], maPeriod: number): IndicatorData[] => {
  const rates = data.map(d => d.rate);
  const result: IndicatorData[] = data.map(d => ({ ...d }));

  // Calculate RSI
  const deltas = rates.slice(1).map((rate, i) => rate - rates[i]);
  const gains: number[] = new Array(deltas.length).fill(0);
  const losses: number[] = new Array(deltas.length).fill(0);
  deltas.forEach((delta, i) => {
    if (delta > 0) {
      gains[i] = delta;
    } else {
      losses[i] = -delta;
    }
  });

  let avgGain = gains.slice(0, maPeriod).reduce((a, b) => a + b, 0) / maPeriod;
  let avgLoss = losses.slice(0, maPeriod).reduce((a, b) => a + b, 0) / maPeriod;

  const rsiValues: (number | undefined)[] = new Array(maPeriod).fill(undefined);

  for (let i = maPeriod; i < rates.length - 1; i++) {
    avgGain = (avgGain * (maPeriod - 1) + gains[i]) / maPeriod;
    avgLoss = (avgLoss * (maPeriod - 1) + losses[i]) / maPeriod;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsiValues.push(100 - (100 / (1 + rs)));
  }

  rsiValues.forEach((rsi, index) => {
    if (result[index + 1]) {
        result[index + 1].rsi = rsi;
    }
  });


  // Calculate MACD
  const ema12 = calculateEma(rates, 12);
  const ema26 = calculateEma(rates, 26);

  const macdLine = ema12.map((val, index) => val - ema26[index]);
  const signalLine = calculateEma(macdLine, 9);

  for (let i = 0; i < data.length; i++) {
    result[i].macd = macdLine[i];
    result[i].signalLine = signalLine[i];
  }

  // Return data but skip initial period where indicators are not stable
  return result.slice(26);
};
