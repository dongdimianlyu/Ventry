import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  AdaptiveDpr, 
  AdaptiveEvents, 
  PerspectiveCamera, 
  Environment, 
  useTexture, 
  Text3D,
  OrbitControls
} from '@react-three/drei';
import * as THREE from 'three';

// Particles that orbit around the sphere
const Particles = ({ count = 200, color = "#88b2d9" }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [dummy] = useState(() => new THREE.Object3D());
  const particlePositions = useRef<Array<{
    position: THREE.Vector3;
    speed: number;
    offset: number;
    scale: number;
  }>>([]);

  useEffect(() => {
    if (!mesh.current) return;

    // Initialize particles
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const distance = 2 + Math.random() * 3;

      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta);
      const z = distance * Math.cos(phi);

      particlePositions.current.push({
        position: new THREE.Vector3(x, y, z),
        speed: 0.002 + Math.random() * 0.01,
        offset: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.08
      });

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(particlePositions.current[i].scale);
      dummy.updateMatrix();
      
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    const elapsedTime = clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const particle = particlePositions.current[i];
      const { position, speed, offset } = particle;
      
      // Calculate new position along orbital path
      const angle = elapsedTime * speed + offset;
      
      const x = position.x * Math.cos(angle) - position.z * Math.sin(angle);
      const z = position.x * Math.sin(angle) + position.z * Math.cos(angle);
      
      dummy.position.set(x, position.y, z);
      dummy.scale.setScalar(particle.scale * (1 + 0.2 * Math.sin(elapsedTime + offset)));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial 
        color={color} 
        transparent
        opacity={0.8}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

// Main sphere with glow effect
const GlowingSphere = ({ color = "#0d1523", glowColor = "#3f5b91" }) => {
  const group = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!group.current || !sphereRef.current || !glowRef.current) return;
    
    const t = clock.getElapsedTime() * 0.2;
    
    // Gentle pulsing animation
    sphereRef.current.scale.set(
      1 + 0.04 * Math.sin(t * 1.5), 
      1 + 0.04 * Math.sin(t * 1.5), 
      1 + 0.04 * Math.sin(t * 1.5)
    );
    
    glowRef.current.scale.set(
      1.1 + 0.08 * Math.sin(t), 
      1.1 + 0.08 * Math.sin(t), 
      1.1 + 0.08 * Math.sin(t)
    );
    
    // Subtle rotation
    group.current.rotation.y = t * 0.15;
    group.current.rotation.z = Math.sin(t * 0.2) * 0.1;
  });

  return (
    <group ref={group}>
      {/* Main sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.7}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial 
          color={glowColor}
          transparent={true}
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Particles */}
      <Particles count={150} color={glowColor} />
      
      {/* Inner highlight */}
      <mesh position={[-0.6, 0.6, 0.8]} scale={0.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent={true}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// Camera animation
const AnimatedCamera = () => {
  const { camera } = useThree();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Gentle camera animation
    camera.position.x = Math.sin(t * 0.1) * 1.5;
    camera.position.y = Math.sin(t * 0.08) * 0.5 + 0.5;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

export const GlowingSphereScene = ({ 
  className = "", 
  sphereColor = "#0d1523", 
  glowColor = "#3f5b91" 
}) => {
  return (
    <div className={`${className}`}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, -10, 10]} angle={0.3} penumbra={1} intensity={2} />
        
        <GlowingSphere color={sphereColor} glowColor={glowColor} />
        <AnimatedCamera />
        
        <Environment preset="city" />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
};

export default GlowingSphereScene; 