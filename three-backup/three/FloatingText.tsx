import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Text3D, 
  Center, 
  PerspectiveCamera, 
  AdaptiveDpr, 
  Float, 
  useTexture,
  Text as DreiText
} from '@react-three/drei';
import * as THREE from 'three';

// Backdrop for the text with layered plane effects
const TextBackdrop = ({ width = 10, height = 5 }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Subtle floating animation for the backdrop layers
    groupRef.current.children.forEach((child, i) => {
      child.position.z = -0.1 - (i * 0.05);
      child.position.y = Math.sin(t * 0.2 + i * 0.5) * 0.05;
      child.position.x = Math.cos(t * 0.3 + i * 0.2) * 0.05;
    });
  });
  
  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 0, -0.1 - (i * 0.05)]}>
          <planeGeometry args={[width + (i * 0.2), height + (i * 0.1)]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? "#0d1523" : "#132442"} 
            transparent 
            opacity={0.8 - (i * 0.15)}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating particles around the text
const TextParticles = ({ count = 50, range = 5 }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [sizes, setSizes] = useState<Float32Array | null>(null);
  
  useEffect(() => {
    const tempPositions = new Float32Array(count * 3);
    const tempSizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Position particles in a volume around the text
      tempPositions[i3] = (Math.random() - 0.5) * range;
      tempPositions[i3 + 1] = (Math.random() - 0.5) * (range / 2);
      tempPositions[i3 + 2] = (Math.random() - 0.5) * (range / 4);
      
      // Vary particle sizes
      tempSizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    setPositions(tempPositions);
    setSizes(tempSizes);
  }, [count, range]);
  
  useFrame(({ clock }) => {
    if (!particlesRef.current || !positions) return;
    
    const t = clock.getElapsedTime();
    const positionArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
    
    // Animate each particle on a unique path
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Add subtle movement to each particle
      positionArray[i3 + 1] += Math.sin(t + i) * 0.002;
      
      // Boundary check - reset particles when they move too far
      if (positionArray[i3 + 1] > range / 3) {
        positionArray[i3 + 1] = -range / 3;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  if (!positions || !sizes) return null;
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          array={positions} 
          count={positions.length / 3} 
          itemSize={3} 
          args={[positions, 3]}
        />
        <bufferAttribute 
          attach="attributes-size" 
          array={sizes} 
          count={sizes.length} 
          itemSize={1} 
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#b4bed2" 
        transparent
        opacity={0.6}
        size={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main text component with glow effect
const FloatingText = ({ 
  text = "Ventry", 
  textColor = "#d1d5db",
  glowColor = "#3f5b91",
  scale = 1
}) => {
  const textRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!textRef.current || !glowRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Subtle floating motion
    textRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    textRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    
    // Glow effect
    glowRef.current.position.copy(textRef.current.position);
    glowRef.current.rotation.copy(textRef.current.rotation);
    
    // Type check and apply opacity
    if (glowRef.current.material instanceof THREE.Material) {
      glowRef.current.material.opacity = 0.6 + Math.sin(t) * 0.2;
    } else if (Array.isArray(glowRef.current.material)) {
      glowRef.current.material.forEach(mat => {
        if (mat instanceof THREE.Material) {
          mat.opacity = 0.6 + Math.sin(t) * 0.2;
        }
      });
    }
  });
  
  return (
    <group scale={scale}>
      <TextBackdrop width={text.length * 0.8 + 2} height={3} />
      
      {/* Main text */}
      <Center>
        <Float
          speed={1.5}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <mesh ref={textRef}>
            <DreiText
              fontSize={1}
              color={textColor}
              anchorX="center"
              anchorY="middle"
            >
              {text}
            </DreiText>
          </mesh>
          
          {/* Glow effect */}
          <mesh ref={glowRef} scale={1.05}>
            <DreiText
              fontSize={1}
              color={glowColor}
              anchorX="center"
              anchorY="middle"
            >
              {text}
            </DreiText>
          </mesh>
        </Float>
      </Center>
      
      <TextParticles count={100} range={10} />
    </group>
  );
};

// Export the component wrapped in a Canvas
export const FloatingTextScene = ({ 
  className = "",
  text = "Ventry", 
  textColor = "#d1d5db",
  glowColor = "#3f5b91" 
}) => {
  return (
    <div className={`${className}`}>
      <Canvas 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.5} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        <FloatingText 
          text={text} 
          textColor={textColor} 
          glowColor={glowColor} 
        />
        
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default FloatingTextScene; 