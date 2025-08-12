import { JsonPostRepository } from '@/repositories/post/json-post-repository'
import { drizzeDb } from '.'
import { postsTable } from './schemas'

(async () => {
  const jsonPostRepository = new JsonPostRepository()
  const posts = await jsonPostRepository.findAll()

  try {
    await drizzeDb.delete(postsTable) // ISSO DELETA TODOS OS REGISTROS
    await drizzeDb.insert(postsTable).values(posts)
    console.log(`${posts.length} posts foram inseridos com sucesso!`)
  } catch (error) {
    console.log('An unexpected error occurred:', error)
  }
})()
