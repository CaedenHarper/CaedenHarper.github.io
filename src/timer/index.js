const main_div = document.getElementById('main_div');
const celebration_emoji = String.fromCodePoint(127881);
const all_units = ['hours', 'minutes', 'seconds', 'fortnights', 'dog_hours',
'usain_bolt_100_meters', 'pizza_hut', 'chopin', 'pills'];

class Timer {
    constructor(date, repeating, final, id_name, class_name) {
        this.date = date;
        // if the timer repeats every week once passed
        this.repeating = repeating;
        // ms since jan 1st 1970
        this.ms = date.getTime();
        // distance between date and now

        // final symbol to display after time is up
        this.final = final;

        // create html element
        this.html_element = document.createElement('div');
        this.html_element.id = id_name;
        this.html_element.className = `noselect ${class_name}`;
        this.html_element.textContent = '';
        main_div.appendChild(this.html_element);

        this.update(new Date().getTime());
    }

    update(current_time) {
        // amount of ms in two weeks
        const two_weeks = 1209600000;

        this.distance = this.ms - current_time;

        // if timer is repeating, add two weeks until it is in the future
        if (this.repeating) {
            while (this.distance <= 0) {
                this.distance += two_weeks;
            }
        }

        // Time calculations for days, hours, minutes and seconds
        this.days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

        this.display();
    }

    display() {
        if (this.distance < 0) {
            this.html_element.textContent = this.final;
        } else if (this.minutes <= 0 && this.hours <= 0 && this.days <= 0) {
            this.html_element.textContent = `${this.seconds}s `;
        } else if (this.hours <= 0 && this.days <= 0) {
            this.html_element.textContent = `${this.minutes}m ${this.seconds}s`;
        } else if (this.days <= 0) {
            this.html_element.textContent = `${this.hours}h ${this.minutes}m ${this.seconds}s`;
        } else {
            this.html_element.textContent = `${this.days}d ${this.hours}h ${this.minutes}m ${this.seconds}s`;
        }
    }
}

class SubTimer {
    constructor(date, repeating, id_name, class_name) {
        this.date = date;
        // if the timer repeats every week once passed
        this.repeating = repeating;
        // ms since jan 1st 1970
        this.ms = date.getTime();
        // distance between date and now

        // create html element
        this.html_element = document.createElement('div');
        this.html_element.id = id_name;
        this.html_element.className = `noselect ${class_name}`;
        this.html_element.textContent = '';
        main_div.appendChild(this.html_element);

        this.html_element.addEventListener('click', this.next_unit.bind(this));

        this.current_unit = all_units[0];
        this.update(new Date().getTime());
    }

    update(current_time) {
        // amount of ms in two weeks
        const two_weeks = 1209600000;

        this.distance = this.ms - current_time;

        // if timer is repeating, add two weeks until it is in the future
        // TODO: make this happen once instead of per update
        if (this.repeating) {
            while (this.distance <= 0) {
                this.distance += two_weeks;
            }
        }

        // Time calculations for days, hours, minutes and seconds
        this.days = Math.floor(this.distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((this.distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((this.distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

        this.current_unit_display();
    }

    display_hours() {
        const full_hours = this.days * 24 + this.hours;
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${full_hours} hours)`;
        }
    }

    display_minutes() {
        const full_minutes = this.days * 24 * 60 + this.hours * 60 + this.minutes;
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${full_minutes} minutes)`;
        }
    }

    display_seconds() {
        const full_seconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60
        + this.minutes * 60 + this.seconds;
        if (this.distance < 0) {
            this.html_element.textContent = '0 seconds';
        } else {
            this.html_element.textContent = `(${full_seconds} seconds)`;
        }
    }

    display_fortnights() {
        // fortnight = 2 weeks = 14 this.days = 1,210,000 seconds
        const full_seconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60
        + this.minutes * 60 + this.seconds;
        const fortnight_constant = 1210000;
        const num_fortnights = (full_seconds / (1.0 * fortnight_constant)).toFixed(4);
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_fortnights} fortnights)`;
        }
    }

    display_dog_hours() {
        const full_seconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60
        + this.minutes * 60 + this.seconds;
        const num_dog_seconds = (full_seconds * 7);
        const num_dog_hours = Math.round(num_dog_seconds / (60 * 60));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_dog_hours} dog hours)`;
        }
    }

    display_usain_bolt_100_meters() {
        const full_seconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60
        + this.minutes * 60 + this.seconds;
        const num_usain_bolt = Math.round(full_seconds / (9.58));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_usain_bolt} Usain Bolt 100 meters)`;
        }
    }

    display_pizza_hut() {
        const full_seconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60
        + this.minutes * 60 + this.seconds;
        const num_pizza_hut = Math.round(full_seconds / (15 * 60));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_pizza_hut} Pizza Hut orders)`;
        }
    }

    display_chopin() {
        const full_seconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60
        + this.minutes * 60 + this.seconds;
        const num_chopin_hours = Math.round(2 * (full_seconds / (60 * 60)));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_chopin_hours} Chopin hours)`;
        }
    }

    display_pills() {
        const num_pills = 16 * this.days;
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_pills} pills)`;
        }
    }

    current_unit_display() {
        switch (this.current_unit) {
            case 'hours':
                this.display_hours();
                break;
            case 'minutes':
                this.display_minutes();
                break;
            case 'seconds':
                this.display_seconds();
                break;
            case 'fortnights':
                this.display_fortnights();
                break;
            case 'dog_hours':
                this.display_dog_hours();
                break;
            case 'usain_bolt_100_meters':
                this.display_usain_bolt_100_meters();
                break;
            case 'pizza_hut':
                this.display_pizza_hut();
                break;
            case 'chopin':
                this.display_chopin();
                break;
            case 'pills':
                this.display_pills();
                break;
            default:
                this.display_hours();
                break;
        }
    }

    next_unit() {
        const index = all_units.indexOf(this.current_unit);
        if (index === -1) {
            this.current_unit = 'hours';
            this.current_unit_display();
            return;
        }

        this.current_unit = all_units[(index + 1) % all_units.length];
        this.current_unit_display();
    }
}

const timers = [];

const countDownDate = new Date('Mar 13, 2024 21:10:00');
const payCheckDate = new Date('Feb 14, 2024 06:00:00');

const countDownTimer = new Timer(countDownDate, false, celebration_emoji, 'countdown', '');
const countDownSubTimer = new SubTimer(countDownDate, false, 'countdownsub', '');
const payCheckTimer = new Timer(payCheckDate, true, '', 'paycheck', 'pay');
const payCheckSubTimer = new SubTimer(payCheckDate, true, 'paycheck', 'pay');

timers.push(countDownTimer, countDownSubTimer, payCheckTimer, payCheckSubTimer);

function main() {
    const current_time = new Date().getTime();

    for (let i = 0; i < timers.length; i += 1) {
        const timer = timers[i];
        timer.update(current_time);
    }
}

setInterval(main, 1000);
