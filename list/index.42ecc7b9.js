// refactor!
const t=String.fromCodePoint(9744),e=String.fromCodePoint(9745),n=document.getElementById("main_div"),o=["airfryer","pebble ice machine","cat","motion activated sink","cute dishware","fun lamp(s)","piano","black cherry merlot soap"];// sort id_list by length, then by dictionary
o.sort((t,e)=>t.length-e.length||t.localeCompare(e)),o.forEach(function(o){let i=document.createElement("div");i.id=o,i.className="noselect child shadow",i.textContent=`${t} ${o}`,i.addEventListener("click",()=>(function(n){let o=document.getElementById(n);o.textContent.startsWith(t)?o.textContent=`${e} ${n}`:o.textContent=`${t} ${n}`})(o)),n.appendChild(i)});//# sourceMappingURL=index.42ecc7b9.js.map

//# sourceMappingURL=index.42ecc7b9.js.map