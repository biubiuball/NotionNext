import React, { useEffect, useRef } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const particleInterval = 14;
  const maxParticles = 120;
  const baseSize = 4;
  
  // 优化的粒子配置
  const particleConfig = {
    life: 650,
    sizeVariation: 1.0,
    speedFactor: 1.6,
    colorPalette: [
      '#FF3E6C', '#FF6B3C', '#FFAA2A', '#A1E44D',
      '#4DE4A1', '#4DA1E4', '#6C3EFF', '#E44DA1'
    ],
    glowIntensity: 0.7
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
      
      // 随机选择颜色
      const color = particleConfig.colorPalette[
        Math.floor(Math.random() * particleConfig.colorPalette.length)
      ];
      
      // 创建更柔和的粒子效果
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
        background: color,
        opacity: '0.92',
        // 减少发光效果，避免遮挡内容
        boxShadow: `0 0 ${8 * particleConfig.glowIntensity}px ${color}80`,
        zIndex: '9999'
      });
      
      container.appendChild(particle);
      
      particlesRef.current.push({
        element: particle,
        age: 0,
        size,
        vx: (Math.random() - 0.5) * particleConfig.speedFactor,
        vy: (Math.random() - 0.25) * particleConfig.speedFactor,
        x: event.clientX,
        y: event.clientY,
        color
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // 动画循环
    const animate = (timestamp) => {
      const particles = particlesRef.current;
      const deltaTime = timestamp - (lastTimeRef.current || timestamp);
      lastTimeRef.current = timestamp;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += deltaTime;
        
        // 物理更新
        p.x += p.vx;
        p.y += p.vy;
        
        // 柔和的重力效果
        p.vy += 0.018;
        
        // 生命周期衰减
        const lifeRatio = 1 - Math.min(p.age / particleConfig.life, 1);
        const opacity = (0.92 * Math.sqrt(lifeRatio)).toFixed(2);
        p.element.style.opacity = opacity;
        
        // 缩放效果
        const scale = 0.6 + lifeRatio * 0.4;
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${scale})`;
        
        // 随着时间减弱发光效果
        const glowSize = 8 * particleConfig.glowIntensity * lifeRatio;
        p.element.style.boxShadow = `0 0 ${glowSize}px ${p.color}80`;
        
        // 移除过期粒子
        if (p.age >= particleConfig.life) {
          container.removeChild(p.element);
          particles.splice(i, 1);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // 清理函数
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
        zIndex: 9998,
        // 使用更友好的混合模式
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default CursorFollow;
