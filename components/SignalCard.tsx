
import React from 'react';
import { Signal, SignalAction } from '../types';

interface SignalCardProps {
  signal: Signal;
}

const getSignalStyles = (action: SignalAction) => {
  switch (action) {
    case SignalAction.BUY:
      return {
        bgColor: 'bg-green-500',
        textColor: 'text-green-100',
        borderColor: 'border-green-400',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )
      };
    case SignalAction.SELL:
      return {
        bgColor: 'bg-red-500',
        textColor: 'text-red-100',
        borderColor: 'border-red-400',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
        )
      };
    case SignalAction.HOLD:
    default:
      return {
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-100',
        borderColor: 'border-yellow-400',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
  }
};

export const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const styles = getSignalStyles(signal.action);

  return (
    <div className={`border-l-4 ${styles.borderColor} ${styles.bgColor} bg-opacity-20 p-5 rounded-r-lg shadow-lg animate-fade-in`}>
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${styles.bgColor}`}>
          {styles.icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">Current Signal</p>
          <p className={`text-4xl font-extrabold ${styles.textColor}`}>{signal.action}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="font-semibold text-gray-200 mb-2">AI Rationale:</h4>
        <p className="text-gray-300 text-sm leading-relaxed">{signal.rationale}</p>
      </div>
    </div>
  );
};
