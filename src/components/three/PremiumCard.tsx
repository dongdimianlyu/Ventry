import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  RoundedBox, 
  Text as DreiText, 
  AdaptiveDpr,
  useTexture
} from '@react-three/drei';
import * as THREE from 'three';
import * as defaultFontData from 'three/examples/fonts/helvetiker_regular.typeface.json';

// Premium card component with animation
const PremiumCard = ({ price = 'FREE' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current || !cardRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Floating animation
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    
    // Subtle rotation
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
  });
  
  // Shine effect that moves across the card
  const ShineEffect = () => {
    const shineRef = useRef<THREE.Mesh & { material: THREE.Material }>(null);
    
    useFrame(({ clock }) => {
      if (!shineRef.current) return;
      
      const t = clock.getElapsedTime();
      
      // Move shine effect across the card
      shineRef.current.position.x = Math.sin(t * 0.2) * 1.5;
      shineRef.current.material.opacity = 0.1 + Math.sin(t * 0.5) * 0.05;
    });
    
    return (
      <mesh ref={shineRef} position={[0, 0, 0.51]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[4, 0.5]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    );
  };
  
  return (
    <group ref={groupRef}>
      <RoundedBox 
        ref={cardRef}
        args={[3, 4, 0.1]} 
        radius={0.1} 
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial 
          color="#0d1523" 
          metalness={0.6}
          roughness={0.3}
        />
      </RoundedBox>
      
      {/* Glow frame */}
      <RoundedBox 
        args={[3.1, 4.1, 0.05]} 
        radius={0.12} 
        smoothness={4}
        position={[0, 0, -0.01]}
      >
        <meshStandardMaterial 
          color="#3f5b91" 
          emissive="#3f5b91"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </RoundedBox>
      
      {/* Premium Text */}
      <DreiText
        position={[0, 1.4, 0.06]}
        fontSize={0.3}
        color="#d1d5db"
        anchorX="center"
        anchorY="middle"
      >
        PREMIUM
      </DreiText>
      
      {/* Price Text */}
      <DreiText
        position={[0, 0.7, 0.06]}
        fontSize={0.6}
        color="#ffffff"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {price}
      </DreiText>
      
      {/* Features */}
      {[
        "All Features", 
        "No Limits", 
        "Priority Support"
      ].map((feature, index) => (
        <DreiText
          key={index}
          position={[0, 0 - (index * 0.4), 0.06]}
          fontSize={0.2}
          color="#b4bed2"
          anchorX="center"
          anchorY="middle"
        >
          {feature}
        </DreiText>
      ))}
      
      {/* Decorative elements */}
      <ShineEffect />
      
      {/* Bottom decoration */}
      <mesh position={[0, -1.8, 0.05]}>
        <planeGeometry args={[2, 0.1]} />
        <meshBasicMaterial color="#3f5b91" />
      </mesh>
    </group>
  );
};

// Component wrapped in Canvas
export const PremiumCardScene = ({ className = "" }) => {
  return (
    <div className={`${className}`}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[0, 0, 5]} angle={0.3} penumbra={1} intensity={0.5} />
        
        <PremiumCard />
        
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default PremiumCardScene; 