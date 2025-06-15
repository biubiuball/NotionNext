import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'
import { useEffect } from 'react'

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
    
    // 确保只有一个背景层处于活动状态
    const lightBg = document.querySelector('.light-bg')
    const darkBg = document.querySelector('.dark-bg')
    
    if (newStatus) {
      // 切换到深色模式
      htmlElement.classList.add('dark')
      htmlElement.classList.remove('light')
      
      // 确保深色背景在浅色背景之上
      if (lightBg && darkBg) {
        lightBg.style.zIndex = '-1';
        darkBg.style.zIndex = '-1';
      }
    } else {
      // 切换到浅色模式
      htmlElement.classList.add('light')
      htmlElement.classList.remove('dark')
      
      // 确保浅色背景在深色背景之上
      if (lightBg && darkBg) {
        lightBg.style.zIndex = '-1';
        darkBg.style.zIndex = '-2';
      }
    }
  }

  return (
    <div className={'justify-center items-center text-center'} onClick={handleChangeDarkMode}>
      <i id="darkModeButton" className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas transform hover:scale-105 duration-200
           text-white bg-indigo-700 w-10 h-10 py-2.5 rounded-full dark:bg-black cursor-pointer`} />
    </div>
  )
}
