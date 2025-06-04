/* eslint-disable */

/**
 * 创建樱花雨
 * @param config
 */
const idSakura = 'canvas_sakura'
let img = null; // 提升为全局变量
let stop = null; // 控制动画循环
let staticx = false; // 樱花雨状态标志
let sakuraCanvas = null; // 保存canvas元素

function createSakura() {
  // 检查是否有light类名
  if (document.documentElement.classList.contains('light')) {
    // 只有light模式才创建樱花雨
    initSakura();
  }
}

function initSakura() {
  // 如果已存在樱花雨，先销毁
  destroySakura();
  
  img = new Image();
  img.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUgAAAEwCAYAAADVZeifAAAACXBIWXMAAACYAAAAmAGiyIKYAAAHG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDFDMjQxQjYyNjIwNjgxMTgwODNEMjE2MDAzOTU1NDQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozNDVjOWViOC04NDc4LTFkNDctOGRjMi0yZDkyOGNhYTYxZWQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YjAzN2ZiMGItNTU5Mi0xYjRkLWJjZGQtOWU4NGExMDJiMGM2IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA1LTA5VDE0OjQ5OjM3KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wNS0wOVQxNDo1MToyNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNS0wOVQxNDo1MToyNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjEyMjVlZWE3LTEyY2QtMTY0NC04ZDAzLWFjOTE2ZTAxZDQ1YyIgc3RSZWY6ZG9jdW1lbnRJRD0idXVpZDoxRDIwNUFGNjZCRDlFNTExOUM5REMwMzg2RjlEQjFGNyIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYmMzNjIzMy1hOWNkLWNiNDQtODViYi0zZTgyMjEwYmIxMjYiIHN0RXZ0OndoZW49IjIwMTgtMDUtMDlUMTQ6NTE6MjUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjAzN2ZiMGItNTU5Mi0xYjRkLWJjZGQtOWU4NGExMDJiMGM2IiBzdEV2dDp3aGVuPSIyMDE4LTA1LTA5VDE0OjUxOjI1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2Vx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'
  
  // 樱花对象定义
  function Sakura(x, y, s, r, fn) {
    this.x = x
    this.y = y
    this.s = s
    this.r = r
    this.fn = fn
  }
  Sakura.prototype.draw = function (cxt) {
    cxt.save()
    var xc = (5 * this.s) / 5
    cxt.translate(this.x, this.y)
    cxt.rotate(this.r)
    cxt.drawImage(img, 0, 0, 25 * this.s, 30 * this.s)
    cxt.restore()
  }
  Sakura.prototype.update = function () {
    this.x = this.fn.x(this.x, this.y)
    this.y = this.fn.y(this.y, this.y)
    this.r = this.fn.r(this.r)
    if (
      this.x > window.innerWidth ||
      this.x < 0 ||
      this.y > window.innerHeight ||
      this.y < 0
    ) {
      this.r = getRandom('fnr')
      if (Math.random() > 0.4) {
        this.x = getRandom('x')
        this.y = 0
        this.s = getRandom('s')
        this.r = getRandom('r')
      } else {
        this.x = window.innerWidth
        this.y = getRandom('y')
        this.s = getRandom('s')
        this.r = getRandom('r')
      }
    }
  }
  
  let SakuraList = function () {
    this.list = []
  }
  SakuraList.prototype.push = function (sakura) {
    this.list.push(sakura)
  }
  SakuraList.prototype.update = function () {
    for (var i = 0, len = this.list.length; i < len; i++) {
      this.list[i].update()
    }
  }
  SakuraList.prototype.draw = function (cxt) {
    for (var i = 0, len = this.list.length; i < len; i++) {
      this.list[i].draw(cxt)
    }
  }
  SakuraList.prototype.get = function (i) {
    return this.list[i]
  }
  SakuraList.prototype.size = function () {
    return this.list.length
  }
  
  function getRandom(option) {
    var ret, random
    switch (option) {
      case 'x':
        ret = Math.random() * window.innerWidth
        break
      case 'y':
        ret = Math.random() * window.innerHeight
        break
      case 's':
        ret = Math.random()
        break
      case 'r':
        ret = Math.random() * 6
        break
      case 'fnx':
        random = -0.5 + Math.random() * 1
        ret = function (x, y) {
          return x + 0.5 * random - 1.7
        }
        break
      case 'fny':
        random = 1.5 + Math.random() * 0.7
        ret = function (x, y) {
          return y + random
        }
        break
      case 'fnr':
        random = Math.random() * 0.03
        ret = function (r) {
          return r + random
        }
        break
    }
    return ret
  }
  
  // 图片加载完成后开始樱花雨
  img.onload = function () {
    startSakura()
  }
  
  function startSakura() {
    requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame
      
    sakuraCanvas = document.createElement('canvas')
    var cxt
    staticx = true
    sakuraCanvas.height = window.innerHeight
    sakuraCanvas.width = window.innerWidth
    sakuraCanvas.setAttribute(
      'style',
      'position: fixed;left: 0;top: 0;pointer-events: none;'
    )
    sakuraCanvas.setAttribute('id', idSakura)
    document.getElementsByTagName('body')[0].appendChild(sakuraCanvas)
    cxt = sakuraCanvas.getContext('2d')
    var sakuraList = new SakuraList()
    for (var i = 0; i < 50; i++) {
      var sakura,
        randomX,
        randomY,
        randomS,
        randomR,
        randomFnx,
        randomFny,
        randomFnR
      randomX = getRandom('x')
      randomY = getRandom('y')
      randomR = getRandom('r')
      randomS = getRandom('s')
      randomFnx = getRandom('fnx')
      randomFny = getRandom('fny')
      randomFnR = getRandom('fnr')
      sakura = new Sakura(randomX, randomY, randomS, randomR, {
        x: randomFnx,
        y: randomFny,
        r: randomFnR
      })
      sakura.draw(cxt)
      sakuraList.push(sakura)
    }
    stop = requestAnimationFrame(asd)
    function asd() {
      cxt.clearRect(0, 0, sakuraCanvas.width, sakuraCanvas.height)
      sakuraList.update()
      sakuraList.draw(cxt)
      stop = requestAnimationFrame(asd)
    }
  }
  
  // 添加暗色模式检测
  function checkThemeAndRedraw() {
    if (document.documentElement.classList.contains('light')) {
      // 只有light模式才显示樱花
      if (!staticx) {
        createSakura();
      }
    } else {
      // 暗色模式销毁樱花
      destroySakura();
    }
  }
  
  // 初始检测
  checkThemeAndRedraw();
  
  // 监听类名变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        checkThemeAndRedraw();
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// 销毁樱花雨
function destroySakura() {
  if (staticx) {
    if (sakuraCanvas && sakuraCanvas.parentNode) {
      sakuraCanvas.parentNode.removeChild(sakuraCanvas);
    }
    if (stop) {
      window.cancelAnimationFrame(stop);
    }
    staticx = false;
    sakuraCanvas = null;
    stop = null;
  }
}

window.createSakura = createSakura
window.destroySakura = destroySakura