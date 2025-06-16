import React, { useEffect, useRef } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const particleInterval = 14;
  const maxParticles = 150;
  const baseSize = 4;
  
  // 增强的粒子配置
  const particleConfig = {
    life: 600,
    sizeVariation: 1.2,
    speedFactor: 2.0,
    colorPalette: [
      '#FF0055', '#FF5500', '#FFAA00', '#AAFF00',
      '#55FF00', '#00FF55', '#00FFAA', '#00AAFF',
      '#0055FF', '#5500FF', '#AA00FF', '#FF00AA'
    ],
    glowIntensity: 1.8
  };

  useEffect(() => {
    const container = containerRef.current;
    let lastParticleTime = 0;
    
    // 检测背景亮度以调整粒子效果
    const detectBackgroundBrightness = () => {
      const bgColor = window.getComputedStyle(document.body).backgroundColor;
      const rgb = bgColor.match(/\d+/g);
      if (!rgb || rgb.length < 3) return 'dark';
      
      // 计算相对亮度 (0-255)
      const brightness = (parseInt(rgb[0]) * 299 + 
                         parseInt(rgb[1]) * 587 + 
                         parseInt(rgb[2]) * 114) / 1000;
      
      return brightness > 128 ? 'light' : 'dark';
    };
    
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
      
      // 根据背景调整效果
      const bgType = detectBackgroundBrightness();
      const isLightBg = bgType === 'light';
      
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
        opacity: isLightBg ? '0.95' : '0.85',
        // 增强发光效果
        boxShadow: `
          0 0 ${isLightBg ? 15 : 18}px ${isLightBg ? 10 : 12}px ${color}${isLightBg ? '80' : 'f0'},
          inset 0 0 ${isLightBg ? 8 : 10}px rgba(255, 255, 255, ${isLightBg ? '0.9' : '0.7'})
        `,
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
        color,
        isLightBg
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
        
        // 重力效果
        p.vy += 0.025;
        
        // 生命周期衰减
        const lifeRatio = 1 - Math.min(p.age / particleConfig.life, 1);
        
        // 根据背景类型调整不透明度
        const opacity = p.isLightBg 
          ? (0.95 * Math.sqrt(lifeRatio)).toFixed(2) 
          : (0.85 * Math.pow(lifeRatio, 0.7)).toFixed(2);
          
        p.element.style.opacity = opacity;
        
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
        // 使用多重混合模式增强效果
        mixBlendMode: 'screen, lighten, difference'
      }}
    />
  );
};

export default CursorFollow;
