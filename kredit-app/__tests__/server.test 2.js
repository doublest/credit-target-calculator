/**
 * @jest-environment node
 */
const request = require('supertest');
const app = require('../server');

describe('Express Server', () => {
  it('serves index.html on GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    // Ensure it contains a known string from the HTML
    expect(res.text).toMatch(/Kredit-Zielwertberechnung/);
  });
});