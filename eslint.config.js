import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';

export default [
  // 'eslint:recommended',
  {
    ignores: ['build/*', '.yarn/'],
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
      },
    },
    settings: {
      react: {
        version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
      },
    },
    plugins: {
      '@typescript-eslint': typescript, // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      prettier, // Disables ESLint rules that would conflict with prettier
      prettierPluginRecommended, // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    },
    rules: {
      '@typescript-eslint/ban-types': [
        'error',
        {
          types: {
            '{}': false,
            Object: false,
            object: false,
            Function: false,
          },
          extendDefaults: true,
        },
      ],
      'max-len': [
        'warn',
        {
          code: 80,
          comments: 120,
          ignoreComments: true,
          ignoreStrings: true, // ignores lines that contain a double-quoted or single-quoted string
          ignoreTemplateLiterals: true, // ignores lines that contain a template literal
          ignoreRegExpLiterals: true, // ignores lines that contain a RegExp literal
          tabWidth: 2,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/adjacent-overload-signatures': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      quotes: [1, 'single', 'avoid-escape'], // TODO: check the options
      'spaced-comment': ['error', 'always'],
    },
  },
];
