'use server'

import { deleteLoginSession } from '@/lib/login/manage-login'
import { getPublicUserFromApi } from '@/lib/user/api/get-user'
import { authenticatedApiRequest } from '@/utils/authenticated-api-request'
import { redirect } from 'next/navigation'

type DeleteUserActionState = {
  errors: string[]
  success: boolean
}

export async function deleteUserAction(): Promise<DeleteUserActionState> {
  const user = await getPublicUserFromApi()

  if (!user) {
    await deleteLoginSession()

    return {
      errors: ['Voce precisa fazer login novamente.'],
      success: true,
    }
  }

  const deleteUserResponse = await authenticatedApiRequest<DeleteUserActionState>('/user/me', {
    method: 'DELETE',
  })

  if (!deleteUserResponse.success) {
    return {
      errors: deleteUserResponse.errors,
      success: false,
    }
  }

  await deleteLoginSession()
  redirect('/')
}
