/* eslint-disable @stylistic/array-bracket-newline */
/* eslint-disable @stylistic/function-paren-newline */
import { truncate_to_two_decimal_places } from '../../../src/cube/index.ts';

type TestCase = Map<number, number>;

test('zero', () => {
    const cases: TestCase = new Map(
        [
            [0, 0],
        ],
    );

    for (const [input, output] of cases) {
        expect(truncate_to_two_decimal_places(input)).toEqual(output);
    }
});

test('number with no decimal component', () => {
    const cases: TestCase = new Map(
        [
            [12, 12],
            [5, 5],
            [243, 243],
            [2, 2],
            [7, 7],
            [134, 134],
            [6425, 6425],
        ],
    );

    for (const [input, output] of cases) {
        expect(truncate_to_two_decimal_places(input)).toEqual(output);
    }
});

test('number with one decimal component', () => {
    const cases: TestCase = new Map(
        [
            [12.1, 12.1],
            [5.0, 5.0],
            [243.2, 243.2],
            [2.7, 2.7],
            [7.9, 7.9],
            [134.3, 134.3],
            [6425.6, 6425.6],
        ],
    );

    for (const [input, output] of cases) {
        expect(truncate_to_two_decimal_places(input)).toEqual(output);
    }
});

test('number with two decimal components', () => {
    const cases: TestCase = new Map(
        [
            [12.12, 12.12],
            [5.00, 5.00],
            [243.27, 243.27],
            [2.37, 2.37],
            [7.89, 7.89],
            [134.33, 134.33],
            [6425.06, 6425.06],
        ],
    );

    for (const [input, output] of cases) {
        expect(truncate_to_two_decimal_places(input)).toEqual(output);
    }
});

test('number with more than two decimal components', () => {
    const cases: TestCase = new Map(
        [
            [12.123, 12.12],
            [5.009, 5.00],
            [243.246, 243.24],
            [2.799, 2.79],
            [7.919, 7.91],
            [134.232, 134.23],
            [6425.060, 6425.06],
        ],
    );

    for (const [input, output] of cases) {
        expect(truncate_to_two_decimal_places(input)).toEqual(output);
    }
});

test('no leading number', () => {
    const cases: TestCase = new Map(
        [
            [0.5, 0.5],
            [0.12, 0.12],
            [0.133333, 0.13],
            [0.045173, 0.04],
            [0.006, 0],
        ],
    );

    for (const [input, output] of cases) {
        expect(truncate_to_two_decimal_places(input)).toEqual(output);
    }
});
