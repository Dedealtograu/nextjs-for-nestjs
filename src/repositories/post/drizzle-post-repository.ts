import { PostModel } from '@/models/post/post-model'
import { PostRepository } from './post-repository'
import { drizzeDb } from '@/db/drizzle'
import { logColor } from '@/utils/log-color'
import { asyncDelay } from '@/utils/async-delay'
import { postsTable } from '@/db/drizzle/schemas'
import { eq } from 'drizzle-orm'

const simulateWaitMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0

export class DrizzlePostRepository implements PostRepository {
  async findAllPublic(): Promise<PostModel[]> {
    await asyncDelay(simulateWaitMs, true)
    logColor('findAllPublic', Date.now())

    const posts = await drizzeDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.published),
      where: (posts, { eq }) => eq(posts.published, true),
    })

    return posts
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
    await asyncDelay(simulateWaitMs, true)
    logColor('findBySlugPublic', Date.now())

    const post = await drizzeDb.query.posts.findFirst({
      where: (posts, { eq, and }) => and(eq(posts.published, true), eq(posts.slug, slug))
    })

    if (!post) throw new Error('Post não encontrado para o slug informado')


    return post
  }

  async findAll(): Promise<PostModel[]> {
    await asyncDelay(simulateWaitMs, true)
    logColor('findAll', Date.now())

    const posts = await drizzeDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
    })

    return posts
  }

  async findById(id: string): Promise<PostModel> {
    await asyncDelay(simulateWaitMs, true)
    logColor('findById', Date.now())

    const post = await drizzeDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id)
    })

    if (!post) throw new Error('Post não encontrado para o id informado')

    return post
  }

  async delete(id: string): Promise<PostModel> {
    const post = await drizzeDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    })

    if (!post) {
      throw new Error('Post não existe')
    }

    await drizzeDb.delete(postsTable).where(eq(postsTable.id, id))

    return post
  }

  async create(post: PostModel): Promise<PostModel> {
    const postExists = await drizzeDb.query.posts.findFirst({
      where: (posts, { or, eq }) =>
        or(eq(posts.id, post.id), eq(posts.slug, post.slug)),
      columns: { id: true }
    })

    if (!!postExists) {
      throw new Error('Post com o mesmo ID ou Slug já existe')
    }

    await drizzeDb.insert(postsTable).values(post)

    return post
  }

  async update(id: string, newPostData: Omit<PostModel, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<PostModel> {
    const oldPost = await drizzeDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    })

    if (!oldPost) {
      throw new Error('Post não encontrado')
    }

    const updatedAt = new Date().toISOString()

    const postData = {
      author: newPostData.author,
      content: newPostData.content,
      coverImage: newPostData.coverImage,
      excerpt: newPostData.excerpt,
      published: newPostData.published,
      title: newPostData.title,
      updatedAt,
    }

    await drizzeDb.update(postsTable).set(postData).where(eq(postsTable.id, id))

    return {
      ...oldPost,
      ...postData,
    }
  }

}
