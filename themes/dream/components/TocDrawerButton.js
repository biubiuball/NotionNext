import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { siteConfig } from '@/lib/config'

/**
 * 点击召唤目录抽屉
 * 当屏幕下滑500像素后会出现该控件
 * @param props 父组件传入props
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawerButton = (props) => {
  const { locale } = useGlobal()
  if (!siteConfig('HEXO_WIDGET_TOC', null, CONFIG)) {
    return <></>
  }
  return (
    <div 
      onClick={props.onClick} 
      className="text-white w-10 h-10 flex items-center justify-center rounded-full transform hover:scale-105 duration-200
         bg-indigo-700 dark:bg-black cursor-pointer"
      title={locale.POST.TOP}>
      <i className='fas fa-list-ol text-sm'/>
    </div>
        )
}

export default TocDrawerButton
