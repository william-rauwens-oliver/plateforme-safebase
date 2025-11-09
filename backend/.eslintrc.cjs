module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
  },
};

