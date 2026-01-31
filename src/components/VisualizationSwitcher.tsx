'use client';

import { Card } from '@/components/ui/card';

export type VisualizationMode = 'cellular' | 'cityscape' | 'chaosmap';

interface VisualizationSwitcherProps {
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
}

const modes: { id: VisualizationMode; label: string; icon: string; description: string }[] = [
  {
    id: 'cellular',
    label: 'セルラー',
    icon: '🫧',
    description: '泡のような球体表示（日本株）',
  },
  {
    id: 'cityscape',
    label: 'シティ',
    icon: '🏙️',
    description: 'ビルの高さで表現（日本株）',
  },
  {
    id: 'chaosmap',
    label: 'カオスマップ',
    icon: '🗺️',
    description: 'SaaS業界マップ',
  },
];

export function VisualizationSwitcher({ mode, onModeChange }: VisualizationSwitcherProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-gray-200 p-2">
      <div className="flex gap-1">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              mode === m.id
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title={m.description}
          >
            <span className="text-lg">{m.icon}</span>
            <span className="text-sm font-medium">{m.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
