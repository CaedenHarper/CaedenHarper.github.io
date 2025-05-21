/* eslint-disable @stylistic/array-bracket-newline */
/* eslint-disable @stylistic/function-paren-newline */
import { validate_step } from '../../../src/cube/index.ts';

type TestCase = Map<number, number>;
// Default output for step
const DEFAULT = 1;

test('zero', () => {
    const cases: TestCase = new Map(
        [
            [0, DEFAULT],
        ],
    );

    for (const [input, output] of cases) {
        expect(validate_step(input)).toEqual(output);
    }
});

test('negative', () => {
    const cases: TestCase = new Map(
        [
            [-0.1, DEFAULT],
            [-12, DEFAULT],
            [-35.323, DEFAULT],
            [-2, DEFAULT],
            [-75, DEFAULT],
            [-10000, DEFAULT],
            [-99999999, DEFAULT],
            [-1, DEFAULT],
        ],
    );

    for (const [input, output] of cases) {
        expect(validate_step(input)).toEqual(output);
    }
});

test('normal', () => {
    const cases: TestCase = new Map(
        [
            [1, 1],
            [2.25, 2.25],
            [25, 25],
            [9999, 9999],
            [0.1, 0.1],
        ],
    );

    for (const [input, output] of cases) {
        expect(validate_step(input)).toEqual(output);
    }
});

test('NaN / Infinity', () => {
    const cases: TestCase = new Map(
        [
            [NaN, DEFAULT],
            [Infinity, DEFAULT],
            [-Infinity, DEFAULT],
        ],
    );

    for (const [input, output] of cases) {
        expect(validate_step(input)).toEqual(output);
    }
});
