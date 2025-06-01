
    /* 实现鼠标跟随粒子动画 */

import React, { useState, useEffect, useRef } from 'react';

const CursorFollow = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const particleElementsRef = useRef([]);
  const particleLife = 300;
  
  useEffect(() => {
    const container = containerRef.current;
    
    const handleMouseMove = (e) => {
      const span = document.createElement('span');
      span.style.cssText = `
        position: absolute;
        left: -5px;
        top: -5px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
      `;
      
      container.appendChild(span);
      
      particlesRef.current.push({
        element: span,
        age: 0,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.random()})`,
        vx: Math.random() * 0.5,
        vy: Math.random() * 0.75,
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const animationInterval = setInterval(() => {
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;
        p.x += p.vx * 2;
        p.y += p.vy * 2;
        
        p.element.style.background = p.color;
        p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
        
        if (p.age >= particleLife) {
          container.removeChild(p.element);
          particles.splice(i, 1);
        }
      }
    }, 16); // ~60fps
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(animationInterval);
      // 清除所有粒子元素
      particlesRef.current.forEach(p => {
        if (p.element.parentNode === container) {
          container.removeChild(p.element);
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
        zIndex: 9999
      }}
    />
  );
};

export default CursorFollow;