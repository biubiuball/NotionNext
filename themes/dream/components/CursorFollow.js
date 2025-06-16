import React, { useEffect, useRef, useState } from 'react';

// 十六进制转RGB辅助函数
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
};

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const [bgType, setBgType] = useState('dark'); // 默认深色背景
  const particleInterval = 14;
  const maxParticles = 130;
  const baseSize = 5;
  
  // 增强的粒子配置
  const particleConfig = {
    life: 650,
    sizeVariation: 1.1,
    speedFactor: 1.7,
    colorPalette: [
      '#FF3366', '#FF6633', '#FFAA33', '#99FF33',
      '#33FF99', '#33AAFF', '#6633FF', '#FF33AA'
    ],
    glowIntensity: 1.2, // 增加发光强度
    flickerIntensity: 0.3, // 闪烁强度
    neonIntensity: 1.5 // 荧光效果强度
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
      const rgb = hexToRgb(color);
      
      // 根据背景类型调整粒子样式
      const isLightBg = bgType === 'light';
      
      // 增强的荧光效果
      const neonEffect = isLightBg 
        ? `drop-shadow(0 0 ${size * 0.8}px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8))`
        : `drop-shadow(0 0 ${size * 1.2}px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.6))`;
      
      Object.assign(particle.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        pointerEvents: 'none',
        transform: `translate(${event.clientX}px, ${event.clientY}px)`,
        willChange: 'transform, opacity, filter',
        background: isLightBg 
          ? `radial-gradient(circle at 30% 30%, white 0%, ${color} 70%)`
          : `radial-gradient(circle at 30% 30%, ${color} 0%, ${color}40 100%)`,
        opacity: isLightBg ? '0.95' : '0.85',
        // 增强的发光效果
        boxShadow: isLightBg
          ? `inset 0 0 ${size * 0.8}px rgba(255, 255, 255, 0.95), 
             0 0 ${size * 1.5}px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.7)`
          : `inset 0 0 ${size}px rgba(255, 255, 255, 0.7), 
             0 0 ${size * 2}px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`,
        zIndex: '9999',
        border: isLightBg ? `1px solid rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4)` : 'none',
        // 添加荧光滤镜
        filter: neonEffect,
        transition: 'filter 0.2s ease'
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
        rgb,
        isLightBg,
        baseFilter: neonEffect,
        flickerOffset: Math.random() * 100 // 随机闪烁偏移
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
        
        // 发光效果随生命周期变化
        const glowSize = p.isLightBg 
          ? p.size * 1.5 * particleConfig.glowIntensity * lifeRatio
          : p.size * 2 * particleConfig.glowIntensity * lifeRatio;
        
        p.element.style.boxShadow = p.isLightBg
          ? `inset 0 0 ${p.size * 0.8}px rgba(255, 255, 255, ${0.95 * lifeRatio}), 
             0 0 ${glowSize}px rgba(${p.rgb[0]}, ${p.rgb[1]}, ${p.rgb[2]}, ${0.7 * lifeRatio})`
          : `inset 0 0 ${p.size}px rgba(255, 255, 255, ${0.7 * lifeRatio}), 
             0 0 ${glowSize}px rgba(${p.rgb[0]}, ${p.rgb[1]}, ${p.rgb[2]}, ${0.8 * lifeRatio})`;
        
        // 荧光闪烁效果
        const flicker = Math.sin(p.age * 0.02 + p.flickerOffset) * particleConfig.flickerIntensity;
        const neonSize = p.isLightBg 
          ? p.size * 0.8 * particleConfig.neonIntensity * (1 + flicker)
          : p.size * 1.2 * particleConfig.neonIntensity * (1 + flicker);
          
        p.element.style.filter = `drop-shadow(0 0 ${neonSize}px rgba(${p.rgb[0]}, ${p.rgb[1]}, ${p.rgb[2]}, ${0.6 * lifeRatio}))`;
        
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
        // 优化混合模式
        mixBlendMode: bgType === 'light' ? 'screen' : 'lighten'
      }}
    />
  );
};

export default CursorFollow;
