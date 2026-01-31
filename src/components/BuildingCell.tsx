'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Company } from '@/types/company';
import { getChangeColor, getMarketCapSize, getVolumeIntensity } from '@/data/companyData';

interface BuildingCellProps {
  company: Company;
  position: [number, number, number];
  onClick?: (company: Company) => void;
  isSelected?: boolean;
}

export function BuildingCell({ company, position, onClick, isSelected }: BuildingCellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Height based on market cap (taller = bigger company)
  const height = getMarketCapSize(company.marketCap) * 3;
  const color = getChangeColor(company.change);
  const intensity = getVolumeIntensity(company.volume);

  // Base width - slightly varied by volume
  const baseWidth = 0.4 + intensity * 0.2;

  // Subtle animation
  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.x = baseWidth + Math.sin(state.clock.elapsedTime * 3) * 0.02;
      meshRef.current.scale.z = baseWidth + Math.sin(state.clock.elapsedTime * 3) * 0.02;
    }
  });

  // Adjust Y position so buildings sit on the ground
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] + height / 2,
    position[2],
  ];

  return (
    <group position={adjustedPosition}>
      {/* Main building */}
      <mesh
        ref={meshRef}
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
          color={color}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Glowing top for high volume stocks */}
      {company.volume > 0.6 && (
        <mesh position={[0, height / 2 + 0.05, 0]} scale={[baseWidth * 0.8, 0.1, baseWidth * 0.8]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -height / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[baseWidth * 0.8, baseWidth * 1.2, 4]} />
          <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[0, height / 2 + 0.5, 0]} style={{ pointerEvents: 'none' }}>
          <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 whitespace-nowrap">
            <div className="font-bold text-gray-900">{company.name}</div>
            <div className="text-sm text-gray-500">{company.ticker}</div>
            <div className={`text-sm font-medium ${company.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {company.change >= 0 ? '+' : ''}{company.change.toFixed(2)}%
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
