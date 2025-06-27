import Catalog from './Catalog'
import { useImperativeHandle, useState } from 'react'

/**
 * 目录抽屉栏
 * @param toc
 * @param post
 * @returns {JSX.Element}
 * @constructor
 */
const TocDrawer = ({ post, cRef }) => {
  // 暴露给父组件 通过cRef.current.handleMenuClick 调用
  useImperativeHandle(cRef, () => {
    return {
      handleSwitchVisible: () => switchVisible()
    }
  })
  const [showDrawer, switchShowDrawer] = useState(false)
  const switchVisible = () => {
    switchShowDrawer(!showDrawer)
  }
  return <>
    {/* 添加 hidden lg:block 控制小屏幕隐藏 */}
    <div className='fixed top-0 right-0 z-40 hidden lg:block'>
      {/* 悬浮目录 */}
      <div
        className={(showDrawer ? 'animate__slideInRight ' : ' -mr-72 animate__slideOutRight') +

          }
      </div>
    </div>
    {/* 背景蒙版 - 添加响应式隐藏 */}
    <div id='right-drawer-background' 
         className={(showDrawer ? 'lg:block' : 'lg:hidden') + ' fixed top-0 left-0 z-30 w-full h-full hidden'} Add comment更多操作
         onClick={switchVisible} />
  </>
}
export default TocDrawer
