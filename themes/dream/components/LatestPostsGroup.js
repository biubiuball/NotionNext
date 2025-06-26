import LazyImage from '@/components/LazyImage'
import { useGlobal } from '@/lib/global'
import Link from 'next/link'
import { useRouter } from 'next/router'

const LatestPostsGroup = ({ latestPosts, siteInfo }) => {
  const currentPath = useRouter().asPath
  const { locale } = useGlobal()

  if (!latestPosts || latestPosts.length === 0) {
    return null
  }

  return (
    <div className='space-y-2'> {/* 保持紧凑间距 */}
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
            className={'flex hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded'}>

            <div className='w-20 h-14 overflow-hidden relative flex-shrink-0'>
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
                ' hover:text-indigo-400 cursor-pointer flex items-center'
              }>
              <div className='flex-1 min-w-0'>
                <div className='line-clamp-2 menu-link'>{post.title}</div>
                <div className='text-gray-500 text-xs'>{post.lastEditedDay}</div> 
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
export default LatestPostsGroup
