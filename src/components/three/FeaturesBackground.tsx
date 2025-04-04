import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

// Animated particles background for features section
const Particles = ({ count = 120, color = "#3f5b91" }) => {
  const particlesRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Animate particles with different speeds and directions
    particlesRef.current.children.forEach((particle, i) => {
      const offset = i * 0.1;
      
      // Use deterministic patterns for smooth motion
      const speed = 0.2 + (i % 5) * 0.05;
      const amplitude = 1 + (i % 3) * 0.5;
      const phase = i * 0.2;
      
      particle.position.y = Math.sin((t + phase) * speed) * amplitude;
      particle.position.x = Math.cos((t + phase + offset) * speed) * amplitude;
      
      // Pulse opacity for sparkle effect
      const opacity = 0.2 + Math.sin((t + i) * 0.3) * 0.1;
      if (particle instanceof THREE.Mesh && particle.material instanceof THREE.MeshBasicMaterial) {
        particle.material.opacity = opacity;
      }
    });
  });
  
  // Create particles with deterministic positions for consistent experience
  return (
    <group ref={particlesRef}>
      {Array.from({ length: count }).map((_, i) => {
        // Create initial positions in a spherical pattern
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        
        const x = 12 * Math.sin(phi) * Math.cos(theta);
        const y = 12 * Math.sin(phi) * Math.sin(theta);
        const z = 12 * Math.cos(phi);
        
        // Vary sizes for depth effect
        const size = 0.02 + (i % 4) * 0.01;
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[size, 8, 8]} />
            <meshBasicMaterial 
              color={color} 
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Light beams that move across the background
const LightBeams = ({ count = 5, color = "#3f5b91" }) => {
  const beamsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!beamsRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Animate each beam
    beamsRef.current.children.forEach((beam, i) => {
      const offset = i * 2.5;
      const speed = 0.1 + (i % 3) * 0.05;
      
      // Move beams back and forth
      beam.position.x = Math.sin((t + offset) * speed) * 10;
      
      // Adjust opacity for fade effect
      const opacity = 0.1 + Math.abs(Math.sin((t + offset) * speed)) * 0.1;
      if (beam instanceof THREE.Mesh && beam.material instanceof THREE.MeshBasicMaterial) {
        beam.material.opacity = opacity;
      }
    });
  });
  
  return (
    <group ref={beamsRef}>
      {Array.from({ length: count }).map((_, i) => {
        // Create beams with different heights
        const y = -4 + (i * 2);
        const width = 20;
        const height = 0.2 + (i % 3) * 0.1;
        
        return (
          <mesh key={i} position={[0, y, -5]} rotation={[0, Math.PI / 4, 0]}>
            <planeGeometry args={[width, height]} />
            <meshBasicMaterial 
              color={color} 
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Scene component
const FeaturesScene = () => {
  const sceneRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    const t = clock.getElapsedTime();
    
    // Very subtle overall rotation
    sceneRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
  });
  
  return (
    <group ref={sceneRef}>
      <Particles color="#3e86f5" />
      <LightBeams color="#4edbca" />
    </group>
  );
};

// Component wrapped in Canvas
export const FeaturesBackground = ({ 
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
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <FeaturesScene />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default FeaturesBackground; 