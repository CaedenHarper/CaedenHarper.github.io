/* eslint-disable @stylistic/function-paren-newline */
import { average_of_n, Average, CubeTime } from '../../../src/cube/index.ts';

// type TestCase = Map<[CubeTime[], number], Average>;
type DNFCase = Map<[number[], number], boolean>;
type TimeCase = Map<[number[], number], number>;

// helper functions to create cubetime with less syntax
function time(num: number): CubeTime {
    return new CubeTime(num, false, false);
}

function times(nums: number[]): CubeTime[] {
    const out: CubeTime[] = [];

    for (const num of nums) {
        out.push(time(num));
    }

    return out;
}

test('empty input', () => {
    expect(average_of_n([], 0)).toHaveProperty('dnf', true);
});

// Check to see if average.dnf === true
test('average under 3', () => {
    const cases: DNFCase = new Map(
        [
            [[[18.12], 1], true],
            [[[18.12, 18.34], 2], true],
            [[[18.12, 18.34, 18.67], 3], false],
        ],
    );

    for (const [input, output] of cases) {
        const cubetimes = times(input[0]);
        expect(average_of_n(cubetimes, input[1])).toHaveProperty('dnf', output);
    }
});

test('mismatched size and amount', () => {
    expect(() => { average_of_n([time(18.12), time(18.12), time(18.12), time(18.12), time(18.12)], 4); }).toThrow(TypeError);
    expect(average_of_n([time(18.12), time(18.12), time(18.12), time(18.12), time(18.12)], 5)).toEqual(new Average(5, 18.12, false, [time(18.12), time(18.12), time(18.12), time(18.12), time(18.12)]));
});

test('regular average tests', () => {
    const cases: TimeCase = new Map(
        [
            [[[22.22, 25.82, 19.54, 10.4, 5.18], 5], 17.38],
            [[[11.7, 29.8, 14.42, 19.17, 27.94], 5], 20.51],
            // CSTimer says 19.82 here because it rounds
            [[[29.96, 20.4, 10.97, 27.18, 5.42, 21.84, 16.01, 22.49], 8], 19.81],
            [[[25.77, 9.55, 6.47, 6.3, 25.76, 10.49, 25.79, 15.34, 24.94, 5.16, 20.38, 7.43], 12], 15.24],
            // long ao100 line here
            [[[13.02, 15.79, 24.09, 20.84, 10.92, 25.78, 11.88, 13.79, 7.56, 24.55, 15.75, 13.86, 21.23, 24.13, 28.47, 22.67, 28.17, 23.91, 22.15, 26.54, 27.24, 16.08, 26.21, 12.4, 18.3, 29.13, 17.65, 7.97, 27.78, 15.88, 28.93, 22.39, 22.89, 16.0, 28.81, 7.11, 9.62, 22.63, 8.35, 24.01, 20.31, 14.88, 10.89, 19.58, 20.91, 22.83, 8.38, 5.26, 15.75, 25.38, 29.87, 17.2, 8.7, 19.58, 18.72, 6.52, 14.42, 12.36, 23.11, 14.41, 6.7, 8.16, 24.15, 10.33, 18.24, 14.93, 25.97, 12.46, 28.56, 14.6, 19.71, 7.72, 24.91, 6.79, 28.38, 26.05, 14.51, 16.25, 13.07, 17.79, 18.47, 27.89, 8.93, 8.32, 14.94, 5.38, 20.58, 13.14, 9.01, 10.59, 13.08, 13.72, 16.69, 18.26, 21.88, 26.0, 28.82, 14.82, 6.95, 22.51], 100], 17.73],
        ],
    );

    for (const [input, output] of cases) {
        const cubetimes = times(input[0]);
        expect(average_of_n(cubetimes, input[1])).toHaveProperty('time', output);
    }
});
