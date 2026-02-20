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

test('getConfig returns config object', () => {
  const cfg = script.getConfig();
  expect(cfg.kreditrahmen).toBe(457000);
  expect(cfg.tilgungsbeginn.year).toBe(2018);
  expect(cfg.tilgungsbeginn.month).toBe(11);
});

test('monateSeitTilgungsbeginn returns positive number', () => {
  const monate = script.monateSeitTilgungsbeginn();
  expect(monate).toBeGreaterThan(0);
  var now = new Date();
  var expected = (now.getFullYear() - 2018) * 12 + (now.getMonth() + 1 - 11);
  expect(monate).toBe(expected);
});

test('aktualisiereZeitreihe does not throw without ApexCharts', () => {
  document.body.innerHTML = '<div id="timeline"></div>';
  expect(() => script.aktualisiereZeitreihe(null)).not.toThrow();
  expect(() => script.aktualisiereZeitreihe(new Date(2040, 0))).not.toThrow();
});

test('berechneRestschuld without Sondertilgungen', () => {
  document.body.innerHTML = '<table><tbody id="sondertilgungenBody"></tbody></table>';
  var monate = script.monateSeitTilgungsbeginn();
  expect(script.berechneRestschuld(457000, 1000)).toBe(457000 - (1000 * monate));
  expect(script.berechneRestschuld(10000, 10000)).toBe(0);
});

test('berechneRestschuld with Sondertilgungen', () => {
  document.body.innerHTML = `<table><tbody id="sondertilgungenBody">
    <tr><td><input class="sonder-datum" value="2020-06"></td>
        <td><input class="sonder-betrag" value="10.000,00 €"></td></tr>
  </tbody></table>`;
  var monate = script.monateSeitTilgungsbeginn();
  var expected = 457000 - (1000 * monate) - 10000;
  expect(script.berechneRestschuld(457000, 1000)).toBe(expected);
});

test('aktualisiereRestschuld updates DOM for Grid 1', () => {
  document.body.innerHTML = `
    <input id="kreditbetrag1" value="457000" />
    <input id="restschuld1" value="" />
    <input id="monatlicheRate1" value="1000" />
    <table><tbody id="sondertilgungenBody"></tbody></table>`;
  script.aktualisiereRestschuld(1);
  var rs = document.getElementById('restschuld1');
  var val = script.parseEuro(rs.value);
  var expected = script.berechneRestschuld(457000, 1000);
  expect(val).toBe(expected);
});

test('aktualisiereRestschuld updates DOM for Grid 2 using Rate from Grid 1', () => {
  document.body.innerHTML = `
    <input id="kreditbetrag1" value="457000" />
    <input id="monatlicheRate1" value="1200" />
    <input id="kreditbetrag2" value="457000" />
    <input id="restschuld2" value="" />
    <table><tbody id="sondertilgungenBody"></tbody></table>`;
  script.aktualisiereRestschuld(2);
  var rs = document.getElementById('restschuld2');
  var val = script.parseEuro(rs.value);
  var expected = script.berechneRestschuld(457000, 1200);
  expect(val).toBe(expected);
});

test('getSondertilgungen reads from DOM', () => {
  document.body.innerHTML = `<table><tbody id="sondertilgungenBody">
    <tr><td><input class="sonder-datum" value="2020-06"></td>
        <td><input class="sonder-betrag" value="10.000,00 €"></td></tr>
    <tr><td><input class="sonder-datum" value="2022-01"></td>
        <td><input class="sonder-betrag" value="15.000,00 €"></td></tr>
  </tbody></table>`;
  var result = script.getSondertilgungen();
  expect(result.length).toBe(2);
  expect(result[0]).toEqual({ datum: '2020-06', betrag: 10000 });
  expect(result[1]).toEqual({ datum: '2022-01', betrag: 15000 });
});

test('getSondertilgungen returns empty array without DOM', () => {
  document.body.innerHTML = '';
  expect(script.getSondertilgungen()).toEqual([]);
});

test('summeSondertilgungen sums up to given date', () => {
  document.body.innerHTML = `<table><tbody id="sondertilgungenBody">
    <tr><td><input class="sonder-datum" value="2020-06"></td>
        <td><input class="sonder-betrag" value="10.000,00 €"></td></tr>
    <tr><td><input class="sonder-datum" value="2025-12"></td>
        <td><input class="sonder-betrag" value="5.000,00 €"></td></tr>
  </tbody></table>`;
  expect(script.summeSondertilgungen('2021-01')).toBe(10000);
  expect(script.summeSondertilgungen('2025-12')).toBe(15000);
  expect(script.summeSondertilgungen('2019-01')).toBe(0);
});

test('addSondertilgung adds a row', () => {
  document.body.innerHTML = '<table><tbody id="sondertilgungenBody"></tbody></table>';
  script.addSondertilgung();
  var rows = document.querySelectorAll('#sondertilgungenBody tr');
  expect(rows.length).toBe(1);
  script.addSondertilgung();
  rows = document.querySelectorAll('#sondertilgungenBody tr');
  expect(rows.length).toBe(2);
});

test('removeSondertilgung removes a row', () => {
  document.body.innerHTML = `<table><tbody id="sondertilgungenBody">
    <tr><td><input class="sonder-datum" value="2020-06"></td>
        <td><input class="sonder-betrag" value="10000"></td>
        <td><button class="btn-remove">X</button></td></tr>
  </tbody></table>
  <p id="sondertilgungenSumme"></p>
  <input id="kreditbetrag1" value="457000" />
  <input id="restschuld1" value="" />
  <input id="monatlicheRate1" value="1000" />
  <p id="ergebnis1"></p>
  <div id="fortschritt1" style="display:none;"><div id="fortschrittFill1"></div><span id="fortschrittText1"></span></div>`;
  var btn = document.querySelector('.btn-remove');
  script.removeSondertilgung(btn);
  var rows = document.querySelectorAll('#sondertilgungenBody tr');
  expect(rows.length).toBe(0);
});

test('renderSondertilgungen populates table from config', () => {
  document.body.innerHTML = '<table><tbody id="sondertilgungenBody"></tbody></table><p id="sondertilgungenSumme"></p>';
  script.renderSondertilgungen();
  var rows = document.querySelectorAll('#sondertilgungenBody tr');
  expect(rows.length).toBe(3);
  var sumEl = document.getElementById('sondertilgungenSumme');
  expect(sumEl.innerText).toMatch(/30\.000/);
});

test('heuteAlsString returns YYYY-MM-DD format', () => {
  var result = script.heuteAlsString();
  expect(result).toMatch(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/);
});

test('getHistorischeBelastung returns correct values for Nov 2018', () => {
  var h = script.getHistorischeBelastung(2018, 11);
  expect(h.miete).toBe(925);
  expect(h.moventum).toBe(500);
  expect(h.giro2).toBe(0);
  expect(h.summe).toBe(1425);
});

test('getHistorischeBelastung returns correct values for Dec 2024', () => {
  var h = script.getHistorischeBelastung(2024, 12);
  expect(h.miete).toBe(925);
  expect(h.moventum).toBe(500);
  expect(h.giro2).toBe(0);
  expect(h.summe).toBe(1425);
});

test('getHistorischeBelastung returns correct values for Jan 2025', () => {
  var h = script.getHistorischeBelastung(2025, 1);
  expect(h.miete).toBe(0);
  expect(h.moventum).toBe(500);
  expect(h.giro2).toBe(0);
  expect(h.summe).toBe(500);
});

test('getHistorischeBelastung returns correct values for Sep 2025', () => {
  var h = script.getHistorischeBelastung(2025, 9);
  expect(h.miete).toBe(0);
  expect(h.moventum).toBe(500);
  expect(h.giro2).toBe(650);
  expect(h.summe).toBe(1150);
});

test('getHistorischeBelastung returns zeros for unknown month', () => {
  var h = script.getHistorischeBelastung(2010, 1);
  expect(h.miete).toBe(0);
  expect(h.moventum).toBe(0);
  expect(h.giro2).toBe(0);
  expect(h.summe).toBe(0);
});

test('getAktuelleFixeBelastung returns object with summe', () => {
  var h = script.getAktuelleFixeBelastung();
  expect(h).toHaveProperty('miete');
  expect(h).toHaveProperty('moventum');
  expect(h).toHaveProperty('giro2');
  expect(h).toHaveProperty('summe');
  expect(typeof h.summe).toBe('number');
});