'use server'

import { getLoginSessionForApi } from '@/lib/login/manage-login'
import { PublicPostForApiDto } from '@/lib/post/schemas'
import { authenticatedApiRequest } from '@/utils/authenticated-api-request'
import { revalidateTag } from 'next/cache'

export async function deletePostAction(id: string) {
  const isAuthenticated = await getLoginSessionForApi()

  if (!isAuthenticated) {
    return { errors: 'Você precisa estar logado para deletar um post.' }
  }

  if (!id || typeof id !== 'string') {
    return { error: 'Dados inválidos' }
  }

  const postResponse = await authenticatedApiRequest<PublicPostForApiDto>(`/post/me/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!postResponse.success) {
    return { error: 'Erro ao buscar post' }
  }

  const deletePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(`/post/me/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!deletePostResponse.success) {
    return { error: 'Erro ao deletar post' }
  }

  revalidateTag('posts')
  revalidateTag(`post-${postResponse.data.slug}`)

  return { error: '' }
}
