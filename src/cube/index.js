import Chart from 'chart.js/auto';
// TODO:
// add line graph
// implement cache
// increase speed
// add unit / e2e / perf testing
// refactor into typescript
// add much more logging
// fix mean not going away

// initialize constants
// divs
const avg_div = document.getElementById('avg');
const streak_div = document.getElementById('streak');
const file_input_div = document.getElementById('file-input');
const text_input_div = document.getElementById('text-input');
const total_time_div = document.getElementById('total_time');
const total_div = document.getElementById('total');
const best_time_div = document.getElementById('best_time');
const worst_time_div = document.getElementById('worst_time');
const dnf_div = document.getElementById('DNF');
const plus_two_div = document.getElementById('plus_two');
const mean_div = document.getElementById('mean');
const min_input = document.getElementById('min-input');
const max_input = document.getElementById('max-input');
const numsolves_input = document.getElementById('numsolves-input');
const step_input = document.getElementById('step-input');
const average_input = document.getElementById('average-input');
const streak_input = document.getElementById('streak-input');
const ignore_dnf_input = document.getElementById('ignore-dnf-input');
const ignore_plus_two_input = document.getElementById('ignore-plus-two-input');

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
class CubeTime {
    /**
    * @param {Number} num - Time of the solve.
    * @param {boolean} plus_two - If the solve was a plus two.
    * @param {boolean} dnf - If the solve was a DNF.
    * @returns {CubeTime}
    */
    constructor(num, plus_two, dnf) {
        this.num = num;
        this.plus_two = plus_two;
        this.dnf = dnf;
    }

    /**
     * Make a copy of the time.
     * @returns {CubeTime}
     */
    copy() {
        return new CubeTime(this.num, this.plus_two, this.dnf);
    }

    /**
     * @returns {string}
     */
    toString() {
        let out = this.num.toFixed(2).toString();
        if (this.plus_two) {
            out += ' (+2)';
        }
        if (this.dnf) {
            out = `(DNF) ${out}`;
        }
        return out;
    }
}

/**
 * Stores an average of N.
*/
class Average {
    /**
    * @param {Number} amount - Amount of solves.
    * @param {Number} time - The average's time.
    * @param {boolean} dnf - If the average was a DNF.
    * @param {CubeTime[]} solves - List of solves in the average.
    * @returns {Average}
    */
    constructor(amount, time, dnf, solves) {
        this.amount = amount;
        this.time = time;
        this.dnf = dnf;
        this.solves = solves;
    }

    /**
     * Returns list of solves as a string.
     * @returns {string}
     */
    toString() {
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
 * Parses text containing a list of solves into an array of CubeTimes.
 * @param {string} solves - String containing a list of solves.
 * @returns {CubeTime[]}
 */
function text_parse(solves) {
    const lines = solves.split('\n');
    const times = [];
    let time_list_flag = false;
    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        if (!time_list_flag) {
            if (line === 'Time List:') {
                time_list_flag = true;
            } else if (line.startsWith('1.')) {
                time_list_flag = true;
            } else continue;
        }

        if (line === '' || line === '\n') continue;

        let time = line.split('   ')[0];
        time = time.split('. ')[1];
        if (time === undefined) continue;

        let plus_two = false;
        let dnf = false;

        if (time.includes('+')) {
            time = time.replace('+', '');
            plus_two = true;
        }

        if (time.includes('DNF(')) {
            time = time.replace('DNF(', '');
            time = time.replace(')', '');
            dnf = true;
        }

        if (time.includes('[')) {
            // remove comments
            const open_bracket_index = time.indexOf('[');
            const closed_bracket_index = time.lastIndexOf(']');

            if (open_bracket_index !== -1 && closed_bracket_index !== -1
                && (closed_bracket_index > open_bracket_index)) {
              const beforeBracket = time.substring(0, open_bracket_index);
              const afterBracket = time.substring(closed_bracket_index + 1);
              time = beforeBracket + afterBracket;
            }
        }

        if (time.includes(':')) {
            const split_time = time.split(':');
            const minutes = split_time[0];
            const seconds = split_time[1];
            time = (parseFloat(seconds) + (parseFloat(minutes) * 60));
        }

        time = parseFloat(time);
        if (!Number.isFinite(time)) {
            console.warn('Parsing Error: one solve was lost.');
            continue;
        }
        const time_object = new CubeTime(time, plus_two, dnf);
        times.push(time_object);
    }
    return times;
}

// TODO: combine csv_parse and text_parse
// or refactor to both use one underlying function

/**
 * Parses a csv file containing a list of solves into an array of CubeTimes.
 * @param {string} file_content - String resulting from file to parse
 * @returns {CubeTime[]}
 */
function csv_parse(file_content) {
    const times = [];

    const lines = file_content.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        // throw away first line
        if (line.startsWith('No.;Time;')) continue;
        const info = line.split(';');
        // const number = info[0];
        let time = info[1];
        // const comment = info[2];
        // const scramble = info[3];
        // const date = info[4];
        // const p1 = info[5];
        //         # day_ is day with extra time info
        //         year, month, day_ = date.split("-")
        //         # time_ is different from the solve time
        //         day, time_ = day_.split(" ")
        //         # these values unused, but stored anyway if ever needed
        //         hour, minute, second = time_.split(":")

        let plus_two = false;
        let dnf = false;

        if (time.includes('+')) {
            time = time.replace('+', '');
            plus_two = true;
        }

        if (time.includes('DNF(')) {
            time = time.replace('DNF(', '');
            time = time.replace(')', '');
            dnf = true;
        }

        if (time.includes(':')) {
            const split_time = time.split(':');
            const minutes = split_time[0];
            const seconds = split_time[1];
            time = (parseFloat(seconds) + (parseFloat(minutes) * 60));
        }

        time = parseFloat(time);
        if (!Number.isFinite(time)) {
            console.warn('Parsing Error: one solve was lost.');
            continue;
        }
        const time_object = new CubeTime(time, plus_two, dnf);
        times.push(time_object);
    }
    return times;
}

/**
 * Creates a new array containing all of times' num components.
 * @param {CubeTime[]} times
 * @returns {Number[]}
 */
function times_to_time_nums(times) {
    const time_nums = [];
    for (let i = 0; i < times.length; i += 1) {
        const time = times[i];
        time_nums.push(time.num);
    }
    return time_nums;
}

// TODO: refactor; increase speed
// TODO: implement cache
/**
 * Calculates average of n solves from given list with length n.
 * @param {CubeTime[]} times
 * @returns {Average}
 */
function average_of_n(times) {
    // copy for average solves parameter
    const times_copy = [...times];
    let sum = 0;
    const num_of_times = times.length;
    const dnf_average = new Average(num_of_times, 0, true, times_copy);

    // fix calculation for small length lists.
    if (num_of_times <= 2) return dnf_average;

    const trim_factor = 0.05;
    const num_trim = Math.ceil(trim_factor * num_of_times);

    let num_dnfs = 0;
    const DNFs = [];
    const times_to_remove = [];
    for (let i = 0; i < times.length; i += 1) {
        const time = times[i];
        if (time.dnf) {
            num_dnfs += 1;
            DNFs.push(time.num);
            times_to_remove.push(time);
        }
    }
    if (num_dnfs > num_trim) {
        return dnf_average;
    }

    for (let i = 0; i < times_to_remove.length; i += 1) {
        const time_to_remove = times_to_remove[i];
        const index_to_remove = times.indexOf(time_to_remove);
        if (index_to_remove !== -1) {
            times.splice(index_to_remove, 1);
        }
    }

    times = times_to_time_nums(times);
    // sort by value
    times.sort((a, b) => a - b);
    times = times.concat(DNFs);
    times = times.splice(num_trim);
    times = times.splice(0, (times.length - num_trim));
    sum = times.reduce((partialSum, a) => partialSum + a, 0);
    const time = parseFloat(sum / (num_of_times - (2 * num_trim)));
    const out = new Average(num_of_times, time, false, times_copy);
    return out;
}

/**
 * @param {CubeTime[]} times
 * @param {Number} solve_nums - Positive integer of solves to include.
 * @returns {Number}
 */
function validate_solve_nums(times, solve_nums) {
    // include all solves
    if (solve_nums === undefined) solve_nums = times.length;
    solve_nums = parseFloat(solve_nums);
    if (!Number.isFinite(solve_nums)) solve_nums = times.length;

    if (solve_nums <= 0) solve_nums = 1;
    if (solve_nums >= times.length) solve_nums = times.length;

    solve_nums = times.length - solve_nums;
    return solve_nums;
}

/**
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @returns {Number[]}
 */
function validate_average_list(average_list) {
    // default value
    if (average_list === undefined || (average_list.length === 1 && average_list[0] === '')) average_list = [5, 12];

    const average_dict = {};
    // further validate average_list and construct average_dict
    for (let i = 0; i < average_list.length; i += 1) {
        let num = average_list[i];
        // if num is an integer, add to dict
        num = parseInt(num, 10);
        if (Number.isInteger(num)) {
            average_dict[num] = [];
        }
    }
    return average_dict;
}

/**
 * @param {Number} graph_min - Positive integer that is the minimum point of graph.
 * @param {Number} graph_max - Positive integer that is the maximum point of graph.
 * @returns {Number[]}
 */
function validate_graphs(graph_min, graph_max) {
    if (graph_min === undefined) graph_min = 5;
    if (graph_max === undefined) graph_max = 30;

    graph_min = parseFloat(graph_min);
    graph_max = parseFloat(graph_max);
    if (!Number.isFinite(parseFloat(graph_min))) graph_min = 5;
    if (!Number.isFinite(parseFloat(graph_max))) graph_max = 30;

    if (graph_min < 0) graph_min = 5;
    if (graph_max <= 0) graph_max = 30;
    if (graph_min >= graph_max) {
        graph_min = 5;
        graph_max = 30;
    }

    return [graph_min, graph_max];
}

/**
 * @param {Number} step - Positive integer of distance between each point in time spread.
 * @returns {Number}
 */
function validate_step(step) {
    if (step === undefined) return 1;
    step = parseFloat(step);
    if (step <= 0 || !Number.isFinite(step)) return 1;
    return step;
}

/**
 * @param {Number[]} streaks - Numbers to show a best streak of.
 * @returns {{number: number[]}}
 */
function validate_streaks(streaks) {
    // default value
    if (streaks === undefined || (streaks.length === 1 && streaks[0] === '')) streaks = [10, 15, 20, 25, 30];
    const streak_dict = {};

    // further validate streaks and construct streak_dict
    for (let i = 0; i < streaks.length; i += 1) {
        let num = streaks[i];
        // if num is a float in range, add to dict
        num = parseFloat(num);
        if (Number.isFinite(num) && num > 0) {
            streak_dict[num] = [0, 0];
        }
    }
    return streak_dict;
}

/**
 * Creates text to display on the screen from seconds solving.
 * @param {number} total_time_solving
 * @returns {string}
 */
function total_time_solving_text(total_time_solving) {
    let text;
    // Time calculations
    const days = Math.floor(total_time_solving / (60 * 60 * 24));
    const hours = Math.floor((total_time_solving % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((total_time_solving % (60 * 60)) / (60));
    const seconds = Math.floor(total_time_solving % 60);
    if (Number.isNaN(days) || Number.isNaN(hours)
    || Number.isNaN(minutes) || Number.isNaN(seconds)) {
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

/**
 * Creates div to add to parent. Returns created div.
 * @param {HTMLElement} parent
 * @param {string} text
 * @param {string} class_name
 * @return {HTMLElement}
 */
function add_to_parent(parent, text, class_name) {
    const div = document.createElement('div');
    div.textContent = text;
    div.className = class_name;
    parent.appendChild(div);
    return div;
}

function on_hover(event, tooltip_div) {
    event.target.style.color = light_blue;
    tooltip_div.style.visibility = 'visible';
    // necessary to prevent tooltip from inherenting the parent's hover color
    // there is probably a better way to prevent this, but this works fine
    tooltip_div.style.color = black;
}

function off_hover(event, tooltip_div) {
    event.target.style.color = white;
    tooltip_div.style.visibility = 'hidden';
}

// TODO: refactor into multiple functions
/**
 * Print statistics onto the screen.
 * @param {CubeTime[]} times - Solve times to process.
 * @param {string} file_or_text - CSV file directory or text input.
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @param {Number} graph_min - Positive integer that is the minimum point of graph.
 * @param {Number} graph_max - Positive integer that is the maximum point of graph.
 * @param {Number} solve_nums - Positive integer of solves to include.
 * @param {Number} step - Positive integer of distance between each point in time spread.
 * @param {Number[]} streaks - Numbers to show a best streak of.
 * @param {bool} ignore_dnf - Boolean to control if DNFs should be ignored.
 * @param {bool} ignore_plus_two - Boolean to control if +2s should be ignored.
 * @returns {void}
 */
function print_stats(
    times,
    average_list,
    graph_min,
    graph_max,
    solve_nums,
    step,
    streaks,
    ignore_dnf,
    ignore_plus_two,
    ) {
    if (times === undefined || times.length <= 0) {
        console.warn('No solves found.');
        return;
    }
    // validate solve_nums and update times
    solve_nums = validate_solve_nums(times, solve_nums);
    times = times.slice(solve_nums, (times.length + 1));

    // validate everything else
    const average_dict = validate_average_list(average_list);
    [graph_min, graph_max] = validate_graphs(graph_min, graph_max);
    step = validate_step(step);
    const streak_dict = validate_streaks(streaks);

    let total = 0;
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
    const time_bins = [];
    let value = graph_min - step;
    // first value's minimum is 0
    if (value <= 0) value = 0;
    const end = graph_max + step;
    // also construct graph data at the same time to avoid two loops
    const graph_data = [];
    let graph_index = 0;
    while (value < end) {
        time_bins.push([value.toFixed(2)]);
        value += step;
        graph_data[graph_index] = { time: value.toFixed(2), count: 0 };
        graph_index += 1;
    }

    const numtimes = [];
    for (let index = 0; index < times.length; index += 1) {
        // make copy of time
        const time = times[index].copy();
        total += 1;
        // Handle ignore +2 and ignore DNF flags
        if (ignore_dnf) {
            time.dnf = false;
        }

        if (ignore_plus_two) {
            if (time.plus_two) {
                time.num -= 2;
            }
            time.plus_two = false;
        }

        if (time.plus_two) num_plus_two += 1;

        const average_keys = Object.keys(average_dict);
        for (let i = 0; i < average_keys.length; i += 1) {
            const key = average_keys[i];
            if (index > (key - 1)) {
                const sub_times = [];
                for (let n = index - (key - 1); n < index + 1; n += 1) {
                    const temp_time = times[n].copy();
                    total += 1;
                    // Handle ignore +2 and ignore DNF flags
                    if (ignore_dnf) {
                        temp_time.dnf = false;
                    }

                    if (ignore_plus_two) {
                        if (temp_time.plus_two) {
                            temp_time.num -= 2;
                        }
                        temp_time.plus_two = false;
                    }

                    sub_times.push(temp_time);
                }
                const avg = average_of_n(sub_times);
                if (!avg.dnf) {
                    average_dict[key].push(avg);
                }
            }
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
            const streak_keys = Object.keys(streak_dict);
            for (let i = 0; i < streak_keys.length; i += 1) {
                const streak = streak_keys[i];
                const streak_list = streak_dict[streak];
                let cur_streak = streak_list[0];
                let best_streak = streak_list[1];
                if (cur_streak > best_streak) best_streak = cur_streak;
                cur_streak = 0;
                // update streak
                streak_dict[streak][0] = cur_streak;
                streak_dict[streak][1] = best_streak;
            }
            continue;
        }

        for (let i = 0; i < graph_data.length - 1; i += 1) {
            const this_properties = graph_data[i];
            const this_time = this_properties.time;
            const next_properties = graph_data[i + 1];
            const next_time = next_properties.time;
            if (num < next_time && num >= this_time) {
                this_properties.count += 1;
            }
        }

        if (num < best_time) {
            best_time = num;
        }
        if (num > worst_time) {
            worst_time = num;
        }

        // streak counting
        const streak_keys = Object.keys(streak_dict);
        for (let i = 0; i < streak_keys.length; i += 1) {
            const streak = streak_keys[i];
            const streak_list = streak_dict[streak];
            let cur_streak = streak_list[0];
            let best_streak = streak_list[1];
            const streak_num = parseFloat(streak);

            if (num < streak_num) cur_streak += 1;
            if (num >= streak_num) cur_streak = 0;
            if (cur_streak > best_streak) best_streak = cur_streak;

            // update streak
            streak_dict[streak][0] = cur_streak;
            streak_dict[streak][1] = best_streak;
        }

        numtimes.push(num);
    }

    // total should never be null
    if (total == null || total <= 0) {
        console.warn('No solves found.');
        return;
    }

    const chart = Chart.getChart('graph');
    const graph = document.getElementById('graph');

    if (chart !== undefined) {
        chart.destroy();
    }

    // remove 0 count datasets at the front
    graph_data.pop();
    if (graph_data.length > 0) {
        new Chart( // eslint-disable-line no-new
            graph,
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

    // TODO: refactor

    // show total in html
    total_div.textContent = `Total solves: ${total}`;

    // show best time in html
    add_to_parent(best_time_div, 'Best', 'remove-refresh one-line green');
    add_to_parent(best_time_div, `${space}time:${space}`, 'remove-refresh one-line');
    add_to_parent(best_time_div, `${best_time.toFixed(2)}`, 'remove-refresh one-line');

    // show worst time in html
    add_to_parent(worst_time_div, 'Worst', 'remove-refresh one-line red');
    add_to_parent(worst_time_div, `${space}time:${space}`, 'remove-refresh one-line');
    add_to_parent(worst_time_div, `${worst_time.toFixed(2)}`, 'remove-refresh one-line');

    // show mean time in html
    const mean_time = total_time_solving / (total - num_dnf);
    mean_div.textContent = `Mean: ${mean_time.toFixed(2)}`;

    // show DNF count in html
    // dnf_div.textContent = `DNFs: ${num_dnf}`;
    add_to_parent(dnf_div, 'DNFs', 'remove-refresh one-line red');
    add_to_parent(dnf_div, `:${space}`, 'remove-refresh one-line');
    add_to_parent(dnf_div, `${num_dnf}`, 'remove-refresh one-line');

    // show +2 count in html
    add_to_parent(plus_two_div, '+2s', 'remove-refresh one-line red');
    add_to_parent(plus_two_div, `:${space}`, 'remove-refresh one-line');
    add_to_parent(plus_two_div, `${num_plus_two}`, 'remove-refresh one-line');

    const average_keys = Object.keys(average_dict);
    for (let i = 0; i < average_keys.length; i += 1) {
        const key = average_keys[i];
        const avg_times = average_dict[key];
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
        const mouse_over_best = add_to_parent(best_parent, `${best}`, 'remove-refresh one-line');

        // add list of solves on mouseover
        const best_tooltip = add_to_parent(mouse_over_best, best_avg.toString(), 'tooltip');
        best_tooltip.style.visibility = 'hidden';
        mouse_over_best.addEventListener('mouseover', (event) => on_hover(event, best_tooltip));
        mouse_over_best.addEventListener('mouseout', (event) => off_hover(event, best_tooltip));

        const worst_parent = add_to_parent(avg_div, '', 'remove-refresh');
        add_to_parent(worst_parent, 'Worst', 'remove-refresh red one-line');
        add_to_parent(worst_parent, `${space}ao${key}:${space}`, 'remove-refresh one-line');
        const mouse_over_worst = add_to_parent(worst_parent, `${worst}`, 'remove-refresh one-line');

        // add list of solves on mouseover
        const worst_tooltip = add_to_parent(mouse_over_worst, worst_avg.toString(), 'tooltip');
        worst_tooltip.style.visibility = 'hidden';
        mouse_over_worst.addEventListener('mouseover', (event) => on_hover(event, worst_tooltip));
        mouse_over_worst.addEventListener('mouseout', (event) => off_hover(event, worst_tooltip));
    }

    // show streaks in html
    const streak_keys = Object.keys(streak_dict);
    streak_keys.sort((a, b) => a - b);
    for (let i = 0; i < streak_keys.length; i += 1) {
        const streak = streak_keys[i];
        const streak_list = streak_dict[streak];
        const cur_streak = streak_list[0];
        let best_streak = streak_list[1];
        if (cur_streak > best_streak) best_streak = cur_streak;

        const streak_num = parseFloat(streak);
        const streak_parent = add_to_parent(streak_div, '', 'remove-refresh');
        add_to_parent(streak_parent, 'Best', 'remove-refresh green one-line');
        add_to_parent(streak_parent, `${space}streak under ${streak_num.toFixed(2)}: ${best_streak}`, 'remove-refresh one-line');
    }

    // show total time solving in html
    const text = total_time_solving_text(total_time_solving);
    total_time_div.textContent = `Total time: ${text}`;
    // show global average in html
}

function clean_divs() {
    // clear text divs
    total_time_div.textContent = '';
    total_div.textContent = '';

    // remove all divs
    const to_remove = document.getElementsByClassName('remove-refresh');
    while (to_remove.length > 0) {
        to_remove[0].parentNode.removeChild(to_remove[0]);
    }

    // destroy graph
    const chart = Chart.getChart('graph');

    if (chart !== undefined) {
        chart.destroy();
    }
}

function draw_screen(time_input) {
    clean_divs();

    const graph_min = min_input.value;
    const graph_max = max_input.value;
    const solve_nums = numsolves_input.value;
    const step = step_input.value;
    const average_list = average_input.value.split(', ');
    const streak_list = streak_input.value.split(', ');
    const ignore_dnf = ignore_dnf_input.checked;
    const ignore_plus_two = ignore_plus_two_input.checked;
    print_stats(
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
}

function main() {
    let time_input;

    // draw screen with specific input method
    file_input_div.addEventListener('change', () => {
        const reader = new FileReader();
        const file = file_input_div.files[0];

        // TODO: use arraybuffer?
        reader.readAsText(file);
        reader.onload = () => {
            text_input_div.value = '';
            time_input = csv_parse(reader.result);
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

main();
