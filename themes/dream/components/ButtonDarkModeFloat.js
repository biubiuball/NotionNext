import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'

/**
 * 深色模式按钮
 */
export default function ButtonDarkModeFloat() {
  const { isDarkMode, updateDarkMode } = useGlobal()

  if (!siteConfig('HEXO_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
    
    // 添加背景图片切换功能
    const lightBg = document.querySelector('.light-bg')
    const darkBg = document.querySelector('.dark-bg')
    
    if (lightBg && darkBg) {
      if (newStatus) {
        lightBg.style.opacity = '0'
        darkBg.style.opacity = '0.85'
        lightBg.style.zIndex = '-2'
        darkBg.style.zIndex = '-1'
      } else {
        lightBg.style.opacity = '0.85'
        darkBg.style.opacity = '0'
        lightBg.style.zIndex = '-1'
        darkBg.style.zIndex = '-2'
      }
    }
  }

  return (
    <div
      onClick={handleChangeDarkMode}
      className={
        'justify-center items-center  text-center'
      }>
      <i
        id='darkModeButton'
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas transform hover:scale-105 duration-200
           text-white bg-indigo-700 w-10 h-10 py-2.5 rounded-full dark:bg-black cursor-pointer`}
      />
    </div>
  )
}
