'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Box(props: any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>();
  
  // Subscribe this component to the render-loop
  useFrame((state, delta) => {
    // Rotate the mesh every frame
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });
  
  // Return the mesh
  return (
    <mesh
      {...props}
      ref={ref}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
}

export default function TestCube({ className = "" }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-900`} style={{ height: '100%', minHeight: '400px' }}>
        <div className="text-white">Loading 3D scene...</div>
      </div>
    );
  }
  
  return (
    <div className={`${className}`} style={{ height: '100%', minHeight: '400px' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
} 