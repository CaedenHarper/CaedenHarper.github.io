// Performance tests
import { CubeTime, compute_stats } from '../../../src/cube/index.ts';
import { readFileSync } from 'fs';

// extract solves from solves.txt for testing
const lines = readFileSync('./tests/unit/cube/solves.txt').
    toString().
    split('\n');

const times: CubeTime[] = [];
for (const line of lines) {
    const [num_str, dnf_str, plus_two_str] = line.split(' ');

    const num = parseFloat(num_str);
    const dnf = dnf_str === '1';
    const plus_two = plus_two_str === '1';

    const time = new CubeTime(num, dnf, plus_two);

    times.push(time);
}

// BEFORE ~21s
// AFTER ~7s
test('ao10000', () => {
    const average_list = [10000];
    compute_stats(times, average_list, NaN, NaN, NaN, NaN, [], false, false);
});

test('ao5, 12, 25, 100, 1000, 10000', () => {
    const average_list = [5, 12, 25, 100, 1000, 10000];
    compute_stats(times, average_list, NaN, NaN, NaN, NaN, [], false, false);
});

test('streaks', () => {
    const streak_list = [10, 12, 15, 20];
    compute_stats(times, [], NaN, NaN, NaN, NaN, streak_list, false, false);
});
