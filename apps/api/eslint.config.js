// @ts-check

import honoConfig from '@santi020k/eslint-config-hono'
import { eslintConfig } from '@santi020k/eslint-config-basic'

export default [
  {
    name: 'api/ignores',
    ignores: ['.wrangler/**', 'dist/**', 'node_modules/**']
  },
  ...eslintConfig({
    typescript: true,
    frameworks: {
      hono: honoConfig
    }
  }),
  {
    name: 'api/typescript-project',
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        projectService: false,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
]
