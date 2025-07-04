import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      js,
      prettier: prettierPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      'no-console': 'error',
      'no-unused-vars': [
        'error',
        { args: 'after-used', argsIgnorePattern: '^_' }
      ],
      'prettier/prettier': 'warn'
    }
  },

  {
    files: ['**/*.{test,spec}.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    plugins: {
      jest
    },
    rules: {
      ...jest.configs.recommended.rules
    }
  },

  prettierConfig
]);
