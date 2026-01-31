'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useMusicStore } from '@/store/useMusicStore';
import { getColorFromFeatures } from '@/data/mockData';
import { MusicMemory } from '@/types';

// Dynamic import for Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/60">Loading Globe...</div>
    </div>
  ),
});

interface GlobePoint {
  lat: number;
  lng: number;
  size: number;
  color: string;
  memory: MusicMemory;
}

export default function MusicGlobe() {
  const globeRef = useRef<any>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const { memories, currentTime, setSelectedMemory, selectedMemory } = useMusicStore();

  // Filter memories based on current time
  const filteredMemories = memories.filter(m => m.listenedAt <= currentTime);

  // Convert memories to globe points
  const points: GlobePoint[] = filteredMemories.map(memory => ({
    lat: memory.lat,
    lng: memory.lng,
    size: (memory.popularity / 100) * 1.5 + 0.3, // Size based on popularity
    color: getColorFromFeatures(memory.features),
    memory,
  }));

  // Handle point click
  const handlePointClick = useCallback((point: object) => {
    const p = point as GlobePoint;
    setSelectedMemory(p.memory);
  }, [setSelectedMemory]);

  // Auto-rotate globe
  useEffect(() => {
    if (globeRef.current && globeReady) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, [globeReady]);

  // Focus on selected memory
  useEffect(() => {
    if (globeRef.current && selectedMemory && globeReady) {
      globeRef.current.pointOfView(
        { lat: selectedMemory.lat, lng: selectedMemory.lng, altitude: 2 },
        1000
      );
    }
  }, [selectedMemory, globeReady]);

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={points}
        pointLat={(d) => (d as GlobePoint).lat}
        pointLng={(d) => (d as GlobePoint).lng}
        pointColor={(d) => (d as GlobePoint).color}
        pointAltitude={0.01}
        pointRadius={(d) => (d as GlobePoint).size}
        pointsMerge={false}
        onPointClick={handlePointClick}
        onGlobeReady={() => setGlobeReady(true)}
        animateIn={true}
        atmosphereColor="#3a82f7"
        atmosphereAltitude={0.25}
      />
    </div>
  );
}
