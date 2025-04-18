/**
 * @type {import('@stryker-mutator/api/core').Config}
 */
module.exports = {
  mutator: 'javascript',
  packageManager: 'npm',
  reporters: ['clear-text', 'progress', 'html'],
  testRunner: 'none',
  mutate: ['public/**/*.js', 'server.js'],
  coverageAnalysis: 'off'
};