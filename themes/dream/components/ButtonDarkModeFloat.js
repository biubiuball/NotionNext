import { useState } from 'react'; // 添加这行导入
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from '../config'

/**
 * 深色模式按钮
 */
export default function ButtonDarkModeFloat() {
  const { isDarkMode, updateDarkMode } = useGlobal()
  const [isSwitching, setIsSwitching] = useState(false); // 添加状态变量

  if (!siteConfig('HEXO_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>
  }

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    if (isSwitching) return;
    
    setIsSwitching(true);
    const newStatus = !isDarkMode;
    
    // 添加临时类名阻止过渡
    const htmlElement = document.documentElement;
    htmlElement.classList.add('theme-no-transition');
    
    saveDarkModeToLocalStorage(newStatus);
    updateDarkMode(newStatus);
    
    if (newStatus) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // 恢复过渡效果
    setTimeout(() => {
      htmlElement.classList.remove('theme-no-transition');
      setIsSwitching(false);
    }, 500); // 与CSS过渡时间匹配
  };

  return (
    <div
      onClick={handleChangeDarkMode}
      className={
        'justify-center items-center w-7 h-7 text-center transform hover:scale-105 duration-200'
      }>
      <i
        id='darkModeButton'
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas text-xs`}
      />
    </div>
  )
}
