/* eslint-disable react/no-unknown-property */
/**
 * 这里的css样式只对当前主题生效
 * 主题客制化css
 * @returns
 */
const Style = () => {
  return (<style jsx global>{`
    /* 确保body没有背景色 */
    body {
      background-color: transparent !important;
    }
    .dark body {
      background-color: transparent !important;
    }
    
    /* 修复z-index层级 */
    #theme-hexo {
      position: relative;
      z-index: 0;
    }
    
    /*  菜单下划线动画 */
    #theme-hexo .menu-link {
        text-decoration: none;
        background-image: linear-gradient(#928CEE, #928CEE);
        background-repeat: no-repeat;
        background-position: bottom center;
        background-size: 0 2px;
        transition: background-size 100ms ease-in-out;
    }
    
    #theme-hexo .menu-link:hover {
        background-size: 100% 2px;
        color: #928CEE;
    }

    /* 设置了从上到下的渐变黑色 */
    #theme-hexo .header-cover::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:  linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.5) 100%);
    }

    /* Custem */
    .tk-footer{
        opacity: 0;
    }

    // 选中字体颜色
    ::selection {
        background: rgba(45, 170, 219, 0.3);
    }

    // 自定义滚动条
    ::-webkit-scrollbar {
        width: 5px;
        height: 5px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* 滚动条颜色适配日夜模式 */
    ::-webkit-scrollbar-thumb {
        background-color: #49b1f5;
    }
    
    .dark ::-webkit-scrollbar-thumb {
        background-color: #6b7280;
    }

    * {
        scrollbar-width: thin;
        scrollbar-color: #49b1f5 transparent;
    }
    
    .dark * {
        scrollbar-color: #6b7280 transparent;
    }

    
    .hitokoto-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 
               Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 100%;
  padding: 8px 0;
  position: relative;
}

/* 亮色模式样式 */
.hitokoto-content {
  display: flex;
  flex-direction: column;
}

.quote-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 4px;
  text-align: center;
  transition: all 0.3s ease;
  padding: 0 10px;
}

.quote-author {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
  font-style: italic;
  padding-right: 15px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.hitokoto-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: #666;
  text-align: center;
  padding: 10px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(79, 192, 210, 0.2);
  border-top: 3px solid #4fc0d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.hitokoto-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #d32f2f;
  text-align: center;
  padding: 10px;
}

.error-icon {
  font-size: 1.5rem;
}

/* 暗色模式样式 */
@media (prefers-color-scheme: dark) {
  .quote-text {
    color: #e2e8f0;
  }
  
  .quote-author {
    color: #a0aec0;
  }
  
  .hitokoto-loading {
    color: #a0aec0;
  }
  
  .spinner {
    border: 3px solid rgba(160, 174, 192, 0.2);
    border-top: 3px solid #63b3ed;
  }
  
  .hitokoto-error {
    color: #fc8181;
  }
}

/* 深色模式悬停效果 */
.hitokoto-content:hover .quote-text {
  color: #4fc0d2;
}

.hitokoto-content:hover .quote-author {
  color: #63b3ed;
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quote-text {
    font-size: 1rem;
  }
  
  .quote-author {
    font-size: 0.85rem;
  }
}

  `}</style>)
}

export { Style }
