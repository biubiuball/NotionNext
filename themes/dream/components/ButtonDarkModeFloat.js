import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'
import CONFIG from './config'
import { useEffect } from 'react'

/**
 * 深色模式按钮
 */
export default function ButtonDarkModeFloat() {
  const { isDarkMode, updateDarkMode } = useGlobal()

  // 预加载背景图片
  useEffect(() => {
    const preloadImages = () => {
      const lightImg = new Image();
      lightImg.src = CONFIG.BACKGROUND_IMAGES.light;
      const darkImg = new Image();
      darkImg.src = CONFIG.BACKGROUND_IMAGES.dark;
    };

    if (typeof window !== 'undefined' && !window.__imagesPreloaded) {
      preloadImages();
      window.__imagesPreloaded = true; // Prevent multiple preloads
    }
  }, []);

  // Handle DOM changes when isDarkMode updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const htmlElement = document.documentElement;
    const lightBg = document.querySelector('.light-bg');
    const darkBg = document.querySelector('.dark-bg');

    if (!lightBg || !darkBg) {
      console.warn('Background elements (.light-bg or .dark-bg) not found');
      return;
    }

    if (isDarkMode) {
      // 切换到深色模式
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
      lightBg.style.zIndex = '-1';
      darkBg.style.zIndex = '-1';
    } else {
      // 切换到浅色模式
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
      lightBg.style.zIndex = '-1';
      darkBg.style.zIndex = '-2';
    }
  }, [isDarkMode]);

  if (!siteConfig('HEXO_WIDGET_DARK_MODE', null, CONFIG)) {
    return <></>;
  }

  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode;
    saveDarkModeToLocalStorage(newStatus);
    updateDarkMode(newStatus);
  };

  return (
    <div className={'justify-center items-center text-center'} onClick={handleChangeDarkMode}>
      <i
        id="darkModeButton"
        className={`${isDarkMode ? 'fa-sun' : 'fa-moon'} fas transform hover:scale-105 duration-200
           text-white bg-indigo-700 w-10 h-10 py-2.5 rounded-full dark:bg-black cursor-pointer`}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      />
    </div>
  );
}
