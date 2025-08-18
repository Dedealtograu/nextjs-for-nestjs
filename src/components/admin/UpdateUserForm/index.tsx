'use client'

import clsx from 'clsx'
import { InputText } from '../../InputText'
import { Button } from '../../Button'
import { LockKeyholeIcon, OctagonXIcon, UserPenIcon } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { Dialog } from '../../Dialog'
import { asyncDelay } from '@/utils/async-delay'
import { PublicUserDto } from '@/lib/user/schemas'
import { updateUserAction } from '@/actions/user/update-user-action'
import { toast } from 'react-toastify'

type UpdateUserFormProps = {
  user: PublicUserDto
}

export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const [state, action, isPending] = useActionState(updateUserAction, {
    user,
    errors: [],
    success: false,
  })
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isTransitioning, startTransition] = useTransition()
  const safetyDelay = 10000
  const isElementsDisabled = isTransitioning || isPending

  function showDeleteAccountDialog(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault()
    setIsDialogVisible(true)

    startTransition(async () => {
      await asyncDelay(safetyDelay)
    })
  }

  function handleDeleteAccount() {
    //setIsDialogVisible(false)
  }

  useEffect(() => {
    toast.dismiss()
    if (state.errors.length > 0) {
      state.errors.forEach(error => toast.error(error))
    }
    if (state.success) {
      toast.success('Dados atualizados com sucesso!')
    }
  }, [state])

  return (
    <div className={clsx('flex items-center justify-center', 'text-center max-w-sm mt-16 mb-32 mx-auto')}>
      <form action={action} className='flex-1 flex flex-col gap-6'>
        <InputText
          type='text'
          name='name'
          labelText='Nome'
          placeholder='Seu nome'
          disabled={isElementsDisabled}
          defaultValue={state.user.name}
          required
        />
        <InputText
          type='email'
          name='email'
          labelText='E-mail'
          placeholder='Seu e-mail'
          disabled={isElementsDisabled}
          defaultValue={state.user.email}
          required
        />

        <div className='flex items-center justify-center mt-4'>
          <Button size='md' type='submit' disabled={isElementsDisabled}>
            <UserPenIcon />
            Atualizar
          </Button>
        </div>

        <div className='flex items-center justify-between gap-4 mt-8'>
          <Link
            className={clsx('flex items-center justify-center gap-2', 'transition hover:text-blue-600')}
            href={'/admin/user/password'}
          >
            <LockKeyholeIcon />
            Trocar senha
          </Link>
          <Link
            className={clsx('flex items-center justify-center gap-2', 'transition text-red-600 hover:text-red-700')}
            href={'#'}
            onClick={showDeleteAccountDialog}
          >
            <OctagonXIcon />
            Apagar conta
          </Link>
        </div>
      </form>

      <Dialog
        content={
          <p>
            Ao apagar sua conta, todos os dados serão perdidos e nenhuma reversão deles pode ser recuperada. Em alguns
            segundos os botões serão habilitados. Click em <b>OK</b> para confirmar ou <b>Cancelar</b> para fechar essa
            janela.
          </p>
        }
        disabled={isElementsDisabled}
        onCancel={() => setIsDialogVisible(false)}
        onConfirm={handleDeleteAccount}
        isVisible={isDialogVisible}
        title='Apagar conta'
      />
    </div>
  )
}
