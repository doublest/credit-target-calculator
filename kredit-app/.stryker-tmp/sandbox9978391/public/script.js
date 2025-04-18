// Dynamisches Setzen des Mindestdatums für das Zieldatum
function stryNS_9fa48() {
  var g = new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
window.onload = function () {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    const zieldatumInput = document.getElementById(stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), 'zieldatum'));
    const today = new Date();
    const month = String(stryMutAct_9fa48("2") ? today.getMonth() - 1 : (stryCov_9fa48("2"), today.getMonth() + 1)).padStart(2, stryMutAct_9fa48("3") ? "" : (stryCov_9fa48("3"), '0')); // Zwei Ziffern für den Monat
    const year = today.getFullYear();
    zieldatumInput.setAttribute(stryMutAct_9fa48("4") ? "" : (stryCov_9fa48("4"), 'min'), stryMutAct_9fa48("5") ? `` : (stryCov_9fa48("5"), `${year}-${month}`));
  }
};
function berechneAbzahldatum() {
  if (stryMutAct_9fa48("6")) {
    {}
  } else {
    stryCov_9fa48("6");
    // Vorherige Fehlermeldungen zurücksetzen
    document.getElementById(stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), 'ergebnis1')).innerText = stryMutAct_9fa48("8") ? "Stryker was here!" : (stryCov_9fa48("8"), '');

    // Eingabewerte holen
    let kreditbetrag = parseFloat(document.getElementById(stryMutAct_9fa48("9") ? "" : (stryCov_9fa48("9"), 'kreditbetrag1')).value);
    let restschuld = parseFloat(document.getElementById(stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), 'restschuld1')).value);
    let monatlicheRate = parseFloat(document.getElementById(stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), 'monatlicheRate1')).value);

    // Überprüfen, ob die Eingabewerte gültig sind
    if (stryMutAct_9fa48("14") ? (isNaN(kreditbetrag) || isNaN(restschuld) || isNaN(monatlicheRate)) && monatlicheRate <= 0 : stryMutAct_9fa48("13") ? false : stryMutAct_9fa48("12") ? true : (stryCov_9fa48("12", "13", "14"), (stryMutAct_9fa48("16") ? (isNaN(kreditbetrag) || isNaN(restschuld)) && isNaN(monatlicheRate) : stryMutAct_9fa48("15") ? false : (stryCov_9fa48("15", "16"), (stryMutAct_9fa48("18") ? isNaN(kreditbetrag) && isNaN(restschuld) : stryMutAct_9fa48("17") ? false : (stryCov_9fa48("17", "18"), isNaN(kreditbetrag) || isNaN(restschuld))) || isNaN(monatlicheRate))) || (stryMutAct_9fa48("21") ? monatlicheRate > 0 : stryMutAct_9fa48("20") ? monatlicheRate < 0 : stryMutAct_9fa48("19") ? false : (stryCov_9fa48("19", "20", "21"), monatlicheRate <= 0)))) {
      if (stryMutAct_9fa48("22")) {
        {}
      } else {
        stryCov_9fa48("22");
        alert(stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), 'Bitte geben Sie gültige Werte ein.'));
        return;
      }
    }

    // Verbleibende Restschuld berechnen
    let verbleibendeSchuld = restschuld;

    // Anzahl der verbleibenden Monate berechnen
    let verbleibendeMonate = Math.ceil(stryMutAct_9fa48("24") ? verbleibendeSchuld * monatlicheRate : (stryCov_9fa48("24"), verbleibendeSchuld / monatlicheRate));

    // Aktuelles Datum holen
    let aktuellesDatum = new Date();
    // Setzen des Tages auf den ersten Tag des Monats
    aktuellesDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

    // Enddatum berechnen
    let endDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());
    endDatum.setMonth(stryMutAct_9fa48("25") ? endDatum.getMonth() - verbleibendeMonate : (stryCov_9fa48("25"), endDatum.getMonth() + verbleibendeMonate));

    // Ergebnis anzeigen
    let options = stryMutAct_9fa48("26") ? {} : (stryCov_9fa48("26"), {
      month: stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), 'long'),
      year: stryMutAct_9fa48("28") ? "" : (stryCov_9fa48("28"), 'numeric')
    });
    document.getElementById(stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), 'ergebnis1')).innerText = (stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), 'Der Kredit wird voraussichtlich bis ')) + endDatum.toLocaleDateString(stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), 'de-DE'), options) + (stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), ' abbezahlt sein.'));
  }
}
function berechneMonatlicheRate() {
  if (stryMutAct_9fa48("33")) {
    {}
  } else {
    stryCov_9fa48("33");
    // Vorherige Fehlermeldungen zurücksetzen
    document.getElementById(stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), 'zieldatumError')).style.display = stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), 'none');
    document.getElementById(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), 'ergebnis2')).innerText = stryMutAct_9fa48("37") ? "Stryker was here!" : (stryCov_9fa48("37"), '');

    // Eingabewerte holen
    let kreditbetrag = parseFloat(document.getElementById(stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), 'kreditbetrag2')).value);
    let restschuld = parseFloat(document.getElementById(stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), 'restschuld2')).value);
    let zieldatumInput = document.getElementById(stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), 'zieldatum')).value;

    // Überprüfen, ob die Eingabewerte gültig sind
    const datePattern = stryMutAct_9fa48("46") ? /^\d{4}-(0[1-9]|1[^0-2])$/ : stryMutAct_9fa48("45") ? /^\d{4}-(0[^1-9]|1[0-2])$/ : stryMutAct_9fa48("44") ? /^\D{4}-(0[1-9]|1[0-2])$/ : stryMutAct_9fa48("43") ? /^\d-(0[1-9]|1[0-2])$/ : stryMutAct_9fa48("42") ? /^\d{4}-(0[1-9]|1[0-2])/ : stryMutAct_9fa48("41") ? /\d{4}-(0[1-9]|1[0-2])$/ : (stryCov_9fa48("41", "42", "43", "44", "45", "46"), /^\d{4}-(0[1-9]|1[0-2])$/);
    if (stryMutAct_9fa48("49") ? (isNaN(kreditbetrag) || isNaN(restschuld) || zieldatumInput === '') && !datePattern.test(zieldatumInput) : stryMutAct_9fa48("48") ? false : stryMutAct_9fa48("47") ? true : (stryCov_9fa48("47", "48", "49"), (stryMutAct_9fa48("51") ? (isNaN(kreditbetrag) || isNaN(restschuld)) && zieldatumInput === '' : stryMutAct_9fa48("50") ? false : (stryCov_9fa48("50", "51"), (stryMutAct_9fa48("53") ? isNaN(kreditbetrag) && isNaN(restschuld) : stryMutAct_9fa48("52") ? false : (stryCov_9fa48("52", "53"), isNaN(kreditbetrag) || isNaN(restschuld))) || (stryMutAct_9fa48("55") ? zieldatumInput !== '' : stryMutAct_9fa48("54") ? false : (stryCov_9fa48("54", "55"), zieldatumInput === (stryMutAct_9fa48("56") ? "Stryker was here!" : (stryCov_9fa48("56"), '')))))) || (stryMutAct_9fa48("57") ? datePattern.test(zieldatumInput) : (stryCov_9fa48("57"), !datePattern.test(zieldatumInput))))) {
      if (stryMutAct_9fa48("58")) {
        {}
      } else {
        stryCov_9fa48("58");
        document.getElementById(stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), 'zieldatumError')).innerText = stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), 'Bitte geben Sie ein gültiges Zieldatum im Format JJJJ-MM ein (Monat zwischen 01 und 12).');
        document.getElementById(stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), 'zieldatumError')).style.display = stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), 'block');
        return;
      }
    }

    // Zieldatum parsen
    let [zielJahr, zielMonat] = zieldatumInput.split(stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), '-')).map(Number);

    // Überprüfen, ob der Monat zwischen 1 und 12 liegt
    if (stryMutAct_9fa48("66") ? zielMonat < 1 && zielMonat > 12 : stryMutAct_9fa48("65") ? false : stryMutAct_9fa48("64") ? true : (stryCov_9fa48("64", "65", "66"), (stryMutAct_9fa48("69") ? zielMonat >= 1 : stryMutAct_9fa48("68") ? zielMonat <= 1 : stryMutAct_9fa48("67") ? false : (stryCov_9fa48("67", "68", "69"), zielMonat < 1)) || (stryMutAct_9fa48("72") ? zielMonat <= 12 : stryMutAct_9fa48("71") ? zielMonat >= 12 : stryMutAct_9fa48("70") ? false : (stryCov_9fa48("70", "71", "72"), zielMonat > 12)))) {
      if (stryMutAct_9fa48("73")) {
        {}
      } else {
        stryCov_9fa48("73");
        document.getElementById(stryMutAct_9fa48("74") ? "" : (stryCov_9fa48("74"), 'zieldatumError')).innerText = stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), 'Bitte geben Sie einen gültigen Monat zwischen 01 und 12 ein.');
        document.getElementById(stryMutAct_9fa48("76") ? "" : (stryCov_9fa48("76"), 'zieldatumError')).style.display = stryMutAct_9fa48("77") ? "" : (stryCov_9fa48("77"), 'block');
        return;
      }
    }
    let zieldatum = new Date(zielJahr, stryMutAct_9fa48("78") ? zielMonat + 1 : (stryCov_9fa48("78"), zielMonat - 1));

    // Aktuelles Datum ohne Tageszeit
    let aktuellesDatum = new Date();
    aktuellesDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

    // Validierung des Zieldatums
    if (stryMutAct_9fa48("82") ? zieldatum >= aktuellesDatum : stryMutAct_9fa48("81") ? zieldatum <= aktuellesDatum : stryMutAct_9fa48("80") ? false : stryMutAct_9fa48("79") ? true : (stryCov_9fa48("79", "80", "81", "82"), zieldatum < aktuellesDatum)) {
      if (stryMutAct_9fa48("83")) {
        {}
      } else {
        stryCov_9fa48("83");
        document.getElementById(stryMutAct_9fa48("84") ? "" : (stryCov_9fa48("84"), 'zieldatumError')).innerText = stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), 'Das Zieldatum muss in der Zukunft liegen.');
        document.getElementById(stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), 'zieldatumError')).style.display = stryMutAct_9fa48("87") ? "" : (stryCov_9fa48("87"), 'block');
        return;
      }
    }

    // Anzahl der Monate zwischen aktuellem Datum und Zieldatum korrekt berechnen
    let gesamtMonate = stryMutAct_9fa48("88") ? (zielJahr - aktuellesDatum.getFullYear()) * 12 - (zielMonat - 1 - aktuellesDatum.getMonth()) : (stryCov_9fa48("88"), (stryMutAct_9fa48("89") ? (zielJahr - aktuellesDatum.getFullYear()) / 12 : (stryCov_9fa48("89"), (stryMutAct_9fa48("90") ? zielJahr + aktuellesDatum.getFullYear() : (stryCov_9fa48("90"), zielJahr - aktuellesDatum.getFullYear())) * 12)) + (stryMutAct_9fa48("91") ? zielMonat - 1 + aktuellesDatum.getMonth() : (stryCov_9fa48("91"), (stryMutAct_9fa48("92") ? zielMonat + 1 : (stryCov_9fa48("92"), zielMonat - 1)) - aktuellesDatum.getMonth())));
    if (stryMutAct_9fa48("96") ? gesamtMonate > 0 : stryMutAct_9fa48("95") ? gesamtMonate < 0 : stryMutAct_9fa48("94") ? false : stryMutAct_9fa48("93") ? true : (stryCov_9fa48("93", "94", "95", "96"), gesamtMonate <= 0)) {
      if (stryMutAct_9fa48("97")) {
        {}
      } else {
        stryCov_9fa48("97");
        document.getElementById(stryMutAct_9fa48("98") ? "" : (stryCov_9fa48("98"), 'zieldatumError')).innerText = stryMutAct_9fa48("99") ? "" : (stryCov_9fa48("99"), 'Das Zieldatum muss mindestens einen Monat in der Zukunft liegen.');
        document.getElementById(stryMutAct_9fa48("100") ? "" : (stryCov_9fa48("100"), 'zieldatumError')).style.display = stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), 'block');
        return;
      }
    }

    // Erforderliche monatliche Rate berechnen
    let monatlicheRate = stryMutAct_9fa48("102") ? restschuld * gesamtMonate : (stryCov_9fa48("102"), restschuld / gesamtMonate);

    // Ergebnis anzeigen
    document.getElementById(stryMutAct_9fa48("103") ? "" : (stryCov_9fa48("103"), 'ergebnis2')).innerText = (stryMutAct_9fa48("104") ? "" : (stryCov_9fa48("104"), 'Sie müssen monatlich ca. ')) + monatlicheRate.toFixed(2) + (stryMutAct_9fa48("105") ? "" : (stryCov_9fa48("105"), ' € zahlen, um den Kredit bis zum gewünschten Datum abzuzahlen.'));
  }
}