import React, { useEffect, useRef, useState } from 'react';

interface SplashCursorProps {
  color?: string;
  size?: number;
  duration?: number;
  blend?: 'normal' | 'screen' | 'overlay' | 'darken' | 'lighten';
  disabled?: boolean;
  className?: string;
}

const SplashCursor: React.FC<SplashCursorProps> = ({
  color = '#5eeeff',
  size = 100,
  duration = 1000,
  blend = 'normal',
  disabled = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
  }>>([]);
  
  let rippleCount = useRef(0);
  
  // Set up the mouse move listener
  useEffect(() => {
    if (disabled) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      // Get the container's position relative to the viewport
      const rect = container.getBoundingClientRect();
      
      // Calculate the mouse position relative to the container
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Create a new ripple
      const id = rippleCount.current++;
      const rippleSize = Math.random() * size * 0.4 + size * 0.6; // Varied sizes
      
      // Add the new ripple to state
      setRipples((prevRipples) => [
        ...prevRipples,
        { id, x, y, size: rippleSize, opacity: 1 }
      ]);
      
      // Remove the ripple after animation completes
      setTimeout(() => {
        setRipples((prevRipples) => 
          prevRipples.filter(ripple => ripple.id !== id)
        );
      }, duration);
    };
    
    // Throttle the event to avoid too many ripples
    let throttleTimeout: number | null = null;
    const throttledMouseMove = (event: MouseEvent) => {
      if (!throttleTimeout) {
        throttleTimeout = window.setTimeout(() => {
          handleMouseMove(event);
          throttleTimeout = null;
        }, 50); // Throttle to 20 fps
      }
    };
    
    container.addEventListener('mousemove', throttledMouseMove);
    
    return () => {
      container.removeEventListener('mousemove', throttledMouseMove);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, [disabled, size, duration]);
  
  // CSS for the container and ripples
  const containerStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    overflow: 'hidden',
    mixBlendMode: blend,
    zIndex: 10,
  };
  
  return (
    <div 
      ref={containerRef} 
      className={className}
      style={containerStyles}
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            position: 'absolute',
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            borderRadius: '50%',
            backgroundColor: color,
            transform: 'translate(-50%, -50%)',
            opacity: ripple.opacity,
            transition: `opacity ${duration}ms ease-out`,
            animation: `ripple-scale ${duration}ms ease-out`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple-scale {
          0% {
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SplashCursor; 