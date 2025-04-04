import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

// Gradient orbs that represent pricing tiers
const GradientOrbs = ({ count = 3 }) => {
  const orbsRef = useRef<THREE.Group>(null);
  
  // Define colors for different pricing tiers
  const colors = [
    new THREE.Color("#3e86f5"),
    new THREE.Color("#4edbca"),
    new THREE.Color("#5d50c6")
  ];
  
  useFrame(({ clock }) => {
    if (!orbsRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Animate each orb
    orbsRef.current.children.forEach((orb, i) => {
      const offset = i * 2;
      const speed = 0.2 + (i * 0.1);
      
      // Gentle floating motion
      const posY = Math.sin((t + offset) * speed) * 0.2;
      orb.position.y = posY;
      
      // Add subtle rotation
      orb.rotation.y = t * 0.1 * (i + 1);
      
      // Pulse scaling for dynamic feel
      const scale = 1 + Math.sin((t + i) * 0.3) * 0.05;
      orb.scale.set(scale, scale, scale);
    });
  });
  
  return (
    <group ref={orbsRef}>
      {Array.from({ length: count }).map((_, i) => {
        // Position orbs in line with spacing
        const x = (i - Math.floor(count / 2)) * 4;
        
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Inner glow */}
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial 
                color={colors[i % colors.length]} 
                transparent
                opacity={0.3}
              />
            </mesh>
            
            {/* Outer glow */}
            <mesh>
              <sphereGeometry args={[1.2, 32, 32]} />
              <meshBasicMaterial 
                color={colors[i % colors.length]} 
                transparent
                opacity={0.1}
                side={THREE.BackSide}
              />
            </mesh>
            
            {/* Halo ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.5, 0.05, 16, 100]} />
              <meshBasicMaterial 
                color={colors[i % colors.length]} 
                transparent
                opacity={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Light beams in background
const LightBeams = ({ count = 10 }) => {
  const beamsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!beamsRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Animate beams
    beamsRef.current.children.forEach((beam, i) => {
      const offset = i * 0.5;
      const speed = 0.05 + (i % 3) * 0.02;
      
      // Move beams across scene
      beam.position.x = ((t * speed + offset) % 20) - 10;
      
      // Fade in and out
      if (beam instanceof THREE.Mesh && beam.material instanceof THREE.MeshBasicMaterial) {
        const distance = Math.abs(beam.position.x);
        const fade = Math.max(0, 1 - distance / 10);
        beam.material.opacity = fade * 0.2;
      }
    });
  });
  
  return (
    <group ref={beamsRef}>
      {Array.from({ length: count }).map((_, i) => {
        // Create beams at different heights and angles
        const y = (i / count) * 15 - 7.5;
        const angle = (i % 3 - 1) * 0.2;
        
        return (
          <mesh 
            key={i} 
            position={[0, y, -10]} 
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[20, 0.1 + (i % 3) * 0.1]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#3e86f5" : "#4edbca"} 
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Background gradient that pulses
const BackgroundGradient = () => {
  const gradientRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!gradientRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Pulse the background subtly
    const material = gradientRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.1 + Math.sin(t * 0.2) * 0.05;
  });
  
  return (
    <mesh ref={gradientRef} position={[0, 0, -15]}>
      <planeGeometry args={[30, 20]} />
      <meshBasicMaterial 
        color="#3e86f5" 
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Main scene
const PricingScene = () => {
  const sceneRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Very gentle scene rotation
    sceneRef.current.rotation.z = Math.sin(t * 0.1) * 0.03;
  });
  
  return (
    <group ref={sceneRef}>
      <BackgroundGradient />
      <LightBeams />
      <GradientOrbs />
    </group>
  );
};

// Main component
export const PricingGradient = ({ 
  className = "",
}) => {
  return (
    <div className={`${className} absolute inset-0`}>
      <Canvas 
        dpr={[1, 2]} 
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "low-power"
        }}
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <PricingScene />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default PricingGradient; 