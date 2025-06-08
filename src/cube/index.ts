import Chart, { ChartItem } from 'chart.js/auto';
// FUTURE:
// add line graph
// FIXME:
// add e2e / perf testing
// add much more logging

// initialize constants
// divs
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const avg_div = document.getElementById('avg')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const streak_div = document.getElementById('streak')!;
const file_input_div = document.getElementById('file-input') as HTMLInputElement;
const text_input_div = document.getElementById('text-input') as HTMLInputElement;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const total_time_div = document.getElementById('total_time')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const total_div = document.getElementById('total')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const best_time_div = document.getElementById('best_time')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const worst_time_div = document.getElementById('worst_time')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const dnf_div = document.getElementById('DNF')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const plus_two_div = document.getElementById('plus_two')!;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- this is probably fine
const mean_div = document.getElementById('mean')!;
const min_input = document.getElementById('min-input') as HTMLInputElement;
const max_input = document.getElementById('max-input') as HTMLInputElement;
const numsolves_input = document.getElementById('numsolves-input') as HTMLInputElement;
const step_input = document.getElementById('step-input') as HTMLInputElement;
const average_input = document.getElementById('average-input') as HTMLInputElement;
const streak_input = document.getElementById('streak-input') as HTMLInputElement;
const ignore_dnf_input = document.getElementById('ignore-dnf-input') as HTMLInputElement;
const ignore_plus_two_input = document.getElementById('ignore-plus-two-input') as HTMLInputElement;

// colors
const blue = '#0163C3';
const white = '#FFFFFF';
const black = '#000000';
const light_blue = '#89CFF0';

// non compressable space -- used for spaces between divs
const space = String.fromCharCode(160);

// defaults for charts
Chart.defaults.borderColor = white;
Chart.defaults.color = white;
Chart.defaults.animation = false;

/**
 * Stores a solve's time, if the solve is a plus two, and if the solve is a DNF.
*/
export class CubeTime {

    num: number;
    plus_two: boolean;
    dnf: boolean;

    /**
    * @param num - Time of the solve in seconds to two decimal places.
    * @param plus_two - If the solve was a plus two.
    * @param dnf - If the solve was a DNF.
    */
    constructor(num: number, plus_two: boolean, dnf: boolean) {
        this.num = truncate_to_two_decimal_places(num);
        this.plus_two = plus_two;
        this.dnf = dnf;
    }

    /**
     * Make a copy of the CubeTime.
     */
    copy(): CubeTime {
        return new CubeTime(this.num, this.plus_two, this.dnf);
    }

    toString(): string {
        // TODO: This only works for ss.ss right now
        // implement logic to handle minutes and hours too
        // TODO: note .toFixed() is probably unnecessary and .toString() should work,
        // but lets not make the change until unit tests
        let out = this.num.toFixed(2);

        if (this.plus_two) out += ' (+2)';
        if (this.dnf) out = `(DNF) ${out}`;

        return out;
    }
}

/**
 * Stores an average of N. Averages are stored to two decimal places.
*/
export class Average {
    amount: number;
    time: number;
    dnf: boolean;
    solves: CubeTime[];

    /**
    * @param amount - Amount of solves.
    * @param time - The average's time.
    * @param dnf - If the average was a DNF.
    * @param solves - List of solves in the average.
    */
    constructor(amount: number, time: number, dnf: boolean, solves: CubeTime[]) {
        this.amount = amount;
        this.time = time;
        this.dnf = dnf;
        this.solves = solves;
    }

    /**
     * Returns list of solves as a string.
     */
    toString(): string {
        let out = '';

        for (let i = 0; i < this.solves.length; i += 1) {
            const solve = this.solves[i];
            out += solve.toString();

            if (i < this.solves.length - 1) out += ', ';
        }

        return out;
    }
}

/**
 * Timing statistics.
 */
class Stats {
    num_solves: number;
    best_time: number;
    worst_time: number;
    num_plus_two: number;
    num_dnf: number;
    total_time_solving: number;
    average_dict: Map<number, Average[]>;
    streak_dict: Map<number, [number, number]>;
    graph_data: { time: number; count: number }[];

    /**
     * Populate divs with information
     * @param num_solves How many solves
     * @param best_time The best solve time
     * @param worst_time The worst solve time
     * @param num_plus_two How many +2s
     * @param num_dnf How many DNFs
     * @param total_time_solving Sum of all solve times
     * @param average_dict TODO
     * @param streak_dict TODO
     * @param graph_data TODO
     */
    constructor (
        num_solves: number,
        best_time: number,
        worst_time: number,
        num_plus_two: number,
        num_dnf: number,
        total_time_solving: number,
        average_dict: Map<number, Average[]>,
        streak_dict: Map<number, [number, number]>,
        graph_data: { time: number; count: number }[],
    ) {
        this.num_solves = num_solves;
        this.best_time = best_time;
        this.worst_time = worst_time;
        this.num_plus_two = num_plus_two;
        this.num_dnf = num_dnf;
        this.total_time_solving = total_time_solving;
        this.average_dict = average_dict;
        this.streak_dict = streak_dict;
        this.graph_data = graph_data;
    }
}

/**
 * Truncate a number to two decimal places. Do not round.
 *
 * This method uses string casting to avoid floating point math errors.
 * E.g., 12.345 -> 12.34, 12.000 -> 12.00, 12 -> 12.00, etc.
 * @param num Number to truncate
 */
export function truncate_to_two_decimal_places(num: number): number {
    const TWO_DECIMAL_PLACES_REGEX = /^-?\d+(?:\.\d{0,2})?/;
    const num_string = num.toString();

    const match = TWO_DECIMAL_PLACES_REGEX.exec(num_string);
    // Very bad
    if (match === null) throw new TypeError(`Unable to truncate ${num} to two decimal places!`);

    return parseFloat(match[0]);
}

/**
 * Parse a CubeTime from an arbitrary line. Returns undefined if parsing failed.
 *
 * CSTimer supports the following time formats:
 * s.ss, ss.ss, m:ss.ss, mm:ss.ss, h:mm:ss.ss, hh:mm:ss.ss, hhh:mm:ss.ss
 * Each of these can also be DNF or +2 (not both, but the regex supports both)
 * E.g., DNF(10.55), 12:34:56.78+, 8.53, 3:24.12+
*/
export function time_parse(line: string): CubeTime | undefined {
    // Regex returns six matched groups
    // the whole line, dnf, hours, minutes, seconds, plus two
    const TIME_REGEX = /^(?:.*?)(DNF\()?(?:((?:(?:\d\d\d)|(?:\d\d)|\d)):)??(?:((?:(?:\d\d)|\d)):)?((?:(?:\d\d)|\d)\.\d\d)(?:\))?(\+)?(?:.*)$/;
    const matches = TIME_REGEX.exec(line);
    if (matches === null) {
        console.debug(`Time regex had no matches and exited early on line "${line}"`);
        return undefined;
    }

    const [_whole_line, _dnf, _hours, _minutes, _seconds, _plus_two] = matches;
    // TS assumes these are all strings, when in reality they can be undefined too
    // The same applies to _whole_line but we never need to use it
    const dnf = _dnf as string | undefined;
    const hours = _hours as string | undefined;
    const minutes = _minutes as string | undefined;
    const seconds = _seconds as string | undefined;
    const plus_two = _plus_two as string | undefined;

    if (seconds === undefined) {
        // No time is present at all
        console.debug(`Seconds is undefined on parsed line "${line}"`);
        return undefined;
    }

    const is_dnf = dnf !== undefined;
    const is_plus_two = plus_two !== undefined;

    const hours_num = parseInt(hours ?? '0');
    const minutes_num = parseInt(minutes ?? '0');
    const seconds_num = parseFloat(seconds);

    // in seconds
    const parsed_time = hours_num * 60 * 60 + minutes_num * 60 + seconds_num;

    if (!Number.isFinite(parsed_time)) {
        console.warn(`Number is unexpectedly not finite. Skipped parsing time on line "${line}"`);
        return undefined;
    }

    if (parsed_time <= 0) {
        console.warn(`Number is unexpectedly zero or negative. Skipped parsing time on line "${line}"`);
        return undefined;
    }

    return new CubeTime(parsed_time, is_plus_two, is_dnf);
}

/**
 * Parses text containing a list of solves separated by newlines into an array of CubeTimes.
 *
 * We parse one solve time per line, except for CSTimer generated lines.
 * If there are two solve times in one line, only the first is parsed.
 *
 * This function can handle text copy-pasted directly from CSTimer, or a list of solves created by hand.
 * @param solves - String containing a list of solves.
 */
export function text_parse(solves: string): CubeTime[] {

    /*
    The format of CSTimer's copy-pasted output is:
        Generated By csTimer on <date>
        solves/total: <solves>/<total>

        single
            best: <time>
            worst: <time>

        mean of 3
            current: <time> (σ = sd)
            best: <time> (σ = sd)

        avg of 5
            current: <time> (σ = sd)
            best: <time> (σ = sd)

        avg of 12
            current: <time> (σ = sd)
            best: <time> (σ = sd)

        Average: <time> (σ = sd)
        Mean: <time> (σ = sd)

        Time List:
        1. <time>   <scramble>
        ...
    */
    const lines = solves.split('\n');
    const times: CubeTime[] = [];
    for (const line of lines) {
        // Then we match lines starting with any amount of whitespace,
        // and any of the CSTimer generated strings (single, mean of 3, best, worst, etc.)
        const CSTIMER_LINE_REGEX = /^ *(Generated|solves|single|mean|avg|current|best|worst|Average|Mean).*$/;
        if (CSTIMER_LINE_REGEX.test(line)) {
            console.debug(`CSTimer line regex exited early on line "${line}"`);
            continue;
        }

        // Next we extract the time regardless of what else is in the line
        const time = time_parse(line);

        if (time === undefined) {
            continue;
        }

        times.push(time);
    }
    return times;
}

// TODO: unit tests, but not as important
// because time_parse is tested

/**
 * Parses a csv file containing a list of solves into an array of CubeTimes.
 * @param file_content - String resulting from file to parse
 */
function csv_parse(file_content: string): CubeTime[] {
    const times: CubeTime[] = [];

    const lines = file_content.split('\n');
    for (const line of lines) {
        // throw away first line
        if (line.startsWith('No.;Time;')) continue;
        const info = line.split(';');
        // const number = info[0];
        const time = info[1];
        // const comment = info[2];
        // const scramble = info[3];
        // const date = info[4];
        // const p1 = info[5];

        const time_object = time_parse(time);

        if (time_object === undefined) {
            continue;
        }

        times.push(time_object);
    }
    return times;
}

/**
 * Creates a new array containing all of times' num components.
 */
export function times_to_time_nums(times: CubeTime[]): number[] {
    const time_nums: number[] = [];

    for (const time of times) {
        if (time.dnf) console.warn(`times_to_time_nums converting ${time} even though it is a DNF.`);
        time_nums.push(time.num);
    }

    return time_nums;
}

// TODO: increase speed more -- maybe with heaps?

/**
 * Calculates average of n solves from given list with length n.
 *
 * Times.length and amount must be equal.
 * @param times Times to take the average of
 * @param amount Amount in the average
 */
export function average_of_n(times: CubeTime[], amount: number): Average {
    // copy for average solves parameter
    // Not big enough for average
    if (amount <= 2) {
        console.warn(`Amount ${amount} is not big enough to calculate average.`);
        // Return DNF average
        return new Average(0, 0, true, []);
    }

    // Validate we have correct amount of solves
    if (times.length !== amount) {
        throw new TypeError(`Incorrect array size for average of ${amount}: ${times.length}`);
    }

    // We trim off 5% (WCA standard)
    const trim_factor = 0.05;
    const num_trim = Math.ceil(trim_factor * amount);

    // keep track of times to trim from the bottom / top
    // so we can avoid re-doing calculations with DNFs
    let bottom_trim = num_trim;

    // TypedArray is much faster than normal array
    // Max value of elements is the amount in the array
    const good_times = new Float32Array(amount);
    let index = 0;
    for (const time of times) {
        // On DNF we adjust bottom_trim
        if (time.dnf) {
            bottom_trim -= 1;
            // return early if we have a DNF average
            if (bottom_trim < 0) return new Average(0, 0, true, []);
            continue;
        }
        // Otherwise continue as normal
        good_times[index] = time.num;
        index += 1;
    }

    // sort by value
    good_times.sort();
    // we want to skip the first values here because it is empty space
    const unused_in_array = amount - index;

    // NOTE: Faster than of-loop and faster than .splice()
    // Sum over all values that are not in the top trim or bottom trim
    let sum = 0;
    // Start at num_trim to skip first too-good values
    // End bottom_trim early so we can skip too-bad values
    for (index = num_trim + unused_in_array; index < good_times.length - bottom_trim; index += 1) {
        sum += good_times[index];
    }

    const time = truncate_to_two_decimal_places(sum / (amount - 2 * num_trim));

    return new Average(amount, time, false, times);
}

/**
 * Keep `solve_nums` solves from the end of `times`. Returns a new list.
 *
 * Also verifies that solve_nums is positive, finite, and within the bounds of times_length.
 * E.g., 2, [10, 11, 12] -> [11, 12]
 * @param solve_nums Positive integer of solves to include
 * @param times List of strings
 */
export function keep_n_solves_from_times(solve_nums: number, times: CubeTime[]): CubeTime[] {
    const times_length = times.length;
    // validate solve nums
    if (!Number.isFinite(solve_nums)) {
        console.warn('Solve nums must be a number. Setting to all.');
        solve_nums = times_length;
    }

    if (solve_nums > times_length) {
        console.warn('Solve nums less than the total number of solves. Setting to all.');
        solve_nums = times_length;
    }

    if (solve_nums < 1) {
        console.warn('Solve nums must be positive. Setting to 1.');
        solve_nums = 1;
    }

    // Remove solve_nums from the end of times
    const solves_to_remove = times_length - solve_nums;
    return times.slice(solves_to_remove);
}

// TODO: unit tests

/**
 * Turn a list of numbers to calculate "average of n" for into a map to hold all of the averages.
 *
 * E.g., [5, 12] -> {5: [Average(length 5), ...], 12: [Average(length 12), ...]}
 * @param average_list Numbers to calculate "average of n" for.
 */
export function validate_average_list(average_list: number[]): Map<number, Average[]> {
    // default value
    if (average_list.length < 1) average_list = [5, 12];

    const average_dict = new Map<number, Average[]>();
    // construct average_dict
    for (const num of average_list) {
        // continue if number is real and > 2
        if (Number.isFinite(num) && num > 2) {
            average_dict.set(num, []);
        }
    }

    return average_dict;
}

// TODO: unit tests

/**
 * Validate the min and max values for the graph make sense.
 *
 * E.g., they must be positive, the max must be bigger than the minm etc.
 * @param graph_min - Positive integer that is the minimum point of graph. Defaults to 5.
 * @param graph_max - Positive integer that is the maximum point of graph. Defaults to 30.
 */
function validate_graphs(graph_min: number, graph_max: number): [number, number] {
    if (!Number.isFinite(graph_min)) graph_min = 5;
    if (!Number.isFinite(graph_max)) graph_max = 30;

    if (graph_min < 0) graph_min = 5;
    if (graph_max <= 0) graph_max = 30;
    if (graph_min >= graph_max) {
        graph_min = 5;
        graph_max = 30;
    }

    return [graph_min, graph_max];
}

// TODO: maybe make sure step is less than graph_max - graph_min? e.g., one step fits?

/**
 * Validate that the step value for the graph makes sense.
 *
 * E.g., it is positive
 * @param step - Positive number between each point in graph. Defaults to 1.
 */
export function validate_step(step: number): number {
    if (step <= 0 || !Number.isFinite(step)) return 1;

    return step;
}

// TODO: consider creating a streak class to make the logic clearer here
// TODO: unit test

/**
 * Turn an array of numbers to show a "best streak under" into a map that holds the current streak and best streak.
 *
 * E.g., [10, 15] -> {10: [<current streak>, <best streak>], 15: [...]}
 * @param streaks - Numbers to show a "best streak under".
 */
function validate_streaks(streaks: number[]): Map<number, [number, number]> {
    // default value
    if (streaks.length < 1) streaks = [10, 15, 20, 25, 30];

    const streak_dict = new Map<number, [number, number]>();

    // further validate streaks and construct streak_dict
    for (const num of streaks) {
        if (Number.isFinite(num) && num > 0) {
            streak_dict.set(num, [0, 0]);
        }
    }
    return streak_dict;
}

// TODO: unit test

/**
 * Creates text to display on the screen from seconds solving. Returns 'NaN' if any component is NaN.
 * @param total_time_solving
 */
function total_time_solving_text(total_time_solving: number): string {
    let text: string;
    // Time calculations
    const days = Math.floor(total_time_solving / (60 * 60 * 24));
    const hours = Math.floor(total_time_solving % (60 * 60 * 24) / (60 * 60));
    const minutes = Math.floor(total_time_solving % (60 * 60) / 60);
    const seconds = Math.floor(total_time_solving % 60);

    if (Number.isNaN(days) || Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
        console.warn('Time spent solving is NaN.');
        // should someshow stop time spent solving to show but I
        // don't (think) this should ever be possibe, so its fine now
        return 'NaN';
    }

    if (minutes <= 0 && hours <= 0 && days <= 0) {
        text = `${seconds}s `;
    } else if (hours <= 0 && days <= 0) {
        text = `${minutes}m ${seconds}s`;
    } else if (days <= 0) {
        text = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        text = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
    return text;
}

// TODO: unit test(?)

/**
 * Creates div with text `text` and class name `class_name` and adds to `parent`. Returns created div.
 * @param parent
 * @param text
 * @param class_name
 */
function add_to_parent(parent: HTMLElement, text: string, class_name: string): HTMLElement {
    const div = document.createElement('div');
    div.textContent = text;
    div.className = class_name;
    parent.appendChild(div);
    return div;
}

function on_hover(event: MouseEvent, tooltip_div: HTMLElement): void {
    if (event.target) {
        // let TS know its an HTML element
        const target = event.target as HTMLInputElement;

        target.style.color = light_blue;
        tooltip_div.style.visibility = 'visible';
        // necessary to prevent tooltip from inherenting the parent's hover color
        // there is probably a better way to prevent this, but this works fine
        tooltip_div.style.color = black;
    }
}

function off_hover(event: MouseEvent, tooltip_div: HTMLElement): void {
    if (event.target) {
        // let TS know its an HTML element
        const target = event.target as HTMLInputElement;

        target.style.color = white;
        tooltip_div.style.visibility = 'hidden';
    }
}

// TODO: refactor! into many functions. also maybe unit tests here too?
/**
 * Print statistics onto the screen.
 * @param times Solve times to process.
 * @param average_list Averages to calculate average of n for.
 * @param graph_min Positive integer that is the minimum point of graph.
 * @param graph_max Positive integer that is the maximum point of graph.
 * @param solve_nums Positive integer of solves to include.
 * @param step Positive integer of distance between each point in time spread.
 * @param streaks Numbers to show a best streak of.
 * @param ignore_dnf Boolean to control if DNFs should be ignored.
 * @param ignore_plus_two Boolean to control if +2s should be ignored.
 * @returns Statistics object on success, undefined on error.
 */
export function compute_stats(
    times: CubeTime[],
    average_list: number[],
    graph_min: number,
    graph_max: number,
    solve_nums: number,
    step: number,
    streaks: number[],
    ignore_dnf: boolean,
    ignore_plus_two: boolean,
): Stats | undefined {
    if (times.length < 1) {
        console.warn('No solves found. Aborting.');
        return;
    }
    // update times by solve_nums
    times = keep_n_solves_from_times(solve_nums, times);

    // validate everything else
    const average_dict = validate_average_list(average_list);
    [graph_min, graph_max] = validate_graphs(graph_min, graph_max);
    step = validate_step(step);
    const streak_dict = validate_streaks(streaks);

    let num_solves = 0;
    let num_dnf = 0;
    let num_plus_two = 0;
    let total_time_solving = 0;

    let best_time = times[0].num;
    let worst_time = times[0].num;

    // bins that split histogram:
    // starts at graph_min - step and end at graph_max + step
    // has intervals of step
    // if time >= index and time <= index + 1 it gets put there
    // if time is out of range it is not included
    let value = graph_min - step;
    // first value's minimum is 0
    if (value <= 0) value = 0;
    const end = graph_max + step;
    // also construct graph data at the same time to avoid two loops
    const graph_data: { time: number; count: number }[] = [];
    let graph_index = 0;
    while (value < end) {
        value += step;
        graph_data[graph_index] = { time: truncate_to_two_decimal_places(value), count: 0 };
        graph_index += 1;
    }

    const numtimes: number[] = [];
    for (let index = 0; index < times.length; index += 1) {
        // make copy of time
        const time = times[index].copy();
        num_solves += 1;
        // Handle ignore +2 and ignore DNF flags
        if (ignore_dnf) {
            time.dnf = false;
        }

        if (ignore_plus_two && time.plus_two) {
            time.num -= 2;
            time.plus_two = false;
        }

        if (time.plus_two) num_plus_two += 1;


        for (const [key, value] of average_dict) {
            const to_average = times.slice(index, index + key);

            // Not enough solves
            if (to_average.length != key) continue;

            const avg = average_of_n(to_average, key);
            if (!avg.dnf) value.push(avg);
        }

        const num = time.num;
        if (Number.isNaN(num)) {
            // should never be true--but if it were it would mess stuff up
            console.error(`Solve ${index} was NaN.`);
            continue;
        }
        total_time_solving += num;

        if (time.dnf) {
            num_dnf += 1;

            // streak counting
            for (const [_streak, streak_list] of streak_dict) {
                let cur_streak = streak_list[0];
                let best_streak = streak_list[1];
                if (cur_streak > best_streak) best_streak = cur_streak;
                cur_streak = 0;
                // update streak
                streak_list[0] = cur_streak;
                streak_list[1] = best_streak;
            }
            continue;
        }

        // TODO: what does this do?
        // TODO: consider turning graph_data into a clearer object here / class
        for (let i = 0; i < graph_data.length - 1; i += 1) {
            const this_properties = graph_data[i];
            const this_time = this_properties.time;
            const next_properties = graph_data[i + 1];
            const next_time = next_properties.time;
            if (num < next_time && num >= this_time) {
                this_properties.count += 1;
            }
        }

        if (num < best_time) best_time = num;
        if (num > worst_time) worst_time = num;

        // TODO: combine the two streak counting loops into one? maybe?

        // streak counting
        for (const [streak, streak_list] of streak_dict) {
            let cur_streak = streak_list[0];
            let best_streak = streak_list[1];

            if (num < streak) cur_streak += 1;
            if (num >= streak) cur_streak = 0;
            if (cur_streak > best_streak) best_streak = cur_streak;

            // update streak
            streak_list[0] = cur_streak;
            streak_list[1] = best_streak;
        }

        numtimes.push(num);
    }

    if (num_solves < 1) {
        console.warn('No solves found. Aborting.');
        return;
    }

    return new Stats(
        num_solves,
        best_time,
        worst_time,
        num_plus_two,
        num_dnf,
        total_time_solving,
        average_dict,
        streak_dict,
        graph_data,
    );
}

// TODO: make average_dict a class, same with streak and streak_dict
// TODO: unit tests

/**
 * Populate divs with information from statistics object.
 * @param stats Statistics object with timing information.
 */
function populate_divs(stats: Stats): void {
    // show total in html
    total_div.textContent = `Total solves: ${stats.num_solves}`;

    // show best time in html
    add_to_parent(best_time_div, 'Best', 'remove-refresh one-line green');
    add_to_parent(best_time_div, `${space}time:${space}`, 'remove-refresh one-line');
    add_to_parent(best_time_div, stats.best_time.toString(), 'remove-refresh one-line');

    // show worst time in html
    add_to_parent(worst_time_div, 'Worst', 'remove-refresh one-line red');
    add_to_parent(worst_time_div, `${space}time:${space}`, 'remove-refresh one-line');
    add_to_parent(worst_time_div, stats.worst_time.toString(), 'remove-refresh one-line');

    // show mean time in html
    const mean_time = stats.total_time_solving / (stats.num_solves - stats.num_dnf);
    mean_div.textContent = `Mean: ${truncate_to_two_decimal_places(mean_time)}`;

    // show DNF count in html
    // dnf_div.textContent = `DNFs: ${num_dnf}`;
    add_to_parent(dnf_div, 'DNFs', 'remove-refresh one-line red');
    add_to_parent(dnf_div, `:${space}`, 'remove-refresh one-line');
    add_to_parent(dnf_div, `${stats.num_dnf}`, 'remove-refresh one-line');

    // show +2 count in html
    add_to_parent(plus_two_div, '+2s', 'remove-refresh one-line red');
    add_to_parent(plus_two_div, `:${space}`, 'remove-refresh one-line');
    add_to_parent(plus_two_div, `${stats.num_plus_two}`, 'remove-refresh one-line');

    // construct averages
    for (const [key, avg_times] of stats.average_dict) {
        if (avg_times.length <= 0) continue;
        // sort by value
        avg_times.sort((a, b) => a.time - b.time);

        const best_avg = avg_times[0];
        const best = best_avg.time.toFixed(2);
        const worst_avg = avg_times[avg_times.length - 1];
        const worst = worst_avg.time.toFixed(2);
        // show best, worst avg in html (I.E., Best Average of {KEY} = Best)
        const best_parent = add_to_parent(avg_div, '', 'remove-refresh');
        add_to_parent(best_parent, 'Best', 'remove-refresh green one-line');
        add_to_parent(best_parent, `${space}ao${key}:${space}`, 'remove-refresh one-line');
        const mouse_over_best = add_to_parent(best_parent, best, 'remove-refresh one-line');

        // add list of solves on mouseover
        const best_tooltip = add_to_parent(mouse_over_best, best_avg.toString(), 'tooltip');
        best_tooltip.style.visibility = 'hidden';
        mouse_over_best.addEventListener('mouseover', (event) => on_hover(event, best_tooltip));
        mouse_over_best.addEventListener('mouseout', (event) => off_hover(event, best_tooltip));

        const worst_parent = add_to_parent(avg_div, '', 'remove-refresh');
        add_to_parent(worst_parent, 'Worst', 'remove-refresh red one-line');
        add_to_parent(worst_parent, `${space}ao${key}:${space}`, 'remove-refresh one-line');
        const mouse_over_worst = add_to_parent(worst_parent, worst, 'remove-refresh one-line');

        // add list of solves on mouseover
        const worst_tooltip = add_to_parent(mouse_over_worst, worst_avg.toString(), 'tooltip');
        worst_tooltip.style.visibility = 'hidden';
        mouse_over_worst.addEventListener('mouseover', (event) => on_hover(event, worst_tooltip));
        mouse_over_worst.addEventListener('mouseout', (event) => off_hover(event, worst_tooltip));
    }

    // show streaks in html
    // sort streak dict by key
    const sorted_streak_dict = new Map([...stats.streak_dict].sort((a, b) => a[0] - b[0]));
    for (const [streak, streak_list] of sorted_streak_dict) {
        const cur_streak = streak_list[0];
        let best_streak = streak_list[1];
        if (cur_streak > best_streak) best_streak = cur_streak;

        const streak_parent = add_to_parent(streak_div, '', 'remove-refresh');
        add_to_parent(streak_parent, 'Best', 'remove-refresh green one-line');
        add_to_parent(streak_parent, `${space}streak under ${streak.toFixed(2)}: ${best_streak}`, 'remove-refresh one-line');
    }

    // show total time solving in html
    const text = total_time_solving_text(stats.total_time_solving);
    total_time_div.textContent = `Total time: ${text}`;
}

// TODO: create class for graph data
// not even sure what the graph data is specifically
// TODO: unit test

/**
 * Populate graph with graph data
 */
function populate_graph(graph_data: { time: number; count: number }[]): void {
    // TODO: make chart clearly show the min and max for each bucket
    // (right now it is ambiguous)
    const chart = Chart.getChart('graph');
    const graph = document.getElementById('graph');

    if (chart) chart.destroy();

    // remove 0 count datasets at the front
    graph_data.pop();
    if (graph_data.length > 0) {
        new Chart(
            // TODO: should we validate the typecasting here?
            graph as ChartItem,
            {
                type: 'bar',
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
                data: {
                    labels: graph_data.map((row) => row.time),
                    datasets: [
                        {
                            backgroundColor: blue,
                            label: 'Solves',
                            data: graph_data.map((row) => row.count),
                        },
                    ],
                },
            },
        );
    }
}

/**
 * Clear text divs and remove all removeable divs.
 */
function clear_divs(): void {
    // clear text divs
    total_time_div.textContent = '';
    total_div.textContent = '';
    mean_div.textContent = '';

    // remove all divs
    const to_remove = document.getElementsByClassName('remove-refresh');
    while (to_remove.length > 0) {
        to_remove[0].parentNode?.removeChild(to_remove[0]);
    }

    // destroy graph
    const chart = Chart.getChart('graph');
    if (chart) chart.destroy();
}

// TODO: unit tests here

/**
* Remove all whitespace from string and split on commas. Turn into an array of unique numbers. Non-numbers will be removed. An empty array may be returned.
* @param str
*/
function string_to_number_array(str: string): number[] {
    const out: number[] = [];

    // Remove whitespace
    // TODO: remove ALL whitespace, not just spaces
    const string_array = str.replaceAll(' ', '').split(',');

    for (const value of string_array) {
        const num = parseFloat(value);

        // if num is unparseable
        if (Number.isNaN(num)) continue;

        out.push(Number(value));
    }

    return out;
}

function draw_screen(time_input: CubeTime[]): void {
    clear_divs();

    // TODO: consider moving to function
    const graph_min_string = min_input.value;
    const graph_max_string = max_input.value;
    const solve_nums_string = numsolves_input.value;
    const step_string = step_input.value;
    const average_list_string = average_input.value;
    const streak_list_string = streak_input.value;
    const ignore_dnf = ignore_dnf_input.checked;
    const ignore_plus_two = ignore_plus_two_input.checked;

    // Make sure we pass numbers to print_stats()
    const graph_min = parseFloat(graph_min_string);
    const graph_max = parseFloat(graph_max_string);
    const solve_nums = parseFloat(solve_nums_string);
    const step = parseFloat(step_string);

    // Make sure we pass number[] to print_stats()
    const average_list = string_to_number_array(average_list_string);
    const streak_list = string_to_number_array(streak_list_string);

    // TODO: consider turning print_stats into create_stats,
    // and moving out the actual on-screen printing out of the function
    const stats = compute_stats(
        time_input,
        average_list,
        graph_min,
        graph_max,
        solve_nums,
        step,
        streak_list,
        ignore_dnf,
        ignore_plus_two,
    );

    if (stats === undefined) return;

    populate_graph(stats.graph_data);
    populate_divs(stats);
}

function main(): void {
    let time_input: CubeTime[];

    // draw screen with specific input method
    file_input_div.addEventListener('change', () => {
        const reader = new FileReader();

        const files = file_input_div.files;
        if (files === null) return;
        const file = files[0];

        // TODO: use arraybuffer?
        reader.readAsText(file);
        reader.onload = (): void => {
            text_input_div.value = '';
            // FIXME: can we typecast here?
            time_input = csv_parse(reader.result as string);
            draw_screen(time_input);
        };
    });

    text_input_div.addEventListener('input', () => {
        file_input_div.value = '';
        time_input = text_parse(text_input_div.value);
        draw_screen(time_input);
    });

    // otherwise just draw screen
    min_input.addEventListener('input', () => draw_screen(time_input));
    max_input.addEventListener('input', () => draw_screen(time_input));
    numsolves_input.addEventListener('input', () => draw_screen(time_input));
    step_input.addEventListener('input', () => draw_screen(time_input));
    average_input.addEventListener('input', () => draw_screen(time_input));
    streak_input.addEventListener('input', () => draw_screen(time_input));
    ignore_dnf_input.addEventListener('input', () => draw_screen(time_input));
    ignore_plus_two_input.addEventListener('input', () => draw_screen(time_input));
}

// Prevent tests from running main() but allow the browser to
// See https://stackoverflow.com/a/52231746
if (process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test') {
    main();
} else console.log('Detected to be running in test environment.');
