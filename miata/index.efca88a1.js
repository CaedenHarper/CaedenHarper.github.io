// initialize constants
// divs
// const main_div = document.getElementById('main_div');
const e=document.getElementById("timer"),t=document.getElementById("paycheck"),n=document.getElementById("biweekly-budget"),d=document.getElementById("daily-budget"),u=document.getElementById("miata-cost"),o=document.getElementById("tax-rate"),l=document.getElementById("total-cost");function i(){let n=function(){let e=u.value,t=o.value;return e*(1+t)}();l.textContent=`$${n}`,e.textContent=`${function(e){let n=t.value;return e/(n/14)}(n)} days`}console.log("here"),// draw screen when parameters are changed
t.addEventListener("input",()=>i()),n.addEventListener("input",()=>i()),d.addEventListener("input",()=>i()),u.addEventListener("input",()=>i()),o.addEventListener("input",()=>i());//# sourceMappingURL=index.efca88a1.js.map

//# sourceMappingURL=index.efca88a1.js.map
