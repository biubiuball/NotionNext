import React, { useEffect, useRef } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const particleInterval = 16;
  const maxParticles = 120;
  const baseSize = 4;
  const particleConfig = {
    life: 500,
    sizeVariation: 0.8,
    speedFactor: 1.8,
    opacityDecay: 0.02,
    // 优化调色板：提高饱和度
    colorPalette: [
      '#FF0000', '#FF1493', '#9400D3', '#4B0082',
      '#0000FF', '#00BFFF', '#00FFFF', '#00FF00',
      '#7FFF00', '#FFFF00', '#FFA500', '#FF4500'
    ]
  };
  
  useEffect(() => {
    const container = containerRef.current;
    let lastParticleTime = 0;
    
    const handleMouseMove = (event) => {
      const now = Date.now();
      if (now - lastParticleTime < particleInterval) return;
      lastParticleTime = now;
      
      if (particlesRef.current.length >= maxParticles) return;
      
      const particle = document.createElement('div');
      const size = baseSize * (1 + Math.random() * particleConfig.sizeVariation);
      
      Object.assign(particle.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translate(${event.clientX}px, ${event.clientY}px)`,
        willChange: 'transform, opacity',
        background: particleConfig.colorPalette[
          Math.floor(Math.random() * particleConfig.colorPalette.length)
        ],
        opacity: '1', // 提高初始透明度
        // 增强视觉效果：深色边框+发光效果
        border: '1px solid rgba(0,0,0,0.3)',
        boxShadow: `
          inset 0 0 8px rgba(255,255,255,0.8),
          0 0 12px currentColor
        `
      });
      
      container.appendChild(particle);
      
      particlesRef.current.push({
        element: particle,
        age: 0,
        size,
        vx: (Math.random() - 0.5) * particleConfig.speedFactor,
        vy: (Math.random() - 0.25) * particleConfig.speedFactor,
        x: event.clientX,
        y: event.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const animate = (timestamp) => {
      const particles = particlesRef.current;
      const deltaTime = timestamp - (lastTimeRef.current || timestamp);
      lastTimeRef.current = timestamp;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += deltaTime;
        
        p.x += p.vx;
        p.y += p.vy;
        
        p.vy += 0.03;
        
        const lifeRatio = 1 - Math.min(p.age / particleConfig.life, 1);
        p.element.style.opacity = (Math.sqrt(lifeRatio)).toFixed(2); // 保持更高亮度
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.5 + lifeRatio * 0.5})`;
        
        if (p.age >= particleConfig.life) {
          container.removeChild(p.element);
          particles.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      
      particlesRef.current.forEach(particle => {
        if (particle.element.parentNode === container) {
          container.removeChild(particle.element);
        }
      });
      particlesRef.current = [];
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 9999,
        // 更合适的混合模式
        mixBlendMode: 'darken'
      }}
    />
  );
};

export default CursorFollow;
