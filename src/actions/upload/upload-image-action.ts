'use server'

import { verifyLoginSession } from '@/lib/login/manage-login'
import { mkdir, writeFile } from 'fs/promises'
import { extname, resolve } from 'path'

type uploadImageActionResylt = {
  url: string
  error: string
}


export async function uploadImageAction(formData: FormData): Promise<uploadImageActionResylt> {
  const makeResult = ({url = '', error = ''}) => ({url, error})

  const isAuthenticated = await verifyLoginSession()

  if (!isAuthenticated) {
    return makeResult({ error: 'Você precisa estar logado para fazer isso' })
  }

  if (!(formData instanceof FormData)) {
    return makeResult({ error: 'Dados inválidos' })
  }

  const file = formData.get('file')

  if (!(file instanceof File)) {
    return makeResult({ error: 'Arquivo inválido' })
  }

  const uploadMaxSize = Number(process.env.NEXT_PUBLIC_IMAGE_UPLOADER_MAX_SIZE) || 921600

  if (file.size > uploadMaxSize) {
    return makeResult({ error: 'Arquivo muito grande' })
  }

  if (!file.type.startsWith('image/')) {
    return makeResult({ error: 'Imagem inválida' })
  }

  const imageExtension = extname(file.name)
  const uniqueImageName = `${Date.now()}${imageExtension}`
  const uploadDir = process.env.IMAGE_UPLOAD_DIRECTORY || 'uploads'

  const uploadFullPath = resolve(process.cwd(), 'public', uploadDir)

  await mkdir(uploadFullPath, { recursive: true })

  const fileArrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(fileArrayBuffer)
  const fileFullPath = resolve(uploadFullPath, uniqueImageName)

  await writeFile(fileFullPath, buffer)

  const imgServerUrl = process.env.IMAGE_SERVER_URL || 'http://localhost:3000'

  const url = `${imgServerUrl}/${uniqueImageName}`

  return makeResult({ url })
}
