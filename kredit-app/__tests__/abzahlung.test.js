/**
 * @jest-environment jsdom
 */

const script = require('../public/script.js');

describe('berechneAbzahldatum and happy path of rate', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="kreditbetrag1" value="100000" />
      <input id="restschuld1" value="200" />
      <input id="monatlicheRate1" value="100" />
      <p id="ergebnis1"></p>
      <div id="fortschritt1" class="progress-container" style="display:none;">
        <div class="progress-bar"><div id="fortschrittFill1" class="progress-fill"></div></div>
        <span id="fortschrittText1" class="progress-text"></span>
      </div>

      <input id="kreditbetrag2" value="100000" />
      <input id="restschuld2" value="100" />
      <input id="zieldatum" />
      <small id="zieldatumError" class="error-message"></small>
      <p id="ergebnis2"></p>
      <div id="fortschritt2" class="progress-container" style="display:none;">
        <div class="progress-bar"><div id="fortschrittFill2" class="progress-fill"></div></div>
        <span id="fortschrittText2" class="progress-text"></span>
      </div>`;
  });

  test('berechneAbzahldatum fills ergebnis1 with a message', () => {
    script.berechneAbzahldatum();
    const el1 = document.getElementById('ergebnis1');
    const text = el1 && (el1.innerText || el1.textContent || '');
    expect(text).toMatch(/Der Kredit wird voraussichtlich bis/);
  });

  test('berechneAbzahldatum shows progress bar with Euro amounts', () => {
    script.berechneAbzahldatum();
    const container = document.getElementById('fortschritt1');
    expect(container.style.display).toBe('block');
    const fill = document.getElementById('fortschrittFill1');
    expect(fill.style.width).toBe('99.8%');
    const txt = document.getElementById('fortschrittText1');
    expect(txt.innerText).toMatch(/99\.8/);
    expect(txt.innerText).toMatch(/€/);
  });

  test('berechneMonatlicheRate happy path for 1 month', () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const nextMonthIndex = (now.getMonth() + 1) % 12; // 0..11
    const yearAdj = now.getMonth() === 11 ? 1 : 0;
    const mm = String(nextMonthIndex + 1).padStart(2, '0');
    document.getElementById('zieldatum').value = `${yyyy + yearAdj}-${mm}`;
    script.berechneMonatlicheRate();
    const el2 = document.getElementById('ergebnis2');
    const text = el2 && (el2.innerText || el2.textContent || '');
    expect(text).toMatch(/100,00\s*€/);
  });

  test('berechneMonatlicheRate shows progress bar with Euro amounts', () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const nextMonthIndex = (now.getMonth() + 1) % 12;
    const yearAdj = now.getMonth() === 11 ? 1 : 0;
    const mm = String(nextMonthIndex + 1).padStart(2, '0');
    document.getElementById('zieldatum').value = `${yyyy + yearAdj}-${mm}`;
    script.berechneMonatlicheRate();
    const container = document.getElementById('fortschritt2');
    expect(container.style.display).toBe('block');
    const txt = document.getElementById('fortschrittText2');
    expect(txt.innerText).toMatch(/99\.9.*% bereits getilgt/);
    expect(txt.innerText).toMatch(/€/);
  });
});
