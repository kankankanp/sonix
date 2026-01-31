'use client';

import { Sector, SECTOR_COLORS, SECTOR_NAMES } from '@/types/company';
import { Card } from '@/components/ui/card';

const sectors: Sector[] = [
  'technology',
  'finance',
  'healthcare',
  'consumer',
  'industrial',
  'energy',
  'materials',
  'telecom',
  'utilities',
  'realEstate',
];

interface SectorLegendProps {
  onSectorClick?: (sector: Sector) => void;
  selectedSector?: Sector | null;
}

export function SectorLegend({ onSectorClick, selectedSector }: SectorLegendProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-gray-200 p-3">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">セクター</h3>
      <div className="flex flex-wrap gap-2">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => onSectorClick?.(sector)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
              selectedSector === sector
                ? 'ring-2 ring-offset-1 ring-blue-500'
                : 'hover:bg-gray-100'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: SECTOR_COLORS[sector] }}
            />
            <span className="text-gray-700">{SECTOR_NAMES[sector]}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
