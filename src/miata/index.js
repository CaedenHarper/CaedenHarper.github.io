// initialize constants
// divs
// const main_div = document.getElementById('main_div');
const timer_div = document.getElementById('timer');
const paycheck_div = document.getElementById('paycheck');
const biweekly_budget_div = document.getElementById('biweekly-budget');
const daily_budget_div = document.getElementById('daily-budget');
const miata_cost_div = document.getElementById('miata-cost');
const tax_rate_div = document.getElementById('tax-rate');
const total_cost_div = document.getElementById('total-cost');

function calculateCost() {
    const miata_cost = parseFloat(miata_cost_div.value);
    const tax_rate = parseFloat(tax_rate_div.value);
    return miata_cost * (1 + tax_rate);
}

function calculateTime(cost) {
    const paycheck = parseFloat(paycheck_div.value);
    const biweekly_budget = parseFloat(biweekly_budget_div.value);
    const daily_paycheck = (paycheck - biweekly_budget) / 14;
    return cost / daily_paycheck;
}

function draw_screen() {
    const total_cost = calculateCost();
    total_cost_div.textContent = `$${total_cost.toFixed(2)}`;
    timer_div.textContent = `${calculateTime(total_cost).toFixed(0)} days`;
}

function main() {
    // draw screen when parameters are changed
    paycheck_div.addEventListener('input', () => draw_screen());
    biweekly_budget_div.addEventListener('input', () => draw_screen());
    daily_budget_div.addEventListener('input', () => draw_screen());
    miata_cost_div.addEventListener('input', () => draw_screen());
    tax_rate_div.addEventListener('input', () => draw_screen());
}

main();
