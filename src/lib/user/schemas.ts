import { z } from 'zod'

const CreateUserBase = z.object({
  name: z.string().trim().min(4, 'Nome precisa ter pelo menos 4 caracteres'),
  email: z.string().trim().email({ message: 'Email inválido' }),
  password: z.string().trim().min(6, 'Senha precisa ter pelo menos 6 caracteres'),
  passwordConfirmation: z.string().trim().min(6, 'Confirmação da senha precisa ter pelo menos 6 caracteres'),
})

export const CreateUserSchema = CreateUserBase.refine(
  data => {
    return data.password === data.passwordConfirmation
  },
  {
    message: 'As senhas precisam ser iguais',
    path: ['passwordConfirmation']
  }
).transform(({ name, email, password }) => {
  return { name, email, password }
})

export const PublicUserSchema = z.object({
  id: z.string().default(''),
  name: z.string().default(''),
  email: z.string().default(''),
})

export const UpdatePasswordSchema = z.object({
  currentPassword: z.string().trim().min(6, 'Senha atual precisa ter pelo menos 6 caracteres'),
  newPassword: z.string().trim().min(6, 'Nova senha precisa ter pelo menos 6 caracteres'),
  newPasswordConfirmation: z.string().trim().min(6, 'Confirmação da nova senha precisa ter pelo menos 6 caracteres'),
}).refine(data => {
  return data.newPassword === data.newPasswordConfirmation
}, {
  message: 'As senhas precisam ser iguais',
  path: ['newPasswordConfirmation']
}).transform(({ currentPassword, newPassword }) => {
  return { currentPassword, newPassword }
})

export const UpdateUserSchema = CreateUserBase.omit({password: true, passwordConfirmation: true}).extend({})

export type CreateUserDto = z.infer<typeof CreateUserSchema>
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
export type PublicUserDto = z.infer<typeof PublicUserSchema>
export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>
