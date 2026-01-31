'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Company, SECTOR_COLORS } from '@/types/company';

interface TechBuildingCellProps {
  company: Company;
  position: [number, number, number];
  onClick?: (company: Company) => void;
  isSelected?: boolean;
}

// Helper function to get color based on change percentage
function getChangeColor(change: number): string {
  if (change <= -3) return '#ef4444';      // red-500
  if (change <= -1.5) return '#fca5a5';    // red-300
  if (change < 0) return '#fef08a';        // yellow-200
  if (change < 1.5) return '#bbf7d0';      // green-200
  if (change < 3) return '#86efac';        // green-300
  return '#22c55e';                         // green-500
}

// Helper function to normalize market cap to building height
function getHeightFromMarketCap(marketCap: number): number {
  // marketCap is in 億円 (100 million yen)
  // Scale: 100億円 = 1, 100,000億円 (10兆円) = 5
  const minHeight = 0.5;
  const maxHeight = 5;
  const logScale = Math.log10(Math.max(marketCap, 100)) - 2; // log10(100) = 2
  const normalized = Math.min(logScale / 3, 1); // max at log10(100000) - 2 = 3
  return minHeight + normalized * (maxHeight - minHeight);
}

export function TechBuildingCell({ company, position, onClick, isSelected }: TechBuildingCellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Height based on market cap
  const height = getHeightFromMarketCap(company.marketCap);
  const changeColor = getChangeColor(company.change);
  const sectorColor = SECTOR_COLORS[company.sector];

  // Base width
  const baseWidth = 0.4;

  // Hover animation
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? baseWidth * 1.1 : baseWidth;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Main building */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        scale={[baseWidth, height, baseWidth]}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(company);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={sectorColor}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Change indicator - top cap */}
      <mesh position={[0, height + 0.05, 0]} scale={[baseWidth * 1.1, 0.1, baseWidth * 1.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={changeColor} />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseWidth * 1.2, baseWidth * 1.6, 4]} />
          <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[0, height + 0.8, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 whitespace-nowrap min-w-[180px]">
            <div className="font-bold text-gray-900">{company.name}</div>
            <div className="text-xs text-gray-500">{company.ticker}</div>
            <div className="flex gap-3 mt-2 text-xs">
              <div>
                <span className="text-gray-500">時価総額:</span>{' '}
                <span className="font-medium">{company.marketCap.toLocaleString()}億円</span>
              </div>
              <div>
                <span className="text-gray-500">騰落率:</span>{' '}
                <span className={`font-medium ${company.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {company.change >= 0 ? '+' : ''}{company.change.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-1 text-xs">
              <div>
                <span className="text-gray-500">株価:</span>{' '}
                <span className="font-medium">¥{company.price.toLocaleString()}</span>
              </div>
              {company.per > 0 && (
                <div>
                  <span className="text-gray-500">PER:</span>{' '}
                  <span className="font-medium">{company.per.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
