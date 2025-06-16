import React, { useEffect, useRef } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const particleInterval = 14;
  const maxParticles = 130;
  const baseSize = 3.5;
  
  // 优化的粒子配置
  const particleConfig = {
    life: 650,
    sizeVariation: 1.0,
    speedFactor: 1.7,
    colorPalette: [
      '#FF3366', '#FF6633', '#FF9966', '#FFCC33',
      '#99CC33', '#33CC99', '#3399FF', '#3366FF',
      '#6633FF', '#CC33FF', '#FF33CC', '#FF3399'
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
      
      // 随机选择颜色
      const color = particleConfig.colorPalette[
        Math.floor(Math.random() * particleConfig.colorPalette.length)
      ];
      
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
        opacity: '0.85',
        // 减少发光效果 - 使用更精细的发光
        boxShadow: `
          0 0 6px ${color}80,
          inset 0 0 4px rgba(255, 255, 255, 0.7)
        `,
        zIndex: '9999',
        filter: 'blur(0.5px)'
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
        
        // 轻微重力效果
        p.vy += 0.02;
        
        // 生命周期衰减
        const lifeRatio = 1 - Math.min(p.age / particleConfig.life, 1);
          
        p.element.style.opacity = (0.85 * Math.pow(lifeRatio, 0.8)).toFixed(2);
        
        // 缩放效果
        const scale = 0.5 + lifeRatio * 0.5;
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${scale})`;
        
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
    <div className="cursor-container">
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
          // 使用更柔和的混合模式
          mixBlendMode: 'lighten'
        }}
      />
      
      <style jsx global>{`
        .cursor-container {
          pointer-events: none;
        }
        
        /* 确保文字在粒子之上 */
        body * {
          position: relative;
          z-index: 10000;
        }
      `}</style>
    </div>
  );
};

export default CursorFollow;
