'use strict';

const path = require('path');

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  cacheDirectory: path.join(process.env.CACHE_DIR, 'jest'),
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['next/babel'],
        plugins: [
          [
            'babel-plugin-relay',
            {
              artifactDirectory: path.resolve('generated'),
            },
          ],
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!d3-.*)/',
    '<rootDir>/node_modules/jest-runner/',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/playground/'],
};
