'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Company, SECTOR_COLORS, Sector } from '@/types/company';
import { BuildingCell } from './BuildingCell';

interface CityScapeMarketSceneProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
}

// Group companies by sector and create grid positions
function getGridPosition(company: Company, companies: Company[]): [number, number, number] {
  const sectors: Sector[] = ['technology', 'finance', 'healthcare', 'consumer', 'industrial', 'energy', 'materials', 'telecom', 'utilities', 'realEstate'];

  const sectorIndex = sectors.indexOf(company.sector);
  const sectorCompanies = companies.filter(c => c.sector === company.sector);
  const indexInSector = sectorCompanies.findIndex(c => c.id === company.id);

  // Grid layout: sectors in columns, companies in rows
  const col = sectorIndex;
  const row = indexInSector;

  const spacing = 1.2;
  const sectorSpacing = 1.5;

  return [
    col * sectorSpacing - (sectors.length * sectorSpacing) / 2 + sectorSpacing / 2,
    0,
    row * spacing - 2,
  ];
}

function CityScapeMarketScene({ companies, selectedCompany, onSelectCompany }: CityScapeMarketSceneProps) {
  const positions = useMemo(() => {
    return companies.map(company => ({
      company,
      position: getGridPosition(company, companies),
    }));
  }, [companies]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.4} />

      {/* Background */}
      <color attach="background" args={['#f1f5f9']} />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Sector labels on ground */}
      {(['technology', 'finance', 'healthcare', 'consumer', 'industrial', 'energy', 'materials', 'telecom', 'utilities', 'realEstate'] as Sector[]).map((sector, index) => {
        const sectorSpacing = 1.5;
        const x = index * sectorSpacing - (10 * sectorSpacing) / 2 + sectorSpacing / 2;
        return (
          <mesh key={sector} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -4]}>
            <planeGeometry args={[1.2, 0.3]} />
            <meshBasicMaterial color={SECTOR_COLORS[sector]} opacity={0.7} transparent />
          </mesh>
        );
      })}

      {/* Buildings */}
      {positions.map(({ company, position }) => (
        <BuildingCell
          key={company.id}
          company={company}
          position={position}
          onClick={onSelectCompany}
          isSelected={selectedCompany?.id === company.id}
        />
      ))}

      {/* Grid lines */}
      <gridHelper args={[30, 30, '#cbd5e1', '#e2e8f0']} position={[0, 0.02, 0]} />
    </>
  );
}

interface CityScapeMarketProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
}

export function CityScapeMarket({ companies, selectedCompany, onSelectCompany }: CityScapeMarketProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onPointerMissed={() => onSelectCompany(null)}
      >
        <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 2, 0]}
        />
        <CityScapeMarketScene
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
        />
      </Canvas>
    </div>
  );
}
