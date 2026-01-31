'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Company, TechSubcategory, TECH_SUBCATEGORY_COLORS, TECH_SUBCATEGORY_NAMES, TECH_SUBCATEGORY_POSITIONS } from '@/types/company';
import { TechBuildingCell } from './TechBuildingCell';

interface ChaosMapSceneProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  selectedSubcategories: TechSubcategory[];
}

// Grid positions for companies - organized by tech subcategory
function getCompanyPositions(companies: Company[]): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>();

  // Group companies by tech subcategory
  const bySubcategory = new Map<TechSubcategory, Company[]>();
  companies.forEach(company => {
    if (company.techSubcategory) {
      const list = bySubcategory.get(company.techSubcategory) || [];
      list.push(company);
      bySubcategory.set(company.techSubcategory, list);
    }
  });

  // Place companies in a grid pattern around their subcategory center
  bySubcategory.forEach((subcategoryCompanies, subcategory) => {
    const [cx, cz] = TECH_SUBCATEGORY_POSITIONS[subcategory];
    const gridSize = Math.ceil(Math.sqrt(subcategoryCompanies.length));
    const spacing = 1.2;

    subcategoryCompanies.forEach((company, idx) => {
      const row = Math.floor(idx / gridSize);
      const col = idx % gridSize;
      const offsetX = (col - (gridSize - 1) / 2) * spacing;
      const offsetZ = (row - (gridSize - 1) / 2) * spacing;
      positions.set(company.id, [cx + offsetX, 0, cz + offsetZ]);
    });
  });

  return positions;
}

function SubcategoryLabel({ subcategory, companies }: { subcategory: TechSubcategory; companies: Company[] }) {
  // Calculate center position for this subcategory's companies
  const subcategoryCompanies = companies.filter(c => c.techSubcategory === subcategory);
  if (subcategoryCompanies.length === 0) return null;

  const [cx, cz] = TECH_SUBCATEGORY_POSITIONS[subcategory];
  const color = TECH_SUBCATEGORY_COLORS[subcategory];
  const name = TECH_SUBCATEGORY_NAMES[subcategory];

  return (
    <group position={[cx, 0, cz]}>
      {/* Category area indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[2.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>

      {/* Category name using Html */}
      <Html position={[0, 0.1, 3.5]} center style={{ pointerEvents: 'none' }}>
        <div
          className="text-sm font-bold whitespace-nowrap px-2 py-1 rounded"
          style={{ color, backgroundColor: 'rgba(255,255,255,0.9)' }}
        >
          {name} ({subcategoryCompanies.length})
        </div>
      </Html>
    </group>
  );
}

function ChaosMapScene({ companies, selectedCompany, onSelectCompany, selectedSubcategories }: ChaosMapSceneProps) {
  // Filter to only technology companies with matching subcategories
  const filteredCompanies = useMemo(() => {
    if (selectedSubcategories.length === 0) return [];
    return companies.filter(c =>
      c.sector === 'technology' &&
      c.techSubcategory &&
      selectedSubcategories.includes(c.techSubcategory)
    );
  }, [companies, selectedSubcategories]);

  const positions = useMemo(() => {
    return getCompanyPositions(filteredCompanies);
  }, [filteredCompanies]);

  // Get unique subcategories that have companies
  const activeSubcategories = useMemo(() => {
    const subcategories = new Set<TechSubcategory>();
    filteredCompanies.forEach(c => {
      if (c.techSubcategory) subcategories.add(c.techSubcategory);
    });
    return Array.from(subcategories);
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
        <planeGeometry args={[35, 35]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Subcategory labels */}
      {activeSubcategories.map(subcategory => (
        <SubcategoryLabel key={subcategory} subcategory={subcategory} companies={filteredCompanies} />
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
      <gridHelper args={[35, 35, '#cbd5e1', '#e2e8f0']} position={[0, 0.01, 0]} />
    </>
  );
}

interface ChaosMapMarketProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (company: Company | null) => void;
  selectedSubcategories: TechSubcategory[];
}

export function ChaosMapMarket({ companies, selectedCompany, onSelectCompany, selectedSubcategories }: ChaosMapMarketProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ antialias: true }}
        dpr={[1, 2]}
        onPointerMissed={() => onSelectCompany(null)}
      >
        <PerspectiveCamera makeDefault position={[15, 18, 15]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 2, 0]}
        />
        <ChaosMapScene
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={onSelectCompany}
          selectedSubcategories={selectedSubcategories}
        />
      </Canvas>
    </div>
  );
}
