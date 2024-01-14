import * as z from 'zod'

export const CountingFormSchema = z.object({
  country: z.string(),
  dates: z.object({
    startDate: z.string(),
    endDate: z.string()
  })
})

export type CountingForm = z.infer<typeof CountingFormSchema>
