import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Define props interface
interface IridescenceProps {
  color?: [number, number, number];
  mouseReact?: boolean;
  amplitude?: number;
  speed?: number;
  className?: string;
}

// Vertex Shader for Iridescence
const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDistortion;

uniform float time;
uniform float amplitude;
uniform vec2 mouse;
uniform bool mouseReact;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;
  
  // Base wave distortion
  float waveX = sin(position.x * 10.0 + time * 0.5);
  float waveY = sin(position.y * 10.0 + time * 0.5);
  float distortion = waveX * waveY * amplitude;
  
  // Mouse interaction
  if (mouseReact) {
    float dist = distance(uv, mouse);
    float mouseEffect = smoothstep(0.5, 0.0, dist) * 0.5;
    distortion += mouseEffect;
  }
  
  vec3 newPosition = position;
  newPosition.z += distortion;
  vDistortion = distortion;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

// Fragment Shader for Iridescence
const FRAGMENT_SHADER = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vDistortion;

uniform float time;
uniform vec3 color;
uniform float speed;

// HSL to RGB conversion
vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

void main() {
  // Create an iridescent effect with base color influence
  float hue = vUv.x + vUv.y + time * 0.1 * speed + vDistortion * 2.0;
  vec3 iridescence = hsl2rgb(vec3(hue, 0.7, 0.5)) * color;
  
  // Add fresnel effect for more realism
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDirection)), 3.0);
  vec3 final = mix(iridescence, iridescence * 1.5, fresnel);
  
  // Add subtle pulse
  final *= 0.8 + 0.2 * sin(time * 0.5);
  
  gl_FragColor = vec4(final, 0.9);
}
`;

// The IridescenceEffect component manages the shader material and animation
const IridescenceEffect = ({
  color = [1, 1, 1],
  mouseReact = false,
  amplitude = 0.1,
  speed = 1.0
}: IridescenceProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  
  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(color[0], color[1], color[2]) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        mouseReact: { value: mouseReact },
        amplitude: { value: amplitude },
        speed: { value: speed }
      },
      transparent: true,
      side: THREE.DoubleSide
    });
  }, [color, mouseReact, amplitude, speed]);
  
  // Handle mousemove to update shader uniform
  const handleMouseMove = (e: any) => {
    if (mouseReact && meshRef.current && e.point) {
      const x = (e.point.x / meshRef.current.scale.x) * 0.5 + 0.5;
      const y = (e.point.y / meshRef.current.scale.y) * 0.5 + 0.5;
      mouse.current.set(x, y);
    }
  };
  
  // Update time uniform and mouse position
  useFrame(({ clock, mouse: fibreMouse }) => {
    material.uniforms.time.value = clock.getElapsedTime();
    
    if (mouseReact) {
      // If no pointer events detected on mesh, use global mouse position
      material.uniforms.mouse.value.x = (fibreMouse.x + 1) / 2;
      material.uniforms.mouse.value.y = (fibreMouse.y + 1) / 2;
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 4, 0, 0]}
      scale={[10, 10, 1]}
      onPointerMove={handleMouseMove}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// Main component with Canvas wrapper
const Iridescence = ({
  color = [1, 1, 1],
  mouseReact = false,
  amplitude = 0.1,
  speed = 1.0,
  className = ""
}: IridescenceProps) => {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <IridescenceEffect
          color={color}
          mouseReact={mouseReact}
          amplitude={amplitude}
          speed={speed}
        />
      </Canvas>
    </div>
  );
};

export default Iridescence; 