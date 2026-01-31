'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Company } from '@/types/company';
import { CompanyInfoPanel } from '@/components/CompanyInfoPanel';
import { SectorLegend } from '@/components/SectorLegend';

// Dynamic import for 3D Canvas to avoid SSR issues with WebGL
const CellularMarket = dynamic(
  () => import('@/components/CellularMarket').then((mod) => mod.CellularMarket),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-gray-500 text-lg">3D空間を読み込み中...</div>
      </div>
    ),
  }
);

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <main className="relative w-full h-screen bg-gray-50 overflow-hidden">
      {/* 3D Cellular Market */}
      <div className="absolute inset-0">
        <CellularMarket
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cellular Market</h1>
            <p className="text-sm text-gray-500">日本株式市場 3D可視化</p>
          </div>
        </div>
      </header>

      {/* Company Info Panel (Right side) */}
      <div className="absolute top-20 right-4 z-10">
        <CompanyInfoPanel company={selectedCompany} />
      </div>

      {/* Sector Legend (Bottom left) */}
      <div className="absolute bottom-4 left-4 z-10">
        <SectorLegend />
      </div>

      {/* Legend for colors (Bottom right) */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">騰落率</h3>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
            <div className="w-4 h-4 rounded-full bg-[#fca5a5]" />
            <div className="w-4 h-4 rounded-full bg-[#fef08a]" />
            <div className="w-4 h-4 rounded-full bg-[#bbf7d0]" />
            <div className="w-4 h-4 rounded-full bg-[#86efac]" />
            <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-3%</span>
            <span>0%</span>
            <span>+3%</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <p className="text-gray-400 text-sm text-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
          ドラッグで回転 • スクロールでズーム • 企業をクリックで詳細表示
        </p>
      </div>
    </main>
  );
}
