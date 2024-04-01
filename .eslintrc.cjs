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
    'tailwindcss/no-custom-classname': 0,
    'astro/semi': 0,
    'max-len': 0,
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': importRules,
    'vitest/no-hooks': [
      'error', {
        allow: ['afterEach', 'afterAll', 'beforeEach', 'beforeAll']
      }
    ],
    'vitest/prefer-expect-assertions': 0,
    'testing-library/no-manual-cleanup': 0,
    'react/jsx-max-depth': ['warn', { max: 7 }],
    'react/prop-types': 0,
    'unused-imports/no-unused-imports': 'error',
    'testing-library/prefer-screen-queries': 0,
    'react-hooks/exhaustive-deps': 0,
    '@stylistic/indent': ['error', 2],
    '@stylistic/quote-props': ['error', 'as-needed'],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/padded-blocks': ['error', 'never'],
    '@stylistic/arrow-parens': ['error', 'as-needed'],
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/member-delimiter-style': 0,
    '@stylistic/no-extra-parens': 0,
    '@stylistic/function-call-argument-newline': ['error', 'never'],
    '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    '@stylistic/max-len': [
      'error', {
        code: 120,
        tabWidth: 2,
        comments: 200
      }
    ],
    '@stylistic/max-statements-per-line': ['error', { max: 1 }],
    '@stylistic/array-element-newline': ['error', 'consistent'],
    '@stylistic/no-extra-semi': 0,
    '@stylistic/no-multi-spaces': 0,
    '@stylistic/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: '*' },
      { blankLine: 'any', prev: 'import', next: 'import' },
      { blankLine: 'never', prev: 'const', next: 'const' },
      { blankLine: 'never', prev: 'let', next: 'let' },
      { blankLine: 'always', prev: 'block-like', next: 'const' },
      { blankLine: 'always', prev: 'const', next: 'block-like' }
    ],
    '@stylistic/function-paren-newline': ['error', 'consistent'],
    indent: 0,
    '@typescript-eslint/indent': 0
  },
  overrides: [
    {
      files: ['*.astro'],
      extends: ['standard-with-typescript'],
      parser: 'astro-eslint-parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 0
      }
    }, {
      files: ['*.jsx', '*.tsx', '*.mjs', '*.mts', '*.js', '*.ts'],
      extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'standard-with-typescript'],
      parser: '@typescript-eslint/parser',
      plugins: ['react', 'react-hooks', '@typescript-eslint'],
      rules: reactRules,
      settings: { react: { version: 'detect' } }
    }, {
      files: ['*.md', '*.mdx'],
      extends: ['plugin:mdx/recommended'],
      settings: {
        'mdx/code-blocks': true,
        'mdx/language-mapper': {}
      },
      rules: {
        'max-len': 0,
        'react/react-in-jsx-scope': 0
      }
    }
  ]
}
