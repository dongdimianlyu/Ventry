import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '@react-three/fiber';

function DebugSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#3f5b91" wireframe />
      </mesh>
    </group>
  );
}

export const SimpleGlobe = ({ className = "" }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ background: '#070e1c', height: '100%', maxHeight: '60vh' }}>
        <div className="text-white text-opacity-80">Loading globe...</div>
      </div>
    );
  }
  
  return (
    <div className={`${className}`} style={{ background: '#070e1c', height: '100%', maxHeight: '60vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DebugSphere />
      </Canvas>
    </div>
  );
};

export default SimpleGlobe; 