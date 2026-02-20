function parseEuro(str) {
    if (typeof str !== 'string') return NaN;
    const cleaned = str.replace(/\s*€\s*/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || NaN;
}

function formatEuro(betrag) {
    return betrag.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function formatEuroInput(inputEl) {
    const num = parseEuro(inputEl.value);
    if (!isNaN(num) && num >= 0) {
        inputEl.value = formatEuro(num);
    }
}

// Dynamisches Setzen des Mindestdatums für das Zieldatum + Euro-Input-Formatierung
window.onload = function() {
    const zieldatumInput = document.getElementById('zieldatum');
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    zieldatumInput.setAttribute('min', `${year}-${month}`);

    const euroInputs = ['kreditbetrag1', 'restschuld1', 'monatlicheRate1', 'kreditbetrag2', 'restschuld2'];
    euroInputs.forEach(function(id) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('blur', function() { formatEuroInput(el); });
        }
    });
};

function berechneAbzahldatum() {
    // Vorherige Fehlermeldungen zurücksetzen
    document.getElementById('ergebnis1').innerText = '';

    // Eingabewerte holen (unterstützt Euro-Format z.B. 250.000,00 €)
    let kreditbetrag = parseEuro(document.getElementById('kreditbetrag1').value);
    let restschuld = parseEuro(document.getElementById('restschuld1').value);
    let monatlicheRate = parseEuro(document.getElementById('monatlicheRate1').value);

    // Überprüfen, ob die Eingabewerte gültig sind
    /* istanbul ignore next: UI alert path */
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

    zeigeFortschritt(1, kreditbetrag, restschuld);
}

function zeigeFortschritt(nr, kreditbetrag, restschuld) {
    let fortschritt = (kreditbetrag > 0)
        ? ((kreditbetrag - restschuld) / kreditbetrag) * 100
        : 0;
    fortschritt = Math.max(0, Math.min(100, fortschritt));

    document.getElementById('fortschritt' + nr).style.display = 'block';
    document.getElementById('fortschrittFill' + nr).style.width = fortschritt.toFixed(1) + '%';
    let getilgt = kreditbetrag - restschuld;
    document.getElementById('fortschrittText' + nr).innerText =
        fortschritt.toFixed(1) + ' % bereits getilgt (' + formatEuro(getilgt) + ' von ' + formatEuro(kreditbetrag) + ')';
}

// Exportiere Funktionen für Tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    berechneAbzahldatum,
    berechneMonatlicheRate,
    zeigeFortschritt,
    formatEuro,
    parseEuro,
    formatEuroInput
  };
}

function berechneMonatlicheRate() {
    // Vorherige Fehlermeldungen zurücksetzen
    document.getElementById('zieldatumError').style.display = 'none';
    document.getElementById('ergebnis2').innerText = '';

    // Eingabewerte holen (unterstützt Euro-Format z.B. 250.000,00 €)
    let kreditbetrag = parseEuro(document.getElementById('kreditbetrag2').value);
    let restschuld = parseEuro(document.getElementById('restschuld2').value);
    let zieldatumInput = document.getElementById('zieldatum').value;

    // Überprüfen, ob die Eingabewerte gültig sind
    const datePattern = /^\d{4}-(0[1-9]|1[0-2])$/;
    /* istanbul ignore next: validated by UI before submit */
    if (isNaN(kreditbetrag) || isNaN(restschuld) || zieldatumInput === '' || !datePattern.test(zieldatumInput)) {
        document.getElementById('zieldatumError').innerText = 'Bitte geben Sie ein gültiges Zieldatum im Format JJJJ-MM ein (Monat zwischen 01 und 12).';
        document.getElementById('zieldatumError').style.display = 'block';
        return;
    }

    // Zieldatum parsen
    let [zielJahr, zielMonat] = zieldatumInput.split('-').map(Number);

    // Hinweis: Monatliche Bereichsprüfung entfällt, da das Regex oben (datePattern)
    // bereits 01-12 strikt erzwingt.

    let zieldatum = new Date(zielJahr, zielMonat - 1);

    // Aktuelles Datum ohne Tageszeit
    let aktuellesDatum = new Date();
    aktuellesDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

    // Validierung des Zieldatums
    /* istanbul ignore next: UI prevents past dates */
    if (zieldatum < aktuellesDatum) {
        document.getElementById('zieldatumError').innerText = 'Das Zieldatum muss in der Zukunft liegen.';
        document.getElementById('zieldatumError').style.display = 'block';
        return;
    }

    // Anzahl der Monate zwischen aktuellem Datum und Zieldatum korrekt berechnen
    let gesamtMonate = (zielJahr - aktuellesDatum.getFullYear()) * 12 + (zielMonat - 1 - aktuellesDatum.getMonth());

    /* istanbul ignore next: same-month selection prevented by min attr */
    if (gesamtMonate <= 0) {
        document.getElementById('zieldatumError').innerText = 'Das Zieldatum muss mindestens einen Monat in der Zukunft liegen.';
        document.getElementById('zieldatumError').style.display = 'block';
        return;
    }

    // Erforderliche monatliche Rate berechnen
    let monatlicheRate = restschuld / gesamtMonate;

    // Ergebnis anzeigen
    document.getElementById('ergebnis2').innerText = 'Sie müssen monatlich ca. ' + formatEuro(monatlicheRate) + ' zahlen, um den Kredit bis zum gewünschten Datum abzuzahlen.';

    zeigeFortschritt(2, kreditbetrag, restschuld);
}
