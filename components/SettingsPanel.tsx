
import React from 'react';
import { TradingSettings } from '../types';
import { SYMBOLS, TIMEFRAMES } from '../constants';

interface SettingsPanelProps {
  settings: TradingSettings;
  onSettingsChange: (newSettings: TradingSettings) => void;
  onRefresh: () => void;
  onRunBacktest: () => void;
  isLoading: boolean;
  isBacktesting: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  onSettingsChange, 
  onRefresh, 
  onRunBacktest,
  isLoading,
  isBacktesting
}) => {

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({ ...settings, [e.target.name]: e.target.value });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let newSettings = { ...settings };

    if (type === 'number') {
        newSettings = { ...newSettings, [name]: parseInt(value, 10) || 0 };
    } else {
        newSettings = { ...newSettings, [name]: value };
    }
    
    // Basic validation to prevent start date from being after end date
    if (name === 'startDate' && value > newSettings.endDate) {
        newSettings.endDate = value;
    }
    if (name === 'endDate' && value < newSettings.startDate) {
        newSettings.startDate = value;
    }
    
    onSettingsChange(newSettings);
  };
  
  const isBusy = isLoading || isBacktesting;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Controls</h2>
      
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-400">Symbol</label>
        <select
          id="symbol"
          name="symbol"
          value={settings.symbol}
          onChange={handleSelectChange}
          disabled={isBusy}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md disabled:opacity-50"
        >
          {SYMBOLS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-400">Timeframe</label>
        <select
          id="timeframe"
          name="timeframe"
          value={settings.timeframe}
          onChange={handleSelectChange}
          disabled={isBusy}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md disabled:opacity-50"
        >
          {TIMEFRAMES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-400">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={settings.startDate}
            onChange={handleInputChange}
            disabled={isBusy}
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md disabled:opacity-50"
            max={settings.endDate}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-400">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={settings.endDate}
            onChange={handleInputChange}
            disabled={isBusy}
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md disabled:opacity-50"
            min={settings.startDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div>
        <label htmlFor="maPeriod" className="block text-sm font-medium text-gray-400">Indicator Period</label>
        <input
          type="number"
          id="maPeriod"
          name="maPeriod"
          value={settings.maPeriod}
          onChange={handleInputChange}
          disabled={isBusy}
          className="mt-1 block w-full pl-3 pr-3 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md disabled:opacity-50"
          min="5"
          max="50"
        />
      </div>

      <div className="space-y-4 pt-2">
        <button
          onClick={onRunBacktest}
          disabled={isBusy}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isBacktesting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Backtesting...
            </>
          ) : 'Run Backtest'}
        </button>
        <button
          onClick={onRefresh}
          disabled={isBusy}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : 'Refresh Analysis'}
        </button>
      </div>
    </div>
  );
};
