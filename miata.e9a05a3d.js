// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"7sSa0":[function(require,module,exports,__globalThis) {
// initialize constants
// divs
// const main_div = document.getElementById('main_div');
const timer_div = document.getElementById('timer');
const date_div = document.getElementById('date');
const paycheck_div = document.getElementById('paycheck');
const biweekly_budget_div = document.getElementById('biweekly-budget');
const daily_budget_div = document.getElementById('daily-budget');
const miata_cost_div = document.getElementById('miata-cost');
const tax_rate_div = document.getElementById('tax-rate');
const already_saved_div = document.getElementById('already-saved');
const total_cost_div = document.getElementById('total-cost');
// turn 'NaN', 'Infinity', '-Infinity', <any negative numbers>, -> '?'
function parseInvalidValues(str) {
    const float_representation = parseFloat(str);
    return Number.isFinite(float_representation) && float_representation >= 0 ? str : '?';
}
// turn nothing in data boxes -> 0
function parseInput(str) {
    const float_representation = parseFloat(str);
    return Number.isFinite(float_representation) ? float_representation : 0;
}
function parseDate(d) {
    const date = new Date(d);
    const options = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    return date.toLocaleString('en-US', options);
}
function calculateCost() {
    const miata_cost = parseInput(miata_cost_div.value);
    const tax_rate = parseInput(tax_rate_div.value);
    const full_cost = miata_cost * (1 + tax_rate);
    const already_saved = parseInput(already_saved_div.value);
    if (already_saved >= full_cost) return 0;
    return full_cost - already_saved;
}
function calculateTime(cost) {
    if (cost === 0) return 0;
    const paycheck = parseInput(paycheck_div.value);
    const biweekly_budget = parseInput(biweekly_budget_div.value);
    if (biweekly_budget >= paycheck) // throw error
    return NaN;
    const daily_paycheck = (paycheck - biweekly_budget) / 14;
    return cost / daily_paycheck;
}
function calculateDate(days) {
    const today = new Date();
    return today.setDate(today.getDate() + days);
}
function update_biweekly_budget() {
    biweekly_budget_div.value = (daily_budget_div.value * 14).toFixed(2);
}
function update_daily_budget() {
    daily_budget_div.value = (biweekly_budget_div.value / 14).toFixed(2);
}
function toTwoDecimalPlaces(event) {
    event.value = parseFloat(event.value).toFixed(2);
}
function draw_screen() {
    const total_cost = calculateCost();
    const total_days = calculateTime(total_cost);
    const total_date = calculateDate(total_days);
    const cost = parseInvalidValues(total_cost.toFixed(2));
    const days = parseInvalidValues(total_days.toFixed(0));
    // only show date if it is a day in the future
    const date = total_days >= 0 ? parseDate(total_date) : 'Invalid Date';
    total_cost_div.textContent = `$${cost}`;
    timer_div.textContent = `${days} days`;
    date_div.textContent = date;
}
function main() {
    // initialize textboxes with specified fixedness
    paycheck_div.value = parseFloat(paycheck_div.value).toFixed(2);
    biweekly_budget_div.value = parseFloat(biweekly_budget_div.value).toFixed(2);
    daily_budget_div.value = parseFloat(daily_budget_div.value).toFixed(2);
    miata_cost_div.value = parseFloat(miata_cost_div.value).toFixed(2);
    already_saved_div.value = parseFloat(already_saved_div.value).toFixed(2);
    // draw screen when parameters are changed
    paycheck_div.addEventListener('input', ()=>draw_screen());
    miata_cost_div.addEventListener('input', ()=>draw_screen());
    tax_rate_div.addEventListener('input', ()=>draw_screen());
    already_saved_div.addEventListener('input', ()=>draw_screen());
    // update both bi-weekly budget and daily budget when either are changed
    biweekly_budget_div.addEventListener('input', ()=>{
        draw_screen();
        update_daily_budget();
    });
    daily_budget_div.addEventListener('input', ()=>{
        draw_screen();
        update_biweekly_budget();
    });
    // update fixedness when user has exited input box
    paycheck_div.addEventListener('blur', (e)=>{
        toTwoDecimalPlaces(e.target);
    });
    biweekly_budget_div.addEventListener('blur', (e)=>{
        toTwoDecimalPlaces(e.target);
    });
    daily_budget_div.addEventListener('blur', (e)=>{
        toTwoDecimalPlaces(e.target);
    });
    miata_cost_div.addEventListener('blur', (e)=>{
        toTwoDecimalPlaces(e.target);
    });
    already_saved_div.addEventListener('blur', (e)=>{
        toTwoDecimalPlaces(e.target);
    });
    // draw initial screen
    draw_screen();
}
main();

},{}]},["7sSa0"], "7sSa0", "parcelRequire4353", {})

//# sourceMappingURL=miata.e9a05a3d.js.map
