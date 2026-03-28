
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ElectronProps {
  radius: number;
  speed: number;
  offset: number;
  color: string;
  isHighlighted: boolean;
  isSubshellHighlighted: boolean;
  onClick: () => void;
}

const Electron = ({ radius, speed, offset, color, isHighlighted, isSubshellHighlighted, onClick }: ElectronProps) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * (radius * 0.2);
  });

  const displayColor = hovered || isHighlighted ? '#ffffff' : isSubshellHighlighted ? '#00e5ff' : color;
  const glowIntensity = isHighlighted ? 1.5 : isSubshellHighlighted ? 1.2 : 1;

  return (
    <group 
      ref={ref} 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <Trail
        width={(isHighlighted || hovered || isSubshellHighlighted) ? 2 : 1}
        length={(isHighlighted || hovered || isSubshellHighlighted) ? 12 : 4}
        color={new THREE.Color(displayColor)}
        attenuation={(t) => t * t}
      >
        <Sphere args={[(isHighlighted || hovered) ? 0.18 : isSubshellHighlighted ? 0.14 : 0.08, 16, 16]}>
          <meshBasicMaterial 
            color={displayColor} 
            toneMapped={false} 
          />
        </Sphere>
      </Trail>
      
      {/* Glow effect for highlighted electrons */}
      {(isHighlighted || isSubshellHighlighted) && (
        <Sphere args={[0.3, 16, 16]}>
          <meshBasicMaterial 
            color={displayColor} 
            transparent 
            opacity={0.2 * glowIntensity} 
            toneMapped={false}
          />
        </Sphere>
      )}

      {/* Invisible larger hit area for easier clicking */}
      <Sphere args={[0.4, 8, 8]}>
        <meshBasicMaterial transparent opacity={0} />
      </Sphere>
    </group>
  );
};

interface ShellProps {
  radius: number;
  electronCount: number;
  color: string;
  isHighlighted: boolean;
  selectedElectronIndex: number | null;
  subshellIndices: number[];
  onSelect: () => void;
  onElectronClick: (electronIndex: number) => void;
}

const Shell = ({ radius, electronCount, color, isHighlighted, selectedElectronIndex, subshellIndices, onSelect, onElectronClick }: ShellProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial 
          color={isHighlighted ? '#ffffff' : color} 
          transparent 
          opacity={isHighlighted ? 0.8 : hovered ? 0.4 : 0.15} 
          side={THREE.DoubleSide} 
        />
      </mesh>
      
      {/* Interaction hit area */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.3, radius + 0.3, 64]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Electrons */}
      {Array.from({ length: electronCount }).map((_, i) => (
        <Electron 
          key={i} 
          radius={radius} 
          speed={0.5 + (1 / radius)} 
          offset={(i * Math.PI * 2) / electronCount}
          color={color}
          isHighlighted={selectedElectronIndex === i}
          isSubshellHighlighted={subshellIndices.includes(i)}
          onClick={() => onElectronClick(i)}
        />
      ))}
    </group>
  );
};

interface BohrModelProps {
  shells: number[];
  elementColor: string;
  activeShellIndex: number | null;
  selectedElectron: { shell: number, index: number } | null;
  subshellIndices: number[];
  onShellSelect: (index: number | null) => void;
  onElectronSelect: (shellIndex: number, electronIndex: number) => void;
}

export const BohrModel = ({ shells, elementColor, activeShellIndex, selectedElectron, subshellIndices, onShellSelect, onElectronSelect }: BohrModelProps) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group onPointerMissed={() => {
        onShellSelect(null);
      }}>
        {/* Nucleus */}
        <Sphere args={[0.4, 32, 32]}>
          <meshStandardMaterial 
            color={elementColor} 
            emissive={elementColor} 
            emissiveIntensity={1} 
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Electron Shells */}
        {shells.map((count, i) => (
          <Shell 
            key={i} 
            radius={(i + 1) * 1.2 + 0.5} 
            electronCount={count} 
            color={elementColor}
            isHighlighted={activeShellIndex === i || selectedElectron?.shell === i}
            selectedElectronIndex={selectedElectron?.shell === i ? selectedElectron.index : null}
            subshellIndices={selectedElectron?.shell === i ? subshellIndices : []}
            onSelect={() => onShellSelect(i)}
            onElectronClick={(electronIndex) => onElectronSelect(i, electronIndex)}
          />
        ))}
      </group>
    </Float>
  );
};
