'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Company, SECTOR_POSITIONS } from '@/types/company';
import { CompanyCell } from './CompanyCell';

interface CellularMarketSceneProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
}

// Group companies by sector
function groupBySector(companies: Company[]): Record<string, Company[]> {
  return companies.reduce((acc, company) => {
    if (!acc[company.sector]) {
      acc[company.sector] = [];
    }
    acc[company.sector].push(company);
    return acc;
  }, {} as Record<string, Company[]>);
}

// Calculate company position within its sector cluster
function getCompanyPosition(company: Company, sectorCompanies: Company[]): [number, number, number] {
  const basePosition = SECTOR_POSITIONS[company.sector];
  const sectorIndex = sectorCompanies.findIndex(c => c.id === company.id);

  // Spread companies within sector using a spiral pattern
  const angle = sectorIndex * 2.4; // Golden angle approximation
  const radius = 1.0 + sectorIndex * 0.4;
  const height = (sectorIndex % 3 - 1) * 0.6;

  return [
    basePosition[0] * 2 + Math.cos(angle) * radius,
    basePosition[1] * 2 + height,
    basePosition[2] * 2 + Math.sin(angle) * radius,
  ];
}

function CellularMarketScene({ companies, selectedCompany, onSelectCompany }: CellularMarketSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const companiesBySector = useMemo(() => groupBySector(companies), [companies]);

  // Slow rotation of the entire scene
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-10, -5, -10]} intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.6} />

      {/* Background color */}
      <color attach="background" args={['#f8fafc']} />

      {/* Company cells */}
      <group ref={groupRef}>
        {companies.map((company) => {
          const sectorCompanies = companiesBySector[company.sector] || [];
          const position = getCompanyPosition(company, sectorCompanies);

          return (
            <CompanyCell
              key={company.id}
              company={company}
              position={position}
              onClick={onSelectCompany}
              isSelected={selectedCompany?.id === company.id}
            />
          );
        })}
      </group>

      {/* Grid helper for reference */}
      <gridHelper args={[30, 30, '#d1d5db', '#e5e7eb']} position={[0, -6, 0]} />
    </>
  );
}

interface CellularMarketProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
}

export function CellularMarket({ companies, selectedCompany, onSelectCompany }: CellularMarketProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onPointerMissed={() => onSelectCompany(null)}
      >
        <PerspectiveCamera makeDefault position={[0, 8, 20]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={60}
          target={[0, 0, 0]}
        />
        <CellularMarketScene
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
        />
      </Canvas>
    </div>
  );
}
