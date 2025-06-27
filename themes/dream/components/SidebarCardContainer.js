import LatestPostsGroup from './LatestPostsGroup'
import MenuGroupCard from './MenuGroupCard'

const SidebarCardContainer = (props) => {
  const { latestPosts, siteInfo, postCount, categoryOptions, tagOptions } = props

  return (
    <div className='space-y-1'>
      <MenuGroupCard 
        postCount={postCount} 
        categoryOptions={categoryOptions} 
        tagOptions={tagOptions} 
      />
      
      <LatestPostsGroup 
        latestPosts={latestPosts} 
        siteInfo={siteInfo} 
      />
    </div>
  )
}

export default SidebarCardContainer
