/* eslint-disable */
/**
 * 创建星空雨
 * @param config
 */
let starrySkyCanvas = null; // 保存canvas元素
let starrySkyAnimationFrame = null; // 控制动画循环
let starrySkyDiv = null; // 保存div元素
let starrySkyContext = null; // 保存canvas上下文

function renderStarrySky() {
  // 检查是否有dark类名
  if (document.documentElement.classList.contains('dark')) {
    // 只有dark模式才创建星空雨
    initStarrySky();
  }
}

function initStarrySky() {
  // 如果已存在星空雨，先销毁
  destroyStarrySky();
  
  // 创建容器和画布
  starrySkyDiv = document.createElement('div');
  starrySkyDiv.className = 'relative';
  
  starrySkyCanvas = document.createElement('canvas');
  starrySkyCanvas.id = 'starry-sky-vixcity';
  starrySkyCanvas.style.zIndex = 5;
  starrySkyCanvas.className = 'top-0 fixed pointer-events-none';
  
  starrySkyDiv.appendChild(starrySkyCanvas);
  document.body.appendChild(starrySkyDiv);

  // 设置动画兼容性
  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  
  // 星空雨变量
  var n, e, i, h, t = 0.05,
    s = starrySkyCanvas,
    o = !0,
    a = '180,184,240',
    r = '226,225,142',
    d = '226,225,224',
    c = [];
  
  // 调整画布大小函数
  function f() {
    n = window.innerWidth;
    e = window.innerHeight;
    i = 0.216 * n;
    s.setAttribute('width', n);
    s.setAttribute('height', e);
  }
  
  // 绘制函数
  function u() {
    h.clearRect(0, 0, n, e);
    for (var t = c.length, i = 0; i < t; i++) {
      var s = c[i];
      s.move(), s.fadeIn(), s.fadeOut(), s.draw();
    }
  }
  
  // 星星对象
  function y() {
    this.reset = function() {
      this.giant = m(3),
        this.comet = !this.giant && !o && m(10),
        this.x = l(0, n - 10),
        this.y = l(0, e),
        this.r = l(1.1, 2.6),
        this.dx = l(t, 6 * t) + (this.comet + 1 - 1) * t * l(50, 120) + 2 * t,
        this.dy = -l(t, 6 * t) - (this.comet + 1 - 1) * t * l(50, 120),
        this.fadingOut = null,
        this.fadingIn = !0,
        this.opacity = 0,
        this.opacityTresh = l(0.2, 1 - 0.4 * (this.comet + 1 - 1)),
        this.do = l(5e-4, 0.002) + 0.001 * (this.comet + 1 - 1);
    },
    this.fadeIn = function() {
      this.fadingIn && ((this.fadingIn = !(this.opacity > this.opacityTresh)),
        (this.opacity += this.do));
    },
    this.fadeOut = function() {
      this.fadingOut && ((this.fadingOut = !(this.opacity < 0)),
        (this.opacity -= this.do / 2),
        (this.x > n || this.y < 0) && ((this.fadingOut = !1), this.reset()));
    },
    this.draw = function() {
      if (h.beginPath(), this.giant)
        (h.fillStyle = 'rgba(' + a + ',' + this.opacity + ')'),
          h.arc(this.x, this.y, 2, 0, 2 * Math.PI, !1);
      else if (this.comet) {
        (h.fillStyle = 'rgba(' + d + ',' + this.opacity + ')'),
          h.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1);
        for (var t = 0; t < 30; t++)
          (h.fillStyle =
            'rgba(' +
            d +
            ',' +
            (this.opacity - (this.opacity / 20) * t) +
            ')'),
            h.rect(
              this.x - (this.dx / 4) * t,
              this.y - (this.dy / 4) * t - 2,
              2,
              2
            ),
            h.fill();
      } else
        (h.fillStyle = 'rgba(' + r + ',' + this.opacity + ')'),
          h.rect(this.x, this.y, this.r, this.r);
      h.closePath(), h.fill();
    },
    this.move = function() {
      (this.x += this.dx),
        (this.y += this.dy),
        !1 === this.fadingOut && this.reset(),
        (this.x > n - n / 4 || this.y < 0) && (this.fadingOut = !0);
    },
    setTimeout(function() {
      o = !1;
    }, 50);
  }
  
  // 辅助函数
  function m(t) {
    return Math.floor(1e3 * Math.random()) + 1 < 10 * t;
  }
  
  function l(t, i) {
    return Math.random() * (i - t) + t;
  }
  
  // 初始化
  f();
  window.addEventListener('resize', f, !1);
  
  (function() {
    h = s.getContext('2d');
    for (var t = 0; t < i; t++) (c[t] = new y()), c[t].reset();
    u();
  })();
  
  // 动画循环
  function animate() {
    u();
    starrySkyAnimationFrame = requestAnimationFrame(animate);
  }
  
  // 启动动画
  starrySkyAnimationFrame = requestAnimationFrame(animate);
}

// 添加暗色模式检测
function checkThemeAndRenderStarrySky() {
  if (document.documentElement.classList.contains('dark')) {
    // 只有dark模式才显示星空
    if (!starrySkyCanvas) {
      renderStarrySky();
    }
  } else {
    // 非暗色模式销毁星空
    destroyStarrySky();
  }
}

// 销毁星空雨
function destroyStarrySky() {
  if (starrySkyAnimationFrame) {
    window.cancelAnimationFrame(starrySkyAnimationFrame);
    starrySkyAnimationFrame = null;
  }
  
  if (starrySkyDiv && starrySkyDiv.parentNode) {
    starrySkyDiv.parentNode.removeChild(starrySkyDiv);
  }
  
  starrySkyCanvas = null;
  starrySkyContext = null;
  starrySkyDiv = null;
}

// 初始检测
checkThemeAndRenderStarrySky();

// 监听类名变化
const starrySkyObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.attributeName === 'class') {
      checkThemeAndRenderStarrySky();
    }
  });
});

starrySkyObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
});

// 暴露公共接口
window.renderStarrySky = renderStarrySky;
window.destroyStarrySky = destroyStarrySky;