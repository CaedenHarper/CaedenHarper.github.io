let e;var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},l={},r=t.parcelRequire4353;null==r&&((r=function(e){if(e in n)return n[e].exports;if(e in l){var t=l[e];delete l[e];var r={id:e,exports:{}};return n[e]=r,t.call(r.exports,r,r.exports),r.exports}var o=Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(e,t){l[e]=t},t.parcelRequire4353=r);var o=r("jqz8H");// TODO:
// add line graph
// initialize constants
// divs
const i=document.getElementById("avg"),s=document.getElementById("streak"),u=document.getElementById("file-input"),a=document.getElementById("text-input"),d=document.getElementById("total_time"),m=document.getElementById("total"),f=document.getElementById("best_time"),g=document.getElementById("worst_time"),h=document.getElementById("DNF"),c=document.getElementById("plus_two"),p=document.getElementById("mean"),v=document.getElementById("min-input"),N=document.getElementById("max-input"),F=document.getElementById("numsolves-input"),y=document.getElementById("step-input"),E=document.getElementById("average-input"),$=document.getElementById("streak-input"),b="#FFFFFF",w=String.fromCharCode(160);o.default.defaults.borderColor=b,o.default.defaults.color=b,o.default.defaults.animation=!1;/**
 * Stores a solve's time, if the solve is a plus two, and if the solve is a DNF.
*/class x{/**
    * @param {Number} num - Time of the solve.
    * @param {boolean} plus_two - If the solve was a plus two.
    * @param {boolean} dnf - If the solve was a DNF.
    * @returns {CubeTime}
    */constructor(e,t,n){this.num=e,this.plus_two=t,this.dnf=n}get getNum(){return this.num}get getPlusTwo(){return this.plus_two}get getDNF(){return this.dnf}/**
     * @returns {string}
     */toString(){let e=this.num.toFixed(2).toString();return this.plus_two&&(e+=" (+2)"),this.dnf&&(e=`(DNF) ${e}`),e}}/**
 * Stores an average of N.
*/class B{/**
    * @param {Number} amount - Amount of solves.
    * @param {Number} time - The average's time.
    * @param {boolean} dnf - If the average was a DNF.
    * @param {CubeTime[]} solves - List of solves in the average.
    * @returns {Average}
    */constructor(e,t,n,l){this.amount=e,this.time=t,this.dnf=n,this.solves=l}get getAmount(){return this.amount}get getTime(){return this.time}get getDNF(){return this.dnf}get getSolves(){return this.solves}/**
     * Returns list of solves as a string.
     * @returns {string}
     */toString(){let e="";for(let t=0;t<this.solves.length;t+=1){let n=this.solves[t];e+=n.toString(),t<this.solves.length-1&&(e+=", ")}return e}}/**
 * Creates div to add to parent. Returns created div.
 * @param {HTMLElement} parent
 * @param {string} text
 * @param {string} class_name
 * @return {HTMLElement}
 */function I(e,t,n){let l=document.createElement("div");return l.textContent=t,l.className=n,e.appendChild(l),l}function C(e,t){e.target.style.color="#89CFF0",t.style.visibility="visible",// necessary to prevent tooltip from inherenting the parent's hover color
// there is probably a better way to prevent this, but this works fine
t.style.color="#000000"}function T(e,t){e.target.style.color=b,t.style.visibility="hidden"}function D(e){!function(){// clear text divs
d.textContent="",m.textContent="";// remove all divs
let e=document.getElementsByClassName("remove-refresh");for(;e.length>0;)e[0].parentNode.removeChild(e[0]);// destroy graph
let t=(0,o.default).getChart("graph");void 0!==t&&t.destroy()}();let t=v.value,n=N.value,l=F.value,r=y.value,u=E.value.split(", "),a=$.value.split(", ");!// TODO: refactor
/**
 * Print statistics onto the screen.
 * @param {string} file_or_text - CSV file directory or text input.
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @param {Number} graph_min - Positive integer that is the minimum point of graph.
 * @param {Number} graph_max - Positive integer that is the maximum point of graph.
 * @param {Number} solve_nums - Positive integer of solves to include.
 * @param {Number} step - Positive integer of distance between each point in time spread.
 * @param {Number[]} streaks - Numbers to show a best streak of.
 * @returns {void}
 */function(e,t,n,l,r,u,a){var v,N,F,y,E;if(void 0===e||e.length<=0){console.warn("No solves found.");return}v=e,void 0===(N=r)&&(N=v.length),Number.isFinite(N=parseFloat(N))||(N=v.length),N<=0&&(N=1),N>=v.length&&(N=v.length),// validate solve_nums and update times
r=N=v.length-N,e=e.slice(r,e.length+1);// validate everything else
let $=/**
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @returns {Number[]}
 */function(e){// default value
(void 0===e||1===e.length&&""===e[0])&&(e=[5,12]);let t={};// further validate average_list and construct average_dict
for(let n=0;n<e.length;n+=1){let l=e[n];Number.isInteger(// if num is an integer, add to dict
l=parseInt(l,10))&&(t[l]=[])}return t}(t);[n,l]=(void 0===(F=n)&&(F=5),void 0===(y=l)&&(y=30),F=parseFloat(F),y=parseFloat(y),Number.isFinite(parseFloat(F))||(F=5),Number.isFinite(parseFloat(y))||(y=30),F<0&&(F=5),y<=0&&(y=30),F>=y&&(F=5,y=30),[F,y]),u=void 0===(E=u)||(E=parseFloat(E))<=0||!Number.isFinite(E)?1:E;let b=/**
 * @param {Number[]} streaks - Numbers to show a best streak of.
 * @returns {{number: number[]}}
 */function(e){// default value
(void 0===e||1===e.length&&""===e[0])&&(e=[10,15,20,25,30]);let t={};// further validate streaks and construct streak_dict
for(let n=0;n<e.length;n+=1){let l=e[n];Number.isFinite(// if num is a float in range, add to dict
l=parseFloat(l))&&l>0&&(t[l]=[0,0])}return t}(a),x=0,D=0,L=0,O=0,S=e[0].getNum,k=e[0].getNum,_=[],M=n-u;M<=0&&(M=0);let j=l+u,P=[],W=0;for(;M<j;)_.push([M.toFixed(2)]),M+=u,P[W]={time:M.toFixed(2),count:0},W+=1;let q=[];for(let t=0;t<e.length;t+=1){let n=e[t];x+=1,n.getPlusTwo&&(L+=1);let l=Object.keys($);for(let n=0;n<l.length;n+=1){let r=l[n];if(t>r-1){let n=[];for(let l=t-(r-1);l<t+1;l+=1)n.push(e[l]);let l=// TODO: refactor; increase speed
/**
 * Calculates average of n solves from given list with length n.
 * @param {CubeTime[]} times
 * @returns {Average}
 */function(e){// copy for average solves parameter
let t=[...e],n=0,l=e.length,r=new B(l,0,!0,t);// fix calculation for small length lists.
if(l<=2)return r;let o=Math.ceil(.05*l),i=0,s=[],u=[];for(let t=0;t<e.length;t+=1){let n=e[t];n.getDNF&&(i+=1,s.push(n.getNum),u.push(n))}if(i>o)return r;for(let t=0;t<u.length;t+=1){let n=u[t],l=e.indexOf(n);-1!==l&&e.splice(l,1)}// sort by value
(e=/**
 * Creates a new array containing all of times' num components.
 * @param {CubeTime[]} times
 * @returns {Number[]}
 */function(e){let t=[];for(let n=0;n<e.length;n+=1){let l=e[n];t.push(l.getNum)}return t}(e)).sort((e,t)=>e-t),n=(e=(e=(e=e.concat(s)).splice(o)).splice(0,e.length-o)).reduce((e,t)=>e+t,0);let a=parseFloat(n/(l-2*o)),d=new B(l,a,!1,t);return d}(n);l.getDNF||$[r].push(l)}}let r=n.getNum;if(Number.isNaN(r)){// should never be true--but if it were it would mess stuff up
console.error(`Solve ${t} was NaN.`);continue}if(O+=r,n.getDNF){D+=1;// streak counting
let e=Object.keys(b);for(let t=0;t<e.length;t+=1){let n=e[t],l=b[n],r=l[0],o=l[1];r>o&&(o=r),r=0,// update streak
b[n][0]=r,b[n][1]=o}continue}for(let e=0;e<P.length-1;e+=1){let t=P[e],n=t.time,l=P[e+1],o=l.time;r<o&&r>=n&&(t.count+=1)}r<S&&(S=r),r>k&&(k=r);// streak counting
let o=Object.keys(b);for(let e=0;e<o.length;e+=1){let t=o[e],n=b[t],l=n[0],i=n[1],s=parseFloat(t);r<s&&(l+=1),r>=s&&(l=0),l>i&&(i=l),// update streak
b[t][0]=l,b[t][1]=i}q.push(r)}// total should never be null
if(null==x||x<=0){console.warn("No solves found.");return}let R=(0,o.default).getChart("graph"),A=document.getElementById("graph");void 0!==R&&R.destroy(),// remove 0 count datasets at the front
P.pop(),P.length>0&&new o.default(A,{type:"bar",options:{plugins:{legend:{display:!1}}},data:{labels:P.map(e=>e.time),datasets:[{backgroundColor:"#0163C3",label:"Solves",data:P.map(e=>e.count)}]}}),// TODO: refactor
// show total in html
m.textContent=`Total solves: ${x}`,// show best time in html
I(f,"Best","remove-refresh one-line green"),I(f,`${w}time:${w}`,"remove-refresh one-line"),I(f,`${S.toFixed(2)}`,"remove-refresh one-line"),// show worst time in html
I(g,"Worst","remove-refresh one-line red"),I(g,`${w}time:${w}`,"remove-refresh one-line"),I(g,`${k.toFixed(2)}`,"remove-refresh one-line");// show mean time in html
let U=O/(x-D);p.textContent=`Mean: ${U.toFixed(2)}`,// show DNF count in html
// dnf_div.textContent = `DNFs: ${num_dnf}`;
I(h,"DNFs","remove-refresh one-line red"),I(h,`:${w}`,"remove-refresh one-line"),I(h,`${D}`,"remove-refresh one-line"),// show +2 count in html
I(c,"+2s","remove-refresh one-line red"),I(c,`:${w}`,"remove-refresh one-line"),I(c,`${L}`,"remove-refresh one-line");let z=Object.keys($);for(let e=0;e<z.length;e+=1){let t=z[e],n=$[t];if(n.length<=0)continue;// sort by value
n.sort((e,t)=>e.getTime-t.getTime);let l=n[0],r=l.getTime.toFixed(2),o=n[n.length-1],s=o.getTime.toFixed(2),u=I(i,"","remove-refresh");I(u,"Best","remove-refresh green one-line"),I(u,`${w}ao${t}:${w}`,"remove-refresh one-line");let a=I(u,`${r}`,"remove-refresh one-line"),d=I(a,l.toString(),"tooltip");d.style.visibility="hidden",a.addEventListener("mouseover",e=>C(e,d)),a.addEventListener("mouseout",e=>T(e,d));let m=I(i,"","remove-refresh");I(m,"Worst","remove-refresh red one-line"),I(m,`${w}ao${t}:${w}`,"remove-refresh one-line");let f=I(m,`${s}`,"remove-refresh one-line"),g=I(f,o.toString(),"tooltip");g.style.visibility="hidden",f.addEventListener("mouseover",e=>C(e,g)),f.addEventListener("mouseout",e=>T(e,g))}// show streaks in html
let H=Object.keys(b);H.sort((e,t)=>e-t);for(let e=0;e<H.length;e+=1){let t=H[e],n=b[t],l=n[0],r=n[1];l>r&&(r=l);let o=parseFloat(t),i=I(s,"","remove-refresh");I(i,"Best","remove-refresh green one-line"),I(i,`${w}streak under ${o.toFixed(2)}: ${r}`,"remove-refresh one-line")}// show total time solving in html
let G=/**
 * Creates text to display on the screen from seconds solving.
 * @param {number} total_time_solving
 * @returns {string}
 */function(e){// Time calculations
let t=Math.floor(e/86400),n=Math.floor(e%86400/3600),l=Math.floor(e%3600/60),r=Math.floor(e%60);return Number.isNaN(t)||Number.isNaN(n)||Number.isNaN(l)||Number.isNaN(r)?(console.warn("Time spent solving is NaN."),"NaN"):l<=0&&n<=0&&t<=0?`${r}s `:n<=0&&t<=0?`${l}m ${r}s`:t<=0?`${n}h ${l}m ${r}s`:`${t}d ${n}h ${l}m ${r}s`}(O);d.textContent=`Total time: ${G}`;// show global average in html
}(e,u,t,n,l,r,a)}// draw screen with specific input method
u.addEventListener("change",()=>{let t=new FileReader,n=u.files[0];// TODO: use arraybuffer?
t.readAsText(n),t.onload=()=>{a.value="",D(e=/**
 * Parses a csv file containing a list of solves into an array of CubeTimes.
 * @param {string} file_content - String resulting from file to parse
 * @returns {CubeTime[]}
 */function(e){let t=[],n=e.split("\n");for(let e=0;e<n.length;e+=1){let l=n[e];// throw away first line
if(l.startsWith("No.;Time;"))continue;let r=l.split(";"),o=r[1],i=!1,s=!1;if(o.includes("+")&&(o=o.replace("+",""),i=!0),o.includes("DNF(")&&(o=(o=o.replace("DNF(","")).replace(")",""),s=!0),o.includes(":")){let e=o.split(":"),t=e[0],n=e[1];o=parseFloat(n)+60*parseFloat(t)}if(!Number.isFinite(o=parseFloat(o))){console.warn("Parsing Error: one solve was lost.");continue}let u=new x(o,i,s);t.push(u)}return t}(t.result))}}),a.addEventListener("input",()=>{u.value="",D(e=/**
 * Parses text containing a list of solves into an array of CubeTimes.
 * @param {string} solves - String containing a list of solves.
 * @returns {CubeTime[]}
 */function(e){let t=e.split("\n"),n=[],l=!1;for(let e=0;e<t.length;e+=1){let r=t[e];if(!l){if("Time List:"===r)l=!0;else{if(!r.startsWith("1."))continue;l=!0}}if(""===r||"\n"===r)continue;let o=r.split("   ")[0];if(void 0===(o=o.split(". ")[1]))continue;let i=!1,s=!1;if(o.includes("+")&&(o=o.replace("+",""),i=!0),o.includes("DNF(")&&(o=(o=o.replace("DNF(","")).replace(")",""),s=!0),o.includes("[")){// remove comments
let e=o.indexOf("["),t=o.lastIndexOf("]");if(-1!==e&&-1!==t&&t>e){let n=o.substring(0,e),l=o.substring(t+1);o=n+l}}if(o.includes(":")){let e=o.split(":"),t=e[0],n=e[1];o=parseFloat(n)+60*parseFloat(t)}if(!Number.isFinite(o=parseFloat(o))){console.warn("Parsing Error: one solve was lost.");continue}let u=new x(o,i,s);n.push(u)}return n}(a.value))}),// otherwise just draw screen
v.addEventListener("input",()=>D(e)),N.addEventListener("input",()=>D(e)),F.addEventListener("input",()=>D(e)),y.addEventListener("input",()=>D(e)),E.addEventListener("input",()=>D(e)),$.addEventListener("input",()=>D(e));//# sourceMappingURL=index.9964573e.js.map

//# sourceMappingURL=index.9964573e.js.map
