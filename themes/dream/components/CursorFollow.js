import React, { useEffect, useRef } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const particleInterval = 16; // 粒子生成间隔(ms)，控制粒子密度
  const maxParticles = 100; // 最大粒子数量限制
  const baseSize = 4; // 基础粒子大小
  const particleConfig = {
    life: 300, // 粒子生命周期
    sizeVariation: 0.8, // 粒子大小变化系数
    speedFactor: 2.5, // 粒子速度系数
    opacityDecay: 0.02, // 透明度衰减速度
    colorPalette: [
      '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
      '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
      '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
    ] // 优化后的颜色调色板
  };
  
  useEffect(() => {
    const container = containerRef.current;
    let lastParticleTime = 0;
    
    const handleMouseMove = (event) => {
      const now = Date.now();
      // 控制粒子生成频率
      if (now - lastParticleTime < particleInterval) return;
      lastParticleTime = now;
      
      // 粒子数量限制
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
        opacity: '0.8',
        boxShadow: '0 0 8px currentColor'
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
    
    // 使用时间差(deltaTime)的动画循环
    const animate = (timestamp) => {
      const particles = particlesRef.current;
      const deltaTime = timestamp - (lastTimeRef.current || timestamp);
      lastTimeRef.current = timestamp;
      
      // 从后向前遍历以便安全删除
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += deltaTime;
        
        // 物理更新
        p.x += p.vx;
        p.y += p.vy;
        
        // 添加重力效果
        p.vy += 0.05;
        
        // 生命周期衰减
        const lifeRatio = 1 - Math.min(p.age / particleConfig.life, 1);
        p.element.style.opacity = (0.8 * lifeRatio).toFixed(2);
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.5 + lifeRatio * 0.5})`;
        
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
        zIndex: 9999,
        mixBlendMode: 'screen' // 添加混合模式增强视觉效果
      }}
    />
  );
};

export default CursorFollow;
