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
      
      // 确保背景元素存在
      if (!document.querySelector('.light-bg')) {
        const lightBg = document.createElement('div')
        lightBg.className = 'light-bg fixed inset-0 bg-cover bg-center z-[-2]'
        lightBg.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/biubiuball/BlogImage/jpg/lightspot.jpeg')"
        document.body.appendChild(lightBg)
      }
      
      if (!document.querySelector('.dark-bg')) {
        const darkBg = document.createElement('div')
        darkBg.className = 'dark-bg fixed inset-0 bg-cover bg-center z-[-3]'
        darkBg.style.backgroundImage = "url('https://cdn.jsdelivr.net/gh/biubiuball/BlogImage/jpg/nightcity.jpg')"
        document.body.appendChild(darkBg)
      }
    }
    
    // 初始设置背景层
    const lightBg = document.querySelector('.light-bg')
    const darkBg = document.querySelector('.dark-bg')
    if (lightBg && darkBg) {
      lightBg.style.zIndex = isDarkMode ? '-2' : '-1'
      darkBg.style.zIndex = isDarkMode ? '-1' : '-2'
    }
  }

  if (!siteConfig('HEXO_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    
    const htmlElement = document.documentElement
    htmlElement.classList.toggle('dark', newStatus)
    htmlElement.classList.toggle('light', !newStatus)
    
    // 直接更新背景层z-index
    const lightBg = document.querySelector('.light-bg')
    const darkBg = document.querySelector('.dark-bg')
    if (lightBg && darkBg) {
      lightBg.style.zIndex = newStatus ? '-2' : '-1'
      darkBg.style.zIndex = newStatus ? '-1' : '-2'
    }
  }

  return (
    <div className={'justify-center items-center text-center'} onClick={handleChangeDarkMode}>
      <i id="darkModeButton" className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas transform hover:scale-105 duration-200
           text-white bg-indigo-700 w-10 h-10 py-2.5 rounded-full dark:bg-black cursor-pointer`} />
    </div>
  )
}
