'use server'

import { createLoginSessionFromApi } from '@/lib/login/manage-login'
import { LoginSchema } from '@/lib/login/schemas'
import { apiRequest } from '@/utils/api-request'
import { asyncDelay } from '@/utils/async-delay'
import { getZodErrorMessages } from '@/utils/get-zod-error-messages'
import { redirect } from 'next/navigation'

type loginActionState = {
  email: string
  errors: string[]
}

export async function loginAction(state: loginActionState, formData: FormData) {
  const allowLogin = Boolean(process.env.ALLOW_LOGIN)

  if (!allowLogin) {
    return {
      email: '',
      errors: ['Login não permitido'],
    }
  }

  await asyncDelay(5000)

  if (!(formData instanceof FormData)) {
    return {
      email: '',
      errors: ['Dados inválidos'],
    }
  }

  const formObj = Object.fromEntries(formData.entries())
  const formEmail = formObj?.email?.toString() || ''
  const parsedFormData = LoginSchema.safeParse(formObj)

  if (!parsedFormData.success) {
    return {
      email: formEmail,
      errors: getZodErrorMessages(parsedFormData.error.format()),
    }
  }

  const loginResponse = await apiRequest<{ accessToken: string }>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsedFormData.data),
  })

  if (!loginResponse.success) {
    return {
      email: formEmail,
      errors: loginResponse.errors,
    }
  }

  await createLoginSessionFromApi(loginResponse.data.accessToken)
  redirect('/admin/post')
}
