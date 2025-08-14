'use server'

import { getLoginSessionForApi } from '@/lib/login/manage-login'
import { CreatePostForApiSchema, PublicPostForApiDto, PublicPostForApiSchema } from '@/lib/post/schemas'
import { authenticatedApiRequest } from '@/utils/authenticated-api-request'
import { getZodErrorMessages } from '@/utils/get-zod-error-messages'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

type CreatePostActionState = {
  formState: PublicPostForApiDto
  errors: string[]
  success?: string
}


export async function createPostAction(prevState: CreatePostActionState, formData: FormData): Promise<CreatePostActionState> {
  const isAuthenticated = await getLoginSessionForApi()

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      errors: ['Dados inválido.'],
    }
  }

  const formDataToObject = Object.fromEntries(formData.entries())
  const zodParsedObj = CreatePostForApiSchema.safeParse(formDataToObject)

  if (!isAuthenticated) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObject),
      errors: ['Você precisa estar logado para criar um post.'],
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

  const createPostResponse = await authenticatedApiRequest<PublicPostForApiDto>('/post/me', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPost),
  })

  if (!createPostResponse.success) {
    return {
      formState: PublicPostForApiSchema.parse(formDataToObject),
      errors: createPostResponse.errors,
    }
  }

  const createPost = createPostResponse.data

  revalidateTag('posts')
  redirect(`/admin/post/${createPost.id}?created=1`)
}
