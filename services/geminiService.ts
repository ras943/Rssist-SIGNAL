
import { GoogleGenAI, Type } from "@google/genai";
import { IndicatorData, Signal, SignalAction, TradingSettings } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MOCK_SIGNAL: Signal = {
  action: SignalAction.HOLD,
  rationale: "This is a mock response. Please configure your Gemini API key to get live AI-powered signals."
};

export const getTradingSignal = async (
  indicatorData: IndicatorData[],
  settings: TradingSettings
): Promise<Signal> => {
  if (!API_KEY) {
    return MOCK_SIGNAL;
  }

  const latestData = indicatorData.slice(-10); // Send last 10 data points for context
  const prompt = `
    You are an expert crypto trading analyst. Your task is to provide a trading signal (BUY, SELL, or HOLD)
    for ${settings.symbol} on a ${settings.timeframe} timeframe. Analyze the provided technical indicators.

    Current context: The market is volatile. Focus on clear signals from the indicators provided.

    Latest Indicator Data (most recent is last):
    - RSI: ${latestData.map(d => d.rsi?.toFixed(2)).join(', ')}
    - MACD: ${latestData.map(d => d.macd?.toFixed(2)).join(', ')}
    - Signal Line: ${latestData.map(d => d.signalLine?.toFixed(2)).join(', ')}

    Based on this data, provide a clear trading signal (BUY, SELL, or HOLD) and a concise, 2-3 sentence rationale for your decision.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: {
              type: Type.STRING,
              description: "The trading signal: 'BUY', 'SELL', or 'HOLD'.",
              enum: ['BUY', 'SELL', 'HOLD'],
            },
            rationale: {
              type: Type.STRING,
              description: 'A brief, 2-3 sentence explanation for the signal.'
            }
          },
          required: ['signal', 'rationale']
        },
        temperature: 0.3,
      }
    });
    
    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);

    // Validate the parsed signal
    const action = parsed.signal.toUpperCase() as SignalAction;
    if (!Object.values(SignalAction).includes(action)) {
        throw new Error(`Invalid signal action received: ${parsed.signal}`);
    }

    return {
      action,
      rationale: parsed.rationale,
    };

  } catch (error) {
    console.error("Error fetching trading signal from Gemini:", error);
    throw new Error("Failed to get analysis from AI. The model may be overloaded or the configuration is incorrect.");
  }
};
