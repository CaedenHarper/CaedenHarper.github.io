/* eslint-disable @stylistic/array-bracket-newline */
/* eslint-disable @stylistic/function-paren-newline */
import { CubeTime, times_to_time_nums } from '../../../src/cube/index.ts';

type TestCase = Map<CubeTime[], number[]>;

test('empty input', () => {
    const cases: TestCase = new Map(
        [
            [[], []],
        ],
    );

    for (const [input, output] of cases) {
        expect(times_to_time_nums(input)).toEqual(output);
    }
});

test('one input', () => {
    const cases: TestCase = new Map(
        [
            [[new CubeTime(12.34, false, false)], [12.34]],
        ],
    );

    for (const [input, output] of cases) {
        expect(times_to_time_nums(input)).toEqual(output);
    }
});

test('multiple inputs', () => {
    const cases: TestCase = new Map(
        [
            [[
                new CubeTime(12.34, false, false),
                new CubeTime(20.24, true, false),
                // we still expect DNFs to work (for now)
                new CubeTime(6.19, false, true),
                new CubeTime(100, false, false),
            ], [12.34, 20.24, 6.19, 100]],
        ],
    );

    for (const [input, output] of cases) {
        expect(times_to_time_nums(input)).toEqual(output);
    }
});
