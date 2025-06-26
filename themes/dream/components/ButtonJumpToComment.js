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
    // 兼容性不好
    // const commentElement = document.getElementById('comment')
    // if (commentElement) {
    // commentElement?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  return (
    <div
      className="fas fa-comments text-white text-sm bg-indigo-700 w-10 h-10 rounded-full dark:bg-indigo-600 flex items-center justify-center"
      onClick={navToComment}>
      <i className='cursor-pointer transform hover:scale-105 duration-200' />
    </div>
  )
}

export default ButtonJumpToComment
