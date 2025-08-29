import { OHLCV } from './types';

export function generateOHLCV(): OHLCV[] {
    const data: OHLCV[] = [];
    let close = 100;
    let trend = 0; // Add trend component
    const startTime = Date.now() - 300 * 60 * 1000; // 300 mins ago
    
    for (let i = 0; i < 300; i++) {
      const open = close;
      
      // Add trend and volatility
      trend += (Math.random() - 0.5) * 0.1;
      const volatility = 1 + Math.abs(trend) * 0.5;
      const change = (Math.random() - 0.5) * volatility + trend * 0.5;
      
      close += change;
      
      // Ensure price stays positive
      if (close < 10) close = 10;
      
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;
      
      data.push({
        timestamp: startTime + i * 60 * 1000,
        open, high, low, close,
        volume: Math.random() * 1000 + 100,
      });
    }
    return data;
  }