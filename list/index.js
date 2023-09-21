const unchecked_box = String.fromCodePoint(9744);
const checked_box = String.fromCodePoint(9745);
const main_div = document.getElementById("main_div");
let id_list = ["airfryer", "pebble ice machine", "cat", "motion activated sink", 
"cute dishware", "fun lamp(s)", "piano", "black cherry merlot soap"];
// sort id_list by length, then by dictionary
id_list.sort(function(a, b) {
    return a.length - b.length || // sort by length, if equal then
           a.localeCompare(b);    // sort by dictionary order
});

let div_list = [];

let max_width = 0;

function append_to_div(id_name) {
    let div = document.createElement('div');
    div.id = id_name;
    div.className = 'noselect child shadow';
    div.textContent = unchecked_box + " " + id_name;
    div.addEventListener("click", function () {return check_by_id(id_name)});
    main_div.appendChild(div);
}

function check_by_id(id_name) {
    let div = document.getElementById(id_name);
    if(div.textContent.startsWith(unchecked_box)) {
        div.textContent = checked_box + " " + id_name;
    } else {
        div.textContent = unchecked_box + " " + id_name;
    }
}

id_list.forEach(append_to_div);