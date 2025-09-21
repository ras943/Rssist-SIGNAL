
import { IndicatorData, SignalAction, BacktestResults } from '../types';

/**
 * Generates a simple trading signal based on classic TA rules.
 * This is a non-AI, simplified logic for performance during backtesting.
 */
const generateSimpleSignal = (current: IndicatorData, previous: IndicatorData): SignalAction => {
  if (!current.macd || !current.signalLine || !previous.macd || !previous.signalLine || !current.rsi) {
    return SignalAction.HOLD;
  }

  const macdCrossedUp = previous.macd <= previous.signalLine && current.macd > current.signalLine;
  const macdCrossedDown = previous.macd >= previous.signalLine && current.macd < current.signalLine;
  
  // Buy signal: MACD crosses up and RSI is not overbought.
  if (macdCrossedUp && current.rsi < 70) {
    return SignalAction.BUY;
  }

  // Sell signal: MACD crosses down and RSI is not oversold.
  if (macdCrossedDown && current.rsi > 30) {
    return SignalAction.SELL;
  }

  return SignalAction.HOLD;
};


export const runBacktest = (data: IndicatorData[]): BacktestResults => {
  const initialBalance = 10000;
  let cash = initialBalance;
  let holdings = 0; // Asset units (e.g., BTC)
  let winningTrades = 0;
  let totalTrades = 0;
  let lastBuyPrice = 0;

  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const previous = data[i-1];
    const signal = generateSimpleSignal(current, previous);

    if (signal === SignalAction.BUY && cash > 0) {
      // Execute Buy
      holdings = cash / current.rate;
      lastBuyPrice = current.rate;
      cash = 0;
    } else if (signal === SignalAction.SELL && holdings > 0) {
      // Execute Sell
      cash = holdings * current.rate;
      holdings = 0;
      totalTrades++;
      if (current.rate > lastBuyPrice) {
        winningTrades++;
      }
      lastBuyPrice = 0;
    }
  }
  
  // Calculate final balance (liquidate any open positions at the end)
  const finalBalance = cash > 0 ? cash : holdings * data[data.length - 1].rate;
  const profit = finalBalance - initialBalance;
  const profitPercentage = (profit / initialBalance) * 100;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  return {
    initialBalance,
    finalBalance,
    profit,
    profitPercentage,
    totalTrades,
    winningTrades,
    winRate
  };
};
