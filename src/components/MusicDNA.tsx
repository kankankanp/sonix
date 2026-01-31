'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MusicMemory } from '@/types';

interface DNAShapeProps {
  features: MusicMemory['features'];
}

function DNAShape({ features }: DNAShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate unique shape based on music features
  const { color, distort, speed, scale } = useMemo(() => {
    const hue = features.valence * 0.3 + features.energy * 0.2;
    const saturation = 0.7 + features.danceability * 0.3;
    const lightness = 0.5 + features.valence * 0.2;

    return {
      color: new THREE.Color().setHSL(hue, saturation, lightness),
      distort: 0.3 + features.energy * 0.4,
      speed: 1 + features.tempo / 200,
      scale: 1 + features.danceability * 0.5,
    };
  }, [features]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={speed}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

// Orbiting particles representing music characteristics
function Particles({ features }: DNAShapeProps) {
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = Math.floor(50 + features.energy * 100);

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 1.5 + Math.random() * 0.5;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, [particleCount]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  const particleColor = useMemo(() => {
    const hue = features.valence * 0.3 + 0.5;
    return new THREE.Color().setHSL(hue, 0.8, 0.6);
  }, [features.valence]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={particleColor}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Ring representing tempo
function TempoRing({ features }: DNAShapeProps) {
  const ringRef = useRef<THREE.Mesh>(null);

  const ringScale = 1.8 + (features.tempo / 200) * 0.5;

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = state.clock.elapsedTime * (features.tempo / 100);
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[ringScale, 0.02, 16, 100]} />
      <meshStandardMaterial
        color={new THREE.Color().setHSL(features.energy * 0.3, 0.9, 0.5)}
        emissive={new THREE.Color().setHSL(features.energy * 0.3, 0.9, 0.3)}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

interface MusicDNAProps {
  memory: MusicMemory;
  size?: 'small' | 'large';
}

export default function MusicDNA({ memory, size = 'large' }: MusicDNAProps) {
  const containerClass = size === 'large' ? 'w-full h-[300px]' : 'w-full h-[150px]';

  return (
    <div className={containerClass}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a9eff" />

        <DNAShape features={memory.features} />
        <Particles features={memory.features} />
        <TempoRing features={memory.features} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
