/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unicorn', 'unused-imports'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
    extraFileExtensions: ['.svelte'],
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  globals: {
    NodeJS: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        // Allow underscore (_) variables
        argsIgnorePattern: '^_$',
        varsIgnorePattern: '^_$',
      },
    ],
    curly: 2,
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/import-style': 'off',
    // TODO: set recommended-type-checked and remove these rules
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/require-await': 'error',
    'unused-imports/no-unused-imports-ts': 2,
  },
};
