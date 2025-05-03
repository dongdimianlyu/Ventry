import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Types
interface Testimonial {
  quote: string;
  author: string;
  position: string;
}

// Scene component for testimonials
function TestimonialsScene({ testimonials }: { testimonials: Testimonial[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Gentle rotation for the entire scene
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
  });
  
  return (
    <group ref={groupRef}>
      {/* Animated particle cloud */}
      {Array.from({ length: 50 }).map((_, i) => {
        // Create a spherical distribution
        const radius = 10 + Math.sin(i * 3) * 2;
        const theta = (i / 50) * Math.PI * 2;
        const phi = Math.acos(-1 + (2 * i) / 50);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.1 + Math.random() * 0.1, 8, 8]} />
            <meshBasicMaterial 
              color={new THREE.Color(0.3, 0.6, 0.9)} 
              transparent 
              opacity={0.2} 
            />
          </mesh>
        );
      })}
      
      {/* Create rings */}
      {[8, 12, 16].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2 - i * 0.2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.1, 64]} />
          <meshBasicMaterial 
            color={new THREE.Color(0.4, 0.6, 0.8)} 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      ))}
    </group>
  );
}

// Main component
export default function TestimonialsEffect({ className = "" }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Default testimonials if none provided
  const defaultTestimonials = [
    {
      quote: "This product completely transformed our business operations!",
      author: "John Smith",
      position: "CEO, Example Inc."
    },
    {
      quote: "The best solution we've implemented in years.",
      author: "Sarah Johnson",
      position: "CTO, Tech Company"
    },
    {
      quote: "Incredible results in just a few weeks of use.",
      author: "Michael Brown",
      position: "Founder, Startup Co."
    }
  ];
  
  const testimonialsToRender = defaultTestimonials;
  
  return (
    <div className={`${className} h-full max-h-screen`}>
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
          dpr={[1, 2]}
          style={{ height: '100%', maxHeight: '100vh' }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "low-power"
          }}
        >
          <TestimonialsScene testimonials={testimonialsToRender} />
        </Canvas>
      )}
    </div>
  );
} 