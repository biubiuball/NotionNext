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
import TagGroups from './TagGroups'
import LazyImage from '@/components/LazyImage'
import { useRouter } from 'next/router'

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
    postCount,
    categoryOptions,
    tagOptions,
    siteInfo
  } = props

  const { locale } = useGlobal()
  const router = useRouter()
  const currentPath = router.asPath

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
          <Card>
            <Catalog toc={post.toc} />
          </Card>
        )}

        <InfoCard {...props} />
        {siteConfig('HEXO_WIDGET_ANALYTICS', null, CONFIG) && (
          <AnalyticsCard {...props} />
        )}

        {/* 整合的菜单和最新文章容器 */}
        <Card>
          {/* 菜单组部分 */}
          <nav id='nav' className='leading-8 flex justify-center dark:text-gray-200 w-full'>
            {[
              {
                name: locale.COMMON.ARTICLE,
                href: '/archive',
                slot: <div className='text-center'>{postCount}</div>,
                show: siteConfig('HEXO_MENU_ARCHIVE', null, CONFIG)
              },
              {
                name: locale.COMMON.CATEGORY,
                href: '/category',
                slot: <div className='text-center'>{categoryOptions?.length}</div>,
                show: siteConfig('HEXO_MENU_CATEGORY', null, CONFIG)
              },
              {
                name: locale.COMMON.TAGS,
                href: '/tag',
                slot: <div className='text-center'>{tagOptions?.length}</div>,
                show: siteConfig('HEXO_MENU_TAG', null, CONFIG)
              }
            ].map(link => {
              if (link.show) {
                return (
                  <Link
                    key={`${link.href}`}
                    title={link.href}
                    href={link.href}
                    className='py-1.5 my-1 px-2 duration-300 text-base justify-center items-center cursor-pointer'>
                    <div className='w-full items-center justify-center hover:scale-105 duration-200 transform dark:hover:text-indigo-400 hover:text-indigo-600'>
                      <div className='text-center'>{link.name}</div>
                      <div className='text-center font-semibold'>{link.slot}</div>
                    </div>
                  </Link>
                )
              } else {
                return null
              }
            })}
          </nav>

          {/* 最新文章部分 */}
          {siteConfig('HEXO_WIDGET_LATEST_POSTS', null, CONFIG) && latestPosts && latestPosts.length > 0 && (
            <>
              <hr className="border-dashed border-gray-200 dark:border-gray-600 my-4" />
              <div className='mb-2 px-1 flex flex-nowrap justify-between'>
                <div>
                  <i className='mr-2 fas fas fa-history' />
                  {locale.COMMON.LATEST_POSTS}
                </div>
              </div>
              {latestPosts.map(post => {
                const headerImage = post?.pageCoverThumbnail
                  ? post.pageCoverThumbnail
                  : siteInfo?.pageCover
                const selected = currentPath === post?.href

                return (
                  <Link
                    key={post.id}
                    title={post.title}
                    href={post?.href}
                    passHref
                    className={'my-3 flex'}>
                    <div className='w-20 h-14 overflow-hidden relative'>
                      <LazyImage
                        alt={post?.title}
                        src={`${headerImage}`}
                        className='object-cover w-full h-full'
                      />
                    </div>
                    <div
                      className={
                        (selected ? ' text-indigo-400 ' : 'dark:text-gray-400 ') +
                        ' text-sm overflow-x-hidden hover:text-indigo-600 px-2 duration-200 w-full rounded ' +
                        ' hover:text-indigo-400 cursor-pointer items-center flex'
                      }>
                      <div>
                        <div className='line-clamp-2 menu-link'>{post.title}</div>
                        <div className='text-gray-500'>{post.lastEditedDay}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </>
          )}
        </Card>
        {/* 整合容器结束 */}

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
