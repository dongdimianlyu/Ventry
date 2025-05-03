import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  AdaptiveDpr, 
  Environment, 
  useTexture, 
  Text as DreiText,
  Cloud,
  OrbitControls,
  Stars,
  Sparkles,
  Text3D
} from '@react-three/drei';
import * as THREE from 'three';

// Gravitational particles that are attracted to the globe, spanning the entire screen
const GravitationalParticles = ({ 
  count = 5000, 
  radius = 20, 
  sphereRadius = 1.0,
  particleSize = 0.008,
  particleColor = "#ffffff",
  attractionForce = 0.002,
  repulsionRadius = 1.3,
  velocityDamping = 0.99
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<THREE.BufferAttribute | null>(null);
  const velocitiesRef = useRef<Array<[number, number, number]>>([]);
  const sizesRef = useRef<THREE.BufferAttribute | null>(null);
  
  // Initialize particles in a sphere distribution
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities: Array<[number, number, number]> = [];
    
    for (let i = 0; i < count; i++) {
      // Generate random positions in spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = radius * Math.pow(Math.random(), 1/3); // Cube root for uniform volume distribution
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Random size variation for particles
      sizes[i] = (0.5 + Math.random() * 0.5) * particleSize;
      
      // Initial velocity - slightly orbital
      const dist = Math.sqrt(x*x + y*y + z*z);
      const vMagnitude = 0.005 * Math.min(1.0, 2.0 / dist);
      
      // Create a slight orbit tendency by setting velocity perpendicular to radius
      const vx = (-y + (Math.random() - 0.5) * 0.01) * vMagnitude;
      const vy = (x + (Math.random() - 0.5) * 0.01) * vMagnitude;
      const vz = (Math.random() - 0.5) * 0.01 * vMagnitude;
      
      velocities.push([vx, vy, vz]);
    }
    
    if (pointsRef.current && pointsRef.current.geometry) {
      const geometry = pointsRef.current.geometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      positionsRef.current = geometry.attributes.position as THREE.BufferAttribute;
      sizesRef.current = geometry.attributes.size as THREE.BufferAttribute;
    }
    
    velocitiesRef.current = velocities;
  }, [count, radius, particleSize]);
  
  // Update particle positions each frame
  useFrame(({ clock }) => {
    if (!pointsRef.current || !positionsRef.current || !sizesRef.current) return;
    
    const positions = positionsRef.current.array as Float32Array;
    const sizes = sizesRef.current.array as Float32Array;
    const velocities = velocitiesRef.current;
    
    const t = clock.getElapsedTime();
    // Subtle pulsing effect
    const pulseFactor = 1.0 + 0.1 * Math.sin(t * 0.3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Current position
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];
      
      // Distance from center
      const distSq = x*x + y*y + z*z;
      const dist = Math.sqrt(distSq);
      
      // Skip updating particles that are too far away
      if (dist > radius * 1.5) continue;
      
      // Direction to center (normalized)
      const dx = -x / dist;
      const dy = -y / dist;
      const dz = -z / dist;
      
      // Current velocity
      let vx = velocities[i][0];
      let vy = velocities[i][1];
      let vz = velocities[i][2];
      
      // Apply gravitational force - stronger pull when further away
      let force;
      if (dist < repulsionRadius) {
        // Repulsion when too close
        force = -attractionForce * 2.0 * (repulsionRadius - dist) / repulsionRadius;
      } else if (dist < radius * 0.8) {
        // Normal attraction in mid-range
        force = attractionForce * pulseFactor * (dist - repulsionRadius) / (radius * 0.5);
      } else {
        // Stronger pull for distant particles
        force = attractionForce * pulseFactor * 1.5;
      }
      
      // Apply force
      vx += dx * force;
      vy += dy * force;
      vz += dz * force;
      
      // Add slight rotational force (orbit tendency)
      vx += dy * 0.001;
      vy -= dx * 0.001;
      
      // Add very subtle noise
      const noiseAmp = 0.0001;
      vx += (Math.random() - 0.5) * noiseAmp;
      vy += (Math.random() - 0.5) * noiseAmp;
      vz += (Math.random() - 0.5) * noiseAmp;
      
      // Apply velocity dampening
      vx *= velocityDamping;
      vy *= velocityDamping;
      vz *= velocityDamping;
      
      // Update velocity
      velocities[i] = [vx, vy, vz];
      
      // Update position
      positions[i3] += vx;
      positions[i3 + 1] += vy;
      positions[i3 + 2] += vz;
      
      // Update size based on distance (particles closer to center appear larger)
      const distFactor = Math.max(0.5, Math.min(1.5, 1.0 / (dist * 0.5)));
      sizes[i] = (0.5 + Math.random() * 0.5) * particleSize * distFactor;
    }
    
    positionsRef.current.needsUpdate = true;
    sizesRef.current.needsUpdate = true;
  });
  
  // Create a shader material for the particles with soft glow effect
  const particleMaterial = useMemo(() => {
    // Convert to string outside of the template literal to avoid hydration issues
    const radiusString = radius.toFixed(1);
    
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(particleColor) },
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying float vDistance;
        varying float vSize;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Calculate distance from center for color/opacity
          vDistance = length(position) / ${radiusString};
          vSize = size;
          
          // Size attenuation
          gl_PointSize = size * (30.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying float vDistance;
        varying float vSize;
        
        void main() {
          // Soft circle shape for particles
          float distToCenter = length(gl_PointCoord - 0.5) * 2.0;
          float strength = 1.0 - smoothstep(0.0, 1.0, distToCenter);
          
          // Distance-based color and opacity
          float distFactor = smoothstep(0.0, 0.8, 1.0 - vDistance);
          float opacity = strength * mix(0.1, 1.0, distFactor);
          
          // Slightly brighter for particles closer to center
          vec3 finalColor = mix(color, vec3(1.0), distFactor * 0.5);
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [particleColor, radius]);
  
  // Update time uniform in shader
  useFrame(({ clock }) => {
    particleMaterial.uniforms.time.value = clock.getElapsedTime();
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <primitive object={particleMaterial} attach="material" />
    </points>
  );
};

// Minimalist globe with wireframe look
const Globe = ({ 
  radius = 2, 
  color = "#ffffff", 
  wireframeColor = "#ffffff",
  glowColor = "#4f6bfd",
  rotationSpeed = 0.03
}) => {
  const globeRef = useRef<THREE.Group>(null);
  
  // Rotate globe continually
  useFrame(({ clock }) => {
    if (!globeRef.current) return;
    
    const t = clock.getElapsedTime();
    globeRef.current.rotation.y = t * rotationSpeed;
    // Slight wobble
    globeRef.current.rotation.x = Math.sin(t * 0.2) * 0.02;
  });
  
  return (
    <group ref={globeRef}>
      {/* Main sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.02} 
          side={THREE.FrontSide}
        />
      </mesh>
      
      {/* Inner wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.SphereGeometry(radius, 24, 24)]} />
        <lineBasicMaterial 
          color={wireframeColor} 
          transparent 
          opacity={0.2} 
        />
      </lineSegments>
      
      {/* Outer wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.SphereGeometry(radius * 1.01, 16, 16)]} />
        <lineBasicMaterial 
          color={wireframeColor} 
          transparent 
          opacity={0.1} 
        />
      </lineSegments>
      
      {/* Enhanced glow effect */}
      <mesh>
        <sphereGeometry args={[radius * 1.2, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[radius * 2, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// Camera rig that adds subtle animation
const CameraRig = () => {
  const camera = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(({ clock }) => {
    if (!camera.current) return;
    
    const t = clock.getElapsedTime();
    
    // Very subtle floating movement
    camera.current.position.x = Math.sin(t * 0.1) * 0.5;
    camera.current.position.y = Math.cos(t * 0.1) * 0.3;
    
    // Always look at center
    camera.current.lookAt(0, 0, 0);
  });
  
  return (
    <PerspectiveCamera 
      ref={camera}
      makeDefault
      position={[0, 0, 10]} 
      fov={30}
    />
  );
};

// Main component that combines everything
const GlobeScene = ({ 
  className = "", 
  text = "Ventry"
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted state only on client-side
    setMounted(true);
  }, []);
  
  // Only render the Three.js Canvas on the client to avoid hydration issues
  if (typeof window === 'undefined') {
    // Server-side rendering placeholder
    return (
      <div className={`${className} relative bg-black`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-opacity-80">Loading visualization...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} relative`}>
      {!mounted ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-opacity-80">Loading...</div>
        </div>
      ) : (
        <Canvas
          dpr={[1, 1.5]} // Reduced for better performance
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.5,
            powerPreference: 'high-performance'
          }}
          style={{ background: 'black' }}
        >
          <CameraRig />
          <fog attach="fog" args={['#050505', 1, 25]} />
          <color attach="background" args={['#050505']} />
          
          {/* Main globe and particles */}
          <Globe 
            radius={2} 
            color="#ffffff" 
            wireframeColor="#ffffff" 
            glowColor="#4f6bfd"
          />
          
          <GravitationalParticles 
            count={5000}
            radius={20}
            sphereRadius={1.0}
            particleSize={0.008}
            particleColor="#ffffff"
            attractionForce={0.002}
            repulsionRadius={1.3}
          />
          
          {/* Subtle background stars */}
          <Stars 
            radius={100} 
            depth={80} 
            count={1000} 
            factor={2} 
            saturation={0} 
            fade 
            speed={0.3}
          />
          
          {/* Subtle lighting for the scene */}
          <ambientLight intensity={0.05} />
          <pointLight position={[10, 10, 10]} intensity={0.1} />
          <Environment preset="night" />
          
          <AdaptiveDpr pixelated />
        </Canvas>
      )}
    </div>
  );
};

export default GlobeScene; 