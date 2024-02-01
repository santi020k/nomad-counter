import tailwindForm from '@tailwindcss/forms'
import tailwindTypography from '@tailwindcss/typography'
import daisyui from 'daisyui'
import preline from 'preline/plugin'
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

import heights from './config/tailwind/heights'
import themes from './config/tailwind/themes'

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
    './node_modules/preline/preline.js'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: heights,
    fontFamily: {
      sans: ['"Inter Variable"', '"Roboto"', ...defaultTheme.fontFamily.mono]
    },
    colors: {
      americViolet: {
        50: '#ECE5FB',
        100: '#D6C6F6',
        200: '#B091ED',
        300: '#8758E4',
        400: '#5F23D7',
        500: '#471AA0',
        600: '#38157F',
        700: '#2B1060',
        800: '#1D0B42',
        900: '#0E051F',
        950: '#080312'
      },
      lavander: {
        50: '#F8F2FD',
        100: '#F1E5FA',
        200: '#E2CBF5',
        300: '#D2ADF0',
        400: '#C494EB',
        500: '#B579E6',
        600: '#943EDB',
        700: '#7021B0',
        800: '#4C1678',
        900: '#260B3C',
        950: '#13061E'
      },
      magenta: {
        50: '#EDEAF6',
        100: '#DED8EE',
        200: '#BCB2DC',
        300: '#9B8BCB',
        400: '#7661B8',
        500: '#5C469C',
        600: '#48377B',
        700: '#382B5F',
        800: '#251C3F',
        900: '#130E20',
        950: '#08060E'
      },
      mauve: {
        50: '#FAF5FF',
        100: '#F7F0FE',
        200: '#EDDDFE',
        300: '#E6CEFD',
        400: '#DEBFFD',
        500: '#D4ADFC',
        600: '#AB5DF9',
        700: '#8009F6',
        800: '#5406A2',
        900: '#2B0354',
        950: '#140127'
      }
    }
  },
  plugins: [tailwindForm, tailwindTypography, daisyui, preline],
  daisyui: {
    logs: false,
    themes
  }
} satisfies Config
