import { UpdatePasswordForm } from '@/components/admin/UpdtePasswordForm'
import { SpinLoader } from '@/components/SpinLoader'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Trocar senha',
}

export default function AdminPasswordPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <UpdatePasswordForm />
    </Suspense>
  )
}
