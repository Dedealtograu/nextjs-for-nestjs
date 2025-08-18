import { UpdateUser } from '@/components/admin/UpdateUser'
import { SpinLoader } from '@/components/SpinLoader'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'User Admin',
}

export default function AdminUserPage() {
  return (
    <Suspense fallback={<SpinLoader className='mb-16' />}>
      <UpdateUser />
    </Suspense>
  )
}
