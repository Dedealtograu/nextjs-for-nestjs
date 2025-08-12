import type { Metadata } from 'next'
import './globals.css'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ToastifyContainer } from '@/components/ToastifyContainer'

export const metadata: Metadata = {
  title: {
    default: 'The blog - Este é um blog criado com Next.js',
    template: '%s | The blog',
  },
  description: 'Este é um blog criado com Next.js, TypeScript e Tailwind CSS',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR'>
      <body>
        <Container>
          <Header />
          {children}
          <Footer />
        </Container>
        <ToastifyContainer />
      </body>
    </html>
  )
}
