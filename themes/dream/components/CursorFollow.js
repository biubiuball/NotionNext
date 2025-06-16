import React, { useEffect, useRef, useState } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const [bgType, setBgType] = useState('dark'); // 默认深色背景
  const particleInterval = 14;
  const maxParticles = 130;
  const baseSize = 5;
  
  // 优化的粒子配置
  const particleConfig = {
    life: 650,
    sizeVariation: 1.1,
    speedFactor: 1.7,
    colorPalette: [
      '#FF3366', '#FF6633', '#FFAA33', '#99FF33',
      '#33FF99', '#33AAFF', '#6633FF', '#FF33AA'
    ],
    glowIntensity: 0.8
  };

  // 检测背景亮度
  useEffect(() => {
    const detectBackgroundBrightness = () => {
      try {
        const bgColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = bgColor.match(/\d+/g);
        if (!rgb || rgb.length < 3) return 'dark';
        
        // 计算相对亮度
        const brightness = (parseInt(rgb[0]) * 299 + 
                          parseInt(rgb[1]) * 587 + 
                          parseInt(rgb[2]) * 114) / 1000;
        
        return brightness > 150 ? 'light' : 'dark';
      } catch (e) {
        return 'dark';
      }
    };
    
    // 初始检测
    setBgType(detectBackgroundBrightness());
    
    // 创建观察器监听背景变化
    const observer = new MutationObserver(() => {
      setBgType(detectBackgroundBrightness());
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let lastParticleTime = 0;
    
    const handleMouseMove = (event) => {
      const now = Date.now();
      if (now - lastParticleTime < particleInterval) return;
      lastParticleTime = now;
      
      if (particlesRef.current.length >= maxParticles) return;
      
      const particle = document.createElement('div');
      const size = baseSize * (1 + Math.random() * particleConfig.sizeVariation);
      const color = particleConfig.colorPalette[
        Math.floor(Math.random() * particleConfig.colorPalette.length)
      ];
      
      // 根据背景类型调整粒子样式
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
        background: isLightBg 
          ? `radial-gradient(circle at 30% 30%, white 0%, ${color} 70%)`
          : color,
        opacity: isLightBg ? '0.95' : '0.85',
        // 双重发光效果：白色内发光 + 彩色外发光
        boxShadow: isLightBg
          ? `inset 0 0 6px rgba(255, 255, 255, 0.9), 0 0 ${8 * particleConfig.glowIntensity}px rgba(0, 0, 0, 0.4)`
          : `inset 0 0 8px rgba(255, 255, 255, 0.7), 0 0 ${10 * particleConfig.glowIntensity}px ${color}80`,
        zIndex: '9999',
        border: isLightBg ? '1px solid rgba(0,0,0,0.15)' : 'none'
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
        
        // 柔和的重力效果
        p.vy += 0.02;
        
        // 生命周期衰减
        const lifeRatio = 1 - Math.min(p.age / particleConfig.life, 1);
        const opacity = p.isLightBg 
          ? (0.95 * Math.sqrt(lifeRatio)).toFixed(2) 
          : (0.85 * Math.pow(lifeRatio, 0.7)).toFixed(2);
          
        p.element.style.opacity = opacity;
        
        // 缩放效果
        const scale = 0.6 + lifeRatio * 0.4;
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) scale(${scale})`;
        
        // 随着时间减弱发光效果
        const glowSize = p.isLightBg 
          ? 8 * particleConfig.glowIntensity * lifeRatio
          : 10 * particleConfig.glowIntensity * lifeRatio;
        
        p.element.style.boxShadow = p.isLightBg
          ? `inset 0 0 6px rgba(255, 255, 255, ${0.9 * lifeRatio}), 0 0 ${glowSize}px rgba(0, 0, 0, ${0.4 * lifeRatio})`
          : `inset 0 0 8px rgba(255, 255, 255, ${0.7 * lifeRatio}), 0 0 ${glowSize}px ${p.color}80`;
        
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
  }, [bgType]);
  
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
        // 使用双重混合模式增强效果
        mixBlendMode: bgType === 'light' ? 'multiply' : 'screen'
      }}
    />
  );
};

export default CursorFollow;
