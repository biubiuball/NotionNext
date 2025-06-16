import Link from 'next/link'
import { useRouter } from 'next/router'

const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const currentPage = +page
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')
  const pages = generatePages(pagePrefix, page, currentPage, totalPage)

  return (
    <div className='mt-10 mb-5 flex justify-center items-end font-medium py-3 space-x-2'>
      {/* 上一页 */}
      <Link
        href={{
          pathname:
            currentPage === 2
              ? `${pagePrefix}/`
              : `${pagePrefix}/page/${currentPage - 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        rel='prev'
        className={`${currentPage === 1 ? 'invisible' : 'block'} pb-0.5 hover:font-bold w-6 text-center cursor-pointer duration-200`}>
        <i className='fas fa-angle-left' />
      </Link>

      {pages}

      {/* 下一页 */}
      <Link
        href={{
          pathname: `${pagePrefix}/page/${currentPage + 1}`,
          query: router.query.s ? { s: router.query.s } : {}
        }}
        rel='next'
        className={`${+showNext ? 'block' : 'invisible'} pb-0.5 hover:font-bold w-6 text-center cursor-pointer duration-200`}>
        <i className='fas fa-angle-right' />
      </Link>
    </div>
  )
}

function getPageElement(page, currentPage, pagePrefix) {
  const selected = page + '' === currentPage + ''
  return (
    <Link
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      className={`${
        selected
          ? 'font-bold underline'
          : 'hover:font-bold'
      }
      duration-200 cursor-pointer pb-0.5 w-6 text-center
      `}>
      {page}
    </Link>
  )
}

function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = []
  const groupCount = 7
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page, pagePrefix))
    }
  } else {
    pages.push(getPageElement(1, page, pagePrefix))
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    if (startPage <= 1) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(<div key={-1} className="pb-0.5">...</div>)
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pages.push(getPageElement(startPage + i, page, pagePrefix))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(<div key={-2} className="pb-0.5">...</div>)
    }

    pages.push(getPageElement(totalPage, page, pagePrefix))
  }
  return pages
}
export default PaginationNumber
