import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'
import { useEffect } from 'react' // 

/**
 * 深色模式按钮
 */
export default function ButtonDarkModeFloat() {
  const { isDarkMode, updateDarkMode } = useGlobal()

  // 预加载背景图片
  useEffect(() => {
    const preloadImages = () => {
      const lightImg = new Image()
      lightImg.src = 'https://cdn.jsdelivr.net/gh/biubiuball/BlogImage/jpg/lightspot.jpeg'
      
      const darkImg = new Image()
      darkImg.src = 'https://cdn.jsdelivr.net/gh/biubiuball/BlogImage/jpg/nightcity.jpg'
    }
    
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      preloadImages()
    }
  }, [])

  if (!siteConfig('HEXO_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    
    const htmlElement = document.documentElement
    // 添加临时类阻止过渡效果
    htmlElement.classList.add('no-transition')
    
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')

    // 强制重绘
    void htmlElement.offsetHeight
    
    // 移除临时类恢复过渡
    htmlElement.classList.remove('no-transition')
  }

  return (
    <div className={'justify-center items-center text-center'} onClick={handleChangeDarkMode}>
      <i id="darkModeButton" className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas transform hover:scale-105 duration-200
           text-white bg-indigo-700 w-10 h-10 py-2.5 rounded-full dark:bg-black cursor-pointer`} />
    </div>
  )
}
