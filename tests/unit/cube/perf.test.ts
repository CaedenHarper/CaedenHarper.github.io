// Performance tests
import { CubeTime, validate_average_list, average_of_n } from '../../../src/cube/index.ts';
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
    const average_dict = validate_average_list(average_list);

    // extracted logic for average handling to test speed
    for (let index = 0; index < times.length; index += 1) {
        for (const [key, value] of average_dict) {
            const to_average = times.slice(index, index + key);

            // Not enough solves
            if (to_average.length != key) continue;

            const avg = average_of_n(to_average, key);
            if (!avg.dnf) value.push(avg);
        }
    }

    // reconstruction of creating averages
    // removed is all HTML editing that is usually done
    for (const [_key, avg_times] of average_dict) {
        if (avg_times.length <= 0) continue;
        // sort by value
        avg_times.sort((a, b) => a.time - b.time);

        const best_avg = avg_times[0];
        const _best = best_avg.time.toFixed(2);
        const worst_avg = avg_times[avg_times.length - 1];
        const _worst = worst_avg.time.toFixed(2);
    }
});
