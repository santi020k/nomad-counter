import tailwindForm from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import preline from 'preline/plugin'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

// Move to alias
import colors from './config/tailwind/colors'
import heights from './config/tailwind/heights'

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    './node_modules/preline/preline.js'
  ],
  darkMode: [
    'class',
    '[data-theme="dark"]'
  ],
  theme: {
    extend: {
      ...heights,
      colors
    },
    fontFamily: {
      sans: [
        '"Inter Variable"',
        '"Roboto"',
        ...defaultTheme.fontFamily.mono
      ]
    }
  },
  plugins: [
    tailwindForm,
    tailwindTypography,
    preline
  ]
} satisfies Config
