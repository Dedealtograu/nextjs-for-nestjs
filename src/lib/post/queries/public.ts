import { PostModelFromApi } from '@/models/post/post-model'
import { postRepository } from '@/repositories/post'
import { apiRequest } from '@/utils/api-request'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const findAllPublicPostsCached = cache(unstable_cache(
  cache(async () => {
    return await postRepository.findAllPublic()
  }),
  ['posts'],
  {
    tags: ['posts'],
  },
))

export const findAllPublicPostsFromApiCached = cache(
  async () => {
    const postResponse = await apiRequest<PostModelFromApi[]>('/post', {
      next: {
        tags: ['posts'],
        revalidate: 86400,
      }
    })

    return postResponse
  },
)

export const findPublicPostBySlugCached = cache((slug: string) => {
  return unstable_cache(async (slug: string) => {
    const post = await postRepository.findBySlugPublic(slug).catch(() => undefined)

    if (!post) notFound()

    return post
  }, [`post-${slug}`], { tags: [`post-${slug}`] })(slug)
})

export const findPublicPostBySlugFromApiCached = cache(async (slug: string) => {
  const postResponse = await apiRequest<PostModelFromApi>(`/post/${slug}`, {
    next: {
      tags: [`post-${slug}`],
      revalidate: 86400,
    }
  })

  return postResponse
})
