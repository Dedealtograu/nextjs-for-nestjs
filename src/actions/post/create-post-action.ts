'use server'

import { makePartialPublicPost, PublicPost } from '@/dto/post/dto'
import { verifyLoginSession } from '@/lib/login/manage-login'
import { PostCreateSchema } from '@/lib/post/validation'
import { PostModel } from '@/models/post/post-model'
import { postRepository } from '@/repositories/post'
import { getZodErrorMessages } from '@/utils/get-zod-error-messages'
import { makeSlugFromText } from '@/utils/make-slug-from-text'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidV4 } from 'uuid'

type CreatePostActionState = {
  formState: PublicPost
  erros: string[]
  success?: string
}


export async function createPostAction(prevState: CreatePostActionState, formData: FormData): Promise<CreatePostActionState> {
  const isAuthenticated = await verifyLoginSession()

  if (!(formData instanceof FormData)) {
    return {
      formState: prevState.formState,
      erros: ['Dados inválido.'],
    }
  }

  const formDataToObject = Object.fromEntries(formData.entries())
  const zodParsedObj =PostCreateSchema.safeParse(formDataToObject)

  if (!isAuthenticated) {
    return {
      formState: makePartialPublicPost(formDataToObject),
      erros: ['Você precisa estar logado para criar um post.'],
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
  const newPost: PostModel = {
    ...validPostData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: uuidV4(),
    slug: makeSlugFromText(validPostData.title),
  }

  try {
    await postRepository.create(newPost)
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        formState: newPost,
        erros: [e.message],
      }
    }

    return {
      formState: newPost,
      erros: ['Erro ao criar o post. Tente novamente mais tarde.'],
    }
  }

  revalidateTag('posts')
  redirect(`/admin/post/${newPost.id}?created=1`)
}
