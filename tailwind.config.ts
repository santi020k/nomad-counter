import type { Config } from 'tailwindcss'

import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import daisyuiTheme from 'daisyui/src/theming/themes'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {}
  },
  plugins: [tailwindTypography, daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiTheme['[data-theme=light]'],
          primary: '#BB84E8',
          secondary: '#471AA0'
        },
        dark: {
          ...daisyuiTheme['[data-theme=dark]'],
          primary: '#BB84E8',
          secondary: '#471AA0'
        }
      }
    ]
  }
} satisfies Config
