import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

// Floating question mark component
const QuestionMark = ({ 
  position = [0, 0, 0], 
  color = "#3f5b91",
  size = 1,
  rotation = 0
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const initialPos = useRef(position);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Gentle floating motion
    groupRef.current.position.y = initialPos.current[1] + Math.sin(t * 0.5 + rotation) * 0.3;
    
    // Subtle rotation
    groupRef.current.rotation.z = Math.sin(t * 0.3 + rotation) * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.4 + rotation) * 0.1;
  });
  
  return (
    <group ref={groupRef} position={position as [number, number, number]} rotation={[0, rotation, 0]}>
      <Text
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        ?
      </Text>
      
      {/* Add glow effect */}
      <mesh>
        <sphereGeometry args={[size * 0.5, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

// Circular path of dots
const CircularDots = ({ 
  radius = 5, 
  count = 20, 
  color = "#3f5b91"
}) => {
  const dotsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!dotsRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Rotate the whole circle slowly
    dotsRef.current.rotation.y = t * 0.1;
  });
  
  return (
    <group ref={dotsRef}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Calculate varying sizes and colors for visual interest
        const dotSize = 0.05 + (i % 3) * 0.02;
        const dotColor = i % 3 === 0 ? "#3e86f5" : (i % 3 === 1 ? "#4edbca" : "#5d50c6");
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[dotSize, 8, 8]} />
            <meshBasicMaterial 
              color={dotColor} 
              transparent
              opacity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Main scene component
const FAQScene = () => {
  const sceneRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!sceneRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Very subtle overall rotation
    sceneRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
  });
  
  // Create several question marks at different positions
  const questionMarks = [
    { position: [0, 0, 0], color: "#3e86f5", size: 2, rotation: 0 },
    { position: [-3, 1, -2], color: "#4edbca", size: 1.5, rotation: 1 },
    { position: [4, -1, -1], color: "#5d50c6", size: 1.2, rotation: 2 },
    { position: [-2, -2, -3], color: "#3e86f5", size: 1, rotation: 3 },
    { position: [3, 2, -4], color: "#4edbca", size: 0.8, rotation: 4 }
  ];
  
  return (
    <group ref={sceneRef}>
      <CircularDots />
      
      {questionMarks.map((qm, i) => (
        <QuestionMark 
          key={i}
          position={qm.position}
          color={qm.color}
          size={qm.size}
          rotation={qm.rotation}
        />
      ))}
    </group>
  );
};

// Main component
export const FAQVisual = ({ 
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className={`${className} absolute inset-0`}>
      {mounted && (
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
          <FAQScene />
          <AdaptiveDpr pixelated />
        </Canvas>
      )}
    </div>
  );
};

export default FAQVisual; 