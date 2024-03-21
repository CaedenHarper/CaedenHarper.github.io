/** 
 * Stores a solve's time, if the solve is a plus two, and if the solve is a DNF.
*/class e{/**
    * @param {Number} num - Time of the solve.
    * @param {boolean} plus_two - If the solve was a plus two.
    * @param {boolean} dnf - If the solve was a DNF.
    * @returns {CubeTime}
    */constructor(e,t,n){this.num=e,this.plus_two=t,this.dnf=n}get getNum(){return this.num}get getPlusTwo(){return this.plus_two}get getDNF(){return this.dnf}/**
     * @returns {string}
     */toString(){return out=num.toString,this.plus_two&&(out+=" (+2)"),this.dnf&&(out="(DNF) "+out),out}}/**
 * Creates a new array containing all of times' num components.
 * @param {CubeTime[]} times
 * @returns {Number[]}
 */function t(e){let t=[];for(let n=0;n<e.length;n++){let i=e[n];t.push(i.getNum)}return t}//     print(f"Total Time Solving: {total_time_solving:.2f} Seconds")
//     print(f"({(total_time_solving/60):.2f} Minutes, {(total_time_solving/60/60):.2f} Hours, {(total_time_solving/60/60/24):.2f} Days)\n")
//     print(f"Global Average = {total_time_solving/(total-num_dnf):.2f}")
function n(e,t){let n=document.createElement("div");n.className=""+t,n.textContent=e,i.appendChild(n)}document.getElementById("main_div");const i=document.getElementById("avg"),s=document.getElementById("streak"),o=document.getElementById("text_input"),l=document.getElementById("total"),r=document.getElementById("DNF"),m=document.getElementById("plus_two"),u=document.getElementById("best_time"),a=document.getElementById("worst_time"),d=document.getElementById("total_time");o.addEventListener("input",// global average
function(){// clear all divs
l.textContent="",r.textContent="",m.textContent="",u.textContent="",a.textContent="",d.textContent="";// remove average divs
let i=document.getElementsByClassName("average");for(;i.length>0;)i[0].parentNode.removeChild(i[0]);// remove streak divs
let g=document.getElementsByClassName("streak");for(;g.length>0;)g[0].parentNode.removeChild(g[0]);!/**
 * Print statistics onto the screen.
 * @param {string} file_or_text - CSV file directory or text input.
 * @param {boolean} file_flag - Flag set if input is a file.
 * @param {boolean} histogram_flag - Flag set if histogram is to be created.
 * @param {boolean} dot_flag - Flag set if dot graph is to be created.
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @param {Number} graph_min - Positive integer that is the minimum point of graph.
 * @param {Number} graph_max - Positive integer that is the maximum point of graph.
 * @param {Number} min - Positive integer that is the minimum point of time spread.
 * @param {Number} max - Positive integer that is the maximum point of time spread.
 * @param {Number} solve_nums - Positive integer of solves to include.
 * @param {boolean} zero_flag - Flag set if time spread ranges with zero solves is to be shown.
 * @param {Number} step - Positive integer of distance between each point in time spread.
 * @param {Number[]} streaks - Numbers to show a best streak of.
 * @returns {void}
 */function(i,o,g,c,f,h,p,N,v,_,F,x,w){var C,b,y,E,B,I,D,T;let M,k,O,P,S;if(void 0===i||void 0===o)return;if((M=o?void 0:/**
 * Parses text containing a list of solves into an array of CubeTimes.
 * @param {string} solves - String containing a list of solves.
 * @returns {CubeTime[]}
 */function(t){lines=t.split("\n"),times=[],time_list_flag=!1;for(let t=0;t<lines.length;t++){if(line=lines[t],!time_list_flag){if("Time List:"==line)time_list_flag=!0;else{if(!line.startsWith("1."))continue;time_list_flag=!0}}if(""!=line&&"\n"!=line&&void 0!=(time=(time=line.split("   ")[0]).split(". ")[1])){if(plus_two=!1,dnf=!1,time.includes("+")&&(time=time.replace("+",""),plus_two=!0),time.includes("DNF(")&&(time=(time=time.replace("DNF(","")).replace(")",""),dnf=!0),time.includes("[")){// remove comments
let e=time.indexOf("["),t=time.lastIndexOf("]");-1!==e&&-1!==t&&t>e&&(time=time.substring(0,e)+time.substring(t+1))}if(time.includes(":")&&(minutes=(split_time=time.split(":"))[0],time=parseFloat(seconds=split_time[1])+60*parseFloat(minutes)),!Number.isFinite(time=parseFloat(time))){console.warn("Parsing Error: one solve was lost.");continue}time_object=new e(time,plus_two,dnf),times.push(time_object)}}return times}(i)).length<=0){console.warn("No solves found.");return}// because there are valid solves, delete label (if it exists)
let W=document.getElementsByTagName("label")[0];(null!=W||void 0!=W)&&W.parentNode.removeChild(W),void 0===g&&(g=!1),void 0===c&&(c=!1),void 0===F&&(F=!0),C=M,void 0===(b=_)&&(b=C.length),Number.isFinite(b=parseFloat(b))||(b=C.length),b<=0&&(b=1),b>=C.length&&(b=C.length),// solve_nums first to update times
_=b=C.length-b,M=M.slice(_,M.length+1);let j=/**
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @returns {Number[]}
 */function(e){// default value
void 0===e&&(e=[5,12,100,1e3,1e4]);let t={};// further validate average_list and construct average_dict
for(let n=0;n<e.length;n++){let i=e[n];Number.isInteger(// if num is an integer, add to dict
i=parseInt(i))&&(t[i]=[])}return t}(void 0),L=(naive_numtimes=t(M)).sort(function(e,t){return e-t});h=(graphs=(y=h,E=p,k=L[0],O=L[L.length-1],void 0===y&&(y=k),void 0===E&&(E=O),y=parseFloat(y),E=parseFloat(E),Number.isFinite(parseFloat(y))||(y=k),Number.isFinite(parseFloat(E))||(E=O),y<0&&(y=k),E<0&&(E=O),y>E&&(y=k,E=O),[y,E]))[0],p=graphs[1],N=(minmax=(B=N,I=v,P=L[0],S=L[L.length-1],void 0===B&&(B=P),void 0===I&&(I=S),B=parseFloat(B),I=parseFloat(I),Number.isFinite(B)||(B=P),Number.isFinite(I)||(I=S),B<0&&(B=P),I<0&&(I=S),B>I&&(B=P,I=S),[B,I]))[0],v=minmax[1],x=void 0===(D=x)||(D=parseFloat(D))<=0||!Number.isFinite(D)?1:D;let q=/**
 * @param {Number[]} streaks - Numbers to show a best streak of. 
 * @returns {{number: number[]}}
 */function(e){// default value
void 0===e&&(e=[15,20,25,30]);let t={};// further validate streaks and construct streak_dict
for(let n=0;n<e.length;n++){let i=e[n];Number.isFinite(// if num is an float, add to dict
i=parseFloat(i))&&(t[i]=[0,0])}return t}(void 0),z=0,A=0,G=0,H=0;best_time=M[0].getNum,worst_time=M[0].getNum;let J=[];for(let e=0;e<M.length;e++){let n=M[e];for(let i in z++,n.getPlusTwo&&G++,j)if(e>i-1){let n=[];for(let t=e-(i-1);t<e+1;t++)n.push(M[t]);let s=/**
 * Calculates average of n solves from given list with length n.
 * @param {CubeTime[]} times 
 * @returns {Number}
 */function(e){let n=e.length;// fix calculation for small length lists.
if(0==n)return null;if(n<=2)return parseFloat((temp_times=t(e)).reduce((e,t)=>e+t,0)/n);let i=Math.ceil(.05*n),s=0,o=[],l=[];for(let t=0;t<e.length;t++){let n=e[t];n.getDNF&&(s++,o.push(n.getNum),l.push(n))}if(s>i)return null;for(let t=0;t<l.length;t++){let n=l[t],i=e.indexOf(n);-1!==i&&e.splice(i,1)}return(// sort by value
(e=t(e)).sort(function(e,t){return e-t}),average=parseFloat((e=(e=(e=e.concat(o)).splice(i)).splice(0,e.length-i)).reduce((e,t)=>e+t,0)/(n-2*i)))}(n);null!=s&&j[i].push(s)}let i=n.getNum;if(isNaN(i)){// should never be true--but if it were it would mess stuff up
console.error("Solve "+e+" was NaN.");continue}if(H+=i,n.getDNF){// streak counting
for(let e in A++,q){let t=q[e],n=t[0],i=t[1];n>i&&(i=n),n=0,// update streak
q[e][0]=n,q[e][1]=i}continue}//streak counting
for(let e in i<best_time&&(best_time=i),i>worst_time&&(worst_time=i),q){let t=q[e],n=t[0],s=t[1],o=parseFloat(e);i<o&&n++,i>=o&&(n=0),n>s&&(s=n),// update streak
q[e][0]=n,q[e][1]=s}J.push(i)}// total should never be null
if(null==z||z<=0){console.warn("No solves found.");return}for(let e in // show total in html
l.textContent="Total solves: "+z,// for(let i = 0; i < time_bins.length-1; i++) {
//     // min, max checking
//     // section checking, zero_flag checking
//     // show time bins sections
//     // print(f"{time_bins[index+1]:.2f} > Solve >= {time_bins[index]:.2f}: {section}")
//     // print(f"({((section/total)):.2%} of Solves)\n")
//     ;
// }
// show DNF count in html
r.textContent="DNFs: "+A,// show +2 count in html
m.textContent="+2s: "+G,// show best time in html
u.textContent="Best time: "+best_time,// show worst time in html
a.textContent="Worst time: "+worst_time,j){if((avg_times=j[e]).length<=0)continue;// sort by value
avg_times.sort(function(e,t){return e-t});let t=avg_times[0].toFixed(2),i=avg_times[avg_times.length-1].toFixed(2),s="Best ao"+e+": "+t;n(s,"average green"),n(s="Worst ao"+e+": "+i,"average red")}// show streaks in html
for(let e in q){let t=q[e],n=t[0],i=t[1];n>i&&(i=n),function(e,t){let n=document.createElement("div");n.className=""+t,n.textContent=e,s.appendChild(n)}("Best streak under "+parseFloat(e).toFixed(2)+": "+i,"streak green")}// show total time solving in html
let K=(// Time calculations
days=Math.floor((T=H)/86400),hours=Math.floor(T%86400/3600),minutes=Math.floor(T%3600/60),seconds=Math.floor(T%60),isNaN(days)||isNaN(hours)||isNaN(minutes)||isNaN(seconds))?(console.warn("Time spent solving is NaN."),"NaN"):minutes<=0&&hours<=0&&days<=0?seconds+"s ":hours<=0&&days<=0?minutes+"m "+seconds+"s ":days<=0?hours+"h "+minutes+"m "+seconds+"s ":days+"d "+hours+"h "+minutes+"m "+seconds+"s ";d.textContent="Total time: "+K;// show global average in html
}(o.value,!1)});//# sourceMappingURL=index.6c2472d3.js.map

//# sourceMappingURL=index.6c2472d3.js.map
