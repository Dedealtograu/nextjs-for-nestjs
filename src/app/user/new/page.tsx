import { CreateUserForm } from '@/components/CreateUserForm'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Crie sua conta',
}

export default function NewUserPage() {
  return <CreateUserForm />
}
