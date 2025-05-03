'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Cube component that runs inside Canvas
function Cube() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={'#ff6700'} />
    </mesh>
  );
}

export default function MinimalCube() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Only mount component on client-side
  useEffect(() => {
    setMounted(true);
    
    // Cleanup on unmount
    return () => setMounted(false);
  }, []);
  
  // Handle errors
  const handleError = (err: any) => {
    console.error('Three.js error:', err);
    setError('Failed to load 3D content');
  };
  
  // Show loading state
  if (!mounted) {
    return (
      <div className="flex items-center justify-center bg-gray-900 w-full h-[400px]">
        <p className="text-white">Loading 3D scene...</p>
      </div>
    );
  }
  
  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-900 w-full h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  // Render Three.js content
  return (
    <div className="w-full h-[400px] bg-gray-900">
      <Canvas onError={handleError}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Cube />
      </Canvas>
    </div>
  );
} 