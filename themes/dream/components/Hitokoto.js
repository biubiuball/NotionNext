import { useState, useEffect } from 'react';

const Hitokoto = () => {
  const [quote, setQuote] = useState({ content: '', from: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 获取一言数据
  const fetchHitokoto = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await fetch('https://v1.hitokoto.cn');
      const data = await response.json();
      
      setQuote({
        content: data.hitokoto,
        from: data.from || '未知'
      });
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
        <div className="hitokoto-loading">加载智慧箴言中...</div>
      ) : error ? (
        <div className="hitokoto-error">
          <div className="quote-text">{quote.content}</div>
        </div>
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
