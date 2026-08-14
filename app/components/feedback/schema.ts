import { z } from 'zod/mini'

export const pageFeedback = z.object({
  opinion: z.enum(['good', 'bad']),
  url: z.string(),
  message: z.string(),
})

export const actionResponse = z.object({})

export type PageFeedback = z.infer<typeof pageFeedback>
export type ActionResponse = z.infer<typeof actionResponse>
