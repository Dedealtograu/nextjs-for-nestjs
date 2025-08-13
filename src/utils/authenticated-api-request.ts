import 'server-only'
import { getLoginSessionForApi } from '@/lib/login/manage-login'
import { ApiRequest, apiRequest } from './api-request'

export async function authenticatedApiRequest<T>(path: string, options?: RequestInit): Promise<ApiRequest<T>> {

  const jwtToken = await getLoginSessionForApi()

  if (!jwtToken) {
    return {
      errors: ['Você não está autenticado'],
      success: false,
      status: 401,
    }
  }

  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${jwtToken}`,
  }

  return apiRequest<T>(path, {
    ...options,
    headers,
  })
}
