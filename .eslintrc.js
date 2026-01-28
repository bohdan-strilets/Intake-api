module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint', 'prettier', 'unused-imports', 'simple-import-sort'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],

  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: ['.eslintrc.js'],

  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.json',
      },
    },
  },

  rules: {
    // ========================
    // 🧠 TypeScript discipline
    // ========================
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    '@typescript-eslint/no-unused-vars': 'off', // замінено unused-imports
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // ========================
    // 🧹 Auto-remove imports
    // ========================
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    // ========================
    // 🔀 Import sorting
    // ========================
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // ========================
    // 🎨 Prettier as truth
    // ========================
    'prettier/prettier': 'error',
  },
};
