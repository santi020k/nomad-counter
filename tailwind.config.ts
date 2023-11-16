import tailwindForm from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

import heights from './config/tailwind/heights'
import themes from './config/tailwind/themes'

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js'
  ],
  darkMode: 'class',
  theme: {
    extend: heights,
    fontFamily: {
      sans: ['"Cabin"', '"Roboto"', ...defaultTheme.fontFamily.mono]
    }
  },
  plugins: [tailwindForm, tailwindTypography, daisyui],
  daisyui: {
    logs: false,
    themes
  }
} satisfies Config
