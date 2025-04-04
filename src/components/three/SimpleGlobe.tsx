import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function DebugSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial color="#3f5b91" wireframe />
    </mesh>
  );
}

export const SimpleGlobe = ({ className = "" }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Only render Three.js content on the client
  if (typeof window === 'undefined') {
    return (
      <div className={`${className} border border-red-500 flex items-center justify-center`} style={{ background: '#070e1c' }}>
        <div className="text-white text-opacity-80">Loading debug globe...</div>
      </div>
    );
  }
  
  return (
    <div className={`${className} border border-red-500`} style={{ background: '#070e1c' }}>
      {mounted ? (
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <DebugSphere />
          <OrbitControls />
          <axesHelper args={[5]} />
          <gridHelper args={[10, 10]} />
        </Canvas>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-white text-opacity-80">Loading debug globe...</div>
        </div>
      )}
    </div>
  );
};

export default SimpleGlobe; 