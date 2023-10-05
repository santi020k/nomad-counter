module.exports = {
  extends: [
    "plugin:astro/all",
  ],
  overrides: [
    {
      // Ts standard
      extends: 'standard-with-typescript',
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
      rules: {
        "astro/semi": "off",
      },
    },
    {
      files: ["*.mjs", "*.mts"],
      // Ts standard
      extends: 'standard-with-typescript',
      env: {
        browser: true,
        es2023: true,
      },
      parserOptions: {
        sourceType: "module",
      },
      rules: {
        "astro/semi": "off",
      },
    },
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      extends: 'standard-with-typescript'
    }
  ],
};
