'use client'

import ErrorMessage from '@/components/ErrorMessage'
import { useEffect } from 'react'

type RootErrorPageProps = {
  error: Error
  reset: () => void
}

export default function RootErrorPage({ error }: RootErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <ErrorMessage
      pageTitle='Internal Server Error'
      contentTitle='501'
      content='Erro 500 - Ocorreu um erro inesperado. Por favor, tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.'
    />
  )
}
