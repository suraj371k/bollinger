import { OHLCV } from './types';

export function generateOHLCV(): OHLCV[] {
    const data: OHLCV[] = [];
    let close = 100;
    const startTime = Date.now() - 300 * 60 * 1000; // 300 mins ago
    for (let i = 0; i < 300; i++) {
      const open = close;
      const change = (Math.random() - 0.5) * 2;
      close += change;
      const high = Math.max(open, close) + Math.random();
      const low = Math.min(open, close) - Math.random();
      data.push({
        timestamp: startTime + i * 60 * 1000,
        open, high, low, close,
        volume: Math.random() * 1000 + 100,
      });
    }
    return data;
  }