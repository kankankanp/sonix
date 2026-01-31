'use client';

import { SaaSCategory, SAAS_CATEGORY_COLORS, SAAS_CATEGORY_NAMES } from '@/types/saas';
import { Card } from '@/components/ui/card';

export const ALL_SAAS_CATEGORIES: SaaSCategory[] = [
  'crm',
  'marketing',
  'hrTech',
  'fintech',
  'communication',
  'productivity',
  'security',
  'infrastructure',
  'analytics',
  'vertical',
];

interface SaaSCategoryLegendProps {
  selectedCategories: SaaSCategory[];
  onCategoryToggle: (category: SaaSCategory) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function SaaSCategoryLegend({
  selectedCategories,
  onCategoryToggle,
  onSelectAll,
  onClearAll,
}: SaaSCategoryLegendProps) {
  const allSelected = selectedCategories.length === ALL_SAAS_CATEGORIES.length;
  const noneSelected = selectedCategories.length === 0;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-gray-200 p-3 max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">SaaSカテゴリ</h3>
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
        {ALL_SAAS_CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all border ${
                isSelected
                  ? 'border-transparent'
                  : 'border-gray-300 opacity-40 hover:opacity-70'
              }`}
              style={{
                backgroundColor: isSelected ? SAAS_CATEGORY_COLORS[category] + '20' : 'transparent',
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: SAAS_CATEGORY_COLORS[category] }}
              />
              <span className={isSelected ? 'text-gray-900' : 'text-gray-500'}>
                {SAAS_CATEGORY_NAMES[category]}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
