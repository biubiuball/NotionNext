// components/Snowflake.js
import React, { useEffect, useRef } from 'react';

const Snowflake = () => {
  const canvasRef = useRef(null);
  const snowsRef = useRef([]);
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSnowflakes();
    };
    
    // 初始化雪花（优化版）
    const initSnowflakes = () => {
      const w = canvas.width;
      const h = canvas.height;
      snowsRef.current = [];
      
      // 动态计算雪花数量（基于屏幕尺寸）
      const density = Math.min(2, Math.max(0.8, w / 1000)); // 密度系数
      const count = Math.floor(w * h * 0.00008 * density);
      
      for (let i = 0; i < count; i++) {
        snowsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h - h, // 从屏幕上方开始
          r: Math.random() * 4 + 1, // 半径范围 1-5
          baseSpeed: (Math.random() * 0.5) + 0.2, // 基础速度
          speedVariation: Math.random() * 0.3 + 0.1, // 速度变化系数
          angle: Math.random() * Math.PI * 2, // 旋转角度
          rotationSpeed: (Math.random() - 0.5) * 0.05, // 旋转速度
          sway: Math.random() * 1 - 0.5, // 左右摇摆幅度
          swaySpeed: Math.random() * 0.01 + 0.005, // 摇摆速度
          alpha: Math.random() * 0.5 + 0.3, // 初始透明度
          wind: (Math.random() - 0.5) * 0.2, // 风力影响
          timeOffset: Math.random() * 100, // 时间偏移
        });
      }
    };
    
    // 绘制雪花（带旋转效果）
    const drawSnowflakes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      snowsRef.current.forEach(snow => {
        ctx.save();
        ctx.translate(snow.x, snow.y);
        ctx.rotate(snow.angle);
        ctx.globalAlpha = snow.alpha;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        
        // 绘制六边形雪花
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.lineTo(
            Math.cos(angle) * snow.r, 
            Math.sin(angle) * snow.r
          );
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    };
    
    // 移动雪花（带物理模拟）
    const moveSnowflakes = (deltaTime) => {
      const w = canvas.width;
      const h = canvas.height;
      const time = performance.now() * 0.001;
      
      snowsRef.current.forEach(snow => {
        // 物理模拟
        const speedFactor = 0.5 + Math.sin(time + snow.timeOffset) * 0.5;
        const currentSpeed = snow.baseSpeed + snow.speedVariation * speedFactor;
        
        // 更新位置
        snow.y += currentSpeed * deltaTime * 60;
        snow.x += (snow.sway * Math.sin(time * snow.swaySpeed) + snow.wind;
        snow.angle += snow.rotationSpeed * deltaTime;
        
        // 边界处理
        const buffer = snow.r * 5;
        if (snow.y > h + buffer) {
          resetSnowflake(snow, w, h);
        }
        if (snow.x > w + buffer) snow.x = -buffer;
        if (snow.x < -buffer) snow.x = w + buffer;
      });
    };
    
    // 重置雪花位置
    const resetSnowflake = (snow, w, h) => {
      snow.x = Math.random() * w;
      snow.y = -snow.r * 10;
      snow.alpha = Math.random() * 0.5 + 0.3;
    };
    
    // 动画循环（带时间增量计算）
    const animate = (timestamp) => {
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      
      if (deltaTime < 0.1) {
        moveSnowflakes(deltaTime);
        drawSnowflakes();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // 初始化
    resizeCanvas();
    lastTimestampRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', resizeCanvas);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // 内联样式
  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
    pointerEvents: 'none',
    opacity: 0.9,
  };

  return (
    <canvas 
      ref={canvasRef} 
      style={canvasStyle}
      aria-hidden="true"
    />
  );
};

export default Snowflake;