import Chart from 'chart.js/auto';

// initialize constants
// divs
const previous_quota_div = document.getElementById('previous-quota');
const quota_num_div = document.getElementById('quota-num');
const current_quota_div = document.getElementById('current-quota');
const lowest_quota_div = document.getElementById('lowest-next-quota');
const average_quota_div = document.getElementById('average-next-quota');
const highest_quota_div = document.getElementById('highest-next-quota');
const percentile_div = document.getElementById('percentile');
const lowest_quota_num_div = document.getElementById('lowest-quota-num');
const highest_quota_num_div = document.getElementById('highest-quota-num');

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

function next_quota(previous_quota, quota_num, random_variance) {
    return Math.trunc(
        previous_quota + 100 * (1 + ((quota_num - 1) ** 2) / 16) * (random_variance + 1),
    );
}

function lowest_next_quota(previous_quota, quota_num) {
    return next_quota(previous_quota, quota_num, -0.5);
}

function highest_next_quota(previous_quota, quota_num) {
    return next_quota(previous_quota, quota_num, 0.5);
}

function average_next_quota(previous_quota, quota_num) {
    return next_quota(previous_quota, quota_num, 0);
}

function quota_to_percentile(quota, previous_quota, quota_num) {
    return Math.trunc(((quota - previous_quota) / (100 * (1 + ((quota_num - 1) ** 2) / 16))) - 0.5);
}

function find_quota_range(goal_quota) {
    // the first quota is always 130
    let min_quota = 130;
    let max_quota = 130;
    let quota_num = 1;
    let lower_bound;
    let upper_bound;
    while (lower_bound === undefined || upper_bound === undefined) {
        if (lower_bound === undefined && max_quota >= goal_quota) {
            lower_bound = quota_num;
        }

        if (upper_bound === undefined && min_quota > goal_quota) {
            upper_bound = quota_num - 1;
        }

        quota_num += 1;
        min_quota = lowest_next_quota(min_quota, quota_num);
        max_quota = highest_next_quota(max_quota, quota_num);
    }

    return { low: Math.trunc(lower_bound), high: Math.trunc(upper_bound) };
}

function clean_divs() {
    // clear text divs
    lowest_quota_div.textContent = 'Lowest Next: ';
    average_quota_div.textContent = 'Average Next: ';
    highest_quota_div.textContent = 'Highest Next: ';
    percentile_div.textContent = 'Percentile: ';
    lowest_quota_num_div.textContent = 'Quota Num Lower Bound: ';
    highest_quota_num_div.textContent = 'Quota Num Upper Bound: ';

    // destroy graph
    const chart = Chart.getChart('graph');

    if (chart !== undefined) {
        chart.destroy();
    }
}

function draw_screen() {
    clean_divs();

    const previous_quota = Number(previous_quota_div.value);
    const quota_num = Number(quota_num_div.value);
    const current_quota = Number(current_quota_div.value);

    const lowest = lowest_next_quota(previous_quota, quota_num);
    const highest = highest_next_quota(previous_quota, quota_num);
    lowest_quota_div.textContent += lowest;
    average_quota_div.textContent += average_next_quota(previous_quota, quota_num);
    highest_quota_div.textContent += highest;

    const percentile = quota_to_percentile(current_quota, previous_quota, quota_num);
    const p_impossible = current_quota < lowest || current_quota > highest;
    percentile_div.textContent += p_impossible ? 'Impossible' : `${Math.round(100 * percentile)}%`;

    const bounds = find_quota_range(current_quota);
    const impossible = current_quota < lowest;
    lowest_quota_num_div.textContent += impossible ? 'Impossible' : bounds.low;
    highest_quota_num_div.textContent += impossible ? 'Impossible' : bounds.high;
}

function main() {
    // add draw screen event listeners
    previous_quota_div.addEventListener('input', () => draw_screen());
    quota_num_div.addEventListener('input', () => draw_screen());
    current_quota_div.addEventListener('input', () => draw_screen());

    // draw the screen once
    draw_screen();
}

main();
