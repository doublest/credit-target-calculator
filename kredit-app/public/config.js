/**
 * Erzeugt historische Belastungen von Nov 2018 bis heute.
 * Muster: Angelika+Miete bis Dez 2024, dann Uebergang, ab Sep 2025 Stefan/giro2.
 */
function buildHistorischeBelastungen() {
  var arr = [];
  var start = new Date(2018, 10, 1); // Nov 2018
  var heute = new Date();
  var end = new Date(heute.getFullYear(), heute.getMonth(), 1);
  for (var d = new Date(start.getTime()); d <= end; d.setMonth(d.getMonth() + 1)) {
    var jahr = d.getFullYear();
    var monat = d.getMonth() + 1;
    var key = jahr + '-' + String(monat).padStart(2, '0');
    var miete = 0;
    var moventum = 500;
    var giro2 = 0;
    if (key <= '2024-12') {
      miete = 925; // Angelika und Thomas Kuehn
    } else if (key >= '2025-09') {
      giro2 = 650; // Stefan Stieber Uebertrag giro2 (Miete/Kredit)
    }
    arr.push({ datum: key, miete: miete, moventum: moventum, giro2: giro2 });
  }
  return arr;
}

var KREDIT_CONFIG = {
  kreditrahmen: 457000,
  monatlicheRate: 1425, // 2024: Angelika+Miete 925 + Moventum 500
  tilgungsbeginn: { year: 2018, month: 11 },
  kreditaufnahmeJahr: 2018,
  sondertilgungen: [
    { datum: '2020-06-15', betrag: 10000 },
    { datum: '2022-01-10', betrag: 15000 },
    { datum: '2024-12-01', betrag: 5000 }
  ],
  historischeBelastungen: buildHistorischeBelastungen()
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = KREDIT_CONFIG;
}
