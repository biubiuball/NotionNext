import Comment from '@/components/Comment'
import replaceSearchResult from '@/components/Mark'
import NotionPage from '@/components/NotionPage'
import ShareBar from '@/components/ShareBar'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
import ArticleAdjacent from './components/ArticleAdjacent'
import ArticleCopyright from './components/ArticleCopyright'
import { ArticleLock } from './components/ArticleLock'
import ArticleRecommend from './components/ArticleRecommend'
import BlogPostArchive from './components/BlogPostArchive'
import BlogPostListPage from './components/BlogPostListPage'
import BlogPostListScroll from './components/BlogPostListScroll'
import ButtonJumpToComment from './components/ButtonJumpToComment'
import ButtonRandomPostMini from './components/ButtonRandomPostMini'
import Card from './components/Card'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import PostHero from './components/PostHero'
import RightFloatArea from './components/RightFloatArea'
import SearchNav from './components/SearchNav'
import SideRight from './components/SideRight'
import SlotBar from './components/SlotBar'
import TagItemMini from './components/TagItemMini'
import TocDrawer from './components/TocDrawer'
import TocDrawerButton from './components/TocDrawerButton'
import CONFIG from './config'
import { Style } from './style'
import CursorFollow from './components/CursorFollow'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

// 新增的Umami跟踪组件
const UmamiTracking = () => {
  useEffect(() => {
    // 确保只在生产环境加载
    if (process.env.NODE_ENV !== 'production') {
      console.log('Umami tracking disabled in development mode');
      return;
    }

    // 检查是否已存在脚本避免重复加载
    if (document.querySelector('script[data-website-id="e334a3a2-dd62-4673-8012-352968dd10c8"]')) {
      return;
    }

    // 创建并配置脚本
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://um.biubiuball.dpdns.org/script.js';
    script.setAttribute('data-website-id', 'e334a3a2-dd62-4673-8012-352968dd10c8');
    
    // 添加跨域属性增强安全性
    script.crossOrigin = 'anonymous';
    
    // 添加到文档头部
    document.head.appendChild(script);
    
    // 加载完成后的回调
    script.onload = () => {
      console.log('Umami tracking initialized');
    };
    
    // 错误处理
    script.onerror = () => {
      console.error('Failed to load Umami tracking script');
    };
  }, []);

  return null; // 该组件不渲染任何内容
};

// 主题全局状态
const ThemeGlobalHexo = createContext()
export const useHexoGlobal = () => useContext(ThemeGlobalHexo)

/**
 * 基础布局 采用左右两侧布局，移动端使用顶部导航栏
 */
const LayoutBase = props => {
  const { post, children, slotTop, className } = props
  const { onLoading, fullWidth } = useGlobal()
  const router = useRouter()
  const showRandomButton = siteConfig('HEXO_MENU_RANDOM', false, CONFIG)

  const headerSlot = post ? (
    <PostHero {...props} />
  ) : router.route === '/' &&
    siteConfig('HEXO_HOME_BANNER_ENABLE', null, CONFIG) ? (
    <Hero {...props} />
  ) : null

  const drawerRight = useRef(null)
  const tocRef = isBrowser ? document.getElementById('article-wrapper') : null

  // 悬浮按钮内容
  const floatSlot = (
    <>
      {post?.toc?.length > 1 && (
        <div className='block lg:hidden'>
          <TocDrawerButton
            onClick={() => {
              drawerRight?.current?.handleSwitchVisible()
            }}
          />
        </div>
      )}
      {post && <ButtonJumpToComment />}
    </>
  )

  // Algolia搜索框
  const searchModal = useRef(null)

  return (
    <ThemeGlobalHexo.Provider value={{ searchModal }}>
      <div
        id='theme-hexo'
        className={`${siteConfig('FONT_STYLE')} dark:bg-black scroll-smooth`}>
        <Style />

        {/* 鼠标轨迹效果组件 */}
        <CursorFollow />
        
        {/* 新增的Umami跟踪组件 */}
        <UmamiTracking />

        {/* 恢复背景图片容器 - 修复开始 */}
        <div className="light-bg fixed inset-0"></div>
        <div className="dark-bg fixed inset-0"></div>  

        {/* 顶部导航 */}
        <Header {...props} />

        {/* 顶部嵌入 */}
        <Transition
          show={!onLoading}
          appear={true}
          enter='transition ease-in-out duration-700 transform order-first'
          enterFrom='opacity-0 -translate-y-16'
          enterTo='opacity-100'
          leave='transition ease-in-out duration-300 transform'
          leaveFrom='opacity-100'
          leaveTo='opacity-0 translate-y-16'
          unmount={false}>
          {headerSlot}
        </Transition>

        {/* 主区块 */}
        <main
          id='wrapper'
          className={`${siteConfig('HEXO_HOME_BANNER_ENABLE', null, CONFIG) ? '' : 'pt-16'} bg-transparent w-full py-8 md:px-8 lg:px-24 min-h-screen relative`}>
          <div
            id='container-inner'
            className={
              (JSON.parse(siteConfig('LAYOUT_SIDEBAR_REVERSE'))
                ? 'flex-row-reverse'
                : '') +
              ' w-full mx-auto lg:flex lg:space-x-4 justify-center relative z-10'
            }>
            <div
              className={`${className || ''} w-full ${fullWidth ? '' : 'max-w-4xl'} h-full overflow-hidden`}>
              <Transition
                show={!onLoading}
                appear={true}
                enter='transition ease-in-out duration-700 transform order-first'
                enterFrom='opacity-0 translate-y-16'
                enterTo='opacity-100'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 -translate-y-16'
                unmount={false}>
                {/* 主区上部嵌入 */}
                {slotTop}

                {children}
              </Transition>
            </div>

            {/* 右侧栏 */}
            <SideRight {...props} />
          </div>
        </main>

        <div className='block lg:hidden'>
          <TocDrawer post={post} cRef={drawerRight} targetRef={tocRef} />
        </div>

        {/* 悬浮菜单 */}
        <RightFloatArea floatSlot={floatSlot} />

        {/* 全文搜索 */}
        <AlgoliaSearchModal cRef={searchModal} {...props} />

        {/* 页脚 */}
        <Footer title={siteConfig('TITLE')} />
      </div>
    </ThemeGlobalHexo.Provider>
  )
}


/**
 * 首页
 */
const LayoutIndex = props => {
  return <LayoutPostList {...props} className='pt-8' />
}

/**
 * 博客列表
 */
const LayoutPostList = props => {
  return (
    <div className='pt-8'>
      <SlotBar {...props} />
      {siteConfig('POST_LIST_STYLE') === 'page' ? (
        <BlogPostListPage {...props} />
      ) : (
        <BlogPostListScroll {...props} />
      )}
    </div>
  )
}

/**
 * 搜索
 */
const LayoutSearch = props => {
  const { keyword } = props
  const router = useRouter()
  const currentSearch = keyword || router?.query?.s

  useEffect(() => {
    if (currentSearch) {
      replaceSearchResult({
        doms: document.getElementsByClassName('replace'),
        search: keyword,
        target: {
          element: 'span',
          className: 'text-red-500 border-b border-dashed'
        }
      })
    }
  })

  return (
    <div className='pt-8'>
      {!currentSearch ? (
        <SearchNav {...props} />
      ) : (
        <div id='posts-wrapper'>
          {' '}
          {siteConfig('POST_LIST_STYLE') === 'page' ? (
            <BlogPostListPage {...props} />
          ) : (
            <BlogPostListScroll {...props} />
          )}{' '}
        </div>
      )}
    </div>
  )
}

/**
 * 归档
 */
const LayoutArchive = props => {
  const { archivePosts } = props
  return (
    <div className='pt-8'>
      <Card className='w-full'>
        <div className='mb-10 pb-20 bg-transparent md:p-12 p-3 min-h-full'>
          {Object.keys(archivePosts).map(archiveTitle => (
            <BlogPostArchive
              key={archiveTitle}
              posts={archivePosts[archiveTitle]}
              archiveTitle={archiveTitle}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}

/**
 * 文章详情
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
  const router = useRouter()
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
    }
  }, [post])
  return (
    <>
      <div className='w-full lg:hover:shadow lg:border rounded-t-xl lg:rounded-xl lg:px-2 lg:py-4 
               backdrop-filter backdrop-blur-md backdrop-saturate-150 bg-white/30 dark:bg-black/30 
               border border-white/20 dark:border-gray-800 article'>
        {lock && <ArticleLock validPassword={validPassword} />}

        {!lock && post && (
          <div className='overflow-x-auto flex-grow mx-auto md:w-full md:px-5 '>
            <article
              id='article-wrapper'
              itemScope
              itemType='https://schema.org/Movie'
              className='subpixel-antialiased overflow-y-hidden'>
              {/* Notion文章主体 */}
              <section className='px-5 justify-center mx-auto max-w-2xl lg:max-w-full'>
                {post && <NotionPage post={post} />}
              </section>

              {/* 分享 */}
              <ShareBar post={post} />
              {post?.type === 'Post' && (
                <>
                  <ArticleCopyright {...props} />
                  <ArticleRecommend {...props} />
                  <ArticleAdjacent {...props} />
                </>
              )}
            </article>

            <div className='pt-4 border-dashed'></div>

            {/* 评论互动 */}
            <div 
              id="comment" 
              className='duration-200 overflow-x-auto rounded-xl backdrop-filter backdrop-blur-md backdrop-saturate-150 bg-white/10 dark:bg-black/10 px-3'>
              <Comment frontMatter={post} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * 404
 */
const Layout404 = props => {
  const router = useRouter()
  const { locale } = useGlobal()
  useEffect(() => {
    // 延时3秒如果加载失败就返回首页
    setTimeout(() => {
      if (isBrowser) {
        const article = document.querySelector('#article-wrapper #notion-article')
        if (!article) {
          router.push('/').then(() => {
            // console.log('找不到页面', router.asPath)
          })
        }
      }
    }, 3000)
  })
  return (
    <>
      <div className='text-black w-full h-screen text-center justify-center content-center items-center flex flex-col'>
        <div className='dark:text-gray-200'>
          <h2 className='inline-block border-r-2 border-gray-600 mr-2 px-3 py-2 align-top'>
            404
          </h2>
          <div className='inline-block text-left h-32 leading-10 items-center'>
            <h2 className='m-0 p-0'>{locale.COMMON.NOT_FOUND}</h2>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * 分类列表
 */
const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  return (
    <div className='mt-8'>
      <Card className='w-full min-h-screen'>
        <div className='dark:text-gray-200 mb-5 mx-3'>
          <i className='mr-4 fas fa-th' /> {locale.COMMON.CATEGORY}:
        </div>
        <div id='category-list' className='duration-200 flex flex-wrap mx-8'>
          {categoryOptions?.map(category => {
            return (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                passHref
                legacyBehavior>
                <div
                    className={'text-gray-800 dark:text-white duration-300 dark:hover:text-white rounded-lg px-5 cursor-pointer py-2 hover:bg-indigo-400 hover:text-white'}
                          >
                  <i className='mr-4 fas fa-folder' /> {category.name}(
                  {category.count})
                </div>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

/**
 * 标签列表
 */
const LayoutTagIndex = props => {
  const { tagOptions } = props
  const { locale } = useGlobal()
  return (
    <div className='mt-8'>
      <Card className='w-full'>
        <div className='dark:text-gray-200 mb-5 ml-4'>
          <i className='mr-4 fas fa-tag' /> {locale.COMMON.TAGS}:
        </div>
        <div id='tags-list' className='duration-200 flex flex-wrap ml-8'>
          {tagOptions.map(tag => (
            <div key={tag.name} className='p-2'>
              <TagItemMini key={tag.name} tag={tag} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
