'use client';

import { TechSubcategory, TECH_SUBCATEGORY_COLORS, TECH_SUBCATEGORY_NAMES, ALL_TECH_SUBCATEGORIES } from '@/types/company';
import { Card } from '@/components/ui/card';

interface TechSubcategoryLegendProps {
  selectedSubcategories: TechSubcategory[];
  onSubcategoryToggle: (subcategory: TechSubcategory) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function TechSubcategoryLegend({
  selectedSubcategories,
  onSubcategoryToggle,
  onSelectAll,
  onClearAll,
}: TechSubcategoryLegendProps) {
  const allSelected = selectedSubcategories.length === ALL_TECH_SUBCATEGORIES.length;
  const noneSelected = selectedSubcategories.length === 0;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-gray-200 p-3 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">テクノロジー領域</h3>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className={`text-xs px-2 py-0.5 rounded ${
              allSelected ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            全選択
          </button>
          <button
            onClick={onClearAll}
            className={`text-xs px-2 py-0.5 rounded ${
              noneSelected ? 'bg-gray-200 text-gray-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            クリア
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ALL_TECH_SUBCATEGORIES.map((subcategory) => {
          const isSelected = selectedSubcategories.includes(subcategory);
          return (
            <button
              key={subcategory}
              onClick={() => onSubcategoryToggle(subcategory)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all border ${
                isSelected
                  ? 'border-transparent'
                  : 'border-gray-300 opacity-40 hover:opacity-70'
              }`}
              style={{
                backgroundColor: isSelected ? TECH_SUBCATEGORY_COLORS[subcategory] + '20' : 'transparent',
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: TECH_SUBCATEGORY_COLORS[subcategory] }}
              />
              <span className={isSelected ? 'text-gray-900' : 'text-gray-500'}>
                {TECH_SUBCATEGORY_NAMES[subcategory]}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
