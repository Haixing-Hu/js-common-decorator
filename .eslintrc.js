////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: [
    '@qubit-ltd/eslint-config',
  ],
  overrides: [{
    files: ['test/**/*.js'],
    rules: {
      'max-classes-per-file': 'off',  // ignore max-classes-per-file rule in test files
      'no-unused-vars': 'off',        // ignore no-unused-vars rule in test files
    },
  }],
};
