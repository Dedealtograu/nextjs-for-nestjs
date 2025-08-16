import ErrorMessage from '../ErrorMessage'
import { PostCoverImage } from '../PostCoverImage'
import { PostSummary } from '../PostSummary'
import { findAllPublicPostsFromApiCached } from '@/lib/post/queries/public'

export async function PostFeatured() {
  const postsRes = await findAllPublicPostsFromApiCached()
  const noPostsFound = <ErrorMessage contentTitle='Ops 😁' content='Ainda não temos nenhum post!' />

  if (!postsRes.success) {
    return noPostsFound
  }

  const posts = postsRes.data

  if (posts.length <= 0) {
    return noPostsFound
  }

  const firstPost = posts[0]
  const postLink = `/post/${firstPost.slug}`

  return (
    <section className='grid grid-cols-1 gap-8 mb-16 sm:grid-cols-2 group'>
      <PostCoverImage
        linkProps={{
          href: postLink,
        }}
        imageProps={{
          width: 1200,
          height: 720,
          src: firstPost.coverImage,
          alt: firstPost.title,
          priority: true,
        }}
      />
      <PostSummary
        postLink={postLink}
        postHeading='h1'
        createdAt={firstPost.createdAt}
        title={firstPost.title}
        excerpt={firstPost.excerpt}
      />
    </section>
  )
}
