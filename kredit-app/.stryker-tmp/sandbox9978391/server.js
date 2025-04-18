// server.js
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
const express = require('express');
const path = require('path');
const app = express();
const port = stryMutAct_9fa48("108") ? process.env.PORT && 3000 : stryMutAct_9fa48("107") ? false : stryMutAct_9fa48("106") ? true : (stryCov_9fa48("106", "107", "108"), process.env.PORT || 3000);

// Statische Dateien aus dem "public"-Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, stryMutAct_9fa48("109") ? "" : (stryCov_9fa48("109"), 'public'))));

// Starten des Servers
app.listen(port, () => {
  if (stryMutAct_9fa48("110")) {
    {}
  } else {
    stryCov_9fa48("110");
    console.log(stryMutAct_9fa48("111") ? `` : (stryCov_9fa48("111"), `Server läuft auf http://localhost:${port}`));
  }
});