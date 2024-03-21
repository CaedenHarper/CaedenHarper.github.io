const t=new Date("Sep 28, 2023 21:10:00").getTime(),e=document.getElementById("time"),n=document.getElementById("hours"),o=String.fromCodePoint(127881),s=["hours","minutes","seconds","fortnights","dog_hours","usain_bolt_100_meters","pizza_hut"];let r="hours",u=0,i=0,a=0,c=0,h=0;function l(){let t=24*i+a;u<0||t<=0?n.textContent="":n.textContent=`(${t} hours)`}function d(){switch(r){case"hours":l();break;case"minutes":!function(){let t=1440*i+60*a+c;u<0||t<=0?n.textContent="":n.textContent=`(${t} minutes)`}();break;case"seconds":!function(){let t=86400*i+3600*a+60*c+h;u<0||t<=0?n.textContent="":n.textContent=`(${t} seconds)`}();break;case"fortnights":!function(){// fortnight = 2 weeks = 14 days = 1,210,000 seconds
let t=86400*i+3600*a+60*c+h,e=(t/121e4).toFixed(4);u<0||e<=0?n.textContent="":n.textContent=`(${e} fortnights)`}();break;case"dog_hours":!function(){let t=86400*i+3600*a+60*c+h,e=Math.round(7*t/3600);u<0||e<=0?n.textContent="":n.textContent=`(${e} dog hours)`}();break;case"usain_bolt_100_meters":!function(){let t=86400*i+3600*a+60*c+h,e=Math.round(t/9.58);u<0||e<=0?n.textContent="":n.textContent=`(${e} Usain Bolt 100 meters)`}();break;case"pizza_hut":!function(){let t=86400*i+3600*a+60*c+h,e=Math.round(t/900);u<0||e<=0?n.textContent="":n.textContent=`(${e} Pizza Hut orders)`}();break;default:l(u,i,a)}}// second_countdown.addEventListener('click', randomize_unit);
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
function(){let t=s.indexOf(r);if(-1===t){r="hours",d();return}r=s[(t+1)%s.length],d()}),setInterval(function(){// Get distance from now to date
let n=new Date().getTime();// Time calculations for days, hours, minutes and seconds
i=Math.floor((u=t-n)/864e5),a=Math.floor(u%864e5/36e5),c=Math.floor(u%36e5/6e4),h=Math.floor(u%6e4/1e3),u<0?e.textContent=o:c<=0&&a<=0&&i<=0?e.textContent=`${h}s `:a<=0&&i<=0?e.textContent=`${c}m ${h}s`:i<=0?e.textContent=`${a}h ${c}m ${h}s`:e.textContent=`${i}d ${a}h ${c}m ${h}s`,d()},1e3);//# sourceMappingURL=index.876eb5dd.js.map

//# sourceMappingURL=index.876eb5dd.js.map
