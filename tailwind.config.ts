import tailwindForm from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import flowbite from 'flowbite/plugin'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

import heights from './config/tailwind/heights'
import themes from './config/tailwind/themes'

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: heights,
    fontFamily: {
      sans: ['"Cabin"', '"Roboto"', ...defaultTheme.fontFamily.mono]
    }
  },
  plugins: [tailwindForm, tailwindTypography, daisyui, flowbite],
  daisyui: {
    logs: false,
    themes
  }
} satisfies Config
