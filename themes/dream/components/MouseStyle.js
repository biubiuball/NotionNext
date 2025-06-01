// components/MouseStyle.js
import React, { useEffect, useRef } from 'react';
import styles from './MouseStyle.module.css';

const MouseStyle = ({ 
  size = 20, 
  rotationSpeed = 0.5,
  hideOnHover = [],
  hideOnMobile = true
}) => {
  const cursorRef = useRef(null);
  const cursorInstance = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  // 更可靠的移动端检测（考虑触控支持和屏幕尺寸）
  const checkIsMobile = () => {
    // 优先检测触控支持
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 结合用户代理和屏幕尺寸
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    return hasTouch && (isMobileUA || isSmallScreen);
  };

  useEffect(() => {
    // 在客户端执行检测
    setIsMobileDevice(checkIsMobile());
    
    // 如果设置为在移动设备上隐藏并且当前是移动设备，则不初始化
    if (hideOnMobile && isMobileDevice) return;
  }, [size, rotationSpeed, hideOnHover, hideOnMobile, isMobileDevice]);
  
    // 在移动设备上隐藏整个组件
  if (hideOnMobile && isMobileDevice) {
    return null;
  }

  // ArrowPointer 类实现
  class ArrowPointer {
    constructor(cursorElement, options) {
      this.root = document.body;
      this.cursor = cursorElement;
      this.options = options;
      
      this.position = {
        distanceX: 0,
        distanceY: 0,
        distance: 0,
        pointerX: 0,
        pointerY: 0,
      };
      
      this.previousPointerX = 0;
      this.previousPointerY = 0;
      this.angle = 0;
      this.previousAngle = 0;
      this.angleDisplace = 0;
      this.degrees = 57.296;
      this.cursorSize = this.options.size;
      
      this.cursorStyle = {
        boxSizing: 'border-box',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '2147483647',
        width: `${this.cursorSize}px`,
        height: `${this.cursorSize}px`,
        transition: `transform ${100 * this.options.rotationSpeed}ms`,
        userSelect: 'none',
        pointerEvents: 'none',
        opacity: 0
      };
      
      this.init();
    }
    
    init() {
      Object.assign(this.cursor.style, this.cursorStyle);
      setTimeout(() => {
        this.cursor.style.opacity = 1;
      }, 500);
    }
    
    move(event) {
      this.previousPointerX = this.position.pointerX;
      this.previousPointerY = this.position.pointerY;
      this.position.pointerX = event.pageX + this.root.getBoundingClientRect().x;
      this.position.pointerY = event.pageY + this.root.getBoundingClientRect().y;
      this.position.distanceX = this.previousPointerX - this.position.pointerX;
      this.position.distanceY = this.previousPointerY - this.position.pointerY;
      this.distance = Math.sqrt(this.position.distanceY ** 2 + this.position.distanceX ** 2);
      
      this.cursor.style.transform = `translate3d(${this.position.pointerX}px, ${this.position.pointerY}px, 0)`;
      
      if (this.distance > 1) {
        this.rotate(this.position);
      } else {
        this.cursor.style.transform += ` rotate(${this.angleDisplace}deg)`;
      }
    }
    
    rotate(position) {
      let unsortedAngle = Math.atan(Math.abs(position.distanceY) / Math.abs(position.distanceX)) * this.degrees;
      let modAngle;
      const style = this.cursor.style;
      this.previousAngle = this.angle;
      
      if (position.distanceX <= 0 && position.distanceY >= 0) {
        this.angle = 90 - unsortedAngle + 0;
      } else if (position.distanceX < 0 && position.distanceY < 0) {
        this.angle = unsortedAngle + 90;
      } else if (position.distanceX >= 0 && position.distanceY <= 0) {
        this.angle = 90 - unsortedAngle + 180;
      } else if (position.distanceX > 0 && position.distanceY > 0) {
        this.angle = unsortedAngle + 270;
      }
      
      if (isNaN(this.angle)) {
        this.angle = this.previousAngle;
      } else {
        if (this.angle - this.previousAngle <= -270) {
          this.angleDisplace += 360 + this.angle - this.previousAngle;
        } else if (this.angle - this.previousAngle >= 270) {
          this.angleDisplace += this.angle - this.previousAngle - 360;
        } else {
          this.angleDisplace += this.angle - this.previousAngle;
        }
      }
      
      style.left = `${-this.cursorSize / 2}px`;
      style.top = `${0}px`;
      style.transform += ` rotate(${this.angleDisplace}deg)`;
    }
    
    hide() {
      this.cursor.style.opacity = 0;
    }
    
    show() {
      this.cursor.style.opacity = 1;
    }
  }

  useEffect(() => {
    // 如果设置为在移动设备上隐藏并且当前是移动设备，则不初始化
    if (hideOnMobile && isMobile()) return;
    
    // 创建光标元素
    const cursorElement = cursorRef.current;
    
    // 初始化光标实例
    cursorInstance.current = new ArrowPointer(cursorElement, {
      size,
      rotationSpeed
    });
    
    // 事件处理函数
    const handleMouseMove = (event) => {
      cursorInstance.current.move(event);
    };
    
    const handleTouchMove = (event) => {
      cursorInstance.current.move(event.touches[0]);
    };
    
    // 检查是否在需要隐藏的元素上悬停
    const handleMouseOver = (e) => {
      if (hideOnHover.length > 0) {
        const shouldHide = hideOnHover.some(selector => 
          e.target.closest(selector)
        );
        
        if (shouldHide) {
          cursorInstance.current.hide();
        } else {
          cursorInstance.current.show();
        }
      }
    };
    
    // 添加事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseover', handleMouseOver);
    
    // 添加全局光标隐藏样式
    document.body.classList.add(styles.globalCursorNone);
    
    // 清理函数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseover', handleMouseOver);
      
      // 移除全局光标隐藏样式
      document.body.classList.remove(styles.globalCursorNone);
      
      // 移除光标元素
      if (cursorRef.current) {
        cursorRef.current.remove();
      }
    };
  }, [size, rotationSpeed, hideOnHover, hideOnMobile]);

  // 在移动设备上隐藏整个组件
  if (hideOnMobile && isMobile()) {
    return null;
  }

  return (
    <div 
      ref={cursorRef} 
      className={styles.cursor}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <path className={styles.inner} d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z" />
        <path className={styles.outer} d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z" />
      </svg>
    </div>
  );
};

export default MouseStyle;