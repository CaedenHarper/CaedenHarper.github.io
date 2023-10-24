// declare event.key constants
const up_arrow = 'ArrowUp';
const down_arrow = 'ArrowDown';
const left_arrow = 'ArrowLeft';
const right_arrow = 'ArrowRight';
const up_letter = 'w';
const down_letter = 's';
const left_letter = 'a';
const right_letter = 'd';

const main_div = document.getElementById('main_div');
const snake = document.getElementById('snake');
const deltaTime = 16.66666;
const velocity = 1;

const x_max = window.screen.availWidth;
const x_min = 0;
const y_max = window.screen.availHeight;
const y_min = 0;

let x_velocity = velocity;
let y_velocity = 0;
let x_position = 0;
let y_position = 0;

function physics() {
    x_position += x_velocity * deltaTime;
    y_position += y_velocity * deltaTime;
    if (x_position > x_max) x_position = x_max;
    if (x_position < x_min) x_position = x_min;
    if (y_position > y_max) y_position = y_max;
    if (y_position < y_min) y_position = y_min;
}

function draw_screen() {
    snake.style.top = `${y_position}px`;
    snake.style.left = `${x_position}px`;
}

function frame() {
    physics();
    draw_screen();
}

function turn_snake(key) {
    if (key === up_arrow || key === up_letter) {
        y_velocity = -1 * velocity;
        x_velocity = 0;
        return;
    }

    if (key === down_arrow || key === down_letter) {
        y_velocity = velocity;
        x_velocity = 0;
        return;
    }

    if (key === left_arrow || key === left_letter) {
        y_velocity = 0;
        x_velocity = -1 * velocity;
        return;
    }

    if (key === right_arrow || key === right_letter) {
        y_velocity = 0;
        x_velocity = velocity;
    }
}

function main() {
    window.addEventListener('keydown', (event) => { turn_snake(event.key); });
    setInterval(frame, deltaTime);
}

main();
