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

function print_stats(file_or_text, file_flag, histogram_flag, dot_flag, average_list, graph_min, graph_max, min, max, solve_nums, zero_flag, step, streaks,) {
    var times;
    if(file_flag) {
        times = csv_parse(file_or_text);
    } else {
        times = text_parse(file_or_text);
    }

    var total = 0;
    var num_dnf = 0;
    var num_plus_two = 0;
    var total_time_solving = 0;

    best_time = 999999999;
    worst_time = 0;
    
    // TODO: validate inputs
    var average_dict = {
        5: [],
        12: [],
        100: [],
        1000: [],
    };
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
            continue;
        }

        //TODO: streak logic

        if(num < best_time) {
            best_time = num;
        }
        if(num > worst_time) {
            worst_time = num;
        }

        //TODO: streak counting

        numtimes.push(num);
    }

    //TODO: graphing bins
    var time_bins;

    if(total == null || total <= 0) {
        console.error("No solves found.");
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
    dnf_div.textContent = "DNF count = " + num_dnf;
    // show +2 count in html
    plus_two_div.textContent = "Plus two count = " + num_plus_two;
    // show best time in html
    best_time_div.textContent = "Best time = " + best_time;
    // show worst time in html
    worst_time_div.textContent = "Worst time = " + worst_time;

    for(const key in average_dict) {
        avg_times = average_dict[key];
        // sort by value
        avg_times.sort(function(a, b){return a - b});
        var best = avg_times[0];
        var worst = avg_times[avg_times.length - 1];

        // show best, worst avg in html (I.E., Best Average of {KEY} = Best)
    }

    // streak logic, show streaks in html

    // show total time solving in html
    // show global average in html
}

    
//     print(f"Total Time Solving: {total_time_solving:.2f} Seconds")
//     print(f"({(total_time_solving/60):.2f} Minutes, {(total_time_solving/60/60):.2f} Hours, {(total_time_solving/60/60/24):.2f} Days)\n")
//     print(f"Global Average = {total_time_solving/(total-num_dnf):.2f}")


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
    var user_input = text_input_div.value;
    console.log(user_input);
    print_stats(user_input, false);
}

text_input_div.addEventListener('input', main);