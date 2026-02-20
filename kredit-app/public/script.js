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

function heuteAlsString() {
    var now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
}

function getSondertilgungen() {
    var body = document.getElementById('sondertilgungenBody');
    if (!body) return [];
    var rows = body.querySelectorAll('tr');
    var result = [];
    for (var i = 0; i < rows.length; i++) {
        var datumInput = rows[i].querySelector('.sonder-datum');
        var betragInput = rows[i].querySelector('.sonder-betrag');
        if (datumInput && betragInput) {
            var datum = datumInput.value;
            var betrag = parseEuro(betragInput.value);
            if (datum && !isNaN(betrag) && betrag > 0) {
                result.push({ datum: datum, betrag: betrag });
            }
        }
    }
    return result;
}

function summeSondertilgungen(bisDatum) {
    var alle = getSondertilgungen();
    var summe = 0;
    for (var i = 0; i < alle.length; i++) {
        if (alle[i].datum <= bisDatum) {
            summe += alle[i].betrag;
        }
    }
    return summe;
}

function aktualisiereSondertilgungenSumme() {
    var el = document.getElementById('sondertilgungenSumme');
    if (!el) return;
    var alle = getSondertilgungen();
    var summe = 0;
    for (var i = 0; i < alle.length; i++) {
        summe += alle[i].betrag;
    }
    el.innerText = 'Summe Sondertilgungen: ' + formatEuro(summe);
}

function sondertilgungZeileHtml(datum, betrag) {
    return '<tr>'
        + '<td><input type="month" class="sonder-datum" value="' + (datum || '') + '" onchange="onSondertilgungChange()"></td>'
        + '<td><input type="text" class="sonder-betrag" value="' + (betrag > 0 ? formatEuro(betrag) : '') + '" '
        + 'inputmode="decimal" placeholder="z.B. 10.000,00 €" '
        + 'onblur="formatEuroInput(this); onSondertilgungChange()"></td>'
        + '<td><button type="button" class="btn-remove" onclick="removeSondertilgung(this)" title="Entfernen">'
        + '<i class="fas fa-trash"></i></button></td>'
        + '</tr>';
}

function renderSondertilgungen() {
    var body = document.getElementById('sondertilgungenBody');
    if (!body) return;
    var cfg = getConfig();
    var html = '';
    var liste = cfg.sondertilgungen || [];
    for (var i = 0; i < liste.length; i++) {
        html += sondertilgungZeileHtml(liste[i].datum, liste[i].betrag);
    }
    body.innerHTML = html;
    aktualisiereSondertilgungenSumme();
}

function addSondertilgung() {
    var body = document.getElementById('sondertilgungenBody');
    if (!body) return;
    body.insertAdjacentHTML('beforeend', sondertilgungZeileHtml('', 0));
}

function removeSondertilgung(btn) {
    var row = btn.closest('tr');
    if (row) row.remove();
    onSondertilgungChange();
}

function onSondertilgungChange() {
    aktualisiereSondertilgungenSumme();
    aktualisiereRestschuld(1);
    aktualisiereRestschuld(2);
    berechneAbzahldatum();
}

function berechneRestschuld(kreditbetrag, monatlicheRate) {
    var monate = monateSeitTilgungsbeginn();
    var regulaer = monatlicheRate * monate;
    var sonderSumme = summeSondertilgungen(heuteAlsString());
    return Math.max(0, kreditbetrag - regulaer - sonderSumme);
}

function aktualisiereRestschuld(gridNr) {
    var kbEl = document.getElementById('kreditbetrag' + gridNr);
    var rsEl = document.getElementById('restschuld' + gridNr);
    if (!kbEl || !rsEl) return;

    var kreditbetrag = parseEuro(kbEl.value);
    var rateEl = document.getElementById('monatlicheRate' + gridNr);
    if (!rateEl) rateEl = document.getElementById('monatlicheRate1');
    var rate = rateEl ? parseEuro(rateEl.value) : 0;

    if (!isNaN(kreditbetrag) && !isNaN(rate) && rate > 0) {
        var restschuld = berechneRestschuld(kreditbetrag, rate);
        rsEl.value = formatEuro(restschuld);
    }
}

function getConfig() {
    if (typeof KREDIT_CONFIG !== 'undefined') return KREDIT_CONFIG;
    if (typeof module !== 'undefined') {
        try { return require('./config.js'); } catch (_) { /* ignore */ }
    }
    return { kreditrahmen: 625000, tilgungsbeginn: { year: 2018, month: 11 }, kreditaufnahmeJahr: 2018 };
}

function monateSeitTilgungsbeginn() {
    var cfg = getConfig();
    var now = new Date();
    return (now.getFullYear() - cfg.tilgungsbeginn.year) * 12
         + (now.getMonth() + 1 - cfg.tilgungsbeginn.month);
}

var zeitreiheInstanz = null;

function aktualisiereZeitreihe(abzahldatum) {
    var container = document.getElementById('timeline');
    if (!container) return;
    if (typeof vis === 'undefined') return;

    var cfg = getConfig();
    var startDatum = new Date(cfg.tilgungsbeginn.year, cfg.tilgungsbeginn.month - 1, 1);
    var heute = new Date();
    heute = new Date(heute.getFullYear(), heute.getMonth(), 1);

    var monatOpt = { month: 'long', year: 'numeric' };

    var items = new vis.DataSet([
        {
            id: 1,
            content: '<b>Tilgungsbeginn</b><br>' + startDatum.toLocaleDateString('de-DE', monatOpt),
            start: startDatum,
            type: 'point',
            className: 'timeline-start'
        },
        {
            id: 2,
            content: '<b>Heute</b><br>' + heute.toLocaleDateString('de-DE', monatOpt)
                + '<br>' + monateSeitTilgungsbeginn() + ' Monate seit Beginn',
            start: heute,
            type: 'point',
            className: 'timeline-heute'
        }
    ]);

    if (abzahldatum) {
        var endDatum = new Date(abzahldatum.getFullYear(), abzahldatum.getMonth(), 1);
        var gesamtMonate = (endDatum.getFullYear() - startDatum.getFullYear()) * 12
            + (endDatum.getMonth() - startDatum.getMonth());
        items.add({
            id: 3,
            content: '<b>Abzahldatum</b><br>' + endDatum.toLocaleDateString('de-DE', monatOpt)
                + '<br>Gesamtlaufzeit: ' + gesamtMonate + ' Monate',
            start: endDatum,
            type: 'point',
            className: 'timeline-ende'
        });
        items.add({
            id: 4,
            content: 'Tilgungszeitraum',
            start: startDatum,
            end: endDatum,
            type: 'range',
            className: 'timeline-range'
        });
    }

    var sondertilgungen = getSondertilgungen();
    for (var si = 0; si < sondertilgungen.length; si++) {
        var parts = sondertilgungen[si].datum.split('-');
        var sDatum = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
        items.add({
            id: 10 + si,
            content: '<b>Sondertilgung</b><br>' + formatEuro(sondertilgungen[si].betrag),
            start: sDatum,
            type: 'point',
            className: 'timeline-sonder'
        });
    }

    var options = {
        height: '150px',
        maxHeight: '180px',
        locale: 'de',
        zoomMin: 1000 * 60 * 60 * 24 * 30,
        margin: { item: { horizontal: 20, vertical: 10 }, axis: 5 },
        orientation: 'top',
        zoomable: false,
        moveable: false
    };

    if (zeitreiheInstanz) {
        zeitreiheInstanz.setItems(items);
        zeitreiheInstanz.fit();
    } else {
        zeitreiheInstanz = new vis.Timeline(container, items, options);
    }
}

// Dynamisches Setzen des Mindestdatums für das Zieldatum + Euro-Input-Formatierung
window.onload = function() {
    var cfg = getConfig();
    var zieldatumInput = document.getElementById('zieldatum');
    var today = new Date();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    zieldatumInput.setAttribute('min', year + '-' + month);

    var kreditbetragFormatiert = formatEuro(cfg.kreditrahmen);
    var kb1 = document.getElementById('kreditbetrag1');
    var kb2 = document.getElementById('kreditbetrag2');
    if (kb1) kb1.value = kreditbetragFormatiert;
    if (kb2) kb2.value = kreditbetragFormatiert;

    var euroInputs = ['kreditbetrag1', 'monatlicheRate1', 'kreditbetrag2'];
    euroInputs.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('blur', function() { formatEuroInput(el); });
        }
    });

    // Grid 1 + 2: Restschuld bei Aenderung von Kreditbetrag oder Rate automatisch neu berechnen
    ['kreditbetrag1', 'monatlicheRate1'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function() {
                aktualisiereRestschuld(1);
                aktualisiereRestschuld(2);
            });
            el.addEventListener('blur', function() {
                aktualisiereRestschuld(1);
                aktualisiereRestschuld(2);
                berechneAbzahldatum();
            });
        }
    });

    // Grid 2: Kreditbetrag-Aenderung aktualisiert auch Restschuld
    var kb2El = document.getElementById('kreditbetrag2');
    if (kb2El) {
        kb2El.addEventListener('input', function() { aktualisiereRestschuld(2); });
        kb2El.addEventListener('blur', function() { aktualisiereRestschuld(2); });
    }

    // Zieldatum-Aenderung loest automatisch Neuberechnung aus
    if (zieldatumInput) {
        zieldatumInput.addEventListener('change', function() { berechneMonatlicheRate(); });
    }

    renderSondertilgungen();

    aktualisiereRestschuld(1);
    aktualisiereRestschuld(2);

    aktualisiereZeitreihe(null);
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

    let aktuellesDatum = new Date();
    aktuellesDatum = new Date(aktuellesDatum.getFullYear(), aktuellesDatum.getMonth());

    let schuld = restschuld;
    let monat = new Date(aktuellesDatum.getTime());
    let sondertilgungen = getSondertilgungen();
    let maxIter = 1200;
    while (schuld > 0 && maxIter-- > 0) {
        monat.setMonth(monat.getMonth() + 1);
        schuld -= monatlicheRate;
        var key = monat.getFullYear() + '-' + String(monat.getMonth() + 1).padStart(2, '0');
        for (var si = 0; si < sondertilgungen.length; si++) {
            if (sondertilgungen[si].datum === key) schuld -= sondertilgungen[si].betrag;
        }
        schuld = Math.max(0, schuld);
    }
    let endDatum = monat;

    // Ergebnis anzeigen
    let options = { month: 'long', year: 'numeric' };
    let monate = monateSeitTilgungsbeginn();
    document.getElementById('ergebnis1').innerText =
        'Der Kredit wird voraussichtlich bis ' + endDatum.toLocaleDateString('de-DE', options) + ' abbezahlt sein.'
        + ' (' + monate + ' Monate seit Tilgungsbeginn)';

    zeigeFortschritt(1, kreditbetrag, restschuld);
    aktualisiereZeitreihe(endDatum);
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
    formatEuroInput,
    getConfig,
    monateSeitTilgungsbeginn,
    aktualisiereZeitreihe,
    berechneRestschuld,
    aktualisiereRestschuld,
    heuteAlsString,
    getSondertilgungen,
    summeSondertilgungen,
    renderSondertilgungen,
    addSondertilgung,
    removeSondertilgung,
    onSondertilgungChange,
    aktualisiereSondertilgungenSumme
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
    let monate = monateSeitTilgungsbeginn();
    document.getElementById('ergebnis2').innerText =
        'Sie müssen monatlich ca. ' + formatEuro(monatlicheRate) + ' zahlen, um den Kredit bis zum gewünschten Datum abzuzahlen.'
        + ' (' + monate + ' Monate seit Tilgungsbeginn)';

    zeigeFortschritt(2, kreditbetrag, restschuld);
    aktualisiereZeitreihe(zieldatum);
}
