var countDownDate = new Date("Sep 14, 2023 22:00:00").getTime();
// var countDownDate = new Date("Sep 12, 2023 9:0z9:00").getTime();

function countdown() {

    var time_obj = document.getElementById("time");
    var hours_obj = document.getElementById("hours");

    // Get distance from now to date
    var now = new Date().getTime();
    var distance = countDownDate - now;
  
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var full_hours = days*24 + hours;
  
    // Display main time
    if (distance < 0) {
        time_obj.innerHTML = "&#127881";
    } else if (minutes <= 0 && hours <= 0 && days <= 0) {
        time_obj.innerHTML = seconds + "s ";
    } else if (hours <= 0 && days <= 0) {
        time_obj.innerHTML = minutes + "m " + seconds + "s ";
    } else if (days <= 0) {
        time_obj.innerHTML = hours + "h "
        + minutes + "m " + seconds + "s ";
    } else {
        time_obj.innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";
    }

    // Display hours
    if (distance < 0 || full_hours <= 0) {
        hours_obj.innerHTML = "";
    } else {
        hours_obj.innerHTML = "(" + full_hours + " hours" + ")";
    }
}

var interval = setInterval(countdown, 1000);