// Dynamisches Setzen des Mindestdatums für das Zieldatum
window.onload = function() {
    const zieldatumInput = document.getElementById('zieldatum');
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Zwei Ziffern für den Monat
    const year = today.getFullYear();
    zieldatumInput.setAttribute('min', `${year}-${month}`);
};

function berechneAbzahldatum() {
    // Vorherige Fehlermeldungen zurücksetzen
    document.getElementById('ergebnis1').innerText = '';

    // Eingabewerte holen
    let kreditbetrag = parseFloat(document.getElementById('kreditbetrag1').value);
    let restschuld = parseFloat(document.getElementById('restschuld1').value);
    let monatlicheRate = parseFloat(document.getElementById('monatlicheRate1').value);

    // Überprüfen, ob die Eingabewerte gültig sind
    if (isNaN(kreditbetrag) || isNaN(restschuld) || isNaN(monatlicheRate) || monatlicheRate <= 0) {
        alert('Bitte geben Sie gültige Werte ein.');
        return;
    }

    // Verbleibende Restschuld berechnen
    let verbleibendeSchuld = restschuld;

    // Anzahl der verbleibenden Monate berechnen
    let verbleibendeMonate = Math.ceil(verbleibendeSchuld / monatlicheRate);

    // Aktuelles Datum holen
    let aktuellesDatum = new Date();
    // Setzen des Tages auf den ersten Tag des Monats
    aktuellesDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

    // Enddatum berechnen
    let endDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());
    endDatum.setMonth(endDatum.getMonth() + verbleibendeMonate);

    // Ergebnis anzeigen
    let options = { month: 'long', year: 'numeric' };
    document.getElementById('ergebnis1').innerText = 'Der Kredit wird voraussichtlich bis ' + endDatum.toLocaleDateString('de-DE', options) + ' abbezahlt sein.';
}

// Exportiere Funktionen für Tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    berechneAbzahldatum,
    berechneMonatlicheRate
  };
}

function berechneMonatlicheRate() {
    // Vorherige Fehlermeldungen zurücksetzen
    document.getElementById('zieldatumError').style.display = 'none';
    document.getElementById('ergebnis2').innerText = '';

    // Eingabewerte holen
    let kreditbetrag = parseFloat(document.getElementById('kreditbetrag2').value);
    let restschuld = parseFloat(document.getElementById('restschuld2').value);
    let zieldatumInput = document.getElementById('zieldatum').value;

    // Überprüfen, ob die Eingabewerte gültig sind
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (isNaN(kreditbetrag) || isNaN(restschuld) || zieldatumInput === '' || !datePattern.test(zieldatumInput)) {
        document.getElementById('zieldatumError').innerText = 'Bitte geben Sie ein gültiges Zieldatum im Format JJJJ-MM ein (Monat zwischen 01 und 12).';
        document.getElementById('zieldatumError').style.display = 'block';
        return;
    }

    // Zieldatum parsen
    let [zielJahr, zielMonat] = zieldatumInput.split('-').map(Number);

    // Überprüfen, ob der Monat zwischen 1 und 12 liegt
    if (zielMonat < 1 || zielMonat > 12) {
        document.getElementById('zieldatumError').innerText = 'Bitte geben Sie einen gültigen Monat zwischen 01 und 12 ein.';
        document.getElementById('zieldatumError').style.display = 'block';
        return;
    }

    let zieldatum = new Date(zielJahr, zielMonat - 1);

    // Aktuelles Datum ohne Tageszeit
    let aktuellesDatum = new Date();
    aktuellesDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

    // Validierung des Zieldatums
    if (zieldatum < aktuellesDatum) {
        document.getElementById('zieldatumError').innerText = 'Das Zieldatum muss in der Zukunft liegen.';
        document.getElementById('zieldatumError').style.display = 'block';
        return;
    }

    // Anzahl der Monate zwischen aktuellem Datum und Zieldatum korrekt berechnen
    let gesamtMonate = (zielJahr - aktuellesDatum.getFullYear()) * 12 + (zielMonat - 1 - aktuellesDatum.getMonth());

    if (gesamtMonate <= 0) {
        document.getElementById('zieldatumError').innerText = 'Das Zieldatum muss mindestens einen Monat in der Zukunft liegen.';
        document.getElementById('zieldatumError').style.display = 'block';
        return;
    }

    // Erforderliche monatliche Rate berechnen
    let monatlicheRate = restschuld / gesamtMonate;

    // Ergebnis anzeigen
    document.getElementById('ergebnis2').innerText = 'Sie müssen monatlich ca. ' + monatlicheRate.toFixed(2) + ' € zahlen, um den Kredit bis zum gewünschten Datum abzuzahlen.';
}
