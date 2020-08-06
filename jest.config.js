
module.exports = {
  'testMatch': [
    '<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}'
  ],
  'preset': 'ts-jest',
  'testEnvironment': 'jsdom',
  'moduleNameMapper': {
    '^components(.*)$': '<rootDir>/src/components$1',
    '^pages(.*)$': '<rootDir>/src/pages$1',
    '^api(.*)$': '<rootDir>/src/api$1',
    '^assets(.*)$': '<rootDir>/src/assets$1',
    '^common(.*)$': '<rootDir>/src/common$1',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  'transform': {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'
  },
  'verbose': true,
  'moduleDirectories': [
    'node_modules',
    'src'
  ],
  'globals': {
    'ts-jest': {
      'babelConfig': true
    }
  },
  'coveragePathIgnorePatterns': [],
  'transformIgnorePatterns': [],
  'testPathIgnorePatterns': [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
    '<rootDir>/node_modules/'
  ],
};
