////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  verbose: true,
  testMatch: ['**/test/**/*.test.js'],
  testEnvironment: 'jest-environment-jsdom-global',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  moduleFileExtensions: ['js'],
  moduleDirectories: ['node_modules'],
  transform: {
    '\\.js$': 'babel-jest',
    // '^.+\\.vue$': '@vue/vue3-jest',
  },
  setupFilesAfterEnv: [
    'jest-extended/all',
  ],
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: [
    'src/index.js',
    'src/deprecated/**/*.js',
  ],
};
