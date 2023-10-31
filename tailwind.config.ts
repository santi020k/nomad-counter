import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import daisyuiTheme from 'daisyui/src/theming/themes'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

// Original colors
// Primary #471AA0
// Secondary #BB84E8

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['"Cabin"', '"Roboto"', ...defaultTheme.fontFamily.mono]
    }
  },
  plugins: [tailwindTypography, daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyuiTheme['[data-theme=light]'],
          primary: '#471AA0',
          secondary: '#B579E6',
          '.btn-primary': {
            'background-color': '#471AA0',
            'border-color': '#471AA0',
            color: '#fff'
          },
          '.btn-secondary': {
            'background-color': '#B579E6',
            'border-color': '#B579E6',
            color: '#fff'
          }
        },
        dark: {
          ...daisyuiTheme['[data-theme=dark]'],
          primary: '#b296d6',
          secondary: '#e2c8f6',
          '.btn-primary': {
            'background-color': '#b296d6',
            'border-color': '#b296d6',
            color: '#fff'
          },
          '.btn-secondary': {
            'background-color': '#e2c8f6',
            'border-color': '#e2c8f6',
            color: '#fff'
          }
        }
      }
    ]
  }
} satisfies Config
