import ButtonJumpToTop from './ButtonJumpToTop'
import ButtonDarkModeFloat from './ButtonDarkModeFloat'

/**
 * 右下角悬浮按钮
 * @param {*} props
 * @returns
 */
export default function RightFloatArea(props) {
  const { floatSlot } = props
  return (
    <div className="bottom-40 right-2 fixed flex flex-col items-end space-y-2 z-20">
      <ButtonDarkModeFloat />
      <ButtonJumpToTop />
      
      {/* 可扩展的右下角悬浮 */}
      {floatSlot}
    </div>
  )
}
