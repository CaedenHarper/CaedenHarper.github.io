var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},e={},n={},o=t.parcelRequire4353;null==o&&((o=function(t){if(t in e)return e[t].exports;if(t in n){var o=n[t];delete n[t];var u={id:t,exports:{}};return e[t]=u,o.call(u.exports,u,u.exports),u.exports}var r=Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(t,e){n[t]=e},t.parcelRequire4353=o);var u=o("jqz8H");// initialize constants
// divs
const r=document.getElementById("previous-quota"),d=document.getElementById("quota-num"),l=document.getElementById("current-quota"),a=document.getElementById("lowest-next-quota"),i=document.getElementById("average-next-quota"),m=document.getElementById("highest-next-quota"),s=document.getElementById("percentile"),c=document.getElementById("lowest-quota-num"),f=document.getElementById("highest-quota-num"),g="#FFFFFF";function x(t,e,n){return Math.trunc(t+100*(1+(e-1)**2/16)*(n+1))}function p(){!function(){// clear text divs
a.textContent="Lowest Next: ",i.textContent="Average Next: ",m.textContent="Highest Next: ",s.textContent="Percentile: ",c.textContent="Quota Num Lower Bound: ",f.textContent="Quota Num Upper Bound: ";// destroy graph
let t=(0,u.default).getChart("graph");void 0!==t&&t.destroy()}();let t=Number(r.value),e=Number(d.value),n=Number(l.value),o=x(t,e,-.5),g=x(t,e,.5);a.textContent+=o,i.textContent+=x(t,e,0),m.textContent+=g;let p=Math.trunc((n-t)/(100*(1+(e-1)**2/16))-.5),h=n<o||n>g;s.textContent+=h?"Impossible":`${Math.round(100*p)}%`;let v=function(t){// the first quota is always 130
let e,n,o=130,u=130,r=1;for(;void 0===e||void 0===n;)void 0===e&&u>=t&&(e=r),void 0===n&&o>t&&(n=r-1),r+=1,o=x(o,r,-.5),u=x(u,r,.5);return{low:Math.trunc(e),high:Math.trunc(n)}}(n),C=n<o;c.textContent+=C?"Impossible":v.low,f.textContent+=C?"Impossible":v.high}String.fromCharCode(160),u.default.defaults.borderColor=g,u.default.defaults.color=g,u.default.defaults.animation=!1,// add draw screen event listeners
r.addEventListener("input",()=>p()),d.addEventListener("input",()=>p()),l.addEventListener("input",()=>p()),// draw the screen once
p();//# sourceMappingURL=index.33c8a5ed.js.map

//# sourceMappingURL=index.33c8a5ed.js.map
