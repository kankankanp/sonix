'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SaaSCompany, SAAS_CATEGORY_COLORS } from '@/types/saas';
import { getValuationSize, getGrowthColor } from '@/data/saasData';

interface SaaSBuildingCellProps {
  company: SaaSCompany;
  position: [number, number, number];
  onClick?: (company: SaaSCompany) => void;
  isSelected?: boolean;
}

export function SaaSBuildingCell({ company, position, onClick, isSelected }: SaaSBuildingCellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Height based on valuation
  const height = getValuationSize(company.valuation) * 4;
  const growthColor = getGrowthColor(company.growth);
  const categoryColor = SAAS_CATEGORY_COLORS[company.category];

  // Base width
  const baseWidth = 0.35;

  // Hover animation
  useFrame(() => {
    if (meshRef.current) {
      if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, baseWidth * 1.1, 0.1);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, baseWidth * 1.1, 0.1);
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, baseWidth, 0.1);
        meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, baseWidth, 0.1);
      }
    }
  });

  // Adjust Y position so buildings sit on the ground
  const adjustedPosition: [number, number, number] = [
    position[0],
    height / 2,
    position[2],
  ];

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
          color={categoryColor}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Growth indicator - top cap */}
      <mesh position={[0, height + 0.05, 0]} scale={[baseWidth * 1.1, 0.1, baseWidth * 1.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={growthColor} />
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
            <div className="text-xs text-gray-500">{company.subcategory}</div>
            <div className="text-xs text-gray-600 mt-1">{company.description}</div>
            <div className="flex gap-3 mt-2 text-xs">
              {company.valuation && (
                <div>
                  <span className="text-gray-500">評価額:</span>{' '}
                  <span className="font-medium">{(company.valuation / 100).toLocaleString()}億円</span>
                </div>
              )}
              {company.growth && (
                <div>
                  <span className="text-gray-500">成長率:</span>{' '}
                  <span className={`font-medium ${company.growth > 20 ? 'text-green-600' : 'text-gray-900'}`}>
                    +{company.growth}%
                  </span>
                </div>
              )}
            </div>
            {company.isPublic && company.ticker && (
              <div className="text-xs text-blue-600 mt-1">
                上場: {company.ticker}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
