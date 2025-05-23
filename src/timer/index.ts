// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- This is probably not null
const main_div = document.getElementById('main_div')!;
const celebration_emoji = String.fromCodePoint(127881);
const all_units = [
    'hours',
    'minutes',
    'seconds',
    'fortnights',
    'dog_hours',
    'usain_bolt_100_meters',
    'pizza_hut',
    'chopin',
    'pills',
    'calls',
];

// TODO: add color option
// TODO: better documentation here
class Timer {
    date: Date;
    repeating: boolean;
    ms: number;
    final: string;
    html_element: HTMLDivElement;
    distance: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;

    constructor(date: Date, repeating: boolean, final: string, id_name: string, class_name: string) {
        this.date = date;
        // if the timer repeats every week once passed
        this.repeating = repeating;
        // ms since jan 1st 1970
        this.ms = date.getTime();
        // distance between date and now
        this.distance = 0;

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

    update(current_time: number): void {
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
        this.hours = Math.floor(this.distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        this.minutes = Math.floor(this.distance % (1000 * 60 * 60) / (1000 * 60));
        this.seconds = Math.floor(this.distance % (1000 * 60) / 1000);

        this.display();
    }

    display(): void {
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
    date: Date;
    repeating: boolean;
    ms: number;
    html_element: HTMLDivElement;
    current_unit: string;
    distance: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    full_seconds: number;

    constructor(date: Date, repeating: boolean, id_name: string, class_name: string) {
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

        // this.html_element.addEventListener('click', this.next_unit.bind(this));

        this.html_element.addEventListener('click', () => this.next_unit());

        this.current_unit = all_units[0];
        this.update(new Date().getTime());
    }

    update(current_time: number): void {
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
        this.hours = Math.floor(this.distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        this.minutes = Math.floor(this.distance % (1000 * 60 * 60) / (1000 * 60));
        this.seconds = Math.floor(this.distance % (1000 * 60) / 1000);
        // full seconds used for some display functions
        this.full_seconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60 + this.minutes * 60 + this.seconds;

        this.current_unit_display();
    }

    // TODO: refactor each of these display functions
    display_hours(): void {
        const full_hours = this.days * 24 + this.hours;
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${full_hours} hours)`;
        }
    }

    display_minutes(): void {
        const full_minutes = this.days * 24 * 60 + this.hours * 60 + this.minutes;
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${full_minutes} minutes)`;
        }
    }

    display_seconds(): void {
        if (this.distance < 0) {
            this.html_element.textContent = '0 seconds';
        } else {
            this.html_element.textContent = `(${this.full_seconds} seconds)`;
        }
    }

    display_fortnights(): void {
        // fortnight = 2 weeks = 14 days = 1,210,000 seconds
        const fortnight_constant = 1210000;
        const num_fortnights = (this.full_seconds / (1.0 * fortnight_constant)).toFixed(1);
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_fortnights} fortnights)`;
        }
    }

    display_dog_hours(): void {
        const num_dog_seconds = this.full_seconds * 7;
        const num_dog_hours = Math.round(num_dog_seconds / (60 * 60));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_dog_hours} dog hours)`;
        }
    }

    display_usain_bolt_100_meters(): void {
        const num_usain_bolt = Math.round(this.full_seconds / 9.58);
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_usain_bolt} Usain Bolt 100 meters)`;
        }
    }

    display_pizza_hut(): void {
        const num_pizza_hut = Math.round(this.full_seconds / (15 * 60));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_pizza_hut} Pizza Hut orders)`;
        }
    }

    display_chopin(): void {
        const num_chopin_hours = Math.round(2 * (this.full_seconds / (60 * 60)));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_chopin_hours} Chopin hours)`;
        }
    }

    display_pills(): void {
        const num_pills = Math.round(16 * (this.full_seconds / 86400));
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_pills} pills)`;
        }
    }

    display_calls(): void {
        // each call is about 13.5 minutes
        const num_calls = Math.round(this.full_seconds / 60 / 13.5);
        if (this.distance < 0) {
            this.html_element.textContent = '';
        } else {
            this.html_element.textContent = `(${num_calls} calls)`;
        }
    }

    // TODO: refactor
    current_unit_display(): void {
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
            case 'calls':
                this.display_calls();
                break;
            default:
                this.display_hours();
                break;
        }
    }

    next_unit(): void {
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

const timers: (Timer | SubTimer)[] = [];

const countDownDate = new Date('Jun 13, 2025 17:00:00');
const countDownTimer = new Timer(countDownDate, false, celebration_emoji, 'countdown', '');
const countDownSubTimer = new SubTimer(countDownDate, false, 'countdownsub', '');
timers.push(countDownTimer, countDownSubTimer);

// Every Wednesday
const payCheckDate = new Date('Feb 14, 2024 06:00:00');
const payCheckTimer = new Timer(payCheckDate, true, '', 'paycheck', 'pay');
const payCheckSubTimer = new SubTimer(payCheckDate, true, 'paychecksub', 'pay');
timers.push(payCheckTimer, payCheckSubTimer);

// const gradDate = new Date('May 17, 2024 00:00:00');
// const gradDateTimer = new Timer(gradDate, false, '', 'graddate', 'grad');
// const gradDateSubTimer = new SubTimer(gradDate, false, 'graddatesub', 'grad');
// timers.push(gradDateTimer, gradDateSubTimer);

function main(): void {
    const current_time = new Date().getTime();

    for (const timer of timers) {
        timer.update(current_time);
    }
}

setInterval(main, 1000);
