'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

// Simple box component
function Box(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    // Initial rotation
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.PI / 5;
    }
  }, []);
  
  // Animation frame update
  useEffect(() => {
    let frameId: number;
    
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
      }
      frameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);
  
  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#ff3e00" />
    </mesh>
  );
}

// Main component
export default function ThreeContent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) {
    return (
      <div className="bg-black w-full h-[400px] flex items-center justify-center">
        <p className="text-white">Initializing 3D scene...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[400px] bg-black">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
} 