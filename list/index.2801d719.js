const t=String.fromCodePoint(9744),e=String.fromCodePoint(9745),n=document.getElementById("main_div");let o=["airfryer","pebble ice machine","cat","motion activated sink","cute dishware","fun lamp(s)","piano","black cherry merlot soap"];// sort id_list by length, then by dictionary
o.sort(function(t,e){return t.length-e.length||// sort by length, if equal then
t.localeCompare(e);// sort by dictionary order
}),o.forEach(function(o){let i=document.createElement("div");i.id=o,i.className="noselect child shadow",i.textContent=t+" "+o,i.addEventListener("click",function(){let n;(n=document.getElementById(o)).textContent.startsWith(t)?n.textContent=e+" "+o:n.textContent=t+" "+o}),n.appendChild(i)});//# sourceMappingURL=index.2801d719.js.map

//# sourceMappingURL=index.2801d719.js.map
