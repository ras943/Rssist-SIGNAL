
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { IndicatorData } from '../types';

interface DataChartProps {
  data: IndicatorData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label).toLocaleString();
    return (
      <div className="bg-gray-700 p-4 border border-gray-600 rounded-lg shadow-lg">
        <p className="label text-gray-200">{`${date}`}</p>
        {payload.map((pld: any) => (
          <p key={pld.dataKey} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value?.toFixed(2) ?? 'N/A'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DataChart: React.FC<DataChartProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="text-center p-10 text-gray-400">No data available to display chart. Select a valid date range.</div>;
  }
  
  const formattedData = data.map(d => ({
    ...d,
    time: d.time, 
    macd_histogram: d.macd && d.signalLine ? d.macd - d.signalLine : 0,
  }));
  
  const tickFormatter = (unixTime: number) => {
    if (!data || data.length < 2) return new Date(unixTime).toLocaleDateString();

    const first = data[0].time;
    const last = data[data.length - 1].time;
    const rangeInHours = (last - first) / (1000 * 60 * 60);

    if (rangeInHours <= 72) { // Show time for ranges up to 3 days
        return new Date(unixTime).toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } else {
        return new Date(unixTime).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };


  return (
    <div className="h-96 w-full">
      <ResponsiveContainer>
        <ComposedChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3c3c3c" />
          <XAxis 
            dataKey="time" 
            tickFormatter={tickFormatter} 
            stroke="#a0a0a0"
            angle={-20}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          <YAxis yAxisId="left" stroke="#a0a0a0" domain={['auto', 'auto']} />
          <YAxis yAxisId="right" orientation="right" stroke="#a0a0a0" domain={[0, 100]} />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#e0e0e0', paddingTop: '20px' }}/>
          
          <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} name="Funding Rate" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="rsi" stroke="#82ca9d" strokeWidth={2} name="RSI" dot={false} />
          <Bar yAxisId="left" dataKey="macd_histogram" name="MACD Hist." fill="#ffc658">
            {formattedData.map((entry, index) => (
              <Bar key={`cell-${index}`} fill={entry.macd_histogram >= 0 ? '#22c55e' : '#ef4444'} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
