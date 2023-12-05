const t=new Date("Oct 19, 2023 21:10:00").getTime(),e=document.getElementById("time"),n=document.getElementById("hours"),o=String.fromCodePoint(127881),s=["hours","minutes","seconds","fortnights","dog_hours","usain_bolt_100_meters","pizza_hut","chopin"];let r="hours",i=0,u=0,a=0,c=0,h=0;function l(){let t=24*u+a;i<0||t<=0?n.textContent="":n.textContent=`(${t} hours)`}// TODO: refactor
function x(){switch(r){case"hours":l();break;case"minutes":!function(){let t=1440*u+60*a+c;i<0||t<=0?n.textContent="":n.textContent=`(${t} minutes)`}();break;case"seconds":!function(){let t=86400*u+3600*a+60*c+h;i<0||t<=0?n.textContent="":n.textContent=`(${t} seconds)`}();break;case"fortnights":!function(){// fortnight = 2 weeks = 14 days = 1,210,000 seconds
let t=86400*u+3600*a+60*c+h,e=(t/121e4).toFixed(4);i<0||e<=0?n.textContent="":n.textContent=`(${e} fortnights)`}();break;case"dog_hours":!function(){let t=86400*u+3600*a+60*c+h,e=Math.round(7*t/3600);i<0||e<=0?n.textContent="":n.textContent=`(${e} dog hours)`}();break;case"usain_bolt_100_meters":!function(){let t=86400*u+3600*a+60*c+h,e=Math.round(t/9.58);i<0||e<=0?n.textContent="":n.textContent=`(${e} Usain Bolt 100 meters)`}();break;case"pizza_hut":!function(){let t=86400*u+3600*a+60*c+h,e=Math.round(t/900);i<0||e<=0?n.textContent="":n.textContent=`(${e} Pizza Hut orders)`}();break;case"chopin":!function(){let t=86400*u+3600*a+60*c+h,e=Math.round(2*(t/3600));i<0||e<=0?n.textContent="":n.textContent=`(${e} Chopin hours)`}();break;default:l(i,u,a)}}// second_countdown.addEventListener('click', randomize_unit);
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
function(){let t=s.indexOf(r);if(-1===t){r="hours",x();return}r=s[(t+1)%s.length],x()}),setInterval(function(){// Get distance from now to date
let n=new Date().getTime();// Time calculations for days, hours, minutes and seconds
u=Math.floor((i=t-n)/864e5),a=Math.floor(i%864e5/36e5),c=Math.floor(i%36e5/6e4),h=Math.floor(i%6e4/1e3),i<0?e.textContent=o:c<=0&&a<=0&&u<=0?e.textContent=`${h}s `:a<=0&&u<=0?e.textContent=`${c}m ${h}s`:u<=0?e.textContent=`${a}h ${c}m ${h}s`:e.textContent=`${u}d ${a}h ${c}m ${h}s`,x()},1e3);//# sourceMappingURL=index.480df31a.js.map

//# sourceMappingURL=index.480df31a.js.map
