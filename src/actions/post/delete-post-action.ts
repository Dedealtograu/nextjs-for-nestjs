'use server'

import { verifyLoginSession } from '@/lib/login/manage-login'
import { postRepository } from '@/repositories/post'
import { revalidateTag } from 'next/cache'

export async function deletePostAction(id: string) {
  const isAuthenticated = await verifyLoginSession()

  if (!isAuthenticated) {
    return { error: 'Você precisa estar logado para deletar um post.' }
  }

  if (!id || typeof id !== 'string') {
    return { error: 'Dados inválidos' }
  }

  let post

  try {
    post = await postRepository.delete(id)
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { error: e.message }
    }

    return { error: 'Erro desconhecido' }
  }

  revalidateTag('posts')
  revalidateTag(`post-${post.slug}`)

  return { error: '' }
}
