import { PostModel } from '@/models/post/post-model'

export type PublicPost = Omit<PostModel, 'updatedAt'>

export const makePartialPublicPost = (post?: Partial<PostModel>): PublicPost => {

  return {
    id: post?.id || '',
    slug: post?.slug || '',
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    author: post?.author || '',
    content: post?.content || '',
    coverImage: post?.coverImage || '',
    createdAt: post?.createdAt || '',
    published: post?.published || false,
  }
}

export const makePublicPostFromDb = (post: PostModel): PublicPost => {

  return makePartialPublicPost(post)
}
