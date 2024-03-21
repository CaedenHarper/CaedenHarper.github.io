const t=new Date("Feb 8, 2024 19:10:00").getTime(),e=new Date("Feb 14, 2024 00:00:00").getTime(),n=document.getElementById("time"),o=document.getElementById("hours"),s=document.getElementById("pay_time"),r=String.fromCodePoint(127881),a=["hours","minutes","seconds","fortnights","dog_hours","usain_bolt_100_meters","pizza_hut","chopin","pills"];let i="hours",u=0,h=0,l=0,c=0,x=0,C=0,$=0,f=0,d=0,m=0;function g(){let t=24*h+l;u<0?o.textContent="":o.textContent=`(${t} hours)`}// TODO: refactor !!!!!
function b(){switch(i){case"hours":g();break;case"minutes":!function(){let t=1440*h+60*l+c;u<0?o.textContent="":o.textContent=`(${t} minutes)`}();break;case"seconds":!function(){let t=86400*h+3600*l+60*c+x;u<0?o.textContent="0 seconds":o.textContent=`(${t} seconds)`}();break;case"fortnights":!function(){// fortnight = 2 weeks = 14 days = 1,210,000 seconds
let t=86400*h+3600*l+60*c+x,e=(t/121e4).toFixed(4);u<0?o.textContent="":o.textContent=`(${e} fortnights)`}();break;case"dog_hours":!function(){let t=86400*h+3600*l+60*c+x;u<0?o.textContent="":o.textContent=`(${Math.round(7*t/3600)} dog hours)`}();break;case"usain_bolt_100_meters":!function(){let t=86400*h+3600*l+60*c+x;u<0?o.textContent="":o.textContent=`(${Math.round(t/9.58)} Usain Bolt 100 meters)`}();break;case"pizza_hut":!function(){let t=86400*h+3600*l+60*c+x;u<0?o.textContent="":o.textContent=`(${Math.round(t/900)} Pizza Hut orders)`}();break;case"chopin":!function(){let t=86400*h+3600*l+60*c+x;u<0?o.textContent="":o.textContent=`(${Math.round(2*(t/3600))} Chopin hours)`}();break;case"pills":!function(){let t=16*h;u<0?o.textContent="":o.textContent=`(${t} pills)`}();break;default:g(u,h,l)}}// second_countdown.addEventListener('click', randomize_unit);
o.addEventListener("click",// function randomize_unit() {
//     const all_units_except_current = [...all_units]
//     const index = all_units_except_current.indexOf(current_unit);
//     if (index !== -1) {
//         all_units_except_current.splice(index, 1);
//     } else {
//         current_unit = 'hours';
//         current_unit_display();
//         return;
//     }
//     const random_index = Math.floor(Math.random() * all_units_except_current.length);
//     current_unit = all_units_except_current[random_index];
//     current_unit_display();
// }
function(){let t=a.indexOf(i);if(-1===t){i="hours",b();return}i=a[(t+1)%a.length],b()}),setInterval(// REFACTOR!!!!!
function(){// Get distance from now to date
let o=new Date().getTime();// while pay_distance is in the past, add 14 days
for(u=t-o,C=e-o;C<=0;)C+=12096e5;// Time calculations for days, hours, minutes and seconds
h=Math.floor(u/864e5),l=Math.floor(u%864e5/36e5),c=Math.floor(u%36e5/6e4),x=Math.floor(u%6e4/1e3),$=Math.floor(C/864e5),f=Math.floor(C%864e5/36e5),d=Math.floor(C%36e5/6e4),m=Math.floor(C%6e4/1e3),u<0?n.textContent=r:c<=0&&l<=0&&h<=0?n.textContent=`${x}s `:l<=0&&h<=0?n.textContent=`${c}m ${x}s`:h<=0?n.textContent=`${l}h ${c}m ${x}s`:n.textContent=`${h}d ${l}h ${c}m ${x}s`,b(),C<0?s.textContent=r:d<=0&&f<=0&&$<=0?s.textContent=`${m}s `:f<=0&&$<=0?s.textContent=`${d}m ${m}s`:$<=0?s.textContent=`${f}h ${d}m ${m}s`:s.textContent=`${$}d ${f}h ${d}m ${m}s`},1e3);//# sourceMappingURL=index.da6afe21.js.map

//# sourceMappingURL=index.da6afe21.js.map
