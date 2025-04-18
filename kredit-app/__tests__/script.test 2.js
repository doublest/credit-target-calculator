/**
 * @jest-environment jsdom
 */
const script = require('../public/script.js');

test('berechneAbzahldatum is defined', () => {
  expect(typeof script.berechneAbzahldatum).toBe('function');
});

test('berechneMonatlicheRate is defined', () => {
  expect(typeof script.berechneMonatlicheRate).toBe('function');
});