import { registerIndicator, Indicator, LineType } from 'klinecharts';
import type { KLineData } from 'klinecharts'; // For data typing
import { BollingerSettings } from './types';

export const defaultSettings: BollingerSettings = {
  inputs: { length: 20, maType: 'SMA', source: 'close', stdDev: 2, offset: 0 },
  style: {
    mid: { visible: true, color: '#FF9800', width: 1, style: LineType.Solid },
    upper: { visible: true, color: '#26A69A', width: 1, style: LineType.Solid },
    lower: { visible: true, color: '#F4511E', width: 1, style: LineType.Solid },
    fill: { visible: true, opacity: 20 }, // 20% opacity
  },
};

export function registerBollingerIndicator() {
  const bollinger = {
    name: 'CustomBOLL',
    shortName: 'BOLL',
    precision: 2,
    calcParams: [[defaultSettings.inputs.length, defaultSettings.inputs.stdDev, defaultSettings.inputs.offset]],
    shouldOhlc: false,
    shouldFormatBigNumber: false,
    visible: true,
    zLevel: 0,
    extendData: {},
    figures: [
      { key: 'upper', title: 'Upper: ', type: 'line' },
      { key: 'mid', title: 'Mid: ', type: 'line' },
      { key: 'lower', title: 'Lower: ', type: 'line' },
    ],
    styles: {
      lines: [
        { color: defaultSettings.style.upper.color, size: defaultSettings.style.upper.width, style: defaultSettings.style.upper.style, dashedValue: [2, 2] },
        { color: defaultSettings.style.mid.color, size: defaultSettings.style.mid.width, style: defaultSettings.style.mid.style, dashedValue: [2, 2] },
        { color: defaultSettings.style.lower.color, size: defaultSettings.style.lower.width, style: defaultSettings.style.lower.style, dashedValue: [2, 2] },
      ],
      areas: [
        {
          keys: ['upper', 'lower'],
          color: `rgba(38, 166, 154, ${defaultSettings.style.fill.opacity / 100})`,
        },
      ],
    },
    calc: (dataList: KLineData[], indicator: Indicator<{ upper?: number; mid?: number; lower?: number }, number[]>) => {
      const [length, multiplier, offset] = indicator.calcParams[0];
      const result: Array<{ upper?: number; mid?: number; lower?: number }> = [];

      dataList.forEach((_, i) => {
        const computeIndex = i - offset;
        if (computeIndex < length - 1 || computeIndex < 0 || computeIndex >= dataList.length) {
          result.push({});
          return;
        }

        let sum = 0;
        for (let j = 0; j < length; j++) {
          sum += dataList[computeIndex - j].close;
        }
        const mid = sum / length;

        let varianceSum = 0;
        for (let j = 0; j < length; j++) {
          const diff = dataList[computeIndex - j].close - mid;
          varianceSum += diff * diff;
        }
        const stdDev = Math.sqrt(varianceSum / length);

        const upper = mid + multiplier * stdDev;
        const lower = mid - multiplier * stdDev;

        result.push({ upper, mid, lower });
      });

      return result;
    },
  };

  registerIndicator(bollinger);
}