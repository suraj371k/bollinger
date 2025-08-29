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
      
      // Apply enhanced professional styling to the chart
      newChart?.setStyles({
        candle: {
          bar: {
            upColor: '#10B981',
            downColor: '#EF4444',
            noChangeColor: '#6B7280',
            upBorderColor: '#10B981',
            downBorderColor: '#EF4444',
            noChangeBorderColor: '#6B7280',
            upWickColor: '#10B981',
            downWickColor: '#EF4444',
            noChangeWickColor: '#6B7280',
          },
        },
        indicator: {
          ohlc: {
            upColor: '#10B981',
            downColor: '#EF4444',
            noChangeColor: '#6B7280',
          },
        },
      });

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
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-slate-800/95 backdrop-blur-md border-b border-slate-600/50 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">📈 Bollinger Bands Pro</h1>
                <div className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <span className="text-xs text-green-400 font-medium">LIVE</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Real-time Analysis</span>
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Advanced Indicators</span>
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Professional Trading</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live Data Feed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-lg">
                <span>⚡</span>
                <span>High Performance</span>
              </div>
            </div>
            <button 
              onClick={() => setShowSettings(true)} 
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3 border border-blue-400/30"
              style={{ pointerEvents: 'auto' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>⚙️ Settings</span>
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500/30 mx-auto"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 mx-auto absolute inset-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">🚀 Initializing Professional Chart</h2>
              <p className="text-slate-300 text-lg">Loading advanced Bollinger Bands analysis...</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-600/50 rounded-xl p-5 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-blue-400 text-lg">📊 Bollinger Bands</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                <span className="text-slate-300">Upper Band</span>
              </div>
              <span className="font-mono text-green-400">{settings.inputs.stdDev}σ above SMA</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full shadow-sm"></div>
                <span className="text-slate-300">Middle Band</span>
              </div>
              <span className="font-mono text-orange-400">{settings.inputs.length}-period SMA</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
                <span className="text-slate-300">Lower Band</span>
              </div>
              <span className="font-mono text-red-400">{settings.inputs.stdDev}σ below SMA</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-600/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Band Width: {settings.inputs.stdDev * 2}σ</span>
              <span>Volatility: {settings.inputs.stdDev > 1.5 ? 'High' : 'Normal'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Panel */}
      <div className="absolute top-24 right-4 z-40">
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-600/50 rounded-xl p-4 text-white shadow-2xl">
          <h4 className="font-semibold text-blue-400 mb-3 text-sm">📈 Quick Stats</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Data Points:</span>
              <span className="font-mono text-white">300</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Timeframe:</span>
              <span className="font-mono text-white">5min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last Update:</span>
              <span className="font-mono text-green-400">Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <BollingerSettingsModal settings={settings} onUpdate={setSettings} onClose={() => setShowSettings(false)} />}
    </div>
  );
}