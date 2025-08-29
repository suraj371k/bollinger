export interface OHLCV {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  import { LineType } from 'klinecharts';

export interface BollingerSettings {
  inputs: {
    length: number;
    maType: 'SMA'; // Fixed for now
    source: 'close'; // Fixed
    stdDev: number;
    offset: number;
  };
  style: {
    mid: { visible: boolean; color: string; width: number; style: LineType };
    upper: { visible: boolean; color: string; width: number; style: LineType };
    lower: { visible: boolean; color: string; width: number; style: LineType };
    fill: { visible: boolean; opacity: number }; // 0-100
  };
}