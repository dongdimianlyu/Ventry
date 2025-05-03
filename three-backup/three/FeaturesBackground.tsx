import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Animated scene with spheres, rings and grid
function FeaturesScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;
  });
  
  return (
    <group ref={groupRef}>
      {/* Create animated glowing spheres */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 8 + Math.cos(i * 5) * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 3) * 3;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.5 + Math.sin(i) * 0.5, 16, 16]} />
            <meshBasicMaterial color={new THREE.Color(0.1, 0.4, 0.8).multiplyScalar(0.1)} transparent opacity={0.6} />
          </mesh>
        );
      })}
      
      {/* Create a few rings around the scene */}
      {[10, 14, 18].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2 + i * 0.2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.1, 64]} />
          <meshBasicMaterial color={new THREE.Color(0.2, 0.4, 0.8).multiplyScalar(0.08)} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// Component wrapped in Canvas
export default function FeaturesBackground({ className = "" }) {
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
          <FeaturesScene />
        </Canvas>
      )}
    </div>
  );
} 