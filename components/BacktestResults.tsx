
import React from 'react';
import { BacktestResults as BacktestResultsType } from '../types';

interface BacktestResultsProps {
  results: BacktestResultsType | null;
  isLoading: boolean;
}

const ResultRow: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className={`font-bold text-sm ${className}`}>{value}</span>
  </div>
);


export const BacktestResults: React.FC<BacktestResultsProps> = ({ results, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Backtest Summary</h2>
                <div className="flex flex-col items-center justify-center p-5">
                    <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-3 text-gray-400">Running historical simulation...</p>
                </div>
            </div>
        );
    }
  
    if (!results) {
    return null; // Don't render anything if there are no results yet
  }

  const isProfit = results.profit >= 0;
  const profitColor = isProfit ? 'text-green-400' : 'text-red-400';
  const profitSign = isProfit ? '+' : '';

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-white">Backtest Summary</h2>
      
      <div className="space-y-1 text-gray-200">
        <ResultRow label="Initial Balance" value={`$${results.initialBalance.toLocaleString()}`} />
        <ResultRow label="Final Balance" value={`$${results.finalBalance.toLocaleString()}`} />
        <ResultRow 
          label="Profit / Loss" 
          value={`${profitSign}$${results.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          className={profitColor} 
        />
         <ResultRow 
          label="Return" 
          value={`${profitSign}${results.profitPercentage.toFixed(2)}%`} 
          className={profitColor}
        />
        <ResultRow label="Total Trades" value={results.totalTrades} />
        <ResultRow label="Win Rate" value={`${results.winRate.toFixed(1)}%`} />
      </div>

      <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-700 italic">
        *Backtest performed using a simplified, non-AI strategy (MACD crossover &amp; RSI) for historical simulation. Results are hypothetical.
      </p>
    </div>
  );
};
