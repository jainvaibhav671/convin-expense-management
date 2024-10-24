/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1' // Map @/* to src/*
  },
  // Other Jest configuration options...
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
