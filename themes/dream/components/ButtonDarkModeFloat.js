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
  // 添加切换锁定防止连续点击
const [isSwitching, setIsSwitching] = useState(false)

const handleChangeDarkMode = () => {
  if (isSwitching) return
  
  setIsSwitching(true)
  const newStatus = !isDarkMode
  
  // 添加临时类名阻止过渡
  document.documentElement.classList.add('no-transition')
  
  saveDarkModeToLocalStorage(newStatus)
  updateDarkMode(newStatus)
  
  const htmlElement = document.documentElement
  if (newStatus) {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
  
  // 恢复过渡效果
  setTimeout(() => {
    document.documentElement.classList.remove('no-transition')
    setIsSwitching(false)
  }, 500) // 与CSS过渡时间匹配
}

   return (
        <div className={'justify-center items-center text-center' } onClick={handleChangeDarkMode}>
            <i id="darkModeButton" className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas transform hover:scale-105 duration-200
                 text-white bg-indigo-700  w-10 h-10  py-2.5 rounded-full dark:bg-black cursor-pointer`} />
        </div>
  )
}
