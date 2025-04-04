import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// A field of connected particles with line connections between nearby particles
const ParticleField = ({ 
  count = 80, 
  spacing = 10, 
  connectionDistance = 2.5,
  particleColor = "#b4bed2",
  lineColor = "#3f5b91",
  speed = 0.2
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [velocities, setVelocities] = useState<Array<THREE.Vector3> | null>(null);
  const [linePositions, setLinePositions] = useState<Float32Array | null>(null);
  const [lineColors, setLineColors] = useState<Float32Array | null>(null);
  
  // Initialize particle positions and velocities
  useEffect(() => {
    const tempPositions = new Float32Array(count * 3);
    const tempVelocities: THREE.Vector3[] = [];
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Position particles in a square field
      tempPositions[i3] = (Math.random() - 0.5) * spacing;
      tempPositions[i3 + 1] = (Math.random() - 0.5) * spacing;
      tempPositions[i3 + 2] = (Math.random() - 0.5) * spacing;
      
      // Add random velocities
      tempVelocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.05 * speed,
        (Math.random() - 0.5) * 0.05 * speed,
        (Math.random() - 0.5) * 0.05 * speed
      ));
    }
    
    setPositions(tempPositions);
    setVelocities(tempVelocities);
  }, [count, spacing, speed]);
  
  // Update particle positions and connections each frame
  useFrame(() => {
    if (!positions || !velocities || !pointsRef.current || !linesRef.current) return;
    
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const lineGeometry = linesRef.current.geometry;
    
    // Maximum number of possible line connections
    const maxConnections = count * count;
    const linePositionsArray = new Float32Array(maxConnections * 6); // 2 points per line, 3 coordinates per point
    const lineColorsArray = new Float32Array(maxConnections * 6); // 2 points per line, 3 color values per point
    
    let lineIndex = 0;
    
    // Update particle positions based on velocities
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update position
      positionArray[i3] += velocities[i].x;
      positionArray[i3 + 1] += velocities[i].y;
      positionArray[i3 + 2] += velocities[i].z;
      
      // Boundary checks - reverse direction when hitting boundaries
      if (Math.abs(positionArray[i3]) > spacing / 2) {
        velocities[i].x *= -1;
      }
      if (Math.abs(positionArray[i3 + 1]) > spacing / 2) {
        velocities[i].y *= -1;
      }
      if (Math.abs(positionArray[i3 + 2]) > spacing / 2) {
        velocities[i].z *= -1;
      }
      
      // Find connections to other particles
      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3;
        
        // Calculate distance between particles
        const dx = positionArray[i3] - positionArray[j3];
        const dy = positionArray[i3 + 1] - positionArray[j3 + 1];
        const dz = positionArray[i3 + 2] - positionArray[j3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // If particles are close enough, draw a line between them
        if (distance < connectionDistance) {
          // First point
          linePositionsArray[lineIndex * 6] = positionArray[i3];
          linePositionsArray[lineIndex * 6 + 1] = positionArray[i3 + 1];
          linePositionsArray[lineIndex * 6 + 2] = positionArray[i3 + 2];
          
          // Second point
          linePositionsArray[lineIndex * 6 + 3] = positionArray[j3];
          linePositionsArray[lineIndex * 6 + 4] = positionArray[j3 + 1];
          linePositionsArray[lineIndex * 6 + 5] = positionArray[j3 + 2];
          
          // Line opacity based on distance (closer = more opaque)
          const opacity = 1 - distance / connectionDistance;
          const color = new THREE.Color(lineColor);
          
          // First point color
          lineColorsArray[lineIndex * 6] = color.r;
          lineColorsArray[lineIndex * 6 + 1] = color.g;
          lineColorsArray[lineIndex * 6 + 2] = color.b * opacity;
          
          // Second point color
          lineColorsArray[lineIndex * 6 + 3] = color.r;
          lineColorsArray[lineIndex * 6 + 4] = color.g;
          lineColorsArray[lineIndex * 6 + 5] = color.b * opacity;
          
          lineIndex++;
        }
      }
    }
    
    // Update geometries
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Redefine line geometry with new connections
    const actualLinePositions = new Float32Array(lineIndex * 6);
    const actualLineColors = new Float32Array(lineIndex * 6);
    
    for (let i = 0; i < lineIndex * 6; i++) {
      actualLinePositions[i] = linePositionsArray[i];
      actualLineColors[i] = lineColorsArray[i];
    }
    
    // Update line geometries
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(actualLinePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(actualLineColors, 3));
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
  });
  
  if (!positions || !velocities) return null;
  
  return (
    <group>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            array={positions} 
            count={positions.length / 3} 
            itemSize={3} 
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.1} 
          color={particleColor} 
          transparent 
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Lines connecting particles */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial 
          vertexColors 
          transparent 
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

// Export the component wrapped in a Canvas
export const ParticleFieldScene = ({ 
  className = "", 
  particleCount = 80,
  particleColor = "#b4bed2",
  lineColor = "#3f5b91",
  speed = 0.2
}) => {
  return (
    <div className={`${className}`}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
        <ParticleField 
          count={particleCount}
          particleColor={particleColor}
          lineColor={lineColor}
          speed={speed}
        />
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default ParticleFieldScene; 