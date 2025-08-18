import ErrorMessage from '@/components/ErrorMessage'
import { UpdateUserForm } from '@/components/admin/UpdateUserForm'
import { getPublicUserFromApi } from '@/lib/user/api/get-user'

export async function UpdateUser() {
  const user = await getPublicUserFromApi()

  if (!user) {
    return <ErrorMessage contentTitle='Ei 😅' content='Tente fazer login novamente' />
  }

  return <UpdateUserForm user={user} />
}
