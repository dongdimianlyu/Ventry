import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Vertex shader for the iridescent effect
const IRIDESCENT_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader for the iridescent effect
const IRIDESCENT_FRAGMENT_SHADER = `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform vec3 colorC;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    // Normalized view direction
    vec3 viewDir = normalize(vViewPosition);
    
    // Fresnel effect - more intense at glancing angles
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
    
    // Create shifting color based on time, normal and view angle
    float t1 = abs(sin(time * 0.2 + vUv.x * 3.0));
    float t2 = abs(sin(time * 0.3 + vUv.y * 3.0));
    
    // Combine colors with fresnel and time effects
    vec3 finalColor = mix(
      mix(colorA, colorB, t1), 
      colorC, 
      t2 * fresnel
    );
    
    // Add subtle waves
    float wave = sin(vUv.x * 10.0 + time * 0.5) * sin(vUv.y * 10.0 + time * 0.3) * 0.1;
    finalColor += wave * colorB;
    
    gl_FragColor = vec4(finalColor, 0.9);
  }
`;

// Dynamic wave surface that uses custom shaders
const IridescentSurface = ({
  colorA = new THREE.Color('#4a70d5'),
  colorB = new THREE.Color('#ae49dd'),
  colorC = new THREE.Color('#02d5ef'),
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  // Create material with custom shaders
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorA: { value: colorA },
        colorB: { value: colorB },
        colorC: { value: colorC }
      },
      vertexShader: IRIDESCENT_VERTEX_SHADER,
      fragmentShader: IRIDESCENT_FRAGMENT_SHADER,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, [colorA, colorB, colorC]);

  // Animate the shader parameters
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    material.uniforms.time.value = clock.getElapsedTime();
    
    // Subtle floating movement
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    mesh.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[40, 40, 64, 64]} />
      {/* @ts-ignore - using custom shader material with uniforms */}
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// Floating particles to enhance the visual effect
const FloatingParticles = ({ count = 200, color = "#ffffff" }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 10;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.05;
    pointsRef.current.rotation.z = t * 0.03;
    
    // Create a gentle wave effect
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const ix = i / 3;
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin((t + x + y) * 0.2) * 2;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Main scene with camera controls
const IridescentScene = ({ 
  colorA = '#4a70d5',
  colorB = '#ae49dd',
  colorC = '#02d5ef'
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(({ clock }) => {
    if (!cameraRef.current) return;
    
    const t = clock.getElapsedTime();
    // Subtle camera movement
    cameraRef.current.position.y = Math.sin(t * 0.2) * 0.5;
    cameraRef.current.position.x = Math.sin(t * 0.1) * 0.5;
    cameraRef.current.lookAt(0, 0, 0);
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 0, 15]}
        fov={60}
      />
      <IridescentSurface 
        colorA={new THREE.Color(colorA)}
        colorB={new THREE.Color(colorB)}
        colorC={new THREE.Color(colorC)}
      />
      <FloatingParticles count={200} color="#ffffff" />
      <ambientLight intensity={0.3} />
    </>
  );
};

// Exportable component wrapped in Canvas
export const IridescentBackground = ({
  className = "",
  colorA = '#4a70d5',
  colorB = '#ae49dd',
  colorC = '#02d5ef'
}) => {
  return (
    <div className={`${className} w-full h-full`}>
      <Canvas
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "default"
        }}
        style={{ background: 'transparent' }}
      >
        <IridescentScene 
          colorA={colorA}
          colorB={colorB}
          colorC={colorC}
        />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default IridescentBackground; 