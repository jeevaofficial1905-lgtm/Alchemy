
import { useRef, useState, useMemo } from 'react';
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
  isPaused: boolean;
  onTogglePause: () => void;
  onClick: () => void;
}

const Electron = ({ radius, speed, offset, color, isHighlighted, isSubshellHighlighted, isPaused, onTogglePause, onClick }: ElectronProps) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current || isPaused) return;
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
      onDoubleClick={(e) => {
        e.stopPropagation();
        onTogglePause();
      }}
    >
      <Trail
        width={(isHighlighted || hovered || isSubshellHighlighted) ? 2 : 1}
        length={(isHighlighted || hovered || isSubshellHighlighted) ? 12 : 4}
        color={new THREE.Color(displayColor)}
        attenuation={(t) => t * t}
      >
        <Sphere args={[(isHighlighted || hovered) ? 0.2 : isSubshellHighlighted ? 0.16 : 0.12, 16, 16]}>
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
  showShells: boolean;
  showElectrons: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onSelect: () => void;
  onElectronClick: (electronIndex: number) => void;
}

const Shell = ({ radius, electronCount, color, isHighlighted, selectedElectronIndex, subshellIndices, showShells, showElectrons, isPaused, onTogglePause, onSelect, onElectronClick }: ShellProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onTogglePause();
      }}
    >
      {/* Orbit ring */}
      {showShells && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
          <meshBasicMaterial 
            color={isHighlighted ? '#ffffff' : color} 
            transparent 
            opacity={isHighlighted ? 0.8 : hovered ? 0.4 : 0.25} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}
      
      {/* Interaction hit area */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.3, radius + 0.3, 64]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Electrons */}
      {showElectrons && Array.from({ length: electronCount }).map((_, i) => (
        <Electron 
          key={i} 
          radius={radius} 
          speed={0.5 + (1 / radius)} 
          offset={(i * Math.PI * 2) / electronCount}
          color={color}
          isHighlighted={selectedElectronIndex === i}
          isSubshellHighlighted={subshellIndices.includes(i)}
          isPaused={isPaused}
          onTogglePause={onTogglePause}
          onClick={() => onElectronClick(i)}
        />
      ))}
    </group>
  );
};

interface NucleusProps {
  protons: number;
  neutrons: number;
  elementColor: string;
}

const Nucleus = ({ protons, neutrons, elementColor }: NucleusProps) => {
  const totalParticles = protons + neutrons;
  // Limit the number of visible particles for performance, but show enough to feel "structured"
  const maxVisible = Math.min(totalParticles, 50); 
  const scale = 0.4;
  
  const particles = useMemo(() => {
    const result = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < maxVisible; i++) {
      // Fibonacci sphere distribution
      const y = maxVisible > 1 ? 1 - (i / (maxVisible - 1)) * 2 : 0;
      const radius = Math.sqrt(1 - y * y);
      const theta = (2 * Math.PI * i) / goldenRatio;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      // Randomly assign as proton or neutron based on ratio
      const isProton = Math.random() < (protons / totalParticles);
      
      result.push({
        position: [x * scale, y * scale, z * scale] as [number, number, number],
        isProton,
        id: i
      });
    }
    return result;
  }, [maxVisible, protons, totalParticles]);

  return (
    <group>
      {particles.map((p) => (
        <Sphere key={p.id} position={p.position} args={[0.18, 16, 16]}>
          <meshStandardMaterial 
            color={p.isProton ? "#ff3333" : "#3333ff"} 
            emissive={p.isProton ? "#ff0000" : "#0000ff"}
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.8}
          />
        </Sphere>
      ))}
      {/* Core glow */}
      <Sphere args={[scale * 1.2, 32, 32]}>
        <meshStandardMaterial 
          color={elementColor} 
          transparent 
          opacity={0.2} 
          emissive={elementColor}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </group>
  );
};

interface BohrModelProps {
  protons: number;
  neutrons: number;
  shells: number[];
  elementColor: string;
  activeShellIndex: number | null;
  selectedElectron: { shell: number, index: number } | null;
  subshellIndices: number[];
  showShells: boolean;
  showElectrons: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onShellSelect: (index: number | null) => void;
  onElectronSelect: (shellIndex: number, electronIndex: number) => void;
}

export const BohrModel = ({ protons, neutrons, shells, elementColor, activeShellIndex, selectedElectron, subshellIndices, showShells, showElectrons, isPaused, onTogglePause, onShellSelect, onElectronSelect }: BohrModelProps) => {
  return (
    <Float speed={isPaused ? 0 : 2} rotationIntensity={isPaused ? 0 : 0.5} floatIntensity={isPaused ? 0 : 0.5}>
      <group 
        onPointerMissed={() => {
          onShellSelect(null);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onTogglePause();
        }}
      >
        {/* Nucleus */}
        <Nucleus protons={protons} neutrons={neutrons} elementColor={elementColor} />
        
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
            showShells={showShells}
            showElectrons={showElectrons}
            isPaused={isPaused}
            onTogglePause={onTogglePause}
            onSelect={() => onShellSelect(i)}
            onElectronClick={(electronIndex) => onElectronSelect(i, electronIndex)}
          />
        ))}
      </group>
    </Float>
  );
};
