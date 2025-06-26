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
import MenuGroupCard from './MenuGroupCard' // 添加MenuGroupCard导入

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
    postCount,       // 新增props
    categoryOptions, // 新增props
    tagOptions       // 新增props
  } = props

  const { locale } = useGlobal()

  // 文章全屏处理
  if (post && post?.fullWidth) {
    return null
  }

  // 判断是否显示组合卡片
  const showCombinedCard = 
    (siteConfig('HEXO_WIDGET_MENU_GROUP', null, CONFIG) && 
    postCount !== undefined && 
    categoryOptions && 
    tagOptions) || 
    (siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) && 
    latestPosts && 
    latestPosts.length > 0)

  return (
    <div
      id='sideRight'
      className={` lg:w-80 lg:pt-8 ${post ? 'lg:pt-0' : 'lg:pt-4'}`}>
      <div className='sticky top-8 space-y-4'>
        {post && post.toc && post.toc.length > 1 && (
          <Card>
            <Catalog toc={post.toc} />
          </Card>
        )}

        <InfoCard {...props} />
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

        {/* 组合卡片容器 */}
        {showCombinedCard && (
          <Card>
            {/* 菜单组卡片 */}
            {siteConfig('HEXO_WIDGET_MENU_GROUP', null, CONFIG) && 
              postCount !== undefined && 
              categoryOptions && 
              tagOptions && (
              <div className="mb-4">
                <MenuGroupCard 
                  postCount={postCount}
                  categoryOptions={categoryOptions}
                  tagOptions={tagOptions}
                />
              </div>
            )}

            {/* 最新文章组 */}
            {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) &&
              latestPosts &&
              latestPosts.length > 0 && (
              <LatestPostsGroup {...props} />
            )}
          </Card>
        )}

        <Announcement post={notice} />

        {siteConfig('COMMENT_WALINE_SERVER_URL') &&
          siteConfig('COMMENT_WALINE_RECENT') && <HexoRecentComments />}

        {rightAreaSlot}
        <FaceBookPage />
        <Live2D />
      </div>
    </div>
  )
}
