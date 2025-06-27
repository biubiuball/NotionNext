// SidebarCardContainer.js
import { siteConfig } from '@/lib/config'
import LatestPostsGroup from './LatestPostsGroup'
import MenuGroupCard from './MenuGroupCard'

const SidebarCardContainer = (props) => {
  const { latestPosts, siteInfo, postCount, categoryOptions, tagOptions } = props

  return (
    <div className='dark:bg-gray-800 bg-white rounded-xl shadow-lg overflow-hidden'>
      {/* 菜单卡片部分 */}
      <div className='p-4 border-b dark:border-gray-700'>
        <MenuGroupCard 
          postCount={postCount} 
          categoryOptions={categoryOptions} 
          tagOptions={tagOptions} 
        />
      </div>
      
      {/* 最新文章部分 */}
      <div className='p-4'>
        <LatestPostsGroup 
          latestPosts={latestPosts} 
          siteInfo={siteInfo} 
        />
      </div>
    </div>
  )
}

export default SidebarCardContainer