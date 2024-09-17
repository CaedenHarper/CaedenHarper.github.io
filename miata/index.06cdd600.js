// initialize constants
// divs
// const main_div = document.getElementById('main_div');
const e=document.getElementById("timer"),t=document.getElementById("date"),n=document.getElementById("paycheck"),a=document.getElementById("biweekly-budget"),u=document.getElementById("daily-budget"),d=document.getElementById("miata-cost"),l=document.getElementById("tax-rate"),r=document.getElementById("already-saved"),i=document.getElementById("total-cost");// turn 'NaN', 'Infinity', '-Infinity', <any negative numbers>, -> '?'
function o(e){let t=parseFloat(e);return Number.isFinite(t)&&t>=0?e:"?"}// turn nothing in data boxes -> 0
function v(e){let t=parseFloat(e);return Number.isFinite(t)?t:0}function s(e){e.value=parseFloat(e.value).toFixed(2)}function c(){let u=function(){let e=v(d.value),t=v(l.value),n=e*(1+t),a=v(r.value);return a>=n?0:n-a}(),s=function(e){if(0===e)return 0;let t=v(n.value),u=v(a.value);return u>=t?NaN:e/((t-u)/14)}(u),c=function(e){let t=new Date;return t.setDate(t.getDate()+e)}(s),m=o(u.toFixed(2)),E=o(s.toFixed(0)),F=s>=0?function(e){let t=new Date(e);return t.toLocaleString("en-US",{day:"numeric",month:"short",year:"numeric"})}(c):"Invalid Date";i.textContent=`$${m}`,e.textContent=`${E} days`,t.textContent=F}// initialize textboxes with specified fixedness
n.value=parseFloat(n.value).toFixed(2),a.value=parseFloat(a.value).toFixed(2),u.value=parseFloat(u.value).toFixed(2),d.value=parseFloat(d.value).toFixed(2),r.value=parseFloat(r.value).toFixed(2),// draw screen when parameters are changed
n.addEventListener("input",()=>c()),d.addEventListener("input",()=>c()),l.addEventListener("input",()=>c()),r.addEventListener("input",()=>c()),// update both bi-weekly budget and daily budget when either are changed
a.addEventListener("input",()=>{c(),u.value=(a.value/14).toFixed(2)}),u.addEventListener("input",()=>{c(),a.value=(14*u.value).toFixed(2)}),// update fixedness when user has exited input box
n.addEventListener("blur",e=>{s(e.target)}),a.addEventListener("blur",e=>{s(e.target)}),u.addEventListener("blur",e=>{s(e.target)}),d.addEventListener("blur",e=>{s(e.target)}),r.addEventListener("blur",e=>{s(e.target)}),// draw initial screen
c();//# sourceMappingURL=index.06cdd600.js.map

//# sourceMappingURL=index.06cdd600.js.map
