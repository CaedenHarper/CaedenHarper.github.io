/* eslint-disable @stylistic/array-bracket-newline */
/* eslint-disable @stylistic/function-paren-newline */
import { keep_n_solves_from_times, CubeTime } from '../../../src/cube/index.ts';

type TestCase = Map<[number, CubeTime[]], CubeTime[]>;

const ex_times = [
    new CubeTime(1, false, false),
    new CubeTime(2, false, false),
    new CubeTime(3, false, false),
    new CubeTime(4, false, false),
    new CubeTime(5, false, false),
    new CubeTime(6, false, false),
    new CubeTime(7, false, false),
    new CubeTime(8, false, false),
    new CubeTime(9, false, false),
    new CubeTime(10, false, false),
];

test('empty list', () => {
    const cases: TestCase = new Map(
        [
            [[1, []], []],
        ],
    );

    for (const [input, output] of cases) {
        expect(keep_n_solves_from_times(input[0], input[1])).toEqual(output);
    }
});

test('simple', () => {
    const cases: TestCase = new Map(
        [
            [[1, ex_times], [new CubeTime(10, false, false)]],
            [[2, ex_times], [new CubeTime(9, false, false), new CubeTime(10, false, false)]],
            [[3, ex_times], [new CubeTime(8, false, false), new CubeTime(9, false, false), new CubeTime(10, false, false)]],
            [[10, ex_times], ex_times],
        ],
    );

    for (const [input, output] of cases) {
        expect(keep_n_solves_from_times(input[0], input[1])).toEqual(output);
    }
});

test('too small', () => {
    const cases: TestCase = new Map(
        [
            [[0, ex_times], [new CubeTime(10, false, false)]],
            [[-1, ex_times], [new CubeTime(10, false, false)]],
            [[-10, ex_times], [new CubeTime(10, false, false)]],
        ],
    );

    for (const [input, output] of cases) {
        expect(keep_n_solves_from_times(input[0], input[1])).toEqual(output);
    }
});

test('too big', () => {
    const cases: TestCase = new Map(
        [
            [[11, ex_times], ex_times],
            [[15, ex_times], ex_times],
            [[20, ex_times], ex_times],
        ],
    );

    for (const [input, output] of cases) {
        expect(keep_n_solves_from_times(input[0], input[1])).toEqual(output);
    }
});

test('NaN', () => {
    const cases: TestCase = new Map(
        [
            [[NaN, ex_times], ex_times],
            [[Infinity, ex_times], ex_times],
            [[-Infinity, ex_times], ex_times],
        ],
    );

    for (const [input, output] of cases) {
        expect(keep_n_solves_from_times(input[0], input[1])).toEqual(output);
    }
});
