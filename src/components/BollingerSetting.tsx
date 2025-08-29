'use client';

import { useState } from 'react';
import { BollingerSettings } from '@/lib/types';
import { LineType } from 'klinecharts';

interface Props {
  settings: BollingerSettings;
  onUpdate: (newSettings: BollingerSettings) => void;
  onClose: () => void;
}

export default function BollingerSettingsModal({ settings, onUpdate, onClose }: Props) {
  const [localSettings, setLocalSettings] = useState<BollingerSettings>(settings);
  const [tab, setTab] = useState<'inputs' | 'style'>('inputs');

  const updateInput = (key: keyof BollingerSettings['inputs'], value: number) => {
    setLocalSettings({ ...localSettings, inputs: { ...localSettings.inputs, [key]: value } });
  };

  const updateStyleBand = (band: 'mid' | 'upper' | 'lower', key: 'visible' | 'color' | 'width' | 'style', value: any) => {
    setLocalSettings({ ...localSettings, style: { ...localSettings.style, [band]: { ...localSettings.style[band], [key]: value } } });
  };

  const updateFill = (key: 'visible' | 'opacity', value: any) => {
    setLocalSettings({ ...localSettings, style: { ...localSettings.style, fill: { ...localSettings.style.fill, [key]: value } } });
  };

  const save = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Bollinger Bands Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex mb-6 bg-gray-700 p-1 rounded-lg">
          <button 
            onClick={() => setTab('inputs')} 
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${tab === 'inputs' 
              ? 'bg-blue-500 text-white shadow' 
              : 'text-gray-300 hover:text-white'}`}
          >
            Inputs
          </button>
          <button 
            onClick={() => setTab('style')} 
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${tab === 'style' 
              ? 'bg-blue-500 text-white shadow' 
              : 'text-gray-300 hover:text-white'}`}
          >
            Style
          </button>
        </div>

        {tab === 'inputs' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Length</label>
              <input 
                type="number" 
                value={localSettings.inputs.length} 
                onChange={e => updateInput('length', +e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Standard Deviation</label>
              <input 
                type="number" 
                value={localSettings.inputs.stdDev} 
                onChange={e => updateInput('stdDev', +e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Offset</label>
              <input 
                type="number" 
                value={localSettings.inputs.offset} 
                onChange={e => updateInput('offset', +e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
              />
            </div>
          </div>
        )}

        {tab === 'style' && (
          <div className="space-y-6 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-medium mb-3 text-white flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                Mid Band
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={localSettings.style.mid.visible} 
                    onChange={e => updateStyleBand('mid', 'visible', e.target.checked)} 
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-800" 
                  />
                  <span className="ml-2 text-gray-300">Visible</span>
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Color:</span>
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-md border border-gray-600 mr-2" 
                      style={{ backgroundColor: localSettings.style.mid.color }}
                    ></div>
                    <input 
                      type="color" 
                      value={localSettings.style.mid.color} 
                      onChange={e => updateStyleBand('mid', 'color', e.target.value)} 
                      className="w-8 h-8 cursor-pointer rounded-lg border-0 bg-transparent" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Width:</span>
                  <select 
                    value={localSettings.style.mid.width} 
                    onChange={e => updateStyleBand('mid', 'width', +e.target.value)} 
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={1}>1px</option>
                    <option value={2}>2px</option>
                    <option value={3}>3px</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Line Style:</span>
                  <select 
                    value={localSettings.style.mid.style} 
                    onChange={e => updateStyleBand('mid', 'style', e.target.value)} 
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={LineType.Solid}>Solid</option>
                    <option value={LineType.Dashed}>Dashed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-medium mb-3 text-white flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                Upper Band
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={localSettings.style.upper.visible} 
                    onChange={e => updateStyleBand('upper', 'visible', e.target.checked)} 
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-800" 
                  />
                  <span className="ml-2 text-gray-300">Visible</span>
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Color:</span>
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-md border border-gray-600 mr-2" 
                      style={{ backgroundColor: localSettings.style.upper.color }}
                    ></div>
                    <input 
                      type="color" 
                      value={localSettings.style.upper.color} 
                      onChange={e => updateStyleBand('upper', 'color', e.target.value)} 
                      className="w-8 h-8 cursor-pointer rounded-lg border-0 bg-transparent" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Width:</span>
                  <select 
                    value={localSettings.style.upper.width} 
                    onChange={e => updateStyleBand('upper', 'width', +e.target.value)} 
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={1}>1px</option>
                    <option value={2}>2px</option>
                    <option value={3}>3px</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Line Style:</span>
                  <select 
                    value={localSettings.style.upper.style} 
                    onChange={e => updateStyleBand('upper', 'style', e.target.value)} 
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={LineType.Solid}>Solid</option>
                    <option value={LineType.Dashed}>Dashed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-medium mb-3 text-white flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>
                Lower Band
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={localSettings.style.lower.visible} 
                    onChange={e => updateStyleBand('lower', 'visible', e.target.checked)} 
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-800" 
                  />
                  <span className="ml-2 text-gray-300">Visible</span>
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Color:</span>
                  <div className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-md border border-gray-600 mr-2" 
                      style={{ backgroundColor: localSettings.style.lower.color }}
                    ></div>
                    <input 
                      type="color" 
                      value={localSettings.style.lower.color} 
                      onChange={e => updateStyleBand('lower', 'color', e.target.value)} 
                      className="w-8 h-8 cursor-pointer rounded-lg border-0 bg-transparent" 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Width:</span>
                  <select 
                    value={localSettings.style.lower.width} 
                    onChange={e => updateStyleBand('lower', 'width', +e.target.value)} 
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={1}>1px</option>
                    <option value={2}>2px</option>
                    <option value={3}>3px</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Line Style:</span>
                  <select 
                    value={localSettings.style.lower.style} 
                    onChange={e => updateStyleBand('lower', 'style', e.target.value)} 
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg py-1 px-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={LineType.Solid}>Solid</option>
                    <option value={LineType.Dashed}>Dashed</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-xl">
              <h3 className="font-medium mb-3 text-white flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                Fill
              </h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={localSettings.style.fill.visible} 
                    onChange={e => updateFill('visible', e.target.checked)} 
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-800" 
                  />
                  <span className="ml-2 text-gray-300">Visible</span>
                </label>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300">Opacity:</span>
                    <span className="text-blue-400 font-medium">{localSettings.style.fill.opacity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={localSettings.style.fill.opacity} 
                    onChange={e => updateFill('opacity', +e.target.value)} 
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={save} 
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
}