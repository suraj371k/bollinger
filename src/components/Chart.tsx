'use client';

import { useEffect, useRef, useState } from 'react';
import { init, dispose, Chart } from 'klinecharts';
import BollingerSettingsModal from './BollingerSetting';
import { BollingerSettings } from '@/lib/types';
import { defaultSettings, registerBollingerIndicator } from '@/lib/bollinger';
import { generateOHLCV } from '@/lib/generateData';

export default function ChartComponent() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const [settings, setSettings] = useState<BollingerSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    registerBollingerIndicator(); // Register once
    if (chartRef.current) {
      const newChart = init(chartRef.current);
      // Convert generated OHLCV data to KLineData format for applyNewData
      const ohlcvData = generateOHLCV();
      const kLineData = ohlcvData.map(item => ({
        timestamp: item.timestamp,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));
      newChart?.applyNewData(kLineData);
      newChart?.createIndicator('CustomBOLL', true, { id: 'candle_pane' });
      setChart(newChart);
    }
    return () => { if (chart) dispose(chart); };
  }, []);

  useEffect(() => {
    if (chart) {
      const { inputs, style } = settings;
      const visibleToColor = (visible: boolean, color: string) => visible ? color : 'transparent';
      const fillColor = style.fill.visible ? `rgba(38, 166, 154, ${style.fill.opacity / 100})` : 'rgba(0,0,0,0)';

      chart.overrideIndicator({
        name: 'CustomBOLL',
        calcParams: [inputs.length, inputs.stdDev, inputs.offset],
        styles: {
          lines: [
            { color: visibleToColor(style.upper.visible, style.upper.color), size: style.upper.width, style: style.upper.style },
            { color: visibleToColor(style.mid.visible, style.mid.color), size: style.mid.width, style: style.mid.style },
            { color: visibleToColor(style.lower.visible, style.lower.color), size: style.lower.width, style: style.lower.style },
          ],
          areas: [{ color: fillColor }],
        },
      });
    }
  }, [settings, chart]);

  return (
    <div className="relative h-screen">
      <div ref={chartRef} className="h-full" />
      <button onClick={() => setShowSettings(true)} className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
        Settings
      </button>
      {showSettings && <BollingerSettingsModal settings={settings} onUpdate={setSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
}