let countDownDate = new Date("Sep 28, 2023 22:00:00").getTime();
// let countDownDate = new Date("Sep 12, 2023 9:09:00").getTime();
const main_countdown = document.getElementById("time");
const second_countdown = document.getElementById("hours");
const celebration_emoji = String.fromCodePoint(127881);
const all_units = ["hours", "minutes", "seconds", "fortnights", "dog_hours", "usain_bolt_100_meters", "pizza_hut"];
let current_unit = "hours";

// init. globally
let distance = 0;
let days = 0;
let hours = 0;
let minutes = 0;
let seconds = 0;

// second_countdown.addEventListener("click", randomize_unit);
second_countdown.addEventListener("click", next_unit);

function main() {
    // Get distance from now to date
    let now = new Date().getTime();
    distance = countDownDate - now;
  
    // Time calculations for days, hours, minutes and seconds
    days = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
    display_countdown()
    current_unit_display();
}

function current_unit_display() {
    switch (current_unit) {
        case "hours":
            display_hours();
            break;
        case "minutes":
            display_minutes();
            break;
        case "seconds":
            display_seconds();
            break;
        case "fortnights":
            display_fortnights();
            break;
        case "dog_hours":
            display_dog_hours();
            break;
        case "usain_bolt_100_meters":
            display_usain_bolt_100_meters();
            break;
        case "pizza_hut":
            display_pizza_hut();
            break;
        default:
            display_hours(distance, days, hours);
            break;
    }
}

function display_countdown() {
    if (distance < 0) {
        main_countdown.textContent = celebration_emoji;
    } else if (minutes <= 0 && hours <= 0 && days <= 0) {
        main_countdown.textContent = seconds + "s ";
    } else if (hours <= 0 && days <= 0) {
        main_countdown.textContent = minutes + "m " + seconds + "s ";
    } else if (days <= 0) {
        main_countdown.textContent = hours + "h "
        + minutes + "m " + seconds + "s ";
    } else {
        main_countdown.textContent = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";
    }
}

function display_hours() {
    let full_hours = days*24 + hours;
    if (distance < 0 || full_hours <= 0) {
        second_countdown.textContent = "";
    } else {
        second_countdown.textContent = "(" + full_hours + " hours" + ")";
    }
}

function display_minutes() {
    let full_minutes = days*24*60 + hours*60 + minutes;
    if (distance < 0 || full_minutes <= 0) {
        second_countdown.textContent = "";
    } else {
        second_countdown.textContent = "(" + full_minutes + " minutes" + ")";
    }
}

function display_seconds() {
    let full_seconds = days*24*60*60 + hours*60*60 + minutes*60 + seconds;
    if (distance < 0 || full_seconds <= 0) {
        second_countdown.textContent = "";
    } else {
        second_countdown.textContent = "(" + full_seconds + " seconds" + ")";
    }
}

function display_fortnights() {
    // fortnight = 2 weeks = 14 days = 1,210,000 seconds
    let full_seconds = days*24*60*60 + hours*60*60 + minutes*60 + seconds;
    let fortnight_constant = 1210000;
    let num_fortnights = (full_seconds / (1.0 * fortnight_constant)).toFixed(4);
    if (distance < 0 || num_fortnights <= 0) {
        second_countdown.textContent = "";
    } else {
        second_countdown.textContent = "(" + num_fortnights + " fortnights" + ")";
    }
}

function display_dog_hours() {
    let full_seconds = days*24*60*60 + hours*60*60 + minutes*60 + seconds;
    let num_dog_seconds = (full_seconds * 7)
    let num_dog_hours = Math.round(num_dog_seconds/(60*60))
    if (distance < 0 || num_dog_hours <= 0) {
        second_countdown.textContent = "";
    } else {
        second_countdown.textContent = "(" + num_dog_hours + " dog hours" + ")";
    }
}

function display_usain_bolt_100_meters() {
    let full_seconds = days*24*60*60 + hours*60*60 + minutes*60 + seconds;
    let num_usain_bolt = Math.round(full_seconds/(9.58))
    if (distance < 0 || num_usain_bolt <= 0) {
        second_countdown.textContent = "";
    } else {
        second_countdown.textContent = "(" + num_usain_bolt + " Usain Bolt 100 meters" + ")";
    }
}

function display_pizza_hut() {
    let full_seconds = days*24*60*60 + hours*60*60 + minutes*60 + seconds;
    let num_pizza_hut = Math.round(full_seconds/(15*60))
    if (distance < 0 || num_pizza_hut <= 0) {
        second_countdown.textContent = "";
    } else {
        second_countdown.textContent = "(" + num_pizza_hut + " Pizza Hut orders" + ")";
    }
}

function randomize_unit() {
    let all_units_except_current = [...all_units]
    
    let index = all_units_except_current.indexOf(current_unit);
    if (index !== -1) {
        all_units_except_current.splice(index, 1);
    } else {
        current_unit = 'hours';
        current_unit_display();
        return;
    }

    current_unit = all_units_except_current[Math.floor(Math.random()*all_units_except_current.length)];
    current_unit_display();
}

function next_unit() {
    let index = all_units.indexOf(current_unit);
    if (index == -1) {
        current_unit = 'hours';
        current_unit_display();
        return;
    }

    current_unit = all_units[(index+1)%all_units.length]
    current_unit_display();
}

let interval = setInterval(main, 1000);