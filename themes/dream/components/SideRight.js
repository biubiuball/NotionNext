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
import MenuGroupCard from './MenuGroupCard'
import TagGroups from './TagGroups'

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
    postCount,
    categoryOptions,
    tagOptions,
    siteInfo
  } = props

  const { locale } = useGlobal()

  if (post && post?.fullWidth) {
    return null
  }

  return (
    <div
      id='sideRight'
      className={`lg:w-80 lg:pt-8 ${post ? 'lg:pt-0' : 'lg:pt-4'}`}>
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
            <div className='ml-2 mb-1'>
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

        {/* 组合卡片 - 添加统一标题 */}
        <Card className="py-1">
          {/* 站点导航标题 */}
          <div className='mb-1 px-1'>
            <div className='flex items-center text-sm font-medium'>
              <i className='mr-2 fas fa-compass' />
              站点导航
            </div>
          </div>
          
          {/* 菜单卡片 */}
          <div className="mb-0.5"> 
            <MenuGroupCard 
              postCount={postCount}
              categoryOptions={categoryOptions}
              tagOptions={tagOptions}
            />
          </div>
          
          {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) &&
            latestPosts &&
            latestPosts.length > 0 && (
              <>
                {/* 最新文章标题 - 无分隔线 */}
                <div className='mb-1 px-1 mt-2'> 
                  <div className='flex items-center text-sm font-medium'>
                    <i className='mr-2 fas fa-history' />
                    {locale.COMMON.LATEST_POSTS}
                  </div>
                </div>
                <LatestPostsGroup 
                  latestPosts={latestPosts} 
                  siteInfo={siteInfo} 
                />
              </>
          )}
        </Card>

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
