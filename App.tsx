
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { DataChart } from './components/DataChart';
import { SignalCard } from './components/SignalCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { BacktestResults } from './components/BacktestResults';
import { mockCoinGlassData } from './services/cryptoDataService';
import { calculateIndicators } from './lib/indicatorCalculator';
import { getTradingSignal } from './services/geminiService';
import { runBacktest } from './lib/backtester';
import { MarketData, IndicatorData, Signal, TradingSettings, BacktestResults as BacktestResultsType } from './types';
import { DEFAULT_SETTINGS } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useState<TradingSettings>(DEFAULT_SETTINGS);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [indicatorData, setIndicatorData] = useState<IndicatorData[]>([]);
  const [signal, setSignal] = useState<Signal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBacktesting, setIsBacktesting] = useState<boolean>(false);
  const [backtestResults, setBacktestResults] = useState<BacktestResultsType | null>(null);

  const fetchAndAnalyze = useCallback(async (currentSettings: TradingSettings) => {
    setIsLoading(true);
    setError(null);
    setSignal(null);
    setBacktestResults(null); // Clear previous backtest results
    try {
      // 1. Fetch market data
      const rawData = mockCoinGlassData(currentSettings);
      setMarketData(rawData);

      // 2. Calculate indicators
      if (rawData.length > currentSettings.maPeriod) {
        const calculatedData = calculateIndicators(rawData, currentSettings.maPeriod);
        setIndicatorData(calculatedData);
        
        // 3. Get trading signal from Gemini
        const geminiSignal = await getTradingSignal(calculatedData, currentSettings);
        setSignal(geminiSignal);
      } else {
        setIndicatorData([]); // Clear data if not enough
        throw new Error("Not enough data for analysis. Please select a wider date range or a shorter indicator period.");
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndAnalyze(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSettingsChange = (newSettings: TradingSettings) => {
    setSettings(newSettings);
    fetchAndAnalyze(newSettings);
  };

  const handleRefresh = () => {
    fetchAndAnalyze(settings);
  };

  const handleRunBacktest = useCallback(() => {
    if (indicatorData.length < 2) {
      setError("Not enough historical data to run a backtest.");
      return;
    }
    setIsBacktesting(true);
    setError(null);

    // Simulate a short delay for UX, as the calculation can be nearly instant
    setTimeout(() => {
      try {
        const results = runBacktest(indicatorData);
        setBacktestResults(results);
      } catch (err) {
        console.error("Backtest failed:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred during backtest.");
      } finally {
        setIsBacktesting(false);
      }
    }, 500);
  }, [indicatorData]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">Market Analysis</h2>
              <DataChart data={indicatorData} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">AI Signal</h2>
              {isLoading && <LoadingSpinner />}
              {error && <ErrorDisplay message={error} />}
              {signal && !isLoading && !error && <SignalCard signal={signal} />}
            </div>

            {(isBacktesting || backtestResults) && (
              <BacktestResults results={backtestResults} isLoading={isBacktesting} />
            )}
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
               <SettingsPanel 
                settings={settings} 
                onSettingsChange={handleSettingsChange}
                onRefresh={handleRefresh}
                onRunBacktest={handleRunBacktest}
                isLoading={isLoading}
                isBacktesting={isBacktesting}
               />
            </div>
          </div>
        </div>
        <footer className="text-center text-gray-400 mt-12 pb-4">
          <p>Disclaimer: This is a demo application for educational purposes only. Not financial advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
