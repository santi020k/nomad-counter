var simpleImportRules = [
  "error",
  {
    "groups": [
      // Packages `react` related packages come first.
      ["^react"],
      // Libs Packages
      ["^@?\\w", "^(@|components)(/.*|$)"],
      // Internal packages.
      ["^(@atoms)(/.*|$)"],
      ["^(@molecules)(/.*|$)"],
      ["^(@organisms)(/.*|$)"],
      ["^(@layouts)(/.*|$)"],
      ["^(@pages)(/.*|$)"],
      ["^(@libs)(/.*|$)"],
      ["^(@store)(/.*|$)"],
      ["^(@models)(/.*|$)"],
      ["^(@utils)(/.*|$)"],
      // Side effect imports.
      ["^\\u0000"],
      // Parent imports. Put `..` last.
      ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
      // Other relative imports. Put same-folder imports and `.` last.
      ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
      // Style imports.
      ["^.+\\.?(css)$"]
    ]
  }
];

module.exports = {
  extends: [
    "plugin:astro/all",
    "plugin:astro/jsx-a11y-strict",
    "plugin:tailwindcss/recommended"
  ],
  rules: {
    "tailwindcss/no-custom-classname": "off"
  },
  overrides: [
    {
      // Ts standard
      extends: ["standard-with-typescript"],
      // Define the configuration for `.astro` file.
      files: ["*.astro"],
      // Allows Astro components to be parsed.
      parser: "astro-eslint-parser",
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
        sourceType: "module",
        ecmaVersion: 2023
      },
      plugins: ["simple-import-sort", "@typescript-eslint", "jsx-a11y", "unused-imports"],
      rules: {
        "astro/semi": "off",
        "max-len": ["error", { "code": 120 }],
        // increase the severity of rules so they are auto-fixable
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": simpleImportRules
      },
    },
    {
      files: ["*.jsx", "*.tsx", "*.mjs", "*.mts", "*.js", "*.ts"],
      env: {
        browser: true,
        es2021: true
      },
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "standard-with-typescript"
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
      },
      plugins: ["unused-imports", "react", "react-hooks", "@typescript-eslint", "jsx-a11y", "simple-import-sort"],
      rules: {
        "react/react-in-jsx-scope": "off",
        "react/button-has-type": "error",
        "react/display-name": "error",
        "react/no-children-prop": "error",
        "react/no-danger-with-children": "error",
        // TODO: Pending to remove
        // "react/jsx-no-bind": "error",
        "arrow-body-style": "error",
        "react/no-unstable-nested-components": "error",
        "react/self-closing-comp": ["error", { "component": true, "html": true }],
        "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "never" }],
        "react/jsx-curly-newline": "error",
        "react/destructuring-assignment": "error",
        "react/jsx-pascal-case": "error",
        "react/boolean-prop-naming": "error",
        "react/hook-use-state": "error",
        "react/jsx-boolean-value": "error",
        "react/jsx-closing-tag-location": "error",
        "react/jsx-closing-bracket-location": "error",
        "react/jsx-wrap-multilines": "error",
        "react/jsx-no-target-blank": "error",
        "react/jsx-no-leaked-render": "error",
        "react/jsx-handler-names": "error",
        "react/jsx-fragments": "error",
        "react/jsx-max-depth": ["error", { "max": 5 }],
        "react/no-deprecated": "error",
        "react/no-multi-comp": "error",
        "react/no-unescaped-entities": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/ban-types": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/ban-ts-comment": "error",
        "jsx-a11y/alt-text": "error",
        "no-empty": "error",
        "no-nested-ternary": "error",
        "no-undef": "error",
        "react/prop-types": 0,
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "error",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_"
          }
        ],
        "max-len": ["error", { "code": 120 }],
        "astro/semi": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        // increase the severity of rules so they are auto-fixable
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": simpleImportRules
      },
      settings: {
        react: {
          version: "detect"
        }
      }
    }
  ],
};
