// initialize constants
// divs
const t=document.getElementById("previous-quota"),e=document.getElementById("quota-num"),n=document.getElementById("current-quota"),o=document.getElementById("lowest-next-quota"),u=document.getElementById("average-next-quota"),d=document.getElementById("highest-next-quota"),m=document.getElementById("percentile"),l=document.getElementById("lowest-quota-num"),i=document.getElementById("highest-quota-num");function r(t,e,n){return Math.trunc(t+100*(1+(e-1)**2/16)*(n+1))}function a(){// clear text divs
o.textContent="Lowest Next: ",u.textContent="Average Next: ",d.textContent="Highest Next: ",m.textContent="Percentile: ",l.textContent="Quota Num Lower Bound: ",i.textContent="Quota Num Upper Bound: ";let a=Number(t.value),c=Number(e.value),x=Number(n.value),s=r(a,c,-.5),g=r(a,c,.5);o.textContent+=s,u.textContent+=r(a,c,0),d.textContent+=g;let h=(x-a)/(100*(1+(c-1)**2/16))-.5,v=x<s||x>g;m.textContent+=v?"Impossible":`${Math.round(100*h)}%`;let C=function(t){// the first quota is always 130
let e,n,o=130,u=130,d=1;for(;void 0===e||void 0===n;)void 0===e&&u>=t&&(e=d),void 0===n&&o>t&&(n=d-1),d+=1,o=r(o,d,-.5),u=r(u,d,.5);return{low:Math.trunc(e),high:Math.trunc(n)}}(x),E=x<s;l.textContent+=E?"Impossible":C.low,i.textContent+=E?"Impossible":C.high}// add draw screen event listeners
t.addEventListener("input",()=>a()),e.addEventListener("input",()=>a()),n.addEventListener("input",()=>a()),// draw the screen once
a();//# sourceMappingURL=index.f5c04a59.js.map

//# sourceMappingURL=index.f5c04a59.js.map
