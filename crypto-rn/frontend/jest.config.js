'use strict';

const findCacheDir = require('find-cache-dir');

module.exports = {
  // The directory where Jest should store its cached dependency information
  cacheDirectory: findCacheDir({name: 'jest'}) ?? 'node_modules/.cache/jest',

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.(ts|tsx|mjs|js|jsx|node)'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'reports',

  // A list of reporter names that Jest uses when writing coverage reports. Any istanbul reporter can be used.
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/types/',
    '/__.+__/',
    '^.+(.generated.).+$',
    '^.+(.mock.).+$',
    '^.+(.graphql.).+$',
    '^.+(.gql.).+$',
    '^.+(.d.ts)$',
  ],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      lines: 80,
      functions: 80,
    },
  },

  // Activates notifications for test results
  notify: true,

  // An enum that specifies notification mode. Requires { notify: true }
  notifyMode: 'always',

  // A preset that is used as a base for Jest's configuration
  preset: 'react-native',

  // A set of global variables that need to be available in all test environments
  globals: {},

  // An array of file extensions your modules use
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'svg'],

  // The root directory that Jest should scan for tests and modules within
  rootDir: null,

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // A list of paths to modules that run some code to configure or set up the testing environment.
  setupFiles: [require.resolve('./jest.setup.js')],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: [require.resolve('./jest.env.js')],

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing.
  snapshotSerializers: [
    '@emotion/jest/serializer' /* if needed other snapshotSerializers should go here */,
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|jsx|ts|tsx|node)$': 'babel-jest',
    '\\.(svg)$': '<rootDir>/jest.svg-transformer.js',
  },

  // Test environment
  testEnvironment: 'jsdom',

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/e2e',
    '<rootDir>/e2eBW',
    '<rootDir>/resources',
    '<rootDir>/patches',
  ],

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-.*)?|@react-native(-community)?|@react-navigation/(.*))/)',
    '\\.pnp\\.[^\\/]+$',
  ],

  // Whether to use watchman for file crawling
  watchman: true,
};
