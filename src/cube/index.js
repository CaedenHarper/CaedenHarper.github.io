import Chart from 'chart.js/auto'

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

    get getNum() {
        return this.num;
    }

    get getPlusTwo() {
        return this.plus_two;
    }

    get getDNF() {
        return this.dnf;
    }

    /**
     * @returns {string}
     */
    toString() {
        out = num.toString;
        if(this.plus_two) {
            out += " (+2)"
        }
        if(this.dnf) {
            out = "(DNF) " + out;
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
    lines = solves.split("\n");
    times = []
    time_list_flag = false;
    for (let i = 0; i < lines.length; i++) {
        line = lines[i];
        if(!time_list_flag) {
            if(line=="Time List:") {
                time_list_flag = true;
            } else if(line.startsWith("1.")) {
                time_list_flag = true;
            } else {
                continue;
            }
        }

        if(line == "" || line == "\n") {
            continue;
        }

        time = line.split("   ")[0];
        time = time.split(". ")[1];
        if(time == undefined) {
            continue;
        }
        plus_two = false;
        dnf = false;

        if(time.includes("+")) {
            time = time.replace("+", "");
            plus_two = true;
        }

        if(time.includes("DNF(")) {
            time = time.replace("DNF(", "");
            time = time.replace(")", "");
            dnf = true;
        }

        if(time.includes("[")) {
            // remove comments
            let open_bracket_index = time.indexOf("[");
            let closed_bracket_index = time.lastIndexOf("]");
            
            if (open_bracket_index !== -1 && closed_bracket_index !== -1 && 
                (closed_bracket_index > open_bracket_index)) {
              let beforeBracket = time.substring(0, open_bracket_index);
              let afterBracket = time.substring(closed_bracket_index + 1);
              time = beforeBracket + afterBracket;
            }
        }

        if(time.includes(":")) {
            split_time = time.split(":");
            minutes = split_time[0];
            seconds = split_time[1];
            time = (parseFloat(seconds) + (parseFloat(minutes)*60));
        }

        time = parseFloat(time);
        if(!Number.isFinite(time)) {
            console.warn("Parsing Error: one solve was lost.")
            continue;
        }
        time_object = new CubeTime(time, plus_two, dnf);
        times.push(time_object);
    }
    return times;
}

// TODO: add csv parse

/**
 * Parses a csv file containing a list of solves into an array of CubeTimes.
 * @param {string} file - String containing file directory.
 * @returns {CubeTime[]}
 */
function csv_parse(file) {
    return;
}

/**
 * Creates a new array containing all of times' num components.
 * @param {CubeTime[]} times
 * @returns {Number[]}
 */
function times_to_time_nums(times) {
    let time_nums = [];
    for(let i = 0; i < times.length; i++) {
        let time = times[i];
        time_nums.push(time.getNum);
    }
    return time_nums;
}

/**
 * Calculates average of n solves from given list with length n.
 * @param {CubeTime[]} times 
 * @returns {Number}
 */
function average_of_n(times) {
    let sum = 0;
    let num_of_times = times.length;
    
    // fix calculation for small length lists.
    if(num_of_times == 0) return null;
    if(num_of_times <= 2) {
        temp_times = times_to_time_nums(times);
        sum = temp_times.reduce((partialSum, a) => partialSum + a, 0);
        return parseFloat(sum/num_of_times);
    }
    let trim_factor = 0.05;
    let num_trim = Math.ceil(trim_factor*num_of_times);

    let num_dnfs = 0;
    let DNFs = [];
    let times_to_remove = [];
    for(let i = 0; i < times.length; i++) {
        let time = times[i];
        if(time.getDNF) {
            num_dnfs++;
            DNFs.push(time.getNum);
            times_to_remove.push(time);
        }
    }
    if(num_dnfs > num_trim) {
        return null;
    }

    for(let i = 0; i < times_to_remove.length; i++) {
        let time_to_remove = times_to_remove[i];
        let index_to_remove = times.indexOf(time_to_remove);
        if(index_to_remove !== -1) {
            times.splice(index_to_remove, 1);
        }
    }

    times = times_to_time_nums(times);
    // sort by value
    times.sort(function(a, b){return a - b});
    times = times.concat(DNFs);
    times = times.splice(num_trim);
    times = times.splice(0, (times.length - num_trim));
    sum = times.reduce((partialSum, a) => partialSum + a, 0);
    average = parseFloat(sum/(num_of_times-(2*num_trim)));
    return average;
}

/**
 * @param {CubeTime[]} times 
 * @param {Number} solve_nums - Positive integer of solves to include.
 * @returns {Number}
 */
function validate_solve_nums(times, solve_nums) {
    // include all solves
    if(solve_nums === undefined) solve_nums = times.length;
    solve_nums = parseFloat(solve_nums);
    if(!Number.isFinite(solve_nums)) solve_nums = times.length;

    if(solve_nums <= 0) solve_nums = 1;
    if(solve_nums >= times.length) solve_nums = times.length;

    solve_nums = times.length - solve_nums;
    return solve_nums;
}

/**
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @returns {Number[]}
 */
function validate_average_list(average_list) {
    // default value
    if(average_list === undefined || (average_list.length == 1 && average_list[0] == '')) average_list = [5, 12, 100, 1000];

    let average_dict = {};
    // further validate average_list and construct average_dict
    for(let i = 0; i < average_list.length; i++) {
        let num = average_list[i];
        // if num is an integer, add to dict
        num = parseInt(num);
        if(Number.isInteger(num)) {
            average_dict[num] = [];
        }
    }
    return average_dict;
}

/**
 * @param {Number[]} naive_sort 
 * @param {Number} graph_min - Positive integer that is the minimum point of graph.
 * @param {Number} graph_max - Positive integer that is the maximum point of graph.
 * @returns {Number[]}
 */
function validate_graphs(naive_sort, graph_min, graph_max) {
    let first = naive_sort[0];
    let last = naive_sort[naive_sort.length - 1];
    if(graph_min === undefined) graph_min = 5;
    if(graph_max === undefined) graph_max = 30;
    
    graph_min = parseFloat(graph_min);
    graph_max = parseFloat(graph_max);
    if(!Number.isFinite(parseFloat(graph_min))) graph_min = 5;
    if(!Number.isFinite(parseFloat(graph_max))) graph_max = 30;

    if(graph_min < 0) graph_min = 5;
    if(graph_max <= 0) graph_max = 30;
    if(graph_min >= graph_max) {
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
    if(step === undefined) return 1;
    step = parseFloat(step);
    if(step <= 0 || !Number.isFinite(step)) return 1;
    return step;
}

/**
 * @param {Number[]} streaks - Numbers to show a best streak of. 
 * @returns {{number: number[]}}
 */
function validate_streaks(streaks) {
    // default value
    console.log(streaks);
    if(streaks === undefined || (streaks.length == 1 && streaks[0] == '')) streaks = [15.00, 20.00, 25.00, 30.00];
    let streak_dict = {};

    // further validate streaks and construct streak_dict
    for(let i = 0; i < streaks.length; i++) {
        let num = streaks[i];
        // if num is an float, add to dict
        num = parseFloat(num);
        if(Number.isFinite(num)) {
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
    days = Math.floor(total_time_solving / (60 * 60 * 24));
    hours = Math.floor((total_time_solving % (60 * 60 * 24)) / (60 * 60));
    minutes = Math.floor((total_time_solving % (60 * 60)) / (60));
    seconds = Math.floor(total_time_solving % 60);
    if(isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        console.warn("Time spent solving is NaN.");
        // should someshow stop time spent solving to show but I
        // don't (think) this should ever be possibe, so its fine now
        return 'NaN';
    }

    if (minutes <= 0 && hours <= 0 && days <= 0) {
        text = seconds + "s ";
    } else if (hours <= 0 && days <= 0) {
        text = minutes + "m " + seconds + "s ";
    } else if (days <= 0) {
        text = hours + "h " + minutes + "m " + seconds + "s ";
    } else {
        text = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    }
    return text;
}

/**
 * Print statistics onto the screen.
 * @param {string} file_or_text - CSV file directory or text input.
 * @param {boolean} file_flag - Flag set if input is a file.
 * @param {Number[]} average_list - Averages to calculate average of n for.
 * @param {Number} graph_min - Positive integer that is the minimum point of graph.
 * @param {Number} graph_max - Positive integer that is the maximum point of graph.
 * @param {Number} solve_nums - Positive integer of solves to include.
 * @param {Number} step - Positive integer of distance between each point in time spread.
 * @param {Number[]} streaks - Numbers to show a best streak of.
 * @returns {void}
 */
function print_stats(file_or_text, file_flag, average_list, graph_min, graph_max, solve_nums, step, streaks) {
    if(file_or_text === undefined || file_flag === undefined) return;

    let times;
    if(file_flag) {
        times = csv_parse(file_or_text);
    } else {
        times = text_parse(file_or_text);
    }

    if(times.length <= 0) {
        console.warn("No solves found.");
        return;
    }
    // because there are valid solves, delete label (if it exists)
    let label = document.getElementsByTagName("label")[0];
    if(label != null || label != undefined) {
        label.parentNode.removeChild(label);
    }

    // solve_nums first to update times
    solve_nums = validate_solve_nums(times, solve_nums);
    times = times.slice(solve_nums, (times.length + 1));

    let average_dict = validate_average_list(average_list);

    naive_numtimes = times_to_time_nums(times);
    // naive sort for min/max
    // sort by value
    let naive_sort = naive_numtimes.sort(function(a, b){return a - b});

    graphs = validate_graphs(naive_sort, graph_min, graph_max);
    graph_min = graphs[0];
    graph_max = graphs[1];

    step = validate_step(step);

    let streak_dict = validate_streaks(streaks);

    let total = 0;
    let num_dnf = 0;
    let num_plus_two = 0;
    let total_time_solving = 0;

    best_time = times[0].getNum;
    worst_time = times[0].getNum;

    // bins that split histogram:
    // starts at graph_min - step and end at graph_max + step
    // has intervals of step
    // if time >= index and time <= index + 1 it gets put there
    // if time is out of range it is not included
    let time_bins = [];
    let value = graph_min - step;
    // first value's minimum is 0
    if(value <= 0) value = 0;
    let end = graph_max + step;
    // also construct graph data at the same time to avoid two loops
    let graph_data = [];
    let index = 0;
    while(value < end) {
        time_bins.push[value.toFixed(2)];
        value += step;
        graph_data[index] = {time: value.toFixed(2), count: 0};
        index++;
    }

    let numtimes = [];
    for(let index = 0; index < times.length; index++) {
        let time = times[index];
        total++;
        if(time.getPlusTwo) {
            num_plus_two++;
        }

        for(const key in average_dict) {
            if(index > (key-1)) {
                let sub_times = [];
                for(let n = index-(key-1); n < index+1; n++) {
                    sub_times.push(times[n]);
                }
                let avg = average_of_n(sub_times);
                if(avg != null) {
                    average_dict[key].push(avg);
                }
            }
        }

        let num = time.getNum;
        if(isNaN(num)) {
            // should never be true--but if it were it would mess stuff up
            console.error("Solve " + index + " was NaN.");
            continue;
        }
        total_time_solving += num;

        if(time.getDNF) {
            num_dnf++;

            // streak counting
            for(const streak in streak_dict) {
                let streak_list = streak_dict[streak];
                let cur_streak = streak_list[0];
                let best_streak = streak_list[1];
                if(cur_streak > best_streak) best_streak = cur_streak;
                cur_streak = 0;
                // update streak
                streak_dict[streak][0] = cur_streak;
                streak_dict[streak][1] = best_streak;
            }
            continue;
        }

        for(let i = 0; i < graph_data.length - 1; i++) {
            let this_properties = graph_data[i];
            let this_time = this_properties.time;
            let next_properties = graph_data[i+1];
            let next_time = next_properties.time;
            if(num < next_time && num >= this_time) {
                this_properties.count++;
            }
        }

        if(num < best_time) {
            best_time = num;
        }
        if(num > worst_time) {
            worst_time = num;
        }

        //streak counting
        for(const streak in streak_dict) {
            let streak_list = streak_dict[streak];
            let cur_streak = streak_list[0];
            let best_streak = streak_list[1];
            let streak_num = parseFloat(streak);

            if(num < streak_num) cur_streak++;
            if(num >= streak_num) cur_streak = 0;
            if(cur_streak > best_streak) best_streak = cur_streak;

            // update streak
            streak_dict[streak][0] = cur_streak;
            streak_dict[streak][1] = best_streak;
        }

        numtimes.push(num);
    }
    
    // total should never be null
    if(total == null || total <= 0) {
        console.warn("No solves found.");
        return;
    }

    // show total in html
    total_div.textContent = "Total solves: " + total;

    let chart = Chart.getChart('graph');
    let graph = document.getElementById('graph');
    
    if(chart != undefined) {
        chart.destroy();
    }

    // remove 0 count datasets at the front and end
    graph_data.pop();
    if(graph_data.length > 0) {
        let test = new Chart(
            graph,
            {
            type: 'bar',
                options: {
                  plugins: {
                    legend: {
                      display: false
                    },
                  }
                },
            data: {
                labels: graph_data.map(row => row.time),
                datasets: [
                  {
                    backgroundColor: blue,
                    label: 'Solves',
                    data: graph_data.map(row => row.count)
                  }
                ]
              }
            }
        );
    }

    // show DNF count in html
    dnf_div.textContent = "DNFs: " + num_dnf;
    // show +2 count in html
    plus_two_div.textContent = "+2s: " + num_plus_two;
    // show best time in html
    best_time_div.textContent = "Best time: " + best_time;
    // show worst time in html
    worst_time_div.textContent = "Worst time: " + worst_time;


    for(const key in average_dict) {
        avg_times = average_dict[key];
        if(avg_times.length <= 0) continue;
        // sort by value
        avg_times.sort(function(a, b){return a - b});
        let best = avg_times[0].toFixed(2);
        let worst = avg_times[avg_times.length - 1].toFixed(2);
        // show best, worst avg in html (I.E., Best Average of {KEY} = Best)
        let text = "Best ao" + key + ": " + best;
        average_to_div(text, "average green");
        text = "Worst ao" + key + ": " + worst;
        average_to_div(text, "average red");
    }

    // show streaks in html
    for(const streak in streak_dict) {
        let streak_list = streak_dict[streak];
        let cur_streak = streak_list[0];
        let best_streak = streak_list[1];
        if(cur_streak > best_streak) best_streak = cur_streak;
        
        let streak_num = parseFloat(streak);
        let text = "Best streak under " + streak_num.toFixed(2) + ": " + best_streak;
        streak_to_div(text, "streak green");
    }

    // show total time solving in html
    let text = total_time_solving_text(total_time_solving);
    total_time_div.textContent = "Total time: " + text;
    // show global average in html
}

    
//     print(f"Total Time Solving: {total_time_solving:.2f} Seconds")
//     print(f"({(total_time_solving/60):.2f} Minutes, {(total_time_solving/60/60):.2f} Hours, {(total_time_solving/60/60/24):.2f} Days)\n")
//     print(f"Global Average = {total_time_solving/(total-num_dnf):.2f}")

function average_to_div(text, class_name) {
    let div = document.createElement('div');
    div.className = "" + class_name;
    div.textContent = text;
    avg_div.appendChild(div);
}

function streak_to_div(text, class_name) {
    let div = document.createElement('div');
    div.className = "" + class_name;
    div.textContent = text;
    streak_div.appendChild(div);
}

const main_div = document.getElementById("main_div");
const avg_div = document.getElementById("avg");
const streak_div = document.getElementById("streak");
const text_input_div = document.getElementById("text_input");
const total_div = document.getElementById("total");
const dnf_div = document.getElementById("DNF");
const plus_two_div = document.getElementById("plus_two");
const best_time_div = document.getElementById("best_time");
const worst_time_div = document.getElementById("worst_time");
const total_time_div = document.getElementById("total_time");
// global average
const min_input = document.getElementById("min-input");
const max_input = document.getElementById("max-input");
const numsolves_input = document.getElementById("numsolves-input");
const step_input = document.getElementById("step-input");
const average_input = document.getElementById("average-input");
const streak_input = document.getElementById("streak-input");


const blue = '#0163C3';
const font = '#FFFFFF';
Chart.defaults.borderColor = font;
Chart.defaults.color = font;
Chart.defaults.animation = false;   

function main() {
    // clear all divs
    total_div.textContent = '';
    dnf_div.textContent = '';
    plus_two_div.textContent = '';
    best_time_div.textContent = '';
    worst_time_div.textContent = '';
    total_time_div.textContent = '';
    
    // remove average divs
    let averages = document.getElementsByClassName("average");
    while(averages.length > 0){
        averages[0].parentNode.removeChild(averages[0]);
    }

    // remove streak divs
    let streaks = document.getElementsByClassName("streak");
    while(streaks.length > 0){
        streaks[0].parentNode.removeChild(streaks[0]);
    }

    // destroy graph
    let chart = Chart.getChart('graph');
    
    if(chart != undefined) {
        chart.destroy();
    }

    let user_input = text_input_div.value;
    let graph_min = min_input.value;
    let graph_max = max_input.value;
    let solve_nums = numsolves_input.value;
    let step = step_input.value;
    let average_list = average_input.value.split(", ");
    let streak_list = streak_input.value.split(", ");
    print_stats(user_input, false, average_list, graph_min, graph_max, solve_nums, step, streak_list);
}

text_input_div.addEventListener('input', main);
min_input.addEventListener('input', main);
max_input.addEventListener('input', main);
numsolves_input.addEventListener('input', main);
step_input.addEventListener('input', main);
average_input.addEventListener('input', main);
streak_input.addEventListener('input', main);