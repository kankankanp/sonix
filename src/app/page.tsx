'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import TimelineSlider from '@/components/TimelineSlider';
import MemoryInfoPanel from '@/components/MemoryInfoPanel';
import MemoryList from '@/components/MemoryList';

// Dynamic import for Globe to avoid SSR issues with WebGL
const MusicGlobe = dynamic(() => import('@/components/MusicGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="text-white/60 text-lg">地球を読み込み中...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Globe */}
      <div className="absolute inset-0">
        <MusicGlobe />
      </div>

      {/* Header */}
      <Header />

      {/* Memory Info Panel (Right side) */}
      <MemoryInfoPanel />

      {/* Left Panel - Memory List */}
      <div className="absolute top-20 left-4 w-72 z-10">
        <MemoryList />
      </div>

      {/* Bottom Timeline */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="max-w-2xl mx-auto">
          <TimelineSlider />
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <p className="text-white/40 text-sm text-center">
          地球をドラッグして回転 • ピンをクリックして詳細表示 • スライダーで時間を操作
        </p>
      </div>
    </main>
  );
}
