// initialize constants
// divs
// const main_div = document.getElementById('main_div');
const e=document.getElementById("timer"),t=document.getElementById("paycheck"),n=document.getElementById("biweekly-budget"),d=document.getElementById("daily-budget"),a=document.getElementById("miata-cost"),u=document.getElementById("tax-rate"),o=document.getElementById("total-cost");function l(){let d=function(){let e=parseFloat(a.value),t=parseFloat(u.value);return e*(1+t)}();o.textContent=`$${d.toFixed(2)}`,e.textContent=`${(function(e){let d=parseFloat(t.value),a=parseFloat(n.value);return e/((d-a)/14)})(d).toFixed(0)} days`}// draw screen when parameters are changed
t.addEventListener("input",()=>l()),n.addEventListener("input",()=>l()),d.addEventListener("input",()=>l()),a.addEventListener("input",()=>l()),u.addEventListener("input",()=>l());//# sourceMappingURL=index.ab610475.js.map

//# sourceMappingURL=index.ab610475.js.map
