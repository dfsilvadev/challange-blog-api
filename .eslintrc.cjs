module.exports = {
  // ...
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier', // Adicione esta linha
    'plugin:prettier/recommended' // Adicione esta linha
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error',
    'prettier/prettier': 'warn',
    'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }]
  }
};
