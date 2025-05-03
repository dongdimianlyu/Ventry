'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple rotating box component
function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export default function BasicBox({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) {
    return (
      <div className={`${className} bg-gray-900 flex items-center justify-center`} style={{ height: '100%', minHeight: '300px' }}>
        <div className="text-white">Loading 3D scene...</div>
      </div>
    );
  }
  
  return (
    <div className={`${className} bg-gray-900`} style={{ height: '100%', minHeight: '300px' }}>
      <Canvas dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <RotatingBox />
      </Canvas>
    </div>
  );
} 