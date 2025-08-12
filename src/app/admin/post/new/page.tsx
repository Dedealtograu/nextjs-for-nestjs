import { ManagePostForm } from '@/components/admin/ManagePostForm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Criar Post',
}

export default async function AdminPostNewPage() {
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-xl font-extrabold'>Novo Post</h1>
      <ManagePostForm mode='create' />
    </div>
  )
}
