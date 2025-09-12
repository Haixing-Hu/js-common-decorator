////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2025.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import qubitConfig from '@qubit-ltd/eslint-config';

export default [
  ...qubitConfig,
  {
    files: ['src/**/*.js', 'test/**/*.js'],
    languageOptions: {
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
          plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { version: '2023-11' }]
          ]
        }
      }
    }
  },
  {
    files: ['src/timeout.js'],
    languageOptions: {
      globals: {
        setTimeout: 'readonly'
      }
    }
  },
  {
    files: ['test/**/*.js'],
    rules: {
      'max-classes-per-file': 'off',  // ignore max-classes-per-file rule in test files
      'no-unused-vars': 'off',        // ignore no-unused-vars rule in test files
    },
  },
];
