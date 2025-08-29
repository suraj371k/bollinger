'use client';

import { useEffect, useRef, useState } from 'react';
import { init, dispose, Chart } from 'klinecharts';
import BollingerSettingsModal from './BollingerSetting';
import { BollingerSettings } from '@/lib/types';
import { defaultSettings, registerBollingerIndicator } from '@/lib/bollinger';
import { generateOHLCV } from '@/lib/generateData';
import { testBollingerBands } from '@/lib/testBollinger';

export default function ChartComponent() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const [settings, setSettings] = useState<BollingerSettings>(defaultSettings);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerBollingerIndicator(); // Register once
    
    // Test Bollinger Bands calculation
    testBollingerBands();
    
    if (chartRef.current) {
      setIsLoading(true);
      const newChart = init(chartRef.current);
      
      // Chart will use default styling for now

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
      setIsLoading(false);
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
        calcParams: [[inputs.length, inputs.stdDev, inputs.offset]],
        styles: {
          lines: [
            { color: visibleToColor(style.upper.visible, style.upper.color), size: style.upper.width, style: style.upper.style, dashedValue: [2, 2] },
            { color: visibleToColor(style.mid.visible, style.mid.color), size: style.mid.width, style: style.mid.style, dashedValue: [2, 2] },
            { color: visibleToColor(style.lower.visible, style.lower.color), size: style.lower.width, style: style.lower.style, dashedValue: [2, 2] },
          ],
          areas: [{ color: fillColor }],
        },
      });
    }
  }, [settings, chart]);

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm border-b border-slate-600/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h1 className="text-xl font-bold text-white">Bollinger Bands Pro</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-slate-300">
              <span>•</span>
              <span>Real-time Analysis</span>
              <span>•</span>
              <span>Advanced Indicators</span>
              <span>•</span>
              <span>Professional Trading</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Live Data</span>
            </div>
            <button 
              onClick={() => setShowSettings(true)} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              style={{ pointerEvents: 'auto' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="pt-20 h-full">
        <div ref={chartRef} className="h-full" />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Loading Professional Chart...</p>
            <p className="text-slate-400 text-sm mt-2">Initializing Bollinger Bands</p>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2 text-blue-400">Bollinger Bands Info</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Upper Band: {settings.inputs.stdDev}σ above SMA</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>Middle Band: {settings.inputs.length}-period SMA</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Lower Band: {settings.inputs.stdDev}σ below SMA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <BollingerSettingsModal settings={settings} onUpdate={setSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
}