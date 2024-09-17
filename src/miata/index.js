// initialize constants
// divs
// const main_div = document.getElementById('main_div');
const timer_div = document.getElementById('timer');
const date_div = document.getElementById('date');
const paycheck_div = document.getElementById('paycheck');
const biweekly_budget_div = document.getElementById('biweekly-budget');
const daily_budget_div = document.getElementById('daily-budget');
const miata_cost_div = document.getElementById('miata-cost');
const tax_rate_div = document.getElementById('tax-rate');
const already_saved_div = document.getElementById('already-saved');
const total_cost_div = document.getElementById('total-cost');

// turn 'NaN', 'Infinity', '-Infinity', <any negative numbers>, -> '?'
function parseInvalidValues(str) {
    const float_representation = parseFloat(str);
    return Number.isFinite(float_representation) && float_representation >= 0 ? str : '?';
}

// turn nothing in data boxes -> 0
function parseInput(str) {
    const float_representation = parseFloat(str);
    return Number.isFinite(float_representation) ? float_representation : 0;
}

function parseDate(d) {
    const date = new Date(d);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleString('en-US', options);
}

function calculateCost() {
    const miata_cost = parseInput(miata_cost_div.value);
    const tax_rate = parseInput(tax_rate_div.value);
    const full_cost = (miata_cost * (1 + tax_rate));

    const already_saved = parseInput(already_saved_div.value);
    if (already_saved >= full_cost) {
        return 0;
    }
    return full_cost - already_saved;
}

function calculateTime(cost) {
    if (cost === 0) {
        return 0;
    }

    const paycheck = parseInput(paycheck_div.value);
    const biweekly_budget = parseInput(biweekly_budget_div.value);

    if (biweekly_budget >= paycheck) {
        // throw error
        return NaN;
    }

    const daily_paycheck = (paycheck - biweekly_budget) / 14;
    return cost / daily_paycheck;
}

function calculateDate(days) {
    const today = new Date();
    return today.setDate(today.getDate() + days);
}

function update_biweekly_budget() {
    biweekly_budget_div.value = (daily_budget_div.value * 14).toFixed(2);
}

function update_daily_budget() {
    daily_budget_div.value = (biweekly_budget_div.value / 14).toFixed(2);
}

function toTwoDecimalPlaces(event) {
    event.value = parseFloat(event.value).toFixed(2);
}

function draw_screen() {
    const total_cost = calculateCost();
    const total_days = calculateTime(total_cost);
    const total_date = calculateDate(total_days);

    const cost = parseInvalidValues(total_cost.toFixed(2));
    const days = parseInvalidValues(total_days.toFixed(0));
    // only show date if it is a day in the future
    const date = total_days >= 0 ? parseDate(total_date) : 'Invalid Date';

    total_cost_div.textContent = `$${cost}`;
    timer_div.textContent = `${days} days`;
    date_div.textContent = date;
}

function main() {
    // initialize textboxes with specified fixedness
    paycheck_div.value = parseFloat(paycheck_div.value).toFixed(2);
    biweekly_budget_div.value = parseFloat(biweekly_budget_div.value).toFixed(2);
    daily_budget_div.value = parseFloat(daily_budget_div.value).toFixed(2);
    miata_cost_div.value = parseFloat(miata_cost_div.value).toFixed(2);
    already_saved_div.value = parseFloat(already_saved_div.value).toFixed(2);

    // draw screen when parameters are changed
    paycheck_div.addEventListener('input', () => draw_screen());
    miata_cost_div.addEventListener('input', () => draw_screen());
    tax_rate_div.addEventListener('input', () => draw_screen());
    already_saved_div.addEventListener('input', () => draw_screen());

    // update both bi-weekly budget and daily budget when either are changed
    biweekly_budget_div.addEventListener('input', () => { draw_screen(); update_daily_budget(); });
    daily_budget_div.addEventListener('input', () => { draw_screen(); update_biweekly_budget(); });

    // update fixedness when user has exited input box
    paycheck_div.addEventListener('blur', (e) => { toTwoDecimalPlaces(e.target); });
    biweekly_budget_div.addEventListener('blur', (e) => { toTwoDecimalPlaces(e.target); });
    daily_budget_div.addEventListener('blur', (e) => { toTwoDecimalPlaces(e.target); });
    miata_cost_div.addEventListener('blur', (e) => { toTwoDecimalPlaces(e.target); });
    already_saved_div.addEventListener('blur', (e) => { toTwoDecimalPlaces(e.target); });

    // draw initial screen
    draw_screen();
}

main();
