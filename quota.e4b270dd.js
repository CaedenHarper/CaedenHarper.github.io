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
})({"5DzcB":[function(require,module,exports,__globalThis) {
// initialize constants
// divs
const previous_quota_div = document.getElementById('previous-quota');
const quota_num_div = document.getElementById('quota-num');
const current_quota_div = document.getElementById('current-quota');
const lowest_quota_div = document.getElementById('lowest-next-quota');
const average_quota_div = document.getElementById('average-next-quota');
const highest_quota_div = document.getElementById('highest-next-quota');
const percentile_div = document.getElementById('percentile');
const lowest_quota_num_div = document.getElementById('lowest-quota-num');
const highest_quota_num_div = document.getElementById('highest-quota-num');
function next_quota(previous_quota, quota_num, random_variance) {
    return Math.trunc(previous_quota + 100 * (1 + (quota_num - 1) ** 2 / 16) * (random_variance + 1));
}
function lowest_next_quota(previous_quota, quota_num) {
    return next_quota(previous_quota, quota_num, -0.5);
}
function highest_next_quota(previous_quota, quota_num) {
    return next_quota(previous_quota, quota_num, 0.5);
}
function average_next_quota(previous_quota, quota_num) {
    return next_quota(previous_quota, quota_num, 0);
}
function quota_to_percentile(quota, previous_quota, quota_num) {
    return (quota - previous_quota) / (100 * (1 + (quota_num - 1) ** 2 / 16)) - 0.5;
}
function find_quota_range(goal_quota) {
    // the first quota is always 130
    let min_quota = 130;
    let max_quota = 130;
    let quota_num = 1;
    let lower_bound;
    let upper_bound;
    while(lower_bound === undefined || upper_bound === undefined){
        if (lower_bound === undefined && max_quota >= goal_quota) lower_bound = quota_num;
        if (upper_bound === undefined && min_quota > goal_quota) upper_bound = quota_num - 1;
        quota_num += 1;
        min_quota = lowest_next_quota(min_quota, quota_num);
        max_quota = highest_next_quota(max_quota, quota_num);
    }
    return {
        low: Math.trunc(lower_bound),
        high: Math.trunc(upper_bound)
    };
}
function clean_divs() {
    // clear text divs
    lowest_quota_div.textContent = 'Lowest Next: ';
    average_quota_div.textContent = 'Average Next: ';
    highest_quota_div.textContent = 'Highest Next: ';
    percentile_div.textContent = 'Percentile: ';
    lowest_quota_num_div.textContent = 'Quota Num Lower Bound: ';
    highest_quota_num_div.textContent = 'Quota Num Upper Bound: ';
}
function draw_screen() {
    clean_divs();
    const previous_quota = Number(previous_quota_div.value);
    const quota_num = Number(quota_num_div.value);
    const current_quota = Number(current_quota_div.value);
    const lowest = lowest_next_quota(previous_quota, quota_num);
    const highest = highest_next_quota(previous_quota, quota_num);
    lowest_quota_div.textContent += lowest;
    average_quota_div.textContent += average_next_quota(previous_quota, quota_num);
    highest_quota_div.textContent += highest;
    const percentile = quota_to_percentile(current_quota, previous_quota, quota_num);
    const p_impossible = current_quota < lowest || current_quota > highest;
    percentile_div.textContent += p_impossible ? 'Impossible' : `${Math.round(100 * percentile)}%`;
    const bounds = find_quota_range(current_quota);
    const impossible = current_quota < lowest;
    lowest_quota_num_div.textContent += impossible ? 'Impossible' : bounds.low;
    highest_quota_num_div.textContent += impossible ? 'Impossible' : bounds.high;
}
function main() {
    // add draw screen event listeners
    previous_quota_div.addEventListener('input', ()=>draw_screen());
    quota_num_div.addEventListener('input', ()=>draw_screen());
    current_quota_div.addEventListener('input', ()=>draw_screen());
    // draw the screen once
    draw_screen();
}
main();

},{}]},["5DzcB"], "5DzcB", "parcelRequire4353", {})

//# sourceMappingURL=quota.e4b270dd.js.map
