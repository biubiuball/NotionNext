import React, { useState, useEffect } from 'react'

const Hitokoto = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://v1.hitokoto.cn')
        const data = await response.json()
        setContent(data.hitokoto)
        setError(false)
      } catch (err) {
        console.error('获取一言失败:', err)
        setError(true)
        setContent('获取内容失败，请稍后刷新页面')
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [])

  // 返回纯文本内容，无额外包装元素
  if (loading) {
    return <span className="text-gray-500">加载中...</span>
  }

  if (error) {
    return <span className="text-red-500">{content}</span>
  }

  return <>{content}</>
}

export default Hitokoto