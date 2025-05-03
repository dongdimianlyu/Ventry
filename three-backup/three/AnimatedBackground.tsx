import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Grid pattern with glowing lines
const GridPattern = ({ 
  size = 20, 
  divisions = 20,
  color = "#3f5b91",
  intensity = 0.3
}) => {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!gridRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Animate grid rotation very slowly
    gridRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.05) * 0.1;
    gridRef.current.rotation.z = Math.sin(t * 0.03) * 0.05;
  });
  
  return (
    <group ref={gridRef} position={[0, -5, 0]}>
      {/* Horizontal lines */}
      {Array.from({ length: divisions + 1 }).map((_, i) => {
        const pos = (i / divisions) * size - size / 2;
        return (
          <mesh key={`h-${i}`} position={[0, 0, pos]}>
            <boxGeometry args={[size, 0.02, 0.02]} />
            <meshBasicMaterial 
              color={color} 
              transparent
              opacity={i === Math.floor(divisions / 2) ? intensity : intensity * 0.6}
            />
          </mesh>
        );
      })}
      
      {/* Vertical lines */}
      {Array.from({ length: divisions + 1 }).map((_, i) => {
        const pos = (i / divisions) * size - size / 2;
        return (
          <mesh key={`v-${i}`} position={[pos, 0, 0]}>
            <boxGeometry args={[0.02, 0.02, size]} />
            <meshBasicMaterial 
              color={color} 
              transparent
              opacity={i === Math.floor(divisions / 2) ? intensity : intensity * 0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Floating orbs
const FloatingOrbs = ({ count = 15, color = "#3f5b91" }) => {
  const orbsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!orbsRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Animate each orb's position and scale
    orbsRef.current.children.forEach((orb, i) => {
      const offset = i * 100;
      orb.position.y = Math.sin((t + offset) * 0.2) * 1.5;
      orb.position.x = Math.cos((t + offset) * 0.15) * 1.5;
      orb.position.z = Math.sin((t + offset) * 0.1) * 1.5;
      
      // Pulse scale
      orb.scale.setScalar(0.5 + Math.sin((t + i) * 0.3) * 0.1);
    });
  });
  
  return (
    <group ref={orbsRef}>
      {Array.from({ length: count }).map((_, i) => {
        // Create unique but deterministic positions
        const x = Math.cos(i / count * Math.PI * 2) * 8;
        const z = Math.sin(i / count * Math.PI * 2) * 8;
        const y = (i % 3 - 1) * 3;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial 
              color={color} 
              transparent
              opacity={0.15}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Main scene component
const AnimatedBg = () => {
  const sceneRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Very subtle rotation of the entire scene
    sceneRef.current.rotation.y = t * 0.03;
  });
  
  return (
    <group ref={sceneRef}>
      <GridPattern />
      <FloatingOrbs />
    </group>
  );
};

// Component wrapped in Canvas
export const AnimatedBackground = ({ 
  className = "",
  gridColor = "#3f5b91",
  orbColor = "#3f5b91",
}) => {
  return (
    <div className={`relative max-h-screen ${className}`}>
      <Canvas 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "low-power"
        }}
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent', height: '100%', maxHeight: '100vh' }}
      >
        <AnimatedBg />
      </Canvas>
    </div>
  );
};

export default AnimatedBackground; 