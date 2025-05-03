import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D premium price card visual
function PremiumCardEffect() {
  const cardRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!cardRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Gentle floating motion and rotation
    cardRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    cardRef.current.rotation.y = Math.sin(t * 0.2) * 0.2;
    cardRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
  });
  
  return (
    <group ref={cardRef}>
      {/* Main card */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 6, 0.2]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Premium highlight strips */}
      <mesh position={[0, 2.5, 0.11]}>
        <boxGeometry args={[3.6, 0.3, 0.05]} />
        <meshStandardMaterial color="#4edbca" emissive="#4edbca" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh position={[0, -2.5, 0.11]}>
        <boxGeometry args={[3.6, 0.3, 0.05]} />
        <meshStandardMaterial color="#4edbca" emissive="#4edbca" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Pricing circle */}
      <mesh position={[0, 0, 0.11]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#3e86f5" emissive="#3e86f5" emissiveIntensity={0.3} />
      </mesh>
      
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[1.3, 32]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Decorative elements */}
      {Array.from({ length: 4 }).map((_, i) => {
        const y = -1.5 + i * 1;
        
        return (
          <mesh key={i} position={[0, y, 0.11]}>
            <boxGeometry args={[2, 0.1, 0.05]} />
            <meshStandardMaterial 
              color={i === 1 ? "#3e86f5" : "#333344"} 
              emissive={i === 1 ? "#3e86f5" : "#333344"}
              emissiveIntensity={i === 1 ? 0.5 : 0.2}
            />
          </mesh>
        );
      })}
      
      {/* Particle effects around the card */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 3 + Math.sin(i * 5) * 0.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.sin(i) - 0.5) * 2;
        
        return (
          <mesh key={`particle-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#3e86f5" : "#4edbca"} 
              emissive={i % 2 === 0 ? "#3e86f5" : "#4edbca"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Exported premium card component
export default function PremiumCard({ className = "" }) {
  return (
    <div className={`${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 40 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4edbca" />
        <PremiumCardEffect />
      </Canvas>
    </div>
  );
} 