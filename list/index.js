const unchecked_box = String.fromCodePoint(9744);
const checked_box = String.fromCodePoint(9745);
const main_div = document.getElementById("main_div");
var id_list = [];

function append_div(id_name) {
    var div = document.createElement('div');
    div.id = id_name;
    div.className = 'noselect child shadow';
    div.textContent = unchecked_box + " " + id_name;
    div.addEventListener("click", function () {return check_by_id(id_name)});
    id_list.push(id_name);
    main_div.appendChild(div);
}

function check_by_id(id_name) {
    var div = document.getElementById(id_name);
    if(div.textContent.startsWith(unchecked_box)) {
        div.textContent = checked_box + " " + id_name;
    } else {
        div.textContent = unchecked_box + " " + id_name;
    }
}

append_div("airfryer");
append_div("pebble ice machine");
append_div("cat");
append_div("motion activated sink");
append_div("cute dishware");
append_div("fun lamp(s)");
append_div("piano");
append_div("black cherry merlot soap");