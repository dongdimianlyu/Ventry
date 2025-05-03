import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Visual scene for FAQ section
function FAQScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Gentle rotation for the entire scene
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
  });
  
  return (
    <group ref={groupRef}>
      {/* Create a spiral of small spheres */}
      {Array.from({ length: 100 }).map((_, i) => {
        const t = i / 10;
        const radius = 5 + t * 0.2;
        const x = Math.cos(t * 2) * radius;
        const y = (i / 10) - 5;
        const z = Math.sin(t * 2) * radius;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.1 + Math.sin(i) * 0.05, 8, 8]} />
            <meshBasicMaterial 
              color={new THREE.Color(0.3 + Math.sin(i * 0.3) * 0.1, 0.5, 0.8)} 
              transparent 
              opacity={0.3} 
            />
          </mesh>
        );
      })}
      
      {/* Add some rings for visual interest */}
      {[6, 9, 12].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2 - i * 0.3, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.1, 64]} />
          <meshBasicMaterial 
            color={new THREE.Color(0.4, 0.6, 0.8)} 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Main component
export default function FAQVisual({ className = "" }) {
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
          <FAQScene />
        </Canvas>
      )}
    </div>
  );
} 