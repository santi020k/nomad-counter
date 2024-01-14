const importRules = require("./config/eslint/import-rules.cjs");
const reactRules = require("./config/eslint/react-rules.cjs");

module.exports = {
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:astro/all",
    "plugin:astro/jsx-a11y-strict",
    "plugin:tailwindcss/recommended",
    "plugin:i18next/recommended",
    'plugin:testing-library/react',
    "plugin:vitest/all"
  ],
  ignorePatterns: ["*.md"],
  plugins: ["simple-import-sort", "jsx-a11y", "unused-imports", "i18next", "vitest", "testing-library"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "tailwindcss/no-custom-classname": "off",
    "astro/semi": "off",
    "max-len": ["error", { code: 120 }],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": importRules,
    "vitest/no-hooks": [
      "error",
      {
        "allow": ["afterEach", "afterAll", "beforeEach", "beforeAll"]
      }
    ],
    "vitest/prefer-expect-assertions": "off",
    "testing-library/no-manual-cleanup": "off"
  },
  overrides: [
    {
      files: ["*.astro"],
      extends: ["standard-with-typescript"],
      parser: "astro-eslint-parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/strict-boolean-expressions": "off",
      },
    },
    {
      files: ["*.jsx", "*.tsx", "*.mjs", "*.mts", "*.js", "*.ts"],
      extends: [
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "standard-with-typescript",
      ],
      parser: "@typescript-eslint/parser",
      plugins: ["react", "react-hooks", "@typescript-eslint"],
      rules: reactRules,
      settings: { react: { version: "detect" } },
    },
    {
      files: ["*.md", "*.mdx"],
      extends: ["plugin:mdx/recommended"],
      settings: {
        "mdx/code-blocks": true,
        "mdx/language-mapper": {},
      },
      rules: {
        "max-len": "off",
      },
    }
  ],
};
