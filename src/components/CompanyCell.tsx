'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Company } from '@/types/company';
import { getChangeColor, getMarketCapSize, getVolumeIntensity } from '@/data/companyData';

interface CompanyCellProps {
  company: Company;
  position: [number, number, number];
  onClick?: (company: Company) => void;
  isSelected?: boolean;
}

export function CompanyCell({ company, position, onClick, isSelected }: CompanyCellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const size = getMarketCapSize(company.marketCap);
  const color = getChangeColor(company.change);
  const intensity = getVolumeIntensity(company.volume);

  // Animation for pulsing effect based on volume
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + company.volume * 10) * 0.05 * intensity;
      const currentScale = size + pulse;
      meshRef.current.scale.setScalar(currentScale);

      if (glowRef.current) {
        glowRef.current.scale.setScalar(currentScale * 1.2);
      }
    }
  });

  return (
    <group position={position}>
      {/* Glow effect - outer sphere */}
      <mesh ref={glowRef} scale={size * 1.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2 * intensity}
          depthWrite={false}
        />
      </mesh>

      {/* Main sphere */}
      <mesh
        ref={meshRef}
        scale={size}
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
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.85}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={size * 1.4}>
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
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
