'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SaaSCompany, SAAS_CATEGORY_COLORS } from '@/types/saas';
import { getValuationSize, getGrowthColor } from '@/data/saasData';

interface SaaSCellProps {
  company: SaaSCompany;
  position: [number, number, number];
  onClick?: (company: SaaSCompany) => void;
  isSelected?: boolean;
}

export function SaaSCell({ company, position, onClick, isSelected }: SaaSCellProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const size = getValuationSize(company.valuation);
  const growthColor = getGrowthColor(company.growth);
  const categoryColor = SAAS_CATEGORY_COLORS[company.category];

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const float = Math.sin(state.clock.elapsedTime + parseFloat(company.id.slice(-2) || '0')) * 0.05;
      meshRef.current.position.y = position[1] + float;

      if (hovered) {
        meshRef.current.scale.setScalar(size * 1.1);
      } else {
        meshRef.current.scale.setScalar(size);
      }
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Shadow on ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[size * 0.8, 32]} />
        <meshBasicMaterial color="#000" transparent opacity={0.1} />
      </mesh>

      {/* Main sphere */}
      <mesh
        ref={meshRef}
        position={[0, position[1], 0]}
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
          color={categoryColor}
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Growth indicator ring */}
      <mesh position={[0, position[1], 0]} rotation={[Math.PI / 2, 0, 0]} scale={size * 1.2}>
        <ringGeometry args={[0.9, 1, 32]} />
        <meshBasicMaterial color={growthColor} side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, position[1], 0]} rotation={[Math.PI / 2, 0, 0]} scale={size * 1.5}>
          <ringGeometry args={[0.95, 1, 32]} />
          <meshBasicMaterial color="#3b82f6" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Company name label (always visible for larger companies) */}
      {(company.valuation && company.valuation > 5000) && (
        <Text
          position={[0, position[1] + size + 0.3, 0]}
          fontSize={0.25}
          color="#374151"
          anchorX="center"
          anchorY="bottom"
        >
          {company.name}
        </Text>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[0, position[1] + size + 0.5, 0]} style={{ pointerEvents: 'none' }}>
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
