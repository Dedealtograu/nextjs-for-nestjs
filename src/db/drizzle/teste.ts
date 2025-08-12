import { drizzeDb } from '.'
import { postsTable } from './schemas'

(async () => {
  const posts = await drizzeDb.select().from(postsTable)
  console.log(posts)
})()
