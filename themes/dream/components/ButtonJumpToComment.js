import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 跳转到评论区
 * @returns {JSX.Element}
 * @constructor
 */
const ButtonJumpToComment = () => {
  if (!siteConfig('HEXO_WIDGET_TO_COMMENT', null, CONFIG)) {
    return <></>
  }

  function navToComment() {
    if (document.getElementById('comment')) {
      window.scrollTo({
        top: document.getElementById('comment').offsetTop,
        behavior: 'smooth'
      })
    }
  }

  return (
  <div 
    className="flex justify-center items-center text-center" 
    onClick={navToComment}
  >
    <i 
      id="commentButton" 
      className={`fas fa-comments transform hover:scale-105 duration-200 text-white text-sm bg-indigo-700 w-10 h-10 rounded-full dark:bg-black cursor-pointer flex items-center justify-center`} // 添加了 flex 布局类
    />
  </div>
);
}

export default ButtonJumpToComment
