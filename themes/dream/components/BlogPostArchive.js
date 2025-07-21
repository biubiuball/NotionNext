import Link from 'next/link'

/**
 * 博客归档列表
 * @param posts 所有文章
 * @param archiveTitle 归档标题
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostArchive = ({ posts = [], archiveTitle }) => {
  if (!posts || posts.length === 0) {
    return <></>
  } else {
    return (
      <div>
        <div
          className='pt-16 pb-4 text-3xl dark:text-gray-300'
          id={archiveTitle}>
          {archiveTitle}
        </div>
        <ul>
          {posts?.map(post => {
              <li
    key={post.id}
    className='border-l-2 p-1 text-xs md:text-base items-center hover:scale-x-105 hover:border-indigo-500 dark:hover:border-indigo-300 dark:border-indigo-400 transform duration-500'>
    <div id={post?.publishDay}>

      <span className='text-gray-800 dark:text-white'>{post.date?.start_date}</span>{' '}
      &nbsp;

      <Link
        href={post?.href}
        passHref
        className='text-gray-800 dark:text-white overflow-x-hidden hover:underline cursor-pointer dark:hover:text-indigo-300'>
        {post.title}
      </Link>
    </div>
  </li>
)
            )
          })}
        </ul>
      </div>
    )
  }
}

export default BlogPostArchive
