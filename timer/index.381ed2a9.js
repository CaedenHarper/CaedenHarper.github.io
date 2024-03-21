const t=new Date("Nov 2, 2023 21:10:00").getTime(),e=document.getElementById("time"),n=document.getElementById("hours"),o=String.fromCodePoint(127881),s=["hours","minutes","seconds","fortnights","dog_hours","usain_bolt_100_meters","pizza_hut","chopin","pills"];let i="hours",r=0,u=0,a=0,c=0,l=0;function h(){let t=24*u+a;r<0||t<=0?n.textContent="":n.textContent=`(${t} hours)`}// TODO: refactor !!!!!
function x(){switch(i){case"hours":h();break;case"minutes":!function(){let t=1440*u+60*a+c;r<0||t<=0?n.textContent="":n.textContent=`(${t} minutes)`}();break;case"seconds":!function(){let t=86400*u+3600*a+60*c+l;r<0||t<=0?n.textContent="":n.textContent=`(${t} seconds)`}();break;case"fortnights":!function(){// fortnight = 2 weeks = 14 days = 1,210,000 seconds
let t=86400*u+3600*a+60*c+l,e=(t/121e4).toFixed(4);r<0||e<=0?n.textContent="":n.textContent=`(${e} fortnights)`}();break;case"dog_hours":!function(){let t=86400*u+3600*a+60*c+l,e=Math.round(7*t/3600);r<0||e<=0?n.textContent="":n.textContent=`(${e} dog hours)`}();break;case"usain_bolt_100_meters":!function(){let t=86400*u+3600*a+60*c+l,e=Math.round(t/9.58);r<0||e<=0?n.textContent="":n.textContent=`(${e} Usain Bolt 100 meters)`}();break;case"pizza_hut":!function(){let t=86400*u+3600*a+60*c+l,e=Math.round(t/900);r<0||e<=0?n.textContent="":n.textContent=`(${e} Pizza Hut orders)`}();break;case"chopin":!function(){let t=86400*u+3600*a+60*c+l,e=Math.round(2*(t/3600));r<0||e<=0?n.textContent="":n.textContent=`(${e} Chopin hours)`}();break;case"pills":!function(){let t=16*u;r<0||t<=0?n.textContent="":n.textContent=`(${t} pills)`}();break;default:h(r,u,a)}}// second_countdown.addEventListener('click', randomize_unit);
n.addEventListener("click",// function randomize_unit() {
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
function(){let t=s.indexOf(i);if(-1===t){i="hours",x();return}i=s[(t+1)%s.length],x()}),setInterval(function(){// Get distance from now to date
let n=new Date().getTime();// Time calculations for days, hours, minutes and seconds
u=Math.floor((r=t-n)/864e5),a=Math.floor(r%864e5/36e5),c=Math.floor(r%36e5/6e4),l=Math.floor(r%6e4/1e3),r<0?e.textContent=o:c<=0&&a<=0&&u<=0?e.textContent=`${l}s `:a<=0&&u<=0?e.textContent=`${c}m ${l}s`:u<=0?e.textContent=`${a}h ${c}m ${l}s`:e.textContent=`${u}d ${a}h ${c}m ${l}s`,x()},1e3);//# sourceMappingURL=index.381ed2a9.js.map

//# sourceMappingURL=index.381ed2a9.js.map
