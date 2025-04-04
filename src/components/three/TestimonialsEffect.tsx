import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Define the testimonial interface
interface Testimonial {
  quote: string;
  author: string;
}

// Floating card that shows a testimonial
const TestimonialCard = ({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  width = 4,
  height = 2,
  color = "#3f5b91",
  text = "",
  author = ""
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const initialPos = useRef(position);
  const initialRot = useRef(rotation);
  
  useFrame(({ clock }) => {
    if (!cardRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Gentle floating motion
    cardRef.current.position.y = initialPos.current[1] + Math.sin(t * 0.5) * 0.1;
    
    // Subtle rotation
    cardRef.current.rotation.x = initialRot.current[0] + Math.sin(t * 0.3) * 0.02;
    cardRef.current.rotation.y = initialRot.current[1] + Math.sin(t * 0.2) * 0.02;
  });
  
  return (
    <group ref={cardRef} position={position as [number, number, number]} rotation={rotation as [number, number, number]}>
      {/* Card backing */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          color={color} 
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Card border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial 
          color={color} 
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Text content */}
      <Text
        position={[0, 0.3, 0.1]}
        fontSize={0.15}
        maxWidth={width - 0.5}
        lineHeight={1.5}
        textAlign="center"
        color="#ffffff"
      >
        {text}
      </Text>
      
      {/* Author */}
      <Text
        position={[0, -height/2 + 0.3, 0.1]}
        fontSize={0.12}
        color="#ffffff"
        textAlign="center"
        font="/fonts/Inter-Medium.woff"
      >
        {author}
      </Text>
    </group>
  );
};

// Background particles
const BackgroundParticles = ({ count = 50, color = "#3f5b91" }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (!particlesRef.current) return;
    
    // Initial random positions for static effect
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    const geometry = particlesRef.current.geometry as THREE.BufferGeometry;
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [count]);
  
  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    
    const t = clock.getElapsedTime();
    
    // Rotate particles slowly
    particlesRef.current.rotation.y = t * 0.02;
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial 
        color={color} 
        size={0.05} 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
      />
    </points>
  );
};

// Main scene component
const TestimonialsScene = ({ testimonials = [] as Testimonial[] }) => {
  return (
    <group>
      <BackgroundParticles color="#4edbca" />
      
      {testimonials.map((testimonial, i) => {
        // Position cards in a circular pattern
        const angle = (i / testimonials.length) * Math.PI * 2;
        const radius = 5;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        // Rotate each card to face center
        const rotation = [0, -angle + Math.PI, 0];
        
        return (
          <TestimonialCard
            key={i}
            position={[x, 0, z]}
            rotation={rotation}
            text={testimonial.quote}
            author={testimonial.author}
            color={i % 2 === 0 ? "#3e86f5" : "#4edbca"}
          />
        );
      })}
    </group>
  );
};

// Main component
export const TestimonialsEffect = ({ 
  className = "",
  testimonials = [] as Testimonial[]
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Default testimonials if none provided
  const defaultTestimonials: Testimonial[] = [
    {
      quote: "The AI-generated plans provided actionable insights we hadn't considered before.",
      author: "Elizabeth H."
    },
    {
      quote: "Ventry helps me stay focused on what matters.",
      author: "Jonathan B."
    },
    {
      quote: "Like having a seasoned advisor on retainer, but without the price tag.",
      author: "Margaret C."
    }
  ];
  
  const testimonialsToRender = testimonials.length > 0 ? testimonials : defaultTestimonials;
  
  return (
    <div className={`${className} absolute inset-0`}>
      {mounted && (
        <Canvas
          dpr={[1, 2]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "low-power"
          }}
          camera={{ position: [0, 2, 10], fov: 50 }}
          style={{ background: 'transparent' }}
        >
          <TestimonialsScene testimonials={testimonialsToRender} />
        </Canvas>
      )}
    </div>
  );
};

export default TestimonialsEffect; 