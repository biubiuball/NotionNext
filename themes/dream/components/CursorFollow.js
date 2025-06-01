

/* Vue鼠标轨迹粒子组件实现 */


export default {
  name: 'CursorFollow',
  props: {
    particleSize: {
      type: Number,
      default: 4
    },
    particleLife: {
      type: Number,
      default: 300
    },
    particleSpeed: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      particles: [] // 存储粒子数据
    };
  },
  mounted() {
    // 添加鼠标移动事件监听器
    window.addEventListener('mousemove', this.createParticle);
    
    // 启动动画循环
    this.animationId = requestAnimationFrame(this.updateParticles);
  },
  beforeUnmount() {
    // 清理事件监听器和动画循环
    window.removeEventListener('mousemove', this.createParticle);
    cancelAnimationFrame(this.animationId);
  },
  watch: {
    particleSize(newSize) {
      // 更新现有粒子大小
      const particles = this.$refs.container.querySelectorAll('.particle');
      particles.forEach(particle => {
        particle.style.width = `${newSize}px`;
        particle.style.height = `${newSize}px`;
      });
    }
  },
  methods: {
    createParticle(event) {
      // 创建新粒子
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // 设置粒子样式
      particle.style.width = `${this.particleSize}px`;
      particle.style.height = `${this.particleSize}px`;
      particle.style.background = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;
      
      // 将粒子添加到容器
      this.$refs.container.appendChild(particle);
      
      // 存储粒子数据
      this.particles.push({
        element: particle,
        age: 0,
        vx: (Math.random() - 0.5) * 0.5 * this.particleSpeed,
        vy: (Math.random() - 0.5) * 0.75 * this.particleSpeed,
        x: event.clientX,
        y: event.clientY
      });
    },
    updateParticles() {
      // 更新所有粒子
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        
        // 增加粒子年龄
        p.age++;
        
        // 更新粒子位置
        p.x += p.vx * 2;
        p.y += p.vy * 2;
        
        // 应用新位置
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        
        // 根据年龄设置透明度
        const opacity = 1 - (p.age / this.particleLife);
        p.element.style.opacity = opacity;
        
        // 如果粒子生命周期结束，移除它
        if (p.age >= this.particleLife) {
          p.element.remove();
          this.particles.splice(i, 1);
        }
      }
      
      // 继续动画循环
      this.animationId = requestAnimationFrame(this.updateParticles);
    }
  }
};
</script>

<style scoped>
.cursor-follow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
</style>

