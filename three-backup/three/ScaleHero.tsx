import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

// Optimized scale component with minimal geometry and animations
const Scale = ({ color = "#5d8def" }) => {
  const scaleRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);
  const isReducedMotion = useRef(false);
  const isInView = useRef(true);
  
  // Check for reduced motion preference on mount
  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Only render when in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView.current = entry.isIntersecting;
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    const canvas = document.querySelector('canvas');
    if (canvas) observer.observe(canvas);
    
    return () => {
      if (canvas) observer.unobserve(canvas);
    };
  }, []);
  
  // Drastically reduced animation frequency
  useFrame(({ clock }) => {
    if (!scaleRef.current || !isInView.current) return;
    
    // Skip many frames for better performance
    frameCount.current = (frameCount.current + 1) % 10;
    if (frameCount.current !== 0 || isReducedMotion.current) return;
    
    const t = clock.getElapsedTime() * 0.2; // Slowed down animation
    
    // Gentle oscillation with minimal updates
    scaleRef.current.rotation.y = Math.sin(t * 0.15) * 0.1;
    scaleRef.current.rotation.x = Math.cos(t * 0.1) * 0.05;
  });
  
  return (
    <group ref={scaleRef}>
      {/* Base */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[5, 0.2, 3]} /> 
        <meshBasicMaterial color={color} opacity={0.7} transparent />
      </mesh>
      
      {/* Scale stand */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 6]} /> {/* Reduced segments */}
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Horizontal bar */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 0.1, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Left side */}
      <group position={[-1.5, 0.3, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.8]} />
          <meshBasicMaterial color={color} opacity={0.8} transparent />
        </mesh>
        
        {/* Left plate chain - simplified */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 4]} /> {/* Reduced segments */}
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
      
      {/* Right side */}
      <group position={[1.5, 0.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.8]} />
          <meshBasicMaterial color={color} opacity={0.8} transparent />
        </mesh>
        
        {/* Right plate chain - simplified */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 4]} /> {/* Reduced segments */}
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
};

// Main component wrapped with optimized Canvas
export const ScaleHero = ({ 
  className = "", 
  color = "#5d8def" 
}) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only mount component when it's visible in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '200px' }
    );
    
    const element = document.getElementById('scale-hero-container');
    if (element) observer.observe(element);
    
    setMounted(true);
    
    return () => {
      if (element) observer.unobserve(element);
      setMounted(false);
    };
  }, []);
  
  if (!mounted) return <div className={`${className} bg-transparent`} />;
  if (!isVisible) return <div className={`${className} bg-transparent`} />;
  
  return (
    <div className={`${className}`}>
      <Canvas
        dpr={[0.5, 1]} // Reduced DPR for better performance
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
          depth: false,
          stencil: false,
          precision: "lowp" // Use low precision for better performance
        }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        frameloop="demand"
        performance={{ min: 0.1 }} // Allow aggressive throttling
        resize={{ scroll: false, debounce: { scroll: 50, resize: 100 } }}
      >
        <Scale color={color} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default ScaleHero; 