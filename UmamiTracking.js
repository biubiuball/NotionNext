const UmamiTracking = () => {
  useEffect(() => {
    // 确保只在生产环境加载
    if (process.env.NODE_ENV !== 'production') {
      console.log('Umami tracking disabled in development mode');
      return;
    }

    // 检查是否已存在脚本避免重复加载
    if (document.querySelector('script[data-website-id="e334a3a2-dd62-4673-8012-352968dd10c8"]')) {
      return;
    }

    // 创建并配置脚本
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://um.biubiuball.ddns-ip.net/script.js';
    script.setAttribute('data-website-id', 'e334a3a2-dd62-4673-8012-352968dd10c8');
    
    // 添加跨域属性增强安全性
    script.crossOrigin = 'anonymous';
    
    // 添加到文档头部
    document.head.appendChild(script);
    
    // 加载完成后的回调
    script.onload = () => {
      console.log('Umami tracking initialized');
    };
    
    // 错误处理
    script.onerror = () => {
      console.error('Failed to load Umami tracking script');
    };
  }, []);

  return null; // 该组件不渲染任何内容
};
