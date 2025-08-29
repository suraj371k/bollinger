'use client';

import { useState } from 'react';
import { BollingerSettings } from '@/lib/types';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <div className="flex mb-4">
          <button onClick={() => setTab('inputs')} className={`px-4 py-2 ${tab === 'inputs' ? 'bg-blue-500 text-white' : ''}`}>Inputs</button>
          <button onClick={() => setTab('style')} className={`px-4 py-2 ${tab === 'style' ? 'bg-blue-500 text-white' : ''}`}>Style</button>
        </div>

        {tab === 'inputs' && (
          <>
            <label>Length: <input type="number" value={localSettings.inputs.length} onChange={e => updateInput('length', +e.target.value)} className="border p-1" /></label>
            <label>StdDev: <input type="number" value={localSettings.inputs.stdDev} onChange={e => updateInput('stdDev', +e.target.value)} className="border p-1" /></label>
            <label>Offset: <input type="number" value={localSettings.inputs.offset} onChange={e => updateInput('offset', +e.target.value)} className="border p-1" /></label>
            {/* MA Type and Source fixed, but show as disabled selects if wanted */}
          </>
        )}

        {tab === 'style' && (
          <>
            <div>Mid Band: <input type="checkbox" checked={localSettings.style.mid.visible} onChange={e => updateStyleBand('mid', 'visible', e.target.checked)} />
              <input type="color" value={localSettings.style.mid.color} onChange={e => updateStyleBand('mid', 'color', e.target.value)} />
              <select value={localSettings.style.mid.width} onChange={e => updateStyleBand('mid', 'width', +e.target.value)}><option>1</option><option>2</option><option>3</option></select>
              <select value={localSettings.style.mid.style} onChange={e => updateStyleBand('mid', 'style', e.target.value)}><option>solid</option><option>dashed</option></select>
            </div>
            {/* Repeat for Upper and Lower */}
            <div>Upper Band: {/* similar inputs */} </div>
            <div>Lower Band: {/* similar inputs */} </div>
            <div>Fill: <input type="checkbox" checked={localSettings.style.fill.visible} onChange={e => updateFill('visible', e.target.checked)} />
              Opacity: <input type="range" min={0} max={100} value={localSettings.style.fill.opacity} onChange={e => updateFill('opacity', +e.target.value)} />
            </div>
          </>
        )}

        <div className="mt-4">
          <button onClick={save} className="bg-green-500 text-white px-4 py-2">Save</button>
          <button onClick={onClose} className="ml-2 bg-red-500 text-white px-4 py-2">Close</button>
        </div>
      </div>
    </div>
  );
}