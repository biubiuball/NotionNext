import React, { useEffect, useRef } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const particleLife = 300; // 粒子生命周期
  
  useEffect(() => {
    const container = containerRef.current;
    
    const handleMouseMove = (event) => {
      // 创建粒子元素
      const particle = document.createElement('span');
      particle.style.cssText = `
        position: absolute;
        left: -5px;
        top: -5px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        pointer-events: none;
      `;
      
      container.appendChild(particle);
      
      // 保存粒子数据
      particlesRef.current.push({
        element: particle,
        age: 0,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random()})`,
        vx: Math.random() * 0.5 - 0.25, // 范围在-0.25到0.25之间
        vy: Math.random() * 0.75 - 0.25, // 范围在-0.25到0.5之间
        x: event.clientX,
        y: event.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // 动画循环
    const animate = () => {
      const particles = particlesRef.current;
      
      // 从后向前遍历，以便安全删除
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += 1;
        p.x += p.vx * 2;
        p.y += p.vy * 2;
        
        p.element.style.background = p.color;
        p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
        
        // 移除过期粒子
        if (p.age >= particleLife) {
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
      
      // 清除所有粒子
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
        zIndex: 10 // 确保在内容之上但在导航栏之下
      }}
    />
  );
};

export default CursorFollow;