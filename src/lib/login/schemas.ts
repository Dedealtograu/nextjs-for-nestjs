import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().trim().email({ message: 'Email inválido' }),
  password: z.string().trim().min(6, 'Senha precisa ter pelo menos 6 caracteres'),
})
