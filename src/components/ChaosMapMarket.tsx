'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Company, Sector, SECTOR_COLORS, SECTOR_NAMES } from '@/types/company';
import { TechBuildingCell } from './TechBuildingCell';

interface ChaosMapSceneProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  selectedSectors: Sector[];
}

// Grid positions for companies - organized by sector
function getCompanyPositions(companies: Company[]): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>();

  // Group companies by sector
  const bySector = new Map<Sector, Company[]>();
  companies.forEach(company => {
    const list = bySector.get(company.sector) || [];
    list.push(company);
    bySector.set(company.sector, list);
  });

  // Sector cluster centers
  const sectorCenters: Record<Sector, [number, number]> = {
    technology: [0, 0],
    finance: [6, 0],
    healthcare: [-6, 0],
    consumer: [3, 5],
    industrial: [-3, 5],
    energy: [6, -5],
    materials: [-6, -5],
    telecom: [0, 5],
    utilities: [3, -5],
    realEstate: [-3, -5],
  };

  // Place companies in a grid pattern around their sector center
  bySector.forEach((sectorCompanies, sector) => {
    const [cx, cz] = sectorCenters[sector];
    const gridSize = Math.ceil(Math.sqrt(sectorCompanies.length));
    const spacing = 1.2;

    sectorCompanies.forEach((company, idx) => {
      const row = Math.floor(idx / gridSize);
      const col = idx % gridSize;
      const offsetX = (col - (gridSize - 1) / 2) * spacing;
      const offsetZ = (row - (gridSize - 1) / 2) * spacing;
      positions.set(company.id, [cx + offsetX, 0, cz + offsetZ]);
    });
  });

  return positions;
}

function SectorLabel({ sector, companies }: { sector: Sector; companies: Company[] }) {
  // Calculate center position for this sector's companies
  const sectorCompanies = companies.filter(c => c.sector === sector);
  if (sectorCompanies.length === 0) return null;

  const sectorCenters: Record<Sector, [number, number]> = {
    technology: [0, 0],
    finance: [6, 0],
    healthcare: [-6, 0],
    consumer: [3, 5],
    industrial: [-3, 5],
    energy: [6, -5],
    materials: [-6, -5],
    telecom: [0, 5],
    utilities: [3, -5],
    realEstate: [-3, -5],
  };

  const [cx, cz] = sectorCenters[sector];
  const color = SECTOR_COLORS[sector];
  const name = SECTOR_NAMES[sector];

  return (
    <group position={[cx, 0, cz]}>
      {/* Category area indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>

      {/* Category name using Html */}
      <Html position={[0, 0.1, 3]} center style={{ pointerEvents: 'none' }}>
        <div
          className="text-sm font-bold whitespace-nowrap px-2 py-1 rounded"
          style={{ color, backgroundColor: 'rgba(255,255,255,0.8)' }}
        >
          {name} ({sectorCompanies.length})
        </div>
      </Html>
    </group>
  );
}

function ChaosMapScene({ companies, selectedCompany, onSelectCompany, selectedSectors }: ChaosMapSceneProps) {
  const filteredCompanies = useMemo(() => {
    if (selectedSectors.length === 0) return [];
    return companies.filter(c => selectedSectors.includes(c.sector));
  }, [companies, selectedSectors]);

  const positions = useMemo(() => {
    return getCompanyPositions(filteredCompanies);
  }, [filteredCompanies]);

  // Get unique sectors that have companies
  const activeSectors = useMemo(() => {
    const sectors = new Set<Sector>();
    filteredCompanies.forEach(c => sectors.add(c.sector));
    return Array.from(sectors);
  }, [filteredCompanies]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 15, -10]} intensity={0.4} />
      <pointLight position={[0, 15, 0]} intensity={0.5} />

      {/* Background */}
      <color attach="background" args={['#f8fafc']} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Sector labels */}
      {activeSectors.map(sector => (
        <SectorLabel key={sector} sector={sector} companies={filteredCompanies} />
      ))}

      {/* Companies as buildings */}
      {filteredCompanies.map((company) => {
        const position = positions.get(company.id);
        if (!position) return null;
        return (
          <TechBuildingCell
            key={company.id}
            company={company}
            position={position}
            onClick={() => onSelectCompany(company)}
            isSelected={selectedCompany?.id === company.id}
          />
        );
      })}

      {/* Grid */}
      <gridHelper args={[30, 30, '#cbd5e1', '#e2e8f0']} position={[0, 0.01, 0]} />
    </>
  );
}

interface ChaosMapMarketProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  selectedSectors: Sector[];
}

export function ChaosMapMarket({ companies, selectedCompany, onSelectCompany, selectedSectors }: ChaosMapMarketProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onPointerMissed={() => onSelectCompany(null)}
      >
        <PerspectiveCamera makeDefault position={[12, 15, 12]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 2, 0]}
        />
        <ChaosMapScene
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
          selectedSectors={selectedSectors}
        />
      </Canvas>
    </div>
  );
}
