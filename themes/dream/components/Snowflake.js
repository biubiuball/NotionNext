import React, { useEffect, useRef } from 'react';

const Snowflake = () => {
  const canvasRef = useRef(null);
  const snowsRef = useRef([]);
  const animationRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const offscreenCanvasRef = useRef(null); // 离屏Canvas用于预渲染
  const offscreenCtxRef = useRef(null);
  const snowflakeShapesRef = useRef([]); // 存储预渲染的雪花形状

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 创建离屏Canvas
    offscreenCanvasRef.current = document.createElement('canvas');
    offscreenCtxRef.current = offscreenCanvasRef.current.getContext('2d');
    
    // 预渲染雪花形状
    const renderSnowflakeShapes = () => {
      snowflakeShapesRef.current = [];
      
      // 六边形雪花
      const hexagon = document.createElement('canvas');
      const size = 30; // 最大尺寸
      hexagon.width = size * 2;
      hexagon.height = size * 2;
      const hexCtx = hexagon.getContext('2d');
      hexCtx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        hexCtx.lineTo(
          Math.cos(angle) * size + size, 
          Math.sin(angle) * size + size
        );
      }
      hexCtx.closePath();
      hexCtx.fillStyle = "rgba(255, 255, 255, 1)";
      hexCtx.fill();
      snowflakeShapesRef.current.push(hexagon);
      
      // 星形雪花
      const star = document.createElement('canvas');
      star.width = size * 2;
      star.height = size * 2;
      const starCtx = star.getContext('2d');
      starCtx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * (Math.PI * 2)) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;
        starCtx.lineTo(
          Math.cos(outerAngle) * size + size, 
          Math.sin(outerAngle) * size + size
        );
        starCtx.lineTo(
          Math.cos(innerAngle) * (size * 0.4) + size, 
          Math.sin(innerAngle) * (size * 0.4) + size
        );
      }
      starCtx.closePath();
      starCtx.fillStyle = "rgba(255, 255, 255, 1)";
      starCtx.fill();
      snowflakeShapesRef.current.push(star);
      
      // 简单圆形雪花
      const circle = document.createElement('canvas');
      circle.width = size * 2;
      circle.height = size * 2;
      const circleCtx = circle.getContext('2d');
      circleCtx.beginPath();
      circleCtx.arc(size, size, size * 0.7, 0, Math.PI * 2);
      circleCtx.fillStyle = "rgba(255, 255, 255, 1)";
      circleCtx.fill();
      snowflakeShapesRef.current.push(circle);
    };
    
    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSnowflakes();
    };
    
    // 初始化雪花（优化版）
    const initSnowflakes = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // 如果雪花数组已存在，保留部分雪花
      const existingSnows = snowsRef.current.filter(snow => 
        snow.y < h && snow.x > 0 && snow.x < w
      );
      
      // 动态计算雪花数量
      const density = Math.min(2, Math.max(0.8, w / 1000));
      const count = Math.floor(w * h * 0.00008 * density);
      
      snowsRef.current = [];
      
      // 添加保留的雪花
      existingSnows.forEach(snow => {
        if (snowsRef.current.length < count) {
          snowsRef.current.push(snow);
        }
      });
      
      // 添加新雪花
      const snowTypes = snowflakeShapesRef.current.length;
      for (let i = snowsRef.current.length; i < count; i++) {
        const type = Math.floor(Math.random() * snowTypes);
        snowsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h - h,
          r: Math.random() * 4 + 1,
          type,
          baseSpeed: (Math.random() * 0.5) + 0.2,
          speedVariation: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          sway: Math.random() * 1 - 0.5,
          swaySpeed: Math.random() * 0.01 + 0.005,
          alpha: Math.random() * 0.5 + 0.3,
          wind: (Math.random() - 0.5) * 0.2,
          timeOffset: Math.random() * 100,
        });
      }
    };
    
    // 绘制雪花（使用预渲染形状）
    const drawSnowflakes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      snowsRef.current.forEach(snow => {
        const shape = snowflakeShapesRef.current[snow.type];
        const scale = snow.r / 15; // 15是预渲染尺寸的参考值
        
        ctx.save();
        ctx.translate(snow.x, snow.y);
        ctx.rotate(snow.angle);
        ctx.scale(scale, scale);
        ctx.globalAlpha = snow.alpha;
        ctx.drawImage(shape, -shape.width/2, -shape.height/2);
        ctx.restore();
      });
    };
    
    // 移动雪花（优化物理模拟）
    const moveSnowflakes = (deltaTime) => {
      const w = canvas.width;
      const h = canvas.height;
      const time = performance.now() * 0.001;
      
      // 轻微随机变化的风力
      const globalWind = Math.sin(time * 0.1) * 0.05;
      
      snowsRef.current.forEach(snow => {
        // 物理模拟 - 使用缓动函数使运动更自然
        const speedFactor = 0.5 + Math.sin(time + snow.timeOffset) * 0.5;
        const currentSpeed = snow.baseSpeed + snow.speedVariation * speedFactor;
        
        // 更新位置 - 添加重力效果
        snow.y += currentSpeed * deltaTime * 60;
        
        // 更新水平位置 - 添加全局风力和个体摇摆
        const swayAmount = snow.sway * Math.sin(time * snow.swaySpeed);
        snow.x += (swayAmount + snow.wind + globalWind) * currentSpeed * 2;
        
        // 更新旋转
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
    
    // 动画循环（带帧率控制）
    const animate = (timestamp) => {
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      
      // 帧率控制 - 只在合理时间间隔内更新
      if (deltaTime < 0.1) {
        moveSnowflakes(deltaTime);
        drawSnowflakes();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // 初始化
    renderSnowflakeShapes();
    resizeCanvas();
    lastTimestampRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);
    
    // 添加窗口大小变化监听（带防抖）
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 200);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // 优化样式
  const canvasStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
    pointerEvents: 'none',
    opacity: 0.9,
    width: '100%',
    height: '100%',
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
