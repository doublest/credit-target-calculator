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

test('zeigeFortschritt is defined', () => {
  expect(typeof script.zeigeFortschritt).toBe('function');
});

test('formatEuro is defined', () => {
  expect(typeof script.formatEuro).toBe('function');
});

test('formatEuro formats numbers in German Euro format', () => {
  expect(script.formatEuro(125000)).toBe('125.000,00 €');
  expect(script.formatEuro(1200.5)).toBe('1.200,50 €');
  expect(script.formatEuro(0)).toBe('0,00 €');
  expect(script.formatEuro(99.999)).toBe('100,00 €');
});

test('parseEuro parses German Euro format', () => {
  expect(script.parseEuro('250.000,00 €')).toBe(250000);
  expect(script.parseEuro('1.200,50 €')).toBe(1200.5);
  expect(script.parseEuro('100000')).toBe(100000);
  expect(script.parseEuro('100,00')).toBe(100);
  expect(Number.isNaN(script.parseEuro(''))).toBe(true);
});