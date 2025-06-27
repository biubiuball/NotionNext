import Live2D from '@/components/Live2D'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import CONFIG from '../config'
import { AnalyticsCard } from './AnalyticsCard'
import Announcement from './Announcement'
import Card from './Card'
import Catalog from './Catalog'
import CategoryGroup from './CategoryGroup'
import { InfoCard } from './InfoCard'
import LatestPostsGroup from './LatestPostsGroup'
import TagGroups from './TagGroups'
import MenuGroupCard from './MenuGroupCard'
import SidebarCardContainer from './SidebarCardContainer' // 引入整合容器组件

const HexoRecentComments = dynamic(() => import('./HexoRecentComments'))
const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * Hexo主题右侧栏
 * @param {*} props
 * @returns
 */
export default function SideRight(props) {
  const {
    post,
    currentCategory,
    categories,
    latestPosts,
    tags,
    currentTag,
    showCategory,
    showTag,
    rightAreaSlot,
    notice,
    className,
    postCount, // 新增：文章总数
    categoryOptions, // 新增：分类选项
    tagOptions, // 新增：标签选项
    siteInfo // 新增：站点信息
  } = props

  const { locale } = useGlobal()

  // 文章全屏处理
  if (post && post?.fullWidth) {
    return null
  }

  return (
    <div
      id='sideRight'
      className={` lg:w-80 lg:pt-8 ${post ? 'lg:pt-0' : 'lg:pt-4'}`}>
      <div className='sticky top-8 space-y-4'>
        {post && post.toc && post.toc.length > 1 && (
          <div className='hidden lg:block'>
            <Card>
              <Catalog toc={post.toc} />
            </Card>
          </div>
        )}

        <InfoCard {...props} />
        
        {/* 添加整合的卡片容器 */}
        <Card>
            <SidebarCardContainer 
             latestPosts={latestPosts}
             siteInfo={siteInfo}
             postCount={postCount}
             categoryOptions={categoryOptions}
             tagOptions={tagOptions} />
       </Card>
        
        {siteConfig('HEXO_WIDGET_ANALYTICS', null, CONFIG) && (
          <AnalyticsCard {...props} />
        )}

        {showCategory && (
          <Card>
            <div className='ml-2 mb-1 '>
              <i className='fas fa-th' /> {locale.COMMON.CATEGORY}
            </div>
            <CategoryGroup
              currentCategory={currentCategory}
              categories={categories}
            />
          </Card>
        )}
        {showTag && (
          <Card>
            <TagGroups tags={tags} currentTag={currentTag} />
          </Card>
        )}
        
        
        <Announcement post={notice} />

        {siteConfig('COMMENT_WALINE_SERVER_URL') &&
          siteConfig('COMMENT_WALINE_RECENT') && <HexoRecentComments />}

        {rightAreaSlot}
        
      </div>
    </div>
  )
}
