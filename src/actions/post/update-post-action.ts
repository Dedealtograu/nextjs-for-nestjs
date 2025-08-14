'use server'

import { getLoginSessionForApi } from '@/lib/login/manage-login'
import { PublicPostForApiDto, PublicPostForApiSchema, UpdatePostForApiSchema } from '@/lib/post/schemas'
import { authenticatedApiRequest } from '@/utils/authenticated-api-request'
import { getZodErrorMessages } from '@/utils/get-zod-error-messages'
import { makeRandomString } from '@/utils/make-random-string'
import { revalidateTag } from 'next/cache'

type UpdatePostActionState = {
  formState: PublicPostForApiDto
  errors: string[]
  success?: string
}


export async function updatePostAction(prevState: UpdatePostActionState, formData: FormData): Promise<UpdatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi()

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválido.'],
    }
  }

  const id = formData.get('id')?.toString() || ''

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      errors: ['ID inválidos.'],
    }
  }

  const formDataToObject = Object.fromEntries(formData.entries())
  const zodParsedObj = UpdatePostForApiSchema.safeParse(formDataToObject)

  if (!isAuthenticated) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObject),
      errors: ['Você precisa estar logado para atualizar um post.'],
    }
  }

  if (!zodParsedObj.success) {
    const errors = getZodErrorMessages(zodParsedObj.error.format())

    return {
      errors,
      formState: PublicPostForApiSchema.parse(formDataToObject),
    }
  }

  const newPost = zodParsedObj.data

  const updatePostResponse = await authenticatedApiRequest<PublicPostForApiDto>(`/post/me/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(newPost),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!updatePostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObject),
      errors: updatePostResponse.errors,
    }
  }

  const post = updatePostResponse.data

  revalidateTag('posts')
  revalidateTag(`post-${post.slug}`)

  return {
    formState: PublicPostForApiSchema.parse(formDataToObject),
    errors: [],
    success: makeRandomString(),
  }
}
