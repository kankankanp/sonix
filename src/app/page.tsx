'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Company, Sector, TechSubcategory, ALL_TECH_SUBCATEGORIES } from '@/types/company';
import { CompanyInfoPanel } from '@/components/CompanyInfoPanel';
import { SectorLegend, ALL_SECTORS } from '@/components/SectorLegend';
import { TechSubcategoryLegend } from '@/components/TechSubcategoryLegend';
import { VisualizationSwitcher, VisualizationMode } from '@/components/VisualizationSwitcher';
import { useStockData } from '@/hooks/useStockData';

// Dynamic imports for 3D components to avoid SSR issues
const CellularMarket = dynamic(
  () => import('@/components/CellularMarket').then((mod) => mod.CellularMarket),
  { ssr: false, loading: () => <LoadingScreen /> }
);

const CityScapeMarket = dynamic(
  () => import('@/components/CityScapeMarket').then((mod) => mod.CityScapeMarket),
  { ssr: false, loading: () => <LoadingScreen /> }
);

const ChaosMapMarket = dynamic(
  () => import('@/components/ChaosMapMarket').then((mod) => mod.ChaosMapMarket),
  { ssr: false, loading: () => <LoadingScreen /> }
);

function LoadingScreen() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-gray-500 text-lg">3D空間を読み込み中...</div>
    </div>
  );
}

// Cache status badge component
function CacheStatusBadge({
  cacheSource,
  cacheAge,
  loading,
  onRefresh,
}: {
  cacheSource: 'none' | 'client' | 'server' | 'fresh';
  cacheAge: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  const getStatusConfig = () => {
    switch (cacheSource) {
      case 'fresh':
        return { label: '最新', color: 'bg-green-100 text-green-700', icon: '●' };
      case 'server':
        return { label: `サーバーキャッシュ (${cacheAge}分前)`, color: 'bg-blue-100 text-blue-700', icon: '◐' };
      case 'client':
        return { label: `ローカルキャッシュ (${cacheAge}分前)`, color: 'bg-yellow-100 text-yellow-700', icon: '◑' };
      default:
        return { label: 'モックデータ', color: 'bg-gray-100 text-gray-700', icon: '○' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
        {config.icon} {config.label}
      </span>
      <button
        onClick={onRefresh}
        disabled={loading}
        className={`text-xs px-2 py-1 rounded-full transition-colors ${
          loading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
        }`}
        title="最新データを取得"
      >
        {loading ? '更新中...' : '更新'}
      </button>
    </div>
  );
}

export default function Home() {
  // Company selection state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>(ALL_SECTORS);
  const [selectedTechSubcategories, setSelectedTechSubcategories] = useState<TechSubcategory[]>(ALL_TECH_SUBCATEGORIES);

  // Visualization mode
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('cellular');

  const isChaosMapMode = visualizationMode === 'chaosmap';

  // Stock data - fetch from Yahoo Finance API
  const { companies, loading, error, lastUpdated, cacheSource, cacheAge, refetch } = useStockData({
    useMockData: false,
    refreshInterval: 6 * 60 * 60 * 1000, // Refresh every 6 hours
  });

  // Filter companies by selected sectors (for non-chaos map modes)
  const filteredCompanies = useMemo(() => {
    if (selectedSectors.length === 0) return [];
    return companies.filter((company) => selectedSectors.includes(company.sector));
  }, [companies, selectedSectors]);

  // Count tech companies for chaos map
  const techCompanyCount = useMemo(() => {
    return companies.filter(c =>
      c.sector === 'technology' &&
      c.techSubcategory &&
      selectedTechSubcategories.includes(c.techSubcategory)
    ).length;
  }, [companies, selectedTechSubcategories]);

  // Handlers for sectors
  const handleSectorToggle = (sector: Sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };
  const handleSelectAllSectors = () => setSelectedSectors(ALL_SECTORS);
  const handleClearAllSectors = () => setSelectedSectors([]);

  // Handlers for tech subcategories
  const handleTechSubcategoryToggle = (subcategory: TechSubcategory) => {
    setSelectedTechSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((s) => s !== subcategory) : [...prev, subcategory]
    );
  };
  const handleSelectAllTechSubcategories = () => setSelectedTechSubcategories(ALL_TECH_SUBCATEGORIES);
  const handleClearAllTechSubcategories = () => setSelectedTechSubcategories([]);

  // Mode change handler - reset selection
  const handleModeChange = (mode: VisualizationMode) => {
    setVisualizationMode(mode);
    setSelectedCompany(null);
  };

  // Force refresh handler
  const handleRefresh = () => {
    refetch(true); // Force refresh from API
  };

  // Get title and description based on mode
  const getTitle = () => {
    switch (visualizationMode) {
      case 'cellular':
        return 'Cellular Market';
      case 'cityscape':
        return 'City Scape Market';
      case 'chaosmap':
        return 'Tech Chaos Map';
      default:
        return 'Market Visualization';
    }
  };

  const getDescription = () => {
    switch (visualizationMode) {
      case 'cellular':
        return '日本株式市場 3D可視化（セル方式）';
      case 'cityscape':
        return '日本株式市場 3D可視化（都市方式）';
      case 'chaosmap':
        return 'テクノロジー業界 カオスマップ';
      default:
        return '日本株式市場 3D可視化';
    }
  };

  return (
    <main className="relative w-full h-screen bg-gray-50 overflow-hidden">
      {/* 3D Visualization */}
      <div className="absolute inset-0">
        {visualizationMode === 'cellular' && (
          <CellularMarket
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
          />
        )}
        {visualizationMode === 'cityscape' && (
          <CityScapeMarket
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
          />
        )}
        {visualizationMode === 'chaosmap' && (
          <ChaosMapMarket
            companies={companies}
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            selectedSubcategories={selectedTechSubcategories}
          />
        )}
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getTitle()}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-gray-500">
                {getDescription()}
                {lastUpdated && (
                  <span className="ml-2 text-xs text-gray-400">
                    取得: {lastUpdated.toLocaleTimeString('ja-JP')}
                  </span>
                )}
              </p>
              <CacheStatusBadge
                cacheSource={cacheSource}
                cacheAge={cacheAge}
                loading={loading}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
          <VisualizationSwitcher mode={visualizationMode} onModeChange={handleModeChange} />
        </div>
      </header>

      {/* Info Panel (Right side) */}
      <div className="absolute top-20 right-4 z-10">
        <CompanyInfoPanel company={selectedCompany} />
      </div>

      {/* Filter (Bottom left) */}
      <div className="absolute bottom-4 left-4 z-10">
        {isChaosMapMode ? (
          <TechSubcategoryLegend
            selectedSubcategories={selectedTechSubcategories}
            onSubcategoryToggle={handleTechSubcategoryToggle}
            onSelectAll={handleSelectAllTechSubcategories}
            onClearAll={handleClearAllTechSubcategories}
          />
        ) : (
          <SectorLegend
            selectedSectors={selectedSectors}
            onSectorToggle={handleSectorToggle}
            onSelectAll={handleSelectAllSectors}
            onClearAll={handleClearAllSectors}
          />
        )}
      </div>

      {/* Legend (Bottom right) */}
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
          {(visualizationMode === 'cityscape' || visualizationMode === 'chaosmap') && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">高さ</h3>
              <p className="text-xs text-gray-500">= 時価総額</p>
            </div>
          )}
        </div>
      </div>

      {/* Company count */}
      <div className="absolute top-20 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 px-3 py-2">
          <span className="text-sm text-gray-700">
            表示中: <span className="font-bold">
              {isChaosMapMode ? techCompanyCount : filteredCompanies.length}
            </span> 社
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <p className="text-gray-400 text-sm text-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
          ドラッグで回転 • スクロールでズーム • 企業をクリックで詳細表示
        </p>
      </div>

      {/* Loading/Error indicator */}
      {loading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm">
            データを読み込み中...
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm">
            エラー: {error}
          </div>
        </div>
      )}
    </main>
  );
}
