import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 跳转到评论区
 * @returns {JSX.Element}
 * @constructor
 */
const ButtonJumpToComment = () => {
  if (!siteConfig('HEXO_WIDGET_TO_COMMENT', null, CONFIG)) {
    return null;
  }

  function navToComment() {
    const commentElement = document.getElementById('comment');
    if (commentElement) {
      const targetPosition = commentElement.offsetTop - headerHeight;
      window.scrollTo({ 
        top: targetPosition, 
        behavior: 'smooth' 
      });
    }
  }

  return (
    <div 
      onClick={navToComment}
      className="cursor-pointer transform hover:scale-105 duration-200"
    >
      <i 
        id="CommentButton"
        className="fas fa-comments text-white text-sm bg-indigo-700 w-10 h-10 rounded-full dark:bg-indigo-600 flex items-center justify-center" 
      />
    </div>
  );
}

export default ButtonJumpToComment
