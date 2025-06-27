import { useState, useEffect } from 'react';

const Hitokoto = () => {
  const [quote, setQuote] = useState({ content: '', from: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // 过滤过长句子
  const isShortEnough = (text) => {
    return text.length <= 18;
  };

  // 获取一言数据
  const fetchHitokoto = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await fetch('https://v1.hitokoto.cn/?c=e&c=h&c=j');
      const data = await response.json();
      
      // 检查句子长度
      if (isShortEnough(data.hitokoto)) {
        setQuote({
          content: data.hitokoto,
          from: data.from || '未知'
        });
        setRetryCount(0);
      } else {
        // 如果句子太长且重试次数少于3次
        if (retryCount < 3) {
          setRetryCount(count => count + 1);
          setTimeout(fetchHitokoto, 500); // 0.5秒后重试
        } else {
          // 超过重试次数，显示默认句子
          setQuote({
            content: '智慧源于简洁',
            from: '古谚'
          });
          setRetryCount(0);
        }
      }
    } catch (err) {
      console.error('获取一言失败:', err);
      setError(true);
      setQuote({
        content: '获取内容失败，请稍后刷新',
        from: '系统提示'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHitokoto();
  }, []);

  return (
    <div className="hitokoto-container">
      {loading ? (
        <div className="hitokoto-loading">加载中...</div>
      ) : error ? (
        <div className="hitokoto-error">{quote.content}</div>
      ) : (
        <div className="hitokoto-content">
          <div className="quote-text">{quote.content}</div>
          <div className="quote-author">——{quote.from}</div>
        </div>
      )}
    </div>
  );
};

export default Hitokoto;
