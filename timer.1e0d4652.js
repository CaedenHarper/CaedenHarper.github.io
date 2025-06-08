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
})({"2h6cK":[function(require,module,exports,__globalThis) {
const main_div = document.getElementById('main_div');
const celebration_emoji = String.fromCodePoint(127881);
const all_units = [
    'hours',
    'minutes',
    'seconds',
    'fortnights',
    'dog_hours',
    'usain_bolt_100_meters',
    'pizza_hut',
    'chopin',
    'pills',
    'calls'
];
// TODO: add color option
class Timer {
    constructor(date, repeating, final, id_name, class_name){
        this.date = date;
        // if the timer repeats every week once passed
        this.repeating = repeating;
        // ms since jan 1st 1970
        this.ms = date.getTime();
        // distance between date and now
        // final symbol to display after time is up
        this.final = final;
        // create html element
        this.html_element = document.createElement('div');
        this.html_element.id = id_name;
        this.html_element.className = `noselect ${class_name}`;
        this.html_element.textContent = '';
        main_div.appendChild(this.html_element);
        this.update(new Date().getTime());
    }
    update(current_time) {
        // amount of ms in two weeks
        const two_weeks = 1209600000;
        this.distance = this.ms - current_time;
        // if timer is repeating, add two weeks until it is in the future
        if (this.repeating) while(this.distance <= 0)this.distance += two_weeks;
        // Time calculations for days, hours, minutes and seconds
        this.days = Math.floor(this.distance / 86400000);
        this.hours = Math.floor(this.distance % 86400000 / 3600000);
        this.minutes = Math.floor(this.distance % 3600000 / 60000);
        this.seconds = Math.floor(this.distance % 60000 / 1000);
        this.display();
    }
    display() {
        if (this.distance < 0) this.html_element.textContent = this.final;
        else if (this.minutes <= 0 && this.hours <= 0 && this.days <= 0) this.html_element.textContent = `${this.seconds}s `;
        else if (this.hours <= 0 && this.days <= 0) this.html_element.textContent = `${this.minutes}m ${this.seconds}s`;
        else if (this.days <= 0) this.html_element.textContent = `${this.hours}h ${this.minutes}m ${this.seconds}s`;
        else this.html_element.textContent = `${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s`;
    }
}
class SubTimer {
    constructor(date, repeating, id_name, class_name){
        this.date = date;
        // if the timer repeats every week once passed
        this.repeating = repeating;
        // ms since jan 1st 1970
        this.ms = date.getTime();
        // distance between date and now
        // create html element
        this.html_element = document.createElement('div');
        this.html_element.id = id_name;
        this.html_element.className = `noselect ${class_name}`;
        this.html_element.textContent = '';
        main_div.appendChild(this.html_element);
        this.html_element.addEventListener('click', this.next_unit.bind(this));
        this.current_unit = all_units[0];
        this.update(new Date().getTime());
    }
    update(current_time) {
        // amount of ms in two weeks
        const two_weeks = 1209600000;
        this.distance = this.ms - current_time;
        // if timer is repeating, add two weeks until it is in the future
        // TODO: make this happen once instead of per update
        if (this.repeating) while(this.distance <= 0)this.distance += two_weeks;
        // Time calculations for days, hours, minutes and seconds
        this.days = Math.floor(this.distance / 86400000);
        this.hours = Math.floor(this.distance % 86400000 / 3600000);
        this.minutes = Math.floor(this.distance % 3600000 / 60000);
        this.seconds = Math.floor(this.distance % 60000 / 1000);
        // full seconds used for some display functions
        this.full_seconds = this.days * 86400 + this.hours * 3600 + this.minutes * 60 + this.seconds;
        this.current_unit_display();
    }
    // TODO: refactor each of these display functions
    display_hours() {
        const full_hours = this.days * 24 + this.hours;
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${full_hours} hours)`;
    }
    display_minutes() {
        const full_minutes = this.days * 1440 + this.hours * 60 + this.minutes;
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${full_minutes} minutes)`;
    }
    display_seconds() {
        if (this.distance < 0) this.html_element.textContent = '0 seconds';
        else this.html_element.textContent = `(${this.full_seconds} seconds)`;
    }
    display_fortnights() {
        // fortnight = 2 weeks = 14 days = 1,210,000 seconds
        const fortnight_constant = 1210000;
        const num_fortnights = (this.full_seconds / (1.0 * fortnight_constant)).toFixed(1);
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${num_fortnights} fortnights)`;
    }
    display_dog_hours() {
        const num_dog_seconds = this.full_seconds * 7;
        const num_dog_hours = Math.round(num_dog_seconds / 3600);
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${num_dog_hours} dog hours)`;
    }
    display_usain_bolt_100_meters() {
        const num_usain_bolt = Math.round(this.full_seconds / 9.58);
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${num_usain_bolt} Usain Bolt 100 meters)`;
    }
    display_pizza_hut() {
        const num_pizza_hut = Math.round(this.full_seconds / 900);
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${num_pizza_hut} Pizza Hut orders)`;
    }
    display_chopin() {
        const num_chopin_hours = Math.round(2 * (this.full_seconds / 3600));
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${num_chopin_hours} Chopin hours)`;
    }
    display_pills() {
        const num_pills = Math.round(16 * (this.full_seconds / 86400));
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${num_pills} pills)`;
    }
    display_calls() {
        // each call is about 13.5 minutes
        const num_calls = Math.round(this.full_seconds / 60 / 13.5);
        if (this.distance < 0) this.html_element.textContent = '';
        else this.html_element.textContent = `(${num_calls} calls)`;
    }
    // TODO: refactor
    current_unit_display() {
        switch(this.current_unit){
            case 'hours':
                this.display_hours();
                break;
            case 'minutes':
                this.display_minutes();
                break;
            case 'seconds':
                this.display_seconds();
                break;
            case 'fortnights':
                this.display_fortnights();
                break;
            case 'dog_hours':
                this.display_dog_hours();
                break;
            case 'usain_bolt_100_meters':
                this.display_usain_bolt_100_meters();
                break;
            case 'pizza_hut':
                this.display_pizza_hut();
                break;
            case 'chopin':
                this.display_chopin();
                break;
            case 'pills':
                this.display_pills();
                break;
            case 'calls':
                this.display_calls();
                break;
            default:
                this.display_hours();
                break;
        }
    }
    next_unit() {
        const index = all_units.indexOf(this.current_unit);
        if (index === -1) {
            this.current_unit = 'hours';
            this.current_unit_display();
            return;
        }
        this.current_unit = all_units[(index + 1) % all_units.length];
        this.current_unit_display();
    }
}
const timers = [];
const countDownDate = new Date('Mar 31, 2025 14:45:00');
const countDownTimer = new Timer(countDownDate, false, celebration_emoji, 'countdown', '');
const countDownSubTimer = new SubTimer(countDownDate, false, 'countdownsub', '');
timers.push(countDownTimer, countDownSubTimer);
const payCheckDate = new Date('Feb 14, 2024 06:00:00');
const payCheckTimer = new Timer(payCheckDate, true, '', 'paycheck', 'pay');
const payCheckSubTimer = new SubTimer(payCheckDate, true, 'paychecksub', 'pay');
timers.push(payCheckTimer, payCheckSubTimer);
// const gradDate = new Date('May 17, 2024 00:00:00');
// const gradDateTimer = new Timer(gradDate, false, '', 'graddate', 'grad');
// const gradDateSubTimer = new SubTimer(gradDate, false, 'graddatesub', 'grad');
// timers.push(gradDateTimer, gradDateSubTimer);
function main() {
    const current_time = new Date().getTime();
    for(let i = 0; i < timers.length; i += 1){
        const timer = timers[i];
        timer.update(current_time);
    }
}
setInterval(main, 1000);

},{}]},["2h6cK"], "2h6cK", "parcelRequire4353", {})

//# sourceMappingURL=timer.1e0d4652.js.map
