'use strict';

module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['**/*.d.ts'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  ],
};
