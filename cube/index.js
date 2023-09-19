class CubeTime {
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

function text_parse(solves) {
    lines = solves.split("\n");
    times = []
    time_list_flag = false;
    for (var i = 0; i < lines.length; i++) {
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
            // regex to remove comments
            const regex = '\[[^>]+]';
            time = time.replace(regex, '');
        }

        if(time.includes(":")) {
            _ = time.split(":");
            minutes = _[0];
            seconds = _[1];
            time = (parseFloat(seconds) + (parseFloat(minutes)*60));
        }

        time_object = new CubeTime(parseFloat(time), plus_two, dnf);
        times.push(time_object);
    }
    return times;
}

// TODO: add csv parse

// def csv_parse(file_dir: str) -> list[CubeTime]:
//     """Parses cvs file's list of times into lists of CubeTime objects."""

//     times = []
//     with open(file_dir, 'r') as file:
//         # for loop to avoid loading entire file into memory
//         for line in file:
//             # throw away first line
//             if line.startswith("No.;Time;"):
//                 continue

//             # number, comment, scramble, P. 1 currently unused
//             number,time,comment,scramble,date,p1 = line.split(";")
//             # day_ is day with extra time info
//             year, month, day_ = date.split("-")
//             # time_ is different from the solve time
//             day, time_ = day_.split(" ")
//             # these values unused, but stored anyway if ever needed
//             hour, minute, second = time_.split(":")
//             plus_two = False
//             dnf = False
            
//             # plus two logic
//             if "+" in time:
//                 time = time.replace("+", "")
//                 plus_two = True
            
//             # dnf logic
//             if "DNF(" in time:
//                 time = time.replace("DNF(", "")
//                 time = time.replace (")", "")
//                 dnf = True
            
//             # changes minutes to seconds (may be buggy, needs to be tested for more than one minute / maybe more than an hour?)
//             if ":" in time:
//                 minutes, seconds = time.split(":")
//                 time = float(seconds) + float(minutes)*60

//             try:
//                 time_object = CubeTime(float(time), plus_two, dnf, datetime(int(year), int(month), int(day)))
//             except ValueError:
//                 continue
//             times.append(time_object)

//     return times

function times_to_time_nums(times) {
    var time_nums = [];
    for(var i = 0; i < times.length; i++) {
        var time = times[i];
        time_nums.push(time.getNum);
    }
    return time_nums;
}

function average_of_n(times) {
    var sum = 0;
    var num_of_times = times.length;
    if(num_of_times == 1 || num_of_times == 2) {
        temp_times = times_to_time_nums(times);
        sum = temp_times.reduce((partialSum, a) => partialSum + a, 0);
        return parseFloat(sum/num_of_times);
    }
    var trim_factor = 0.05;
    var num_trim = Math.ceil(trim_factor*num_of_times);

    var num_dnfs = 0;
    var DNFs = [];
    var times_to_remove = [];
    for(var i = 0; i < times.length; i++) {
        var time = times[i];
        if(time.getDNF) {
            num_dnfs++;
            DNFs.push(time.getNum);
            times_to_remove.push(time);
        }
    }
    if(num_dnfs > num_trim) {
        return null;
    }

    for(var i = 0; i < times_to_remove.length; i++) {
        var time_to_remove = times_to_remove[i];
        var index_to_remove = times.indexOf(time_to_remove);
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

function validate_average_list(average_list) {
    // default value
    if(average_list === undefined) average_list = [5, 12, 100, 1000, 10000];

    var average_dict = {};
    // further validate average_list and construct average_dict
    for(var i = 0; i < average_list.length; i++) {
        var num = average_list[i];
        // if num is an integer, add to dict
        num = parseInt(num);
        if(Number.isInteger(num)) {
            average_dict[num] = [];
        }
    }
    return average_dict;
}

function validate_graphs(naive_sort, graph_min, graph_max) {
    var first = naive_sort[0];
    var last = naive_sort[naive_sort.length - 1];
    if(graph_min === undefined) graph_min = first;
    if(graph_max === undefined) graph_max = last;
    
    graph_min = parseFloat(graph_min);
    graph_max = parseFloat(graph_max);
    if(!Number.isFinite(parseFloat(graph_min))) graph_min = first;
    if(!Number.isFinite(parseFloat(graph_max))) graph_max = last;

    if(graph_min < 0) graph_min = first;
    if(graph_max < 0) graph_max = last;
    if(graph_min > graph_max) {
        graph_min = first;
        graph_max = last;
    }

    return [graph_min, graph_max];
}

function validate_minmax(naive_sort, min, max) {
    var first = naive_sort[0];
    var last = naive_sort[naive_sort.length - 1];
    if(min === undefined) min = first;
    if(max === undefined) max = last;

    min = parseFloat(min);
    max = parseFloat(max);
    if(!Number.isFinite(min)) min = first;
    if(!Number.isFinite(max)) max = last;

    if(min < 0) min = first;
    if(max < 0) max = last;
    if(min > max) {
        min = first;
        max = last;
    }
    return [min, max];
}

function validate_step(step) {
    if(step === undefined) return 1;
    step = parseFloat(step);
    if(step <= 0 || !Number.isFinite(step)) return 1;
    return step;
}

function validate_streaks(streaks) {
    // default value
    if(streaks === undefined) streaks = [20.00];
    var streak_dict = {};

    // further validate streaks and construct streak_dict
    for(var i = 0; i < streaks.length; i++) {
        var num = streaks[i];
        // if num is an float, add to dict
        num = parseFloat(num);
        if(Number.isFinite(num)) {
            streak_dict[num] = [0, 0];
        }
    }
    return streak_dict;
}

function total_time_solving_text(total_time_solving) {
    var text;
    // Time calculations
    days = Math.floor(total_time_solving / (60 * 60 * 24));
    hours = Math.floor((total_time_solving % (60 * 60 * 24)) / (60 * 60));
    minutes = Math.floor((total_time_solving % (60 * 60)) / (60));
    seconds = Math.floor(total_time_solving % 60);

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

function print_stats(file_or_text, file_flag, histogram_flag, dot_flag, average_list, graph_min, graph_max, min, max, solve_nums, zero_flag, step, streaks) {
    if(file_or_text === undefined || file_flag === undefined) return;

    var times;
    if(file_flag) {
        times = csv_parse(file_or_text);
    } else {
        times = text_parse(file_or_text);
    }

    if(times.length <= 0) {
        console.warn("No solves found.");
        return;
    }

    // input validation
    // one liners
    if(histogram_flag === undefined) histogram_flag = false;
    if(dot_flag === undefined) dot_flag = false;
    if(zero_flag === undefined) zero_flag = true;

    // solve_nums first to update times
    solve_nums = validate_solve_nums(times, solve_nums);
    times = times.slice(solve_nums, (times.length + 1));

    var average_dict = validate_average_list(average_list);

    naive_numtimes = times_to_time_nums(times);
    // naive sort for min/max
    // sort by value
    var naive_sort = naive_numtimes.sort(function(a, b){return a - b});

    graphs = validate_graphs(naive_sort, graph_min, graph_max);
    graph_min = graphs[0];
    graph_max = graphs[1];

    minmax = validate_minmax(naive_sort, min, max);
    min = minmax[0];
    max = minmax[1];

    step = validate_step(step);

    var streak_dict = validate_streaks(streaks);

    var total = 0;
    var num_dnf = 0;
    var num_plus_two = 0;
    var total_time_solving = 0;

    best_time = times[0].getNum;
    worst_time = times[0].getNum;
    
    var numtimes = [];
    for(var index = 0; index < times.length; index++) {
        var time = times[index];
        total++;
        if(time.getPlusTwo) {
            num_plus_two++;
        }

        for(const key in average_dict) {
            if(index > (key-1)) {
                var sub_times = [];
                for(var n = index-(key-1); n < index+1; n++) {
                    sub_times.push(times[n]);
                }
                var avg = average_of_n(sub_times);
                if(avg != null) {
                    average_dict[key].push(avg);
                }
            }
        }

        var num = time.getNum;
        total_time_solving += num;

        if(time.getDNF) {
            num_dnf++;

            // streak counting
            for(const streak in streak_dict) {
                var streak_list = streak_dict[streak];
                var cur_streak = streak_list[0];
                var best_streak = streak_list[1];
                if(cur_streak > best_streak) best_streak = cur_streak;
                cur_streak = 0;
                // update streak
                streak_dict[streak][0] = cur_streak;
                streak_dict[streak][1] = best_streak;
            }
            continue;
        }

        if(num < best_time) {
            best_time = num;
        }
        if(num > worst_time) {
            worst_time = num;
        }

        //streak counting
        for(const streak in streak_dict) {
            var streak_list = streak_dict[streak];
            var cur_streak = streak_list[0];
            var best_streak = streak_list[1];
            var streak_num = parseFloat(streak);

            if(num < streak_num) cur_streak++;
            if(num >= streak_num) cur_streak = 0;
            if(cur_streak > best_streak) best_streak = cur_streak;

            // update streak
            streak_dict[streak][0] = cur_streak;
            streak_dict[streak][1] = best_streak;
        }

        numtimes.push(num);
    }

    //TODO: graphing bins
    var time_bins;
    
    // total should never be null
    if(total == null || total <= 0) {
        console.warn("No solves found.");
        return;
    }

    // show total in html
    total_div.textContent = "Total solves = " + total;


    // for(var i = 0; i < time_bins.length-1; i++) {
    //     //TODO: min, max checking
    //     //TODO: section checking, zero_flag checking

    //     // show time bins sections
    //     // print(f"{time_bins[index+1]:.2f} > Solve >= {time_bins[index]:.2f}: {section}")
    //     // print(f"({((section/total)):.2%} of Solves)\n")
    //     ;
    // }

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
        var best = avg_times[0].toFixed(2);
        var worst = avg_times[avg_times.length - 1].toFixed(2);
        // show best, worst avg in html (I.E., Best Average of {KEY} = Best)
        var text = "Best ao" + key + ": " + best + " Worst ao" + key + ": " + worst;
        append_to_div(text, "average");
    }

    // show streaks in html
    for(const streak in streak_dict) {
        var streak_list = streak_dict[streak];
        var cur_streak = streak_list[0];
        var best_streak = streak_list[1];
        if(cur_streak > best_streak) best_streak = cur_streak;
        
        var streak_num = parseFloat(streak);
        var text = "Best streak under " + streak_num.toFixed(2) + ": " + best_streak;
        append_to_div(text, "streak");
    }

    // show total time solving in html
    var text = total_time_solving_text(total_time_solving);
    total_time_div.textContent = text + " spent solving.";
    // show global average in html
}

    
//     print(f"Total Time Solving: {total_time_solving:.2f} Seconds")
//     print(f"({(total_time_solving/60):.2f} Minutes, {(total_time_solving/60/60):.2f} Hours, {(total_time_solving/60/60/24):.2f} Days)\n")
//     print(f"Global Average = {total_time_solving/(total-num_dnf):.2f}")

function append_to_div(text, class_name) {
    var div = document.createElement('div');
    div.className = "child shadow " + class_name;
    div.textContent = text;
    main_div.insertBefore(div, total_time_div);
}

const main_div = document.getElementById("main_div");
// input textbox
const text_input_div = document.getElementById("text_input");
// total # of solves
const total_div = document.getElementById("total");
// DNF count
const dnf_div = document.getElementById("DNF");
// +2 count
const plus_two_div = document.getElementById("plus_two");
// best time
const best_time_div = document.getElementById("best_time");
// worst time
const worst_time_div = document.getElementById("worst_time");
// average list
// total time solving
const total_time_div = document.getElementById("total_time");
// global average

function main() {
    // clear all divs
    total_div.textContent = '';
    dnf_div.textContent = '';
    plus_two_div.textContent = '';
    best_time_div.textContent = '';
    worst_time_div.textContent = '';
    total_time_div.textContent = '';
    
    // remove average divs
    var averages = document.getElementsByClassName("average");
    while(averages.length > 0){
        averages[0].parentNode.removeChild(averages[0]);
    }

    // remove streak divs
    var streaks = document.getElementsByClassName("streak");
    while(streaks.length > 0){
        streaks[0].parentNode.removeChild(streaks[0]);
    }

    var user_input = text_input_div.value;
    print_stats(user_input, false);
}

text_input_div.addEventListener('input', main);