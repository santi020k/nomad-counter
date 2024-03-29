/* eslint-disable @typescript-eslint/no-var-requires */
const importRules = require('./config/eslint/import-rules.cjs')
const reactRules = require('./config/eslint/react-rules.cjs')

module.exports = {
  env: {
    browser: true,
    es2023: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:astro/all',
    'plugin:astro/jsx-a11y-strict',
    'plugin:tailwindcss/recommended',
    'plugin:i18next/recommended',
    'plugin:testing-library/react',
    'plugin:vitest/all',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
    'plugin:@stylistic/all-extends'
  ],
  ignorePatterns: ['*.md'],
  plugins: [
    'simple-import-sort',
    'jsx-a11y',
    'unused-imports',
    'i18next',
    'vitest',
    'testing-library',
    '@stylistic',
    '@typescript-eslint'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'tailwindcss/no-custom-classname': 'off',
    'astro/semi': 'off',
    'max-len': [
      'error',
      { code: 120 }
    ],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': importRules,
    'vitest/no-hooks': [
      'error',
      {
        allow: [
          'afterEach',
          'afterAll',
          'beforeEach',
          'beforeAll'
        ]
      }
    ],
    'vitest/prefer-expect-assertions': 'off',
    'testing-library/no-manual-cleanup': 'off',
    'react/jsx-max-depth': [
      'warn',
      { max: 7 }
    ],
    'react/prop-types': 'off',
    'unused-imports/no-unused-imports': 'error',
    'testing-library/prefer-screen-queries': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@stylistic/indent': [
      'error',
      2
    ],
    '@stylistic/quote-props': [
      'error',
      'as-needed'
    ],
    '@stylistic/quotes': [
      'error',
      'single'
    ],
    '@stylistic/semi': [
      'error',
      'never'
    ],
    '@stylistic/object-curly-spacing': [
      'error',
      'always'
    ],
    '@stylistic/padded-blocks': [
      'error',
      'never'
    ],
    '@stylistic/arrow-parens': [
      'error',
      'as-needed'
    ],
    '@stylistic/dot-location': [
      'error',
      'property'
    ],
    '@stylistic/member-delimiter-style': 'off',
    '@stylistic/no-extra-parens': 'off',
    '@stylistic/function-call-argument-newline': [
      'error',
      'never'
    ],
    '@stylistic/object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: true }
    ],
    indent: 'off',
    '@typescript-eslint/indent': 'off'
  },
  overrides: [
    {
      files: ['*.astro'],
      extends: ['standard-with-typescript'],
      parser: 'astro-eslint-parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 'off'
      }
    },
    {
      files: [
        '*.jsx',
        '*.tsx',
        '*.mjs',
        '*.mts',
        '*.js',
        '*.ts'
      ],
      extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'standard-with-typescript'
      ],
      parser: '@typescript-eslint/parser',
      plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint'
      ],
      rules: reactRules,
      settings: { react: { version: 'detect' } }
    },
    {
      files: [
        '*.md',
        '*.mdx'
      ],
      extends: ['plugin:mdx/recommended'],
      settings: {
        'mdx/code-blocks': true,
        'mdx/language-mapper': {}
      },
      rules: {
        'max-len': 'off',
        'react/react-in-jsx-scope': 'off'
      }
    }
  ]
}
