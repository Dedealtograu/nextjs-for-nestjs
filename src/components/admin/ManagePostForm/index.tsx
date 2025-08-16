'use client'

import { Button } from '@/components/Button'
import { InputCheckBox } from '@/components/InputCheckBox'
import { InputText } from '@/components/InputText'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { useActionState, useEffect, useState } from 'react'
import { ImageUploader } from '../ImageUploader'
import { createPostAction } from '@/actions/post/create-post-action'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { updatePostAction } from '@/actions/post/update-post-action'
import { PublicPostForApiDto, PublicPostForApiSchema } from '@/lib/post/schemas'

type ManagePostFormUpdateProps = {
  mode: 'update'
  publicPost: PublicPostForApiDto
}

type ManagePostFormCreateProps = {
  mode: 'create'
}

type ManagePostFormProps = ManagePostFormUpdateProps | ManagePostFormCreateProps

export function ManagePostForm(props: ManagePostFormProps) {
  const { mode } = props
  const searchParams = useSearchParams()
  const created = searchParams.get('created')
  const router = useRouter()
  let publicPost

  if (mode === 'update') {
    publicPost = props.publicPost
  }

  const actionsMap = {
    create: createPostAction,
    update: updatePostAction,
  }

  const initialState = {
    formState: PublicPostForApiSchema.parse(publicPost || {}),
    errors: [],
  }
  const [state, action, isPending] = useActionState(actionsMap[mode], initialState)

  useEffect(() => {
    if (state.errors.length > 0) {
      toast.dismiss()
      state.errors.forEach(error => toast.error(error))
    }
  }, [state.errors])

  useEffect(() => {
    if (state.success) {
      toast.dismiss()
      toast.success('Post atualizado com sucesso!')
    }
  }, [state.success])

  useEffect(() => {
    if (created === '1') {
      toast.dismiss()
      toast.success('Post criado com sucesso!')
      const url = new URL(window.location.href)
      url.searchParams.delete('created')
      router.replace(url.toString())
    }
  }, [created, router])

  const { formState } = state
  const [contentValue, setContentValue] = useState(publicPost?.content || '')

  return (
    <form action={action} className='mb-16'>
      <div className='flex flex-col gap-6'>
        <InputText
          labelText='ID'
          name='id'
          placeholder='Id gerado automaticamente'
          type='text'
          defaultValue={formState.id}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText='Slug'
          name='slug'
          placeholder='Slug gerado automaticamente'
          type='text'
          defaultValue={formState.slug}
          disabled={isPending}
          readOnly
        />

        <InputText
          labelText='Título'
          name='title'
          placeholder='Digite o título do post'
          type='text'
          defaultValue={formState.title}
          disabled={isPending}
        />

        <InputText
          labelText='Excerto'
          name='excerpt'
          placeholder='Digite o resumo do post'
          type='text'
          defaultValue={formState.excerpt}
          disabled={isPending}
        />

        <MarkdownEditor
          labelText='Conteúdo'
          value={contentValue}
          setValue={setContentValue}
          textAreaName='content'
          disabled={isPending}
        />

        <ImageUploader disabled={isPending} />

        <InputText
          labelText='URL da imagem de capa'
          name='coverImage'
          placeholder='Digite a URL da imagem de capa'
          type='text'
          defaultValue={formState.coverImage}
          disabled={isPending}
        />

        {mode === 'update' && (
          <InputCheckBox
            labelText='Publicar?'
            name='published'
            type='checkbox'
            defaultChecked={formState.published}
            disabled={isPending}
          />
        )}

        <div className='mt-4'>
          <Button disabled={isPending} type='submit'>
            Enviar
          </Button>
        </div>
      </div>
    </form>
  )
}
