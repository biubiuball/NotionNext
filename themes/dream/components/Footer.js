import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import BeiAnSite from '@/components/BeiAnSite'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate =
    parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer className='relative z-10 dark:bg-black flex-shrink-0 bg-hexo-light-gray justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm p-6'>
       <SocialButton />
      <div className='flex justify-center'>
        <div>
          <i className='mx-1 animate-pulse fas fa-heart' />{' '}
          <a
            href={siteConfig('LINK')}
            className='underline font-bold text-gray-500 dark:text-gray-300 '>
            {siteConfig('AUTHOR')}
          </a>
          .<br />
        </div>
        © {`${copyrightDate}`}
      </div>

      {siteConfig('BEI_AN') && (
        <>
          <i className='fas fa-shield-alt' />{' '}
          <a href={siteConfig('BEI_AN_LINK')} className='mr-2'>
            {siteConfig('BEI_AN')}
          </a>
          <BeiAnGongAn />
          <br />
        </>
      )}

      <span className='hidden busuanzi_container_site_pv'>
        <i className='fas fa-eye' />
        <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
      </span>
      <span className='pl-2 hidden busuanzi_container_site_uv'>
        <i className='fas fa-users' />{' '}
        <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
      </span>
      
      <div className='text-xs font-serif'>
        Powered By{' '}
        <a
          href='https://github.com/tangly1024/NotionNext'
          className='underline text-gray-500 dark:text-gray-300'>
          NotionNext {siteConfig('VERSION')}
        </a>
      </div>

    </footer>
  )
}

export default Footer