// jest.setup.js
// Setup file to mock the 'mime' module for superagent in tests
jest.mock('mime', () => ({
  // superagent expects mime.define to be available
  define: () => {},
  // provide a lookup function to return a generic content-type
  lookup: () => 'application/octet-stream',
}));

// Polyfills for Node 18+/Jest+jsdom
try {
  const { TextEncoder, TextDecoder } = require('util');
  if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
  if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;
} catch (_) {
  // ignore if not available
}

// Avoid jsdom "not implemented" alert throwing during tests
if (typeof global.alert === 'undefined') {
  global.alert = () => {};
}
