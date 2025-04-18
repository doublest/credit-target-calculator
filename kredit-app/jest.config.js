/**
 * Jest configuration for kredit-app
 */
module.exports = {
  testEnvironment: 'jsdom',
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
  transform: {}
};