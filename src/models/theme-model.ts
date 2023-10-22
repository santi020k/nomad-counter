import * as z from 'zod'

export const themes = z.enum(['light', 'dark'])

export const defaultTheme = themes.enum.light

export type Theme = z.infer<typeof themes>
