'use server'

import { makePartialPublicPost, PublicPost } from '@/dto/post/dto'
import { verifyLoginSession } from '@/lib/login/manage-login'
import { PostUpdateSchema } from '@/lib/post/validation'
import { postRepository } from '@/repositories/post'
import { getZodErrorMessages } from '@/utils/get-zod-error-messages'
import { makeRandomString } from '@/utils/make-random-string'
import { revalidateTag } from 'next/cache'

type UpdatePostActionState = {
  formState: PublicPost
  erros: string[]
  success?: string
}


export async function updatePostAction(prevState: UpdatePostActionState, formData: FormData): Promise<UpdatePostActionState> {
  const isAuthenticated = await verifyLoginSession()

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      erros: ['Dados inválido.'],
    }
  }

  const id = formData.get('id')?.toString() || ''

  if (!id || typeof id !== 'string') {
    return {
      formState: prevState.formState,
      erros: ['Dados inválidos.'],
    }
  }

  const formDataToObject = Object.fromEntries(formData.entries())
  const zodParsedObj = PostUpdateSchema.safeParse(formDataToObject)

  if (!isAuthenticated) {
    return {
      formState: makePartialPublicPost(formDataToObject),
      erros: ['Você precisa estar logado para atualizar um post.'],
    }
  }

  if (!zodParsedObj.success) {
    const erros = getZodErrorMessages(zodParsedObj.error.format())

    return {
      erros,
      formState: makePartialPublicPost(formDataToObject),
    }
  }

  const validPostData = zodParsedObj.data
  const newPost = {
    ...validPostData,
  }

  let post

  try {
    post = await postRepository.update(id, newPost)
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: makePartialPublicPost(newPost),
        erros: [e.message],
      }
    }

    return {
      formState: makePartialPublicPost(newPost),
      erros: ['Erro ao criar o post. Tente novamente mais tarde.'],
    }
  }

  revalidateTag('posts')
  revalidateTag(`post-${post.slug}`)

  return {
    formState: makePartialPublicPost(post),
    erros: [],
    success: makeRandomString(),
  }
}
