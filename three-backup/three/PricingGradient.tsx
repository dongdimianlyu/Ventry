import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create a visually appealing scene for pricing section
function PricingScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Rotate the entire scene slowly
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
  });
  
  return (
    <group ref={groupRef}>
      {/* Create animated particles in a circular pattern */}
      {Array.from({ length: 100 }).map((_, i) => {
        // Spread particles in a sphere
        const phi = Math.acos(-1 + (2 * i) / 100);
        const theta = Math.sqrt(100 * Math.PI) * phi;
        
        const radius = 8 + Math.sin(i * 3) * 2;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Give particles different sizes
        const size = 0.05 + Math.sin(i) * 0.05;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial 
              color={new THREE.Color(0.4, 0.6, 0.8)} 
              transparent 
              opacity={0.2} 
            />
          </mesh>
        );
      })}
      
      {/* Add some rings for visual interest */}
      {[6, 10, 14].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2 - i * 0.3, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.1, 64]} />
          <meshBasicMaterial 
            color={new THREE.Color(0.3, 0.6, 0.9)} 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Main component
export default function PricingGradient({ className = "" }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className={`${className} h-full max-h-screen`}>
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
          dpr={[1, 2]}
          style={{ height: '100%', maxHeight: '100vh' }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "low-power"
          }}
        >
          <PricingScene />
        </Canvas>
      )}
    </div>
  );
} 