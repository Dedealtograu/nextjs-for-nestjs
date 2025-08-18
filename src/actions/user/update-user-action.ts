'use server'

import { deleteLoginSession } from '@/lib/login/manage-login'
import { getPublicUserFromApi } from '@/lib/user/api/get-user'
import { PublicUserDto, PublicUserSchema, UpdateUserSchema } from '@/lib/user/schemas'
import { authenticatedApiRequest } from '@/utils/authenticated-api-request'
import { getZodErrorMessages } from '@/utils/get-zod-error-messages'
import { redirect } from 'next/navigation'

type UpdateUserActionState = {
  user: PublicUserDto
  errors: string[]
  success: boolean
}

export async function updateUserAction(state: UpdateUserActionState, formData: FormData): Promise<UpdateUserActionState> {
  const user = await getPublicUserFromApi()

  if (!user) {
    await deleteLoginSession()

    return {
      user: state.user,
      errors: ['Voce precisa fazer login novamente.'],
      success: true,
    }
  }

  if (!(formData instanceof FormData)) {
    return {
      user: state.user,
      errors: ['Dados inválidos'],
      success: false,
    }
  }

  const formObj = Object.fromEntries(formData.entries())
  const parsedFormData = UpdateUserSchema.safeParse(formObj)

  if (!parsedFormData.success) {
    return {
      user: state.user,
      errors: getZodErrorMessages(parsedFormData.error.format()),
      success: false,
    }
  }

  const updateUserResponse = await authenticatedApiRequest<PublicUserDto>('/user/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedFormData.data),
  })

  if (!updateUserResponse.success) {
    return {
      user: PublicUserSchema.parse(formObj),
      errors: updateUserResponse.errors,
      success: false,
    }
  }

  if (user.email !== updateUserResponse.data.email) {
    await deleteLoginSession()
    redirect('/login?userChanged=1')
  }

  //revalidateTag('posts')

  return {
    user: PublicUserSchema.parse(updateUserResponse.data),
    errors: [],
    success: true,
  }
}
