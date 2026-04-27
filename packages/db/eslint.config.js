// @ts-check

import { eslintConfig } from '@santi020k/eslint-config-basic'

export default [
  {
    name: 'db/ignores',
    ignores: ['dist/**', 'node_modules/**']
  },
  ...eslintConfig({ typescript: true }),
  {
    name: 'db/typescript-project',
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        projectService: false,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
]
