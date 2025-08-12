import ErrorMessage from '@/components/ErrorMessage'
import { LoginForm } from '@/components/LoginForm'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Login',
}

export default async function AdminLoginPage() {
  const allowLogin = Boolean(process.env.ALLOW_LOGIN)

  if (!allowLogin) {
    return <ErrorMessage contentTitle='403' content='Libere o login usando a variável de ambiente ALLOW_LOGIN' />
  }

  return <LoginForm />
}
