import type { Config } from 'tailwindcss'

import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import daisyuiTheme from 'daisyui/src/theming/themes'

import defaultTheme  from 'tailwindcss/defaultTheme'

const customTheme = {
  primary: '#471AA0',
  secondary: '#BB84E8',
  ".btn-primary": {
    "background-color": "#471AA0",
    "border-color": "#471AA0",
    "color": "#fff",
  },
  ".btn-secondary": {
    "background-color": "#BB84E8",
    "border-color": "#BB84E8",
    "color": "#fff",
  },
}

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
      fontFamily: {
        'sans': ['"Cabin"', '"Roboto"', ...defaultTheme.fontFamily.mono],
      }
  },
  plugins: [tailwindTypography, daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiTheme['[data-theme=light]'],
          ...customTheme
        },
        dark: {
          ...daisyuiTheme['[data-theme=dark]'],
          ...customTheme
        }
      }
    ]
  }
} satisfies Config
