// jest.setup.js
// Setup file to mock the 'mime' module for superagent in tests
jest.mock('mime', () => ({
  // superagent expects mime.define to be available
  define: () => {},
  // provide a lookup function to return a generic content-type
  lookup: () => 'application/octet-stream',
}));