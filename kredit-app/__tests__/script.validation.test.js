/**
 * @jest-environment jsdom
 */

describe('Frontend validation edge cases', () => {
  let script;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="kreditbetrag1" value="100000" />
      <input id="restschuld1" value="50000" />
      <input id="monatlicheRate1" value="0" />
      <p id="ergebnis1"></p>

      <input id="kreditbetrag2" value="100000" />
      <input id="restschuld2" value="60000" />
      <input id="zieldatum" />
      <small id="zieldatumError" class="error-message"></small>
      <p id="ergebnis2"></p>`;
    // fresh-require the script for each test
    jest.resetModules();
    script = require('../public/script.js');
  });

  test('berechneAbzahldatum alerts on invalid input', () => {
    const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => {});
    document.getElementById('monatlicheRate1').value = '0';
    script.berechneAbzahldatum();
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  test('berechneMonatlicheRate shows error for empty date', () => {
    document.getElementById('zieldatum').value = '';
    script.berechneMonatlicheRate();
    const el = document.getElementById('zieldatumError');
    const txt = el.textContent || el.innerText || '';
    expect(txt).toMatch(/gültiges Zieldatum/);
  });

  test('berechneMonatlicheRate rejects past date', () => {
    const now = new Date();
    const pastYear = now.getFullYear() - 1;
    document.getElementById('zieldatum').value = `${pastYear}-01`;
    script.berechneMonatlicheRate();
    const el = document.getElementById('zieldatumError');
    const txt = el.textContent || el.innerText || '';
    expect(txt).toMatch(/in der Zukunft/);
  });
});
