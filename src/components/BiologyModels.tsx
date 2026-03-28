
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, Torus, Tube, Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- Human Heart Model ---
export function HeartModel({ isPaused = false }) {
  const groupRef = useRef<THREE.Group>(null);

  // Aorta curve with branching
  const aortaCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.8, 0.1),
      new THREE.Vector3(0.2, 2.2, 0.2),
      new THREE.Vector3(0.8, 2.8, 0.3),
      new THREE.Vector3(1.6, 2.4, 0.2),
      new THREE.Vector3(1.8, 0.5, 0),
      new THREE.Vector3(1.8, -2.5, -0.2),
    ]);
  }, []);

  // Coronary artery curves
  const coronaryLeft = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.4, 0.8, 0.8),
      new THREE.Vector3(0.6, 0.2, 1.0),
      new THREE.Vector3(0.8, -0.5, 0.9),
      new THREE.Vector3(0.9, -1.2, 0.6),
    ]);
  }, []);

  const coronaryRight = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.6, 0.8),
      new THREE.Vector3(-0.7, 0.0, 0.9),
      new THREE.Vector3(-0.9, -0.8, 0.7),
      new THREE.Vector3(-1.0, -1.5, 0.4),
    ]);
  }, []);

  useFrame((state) => {
    if (!isPaused && groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Pulsing effect
      const scale = 1 + Math.sin(t * 4) * 0.035;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ventricles (Main Mass) */}
      <group position={[0, -0.2, 0]}>
        {/* Left Ventricle (Larger) */}
        <Sphere args={[1.3, 32, 32]} position={[0.3, -0.4, 0]} scale={[1, 1.5, 0.9]}>
          <meshStandardMaterial color="#a11d33" roughness={0.4} />
        </Sphere>
        {/* Right Ventricle */}
        <Sphere args={[1.1, 32, 32]} position={[-0.4, -0.2, 0.2]} scale={[1, 1.3, 0.8]}>
          <meshStandardMaterial color="#b91c1c" roughness={0.4} />
        </Sphere>
      </group>
      
      {/* Atria (Upper Chambers) */}
      <Sphere args={[0.7, 32, 32]} position={[0.6, 1.0, 0.1]} scale={[1.1, 0.8, 1]}>
        <meshStandardMaterial color="#881337" roughness={0.5} />
      </Sphere>
      <Sphere args={[0.6, 32, 32]} position={[-0.6, 0.9, 0.2]} scale={[1, 0.7, 1]}>
        <meshStandardMaterial color="#881337" roughness={0.5} />
      </Sphere>

      {/* Aorta (Main Artery) */}
      <group>
        <Tube args={[aortaCurve, 64, 0.3, 12, false]}>
          <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.1} />
        </Tube>
        {/* Aortic Branches */}
        <Cylinder args={[0.08, 0.08, 0.8]} position={[0.4, 2.8, 0.3]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color="#dc2626" />
        </Cylinder>
        <Cylinder args={[0.08, 0.08, 0.8]} position={[0.7, 2.9, 0.3]} rotation={[0, 0, -0.1]}>
          <meshStandardMaterial color="#dc2626" />
        </Cylinder>
        <Cylinder args={[0.08, 0.08, 0.8]} position={[1.0, 2.8, 0.3]} rotation={[0, 0, 0.1]}>
          <meshStandardMaterial color="#dc2626" />
        </Cylinder>
      </group>
      
      {/* Superior Vena Cava */}
      <Cylinder args={[0.25, 0.25, 2.2]} position={[-0.9, 1.8, 0.1]} rotation={[0, 0, 0.05]}>
        <meshStandardMaterial color="#1d4ed8" roughness={0.3} />
      </Cylinder>
      
      {/* Inferior Vena Cava */}
      <Cylinder args={[0.22, 0.22, 1.2]} position={[-0.8, -1.8, -0.2]}>
        <meshStandardMaterial color="#1d4ed8" roughness={0.3} />
      </Cylinder>

      {/* Pulmonary Artery (Blue) */}
      <group>
        <Cylinder args={[0.22, 0.22, 1.8]} position={[-0.1, 1.4, 0.6]} rotation={[0, 0, 0.6]}>
          <meshStandardMaterial color="#2563eb" roughness={0.3} />
        </Cylinder>
        {/* Branching */}
        <Cylinder args={[0.15, 0.15, 1.2]} position={[0.5, 1.8, 0.6]} rotation={[0, 0, 1.2]}>
          <meshStandardMaterial color="#2563eb" />
        </Cylinder>
        <Cylinder args={[0.15, 0.15, 1.2]} position={[-0.6, 1.8, 0.6]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color="#2563eb" />
        </Cylinder>
      </group>

      {/* Coronary Arteries (Surface Detail) */}
      <Tube args={[coronaryLeft, 32, 0.04, 8, false]}>
        <meshStandardMaterial color="#ef4444" />
      </Tube>
      <Tube args={[coronaryRight, 32, 0.04, 8, false]}>
        <meshStandardMaterial color="#ef4444" />
      </Tube>
      
      {/* Labels */}
      <Html position={[2.2, 2.5, 0]}>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded border border-red-400 shadow-md text-[9px] font-bold uppercase whitespace-nowrap">Aorta</div>
      </Html>
      <Html position={[-2.2, 2.5, 0]}>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded border border-blue-400 shadow-md text-[9px] font-bold uppercase whitespace-nowrap">Vena Cava</div>
      </Html>
      <Html position={[1.5, -1.5, 0]}>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded border border-red-600 shadow-md text-[9px] font-bold uppercase whitespace-nowrap">Left Ventricle</div>
      </Html>
    </group>
  );
}

// --- Plant Cell Model ---
export function PlantCellModel() {
  return (
    <group>
      {/* Cell Wall */}
      <Box args={[4, 5, 4]}>
        <meshStandardMaterial color="#166534" transparent opacity={0.3} wireframe />
      </Box>
      <Box args={[3.8, 4.8, 3.8]}>
        <meshStandardMaterial color="#22c55e" transparent opacity={0.1} />
      </Box>
      
      {/* Vacuole */}
      <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]} scale={[1, 1.5, 1]}>
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.6} />
      </Sphere>
      
      {/* Nucleus */}
      <Sphere args={[0.5, 32, 32]} position={[1.2, 1.5, 0.8]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Sphere>
      
      {/* Chloroplasts */}
      {[...Array(6)].map((_, i) => (
        <Sphere key={i} args={[0.3, 16, 16]} position={[
          Math.sin(i * 1.1) * 1.5,
          Math.cos(i * 1.1) * 1.5,
          Math.sin(i * 2.2) * 1.5
        ]}>
          <meshStandardMaterial color="#4ade80" />
        </Sphere>
      ))}
      
      <Html position={[0, 0, 0]}>
        <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-green-200 text-[8px] font-bold uppercase">Central Vacuole</div>
      </Html>
    </group>
  );
}

// --- Digestive System Model ---
export function DigestiveModel() {
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      points.push(new THREE.Vector3(Math.sin(i * 0.5) * 1, -i * 0.3 + 3, Math.cos(i * 0.5) * 0.5));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group>
      {/* Esophagus */}
      <Cylinder args={[0.2, 0.2, 3]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#fca5a5" />
      </Cylinder>
      
      {/* Stomach */}
      <Sphere args={[1, 32, 32]} position={[0.5, 0.5, 0]} scale={[1.2, 0.8, 1]}>
        <meshStandardMaterial color="#f87171" />
      </Sphere>
      
      {/* Intestines (Simplified) */}
      <Tube args={[curve, 64, 0.3, 8, false]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Tube>
      
      <Html position={[1.8, 0.5, 0]}>
        <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-orange-200 text-[8px] font-bold uppercase">Stomach</div>
      </Html>
    </group>
  );
}

// --- Neuron Model ---
export function NeuronModel() {
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Soma (Cell Body) */}
      <Sphere args={[1, 32, 32]} scale={[1.2, 1, 1]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.3} />
      </Sphere>
      
      {/* Dendrites */}
      {[...Array(8)].map((_, i) => (
        <Cylinder key={i} args={[0.05, 0.1, 1.5]} position={[
          Math.sin(i * 0.8) * 1,
          Math.cos(i * 0.8) * 1,
          0
        ]} rotation={[0, 0, i * 0.8]}>
          <meshStandardMaterial color="#60a5fa" />
        </Cylinder>
      ))}
      
      {/* Axon */}
      <Cylinder args={[0.15, 0.15, 6]} position={[0, -3.5, 0]}>
        <meshStandardMaterial color="#3b82f6" />
      </Cylinder>
      
      {/* Myelin Sheath */}
      {[...Array(4)].map((_, i) => (
        <Cylinder key={i} args={[0.25, 0.25, 0.8]} position={[0, -1.5 - i * 1.2, 0]}>
          <meshStandardMaterial color="#93c5fd" />
        </Cylinder>
      ))}
      
      <Html position={[0, 0, 0]}>
        <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-blue-200 text-[8px] font-bold uppercase">Soma</div>
      </Html>
      <Html position={[0, -4, 0]}>
        <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-blue-200 text-[8px] font-bold uppercase">Axon</div>
      </Html>
    </group>
  );
}

// --- Flower Model ---
export function FlowerModel() {
  return (
    <group>
      {/* Stem */}
      <Cylinder args={[0.1, 0.1, 4]} position={[0, -2, 0]}>
        <meshStandardMaterial color="#166534" />
      </Cylinder>
      
      {/* Receptacle */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#15803d" />
      </Sphere>
      
      {/* Petals */}
      {[...Array(8)].map((_, i) => (
        <Sphere key={i} args={[0.8, 32, 32]} position={[
          Math.sin(i * 0.8) * 1.2,
          Math.cos(i * 0.8) * 1.2,
          0.2
        ]} scale={[1, 0.5, 0.1]} rotation={[0, 0, i * 0.8]}>
          <meshStandardMaterial color="#ec4899" />
        </Sphere>
      ))}
      
      {/* Stamen */}
      {[...Array(6)].map((_, i) => (
        <group key={i} rotation={[0, 0, i * 1.05]}>
          <Cylinder args={[0.02, 0.02, 1.5]} position={[0, 0.7, 0.5]}>
            <meshStandardMaterial color="#fde047" />
          </Cylinder>
          <Sphere args={[0.1, 16, 16]} position={[0, 1.4, 0.5]}>
            <meshStandardMaterial color="#eab308" />
          </Sphere>
        </group>
      ))}
      
      {/* Pistil */}
      <Cylinder args={[0.1, 0.2, 2]} position={[0, 1, 0.5]}>
        <meshStandardMaterial color="#22c55e" />
      </Cylinder>
      <Sphere args={[0.2, 16, 16]} position={[0, 2, 0.5]}>
        <meshStandardMaterial color="#15803d" />
      </Sphere>
      
      <Html position={[0, 2.5, 0.5]}>
        <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-pink-200 text-[8px] font-bold uppercase">Stigma</div>
      </Html>
    </group>
  );
}
