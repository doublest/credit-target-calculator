/**
 * Jest configuration for kredit-app
 */
module.exports = {
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/server.js'],
  modulePathIgnorePatterns: ['<rootDir>/.stryker-tmp'],
  // Add HTML reporter for test results
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './html-report',
      filename: 'report.html',
      expand: true
    }]
  ],
  // Disable Babel transformations
  transform: {},
  // Automatically mock the 'mime' module to satisfy superagent requirements
  setupFiles: ['<rootDir>/jest.setup.js'],
};
