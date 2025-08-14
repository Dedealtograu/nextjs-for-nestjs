import { isUrlOrRelativePath } from '@/utils/is-url-or-relative-path'
import sanitizeHtml from 'sanitize-html'
import  { z } from 'zod'
import { PublicUserSchema } from '../user/schemas'

const PostBasicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(120, 'O título deve ter no máximo 120 caracteres'),
  content: z
    .string()
    .trim()
    .min(3, 'O conteúdo é obrigatório')
    .transform(val => sanitizeHtml(val)),
  author: z
    .string()
    .trim()
    .min(4, 'O nome do autor deve ter pelo menos 4 caracteres')
    .max(100, 'O nome do autor deve ter no máximo 100 caracteres'),
  excerpt: z
    .string()
    .trim()
    .min(10, 'O excerto deve ter pelo menos 10 caracteres')
    .max(300, 'O excerto deve ter no máximo 300 caracteres'),
  coverImageUrl: z
    .string()
    .trim()
    .refine(isUrlOrRelativePath, {
      message: 'A URL da imagem de capa deve ser uma URL válida',
    }),
    published: z
    .union([
      z.literal('on'),
      z.literal('true'),
      z.literal('false'),
      z.literal(true),
      z.literal(false),
      z.literal(null),
      z.literal(undefined),
    ])
    .default(false)
    .transform(val => val === 'on' || val === 'true' || val === true),
})

export const PostCreateSchema = PostBasicSchema

export const PostUpdateSchema = PostBasicSchema.extend({})

export const CreatePostForApiSchema = PostBasicSchema.omit({ author: true, published: true }).extend({})

export const UpdatePostForApiSchema = PostBasicSchema.omit({ author: true }).extend({})

export const PublicPostForApiSchema = PostBasicSchema.extend({
  id: z.string().default(''),
  slug: z.string().default(''),
  title: z.string().default(''),
  excerpt: z.string().default(''),
  author: PublicUserSchema.optional().default({ id: '', name: '', email: '' }),
  content: z.string().default(''),
  coverImageUrl: z.string().default(''),
  createdAt: z.string().default(''),
})

export type CreatePostForApiDto = z.infer<typeof CreatePostForApiSchema>
export type UpdatePostForApiDto = z.infer<typeof UpdatePostForApiSchema>
export type PublicPostForApiDto = z.infer<typeof PublicPostForApiSchema>
