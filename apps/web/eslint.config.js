// @ts-check

import astroConfig from '@santi020k/eslint-config-astro'
import { eslintConfig, playwright } from '@santi020k/eslint-config-basic'
import reactConfig from '@santi020k/eslint-config-react'

export default [
  {
    name: 'web/ignores',
    ignores: ['**/.astro/**', 'dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**']
  },
  ...eslintConfig({
    typescript: true,
    frameworks: {
      astro: astroConfig,
      react: reactConfig
    }
  }),
  {
    name: 'web/commonjs-config',
    files: ['*.cjs', '**/*.cjs'],
    languageOptions: {
      globals: {
        module: 'readonly'
      }
    }
  },
  {
    name: 'web/typescript-project',
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
        projectService: false,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/styles/global.css',
        detectComponentClasses: true
      }
    },
    rules: {
      'better-tailwindcss/no-unknown-classes': 'off'
    }
  },
  {
    name: 'web/astro-template-typescript',
    files: ['**/*.astro'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off'
    }
  },
  ...playwright.map(config => ({
    ...config,
    name: `web/${config.name ?? 'playwright-tests'}`,
    files: ['tests/**/*.ts']
  }))
]
