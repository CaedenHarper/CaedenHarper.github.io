/* eslint-disable @stylistic/array-bracket-newline */
/* eslint-disable @stylistic/array-element-newline */
/* eslint-disable @stylistic/function-paren-newline */
import { average_of_n, Average, CubeTime } from '../../../src/cube/index.ts';

// type TestCase = Map<[CubeTime[], number], Average>;
type DNFCase = Map<[number[], number], boolean>;
type TimeCase = Map<[number[], number], number>;

const time_good = new CubeTime(1, false, false);
const time_dnf = new CubeTime(1, false, true);

// helper functions to create cubetime with less syntax
function time(num: number, plus_two?: boolean, dnf?: boolean): CubeTime {
    return new CubeTime(num, plus_two ?? false, dnf ?? false);
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

test('ao5 Expected DNF average', () => {
    expect(average_of_n([
        time_dnf,
        time_dnf,
        time_good,
        time_good,
        time_good,
    ], 5)).toHaveProperty('dnf', true);
});

test('ao5 Close but not DNF average', () => {
    expect(average_of_n([
        time_dnf,
        time_good,
        time_good,
        time_good,
        time_good,
    ], 5)).toHaveProperty('dnf', false);
});

test('ao12 Expected DNF average', () => {
    expect(average_of_n([
        time_dnf,
        time_dnf,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
    ], 12)).toHaveProperty('dnf', true);
});

test('ao12 Close but not DNF average', () => {
    expect(average_of_n([
        time_dnf,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
        time_good,
    ], 12)).toHaveProperty('dnf', false);
});

test('ao100 Expected DNF average', () => {
    expect(average_of_n([
        // 6 DNFs
        time_dnf, time_dnf, time_dnf, time_dnf, time_dnf, time_dnf,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good,
    ], 100)).toHaveProperty('dnf', true);
});

test('ao100 Close but not DNF average', () => {
    expect(average_of_n([
        // 5 DNFs
        time_dnf, time_dnf, time_dnf, time_dnf, time_dnf,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good, time_good,
        time_good, time_good, time_good, time_good, time_good,
    ], 100)).toHaveProperty('dnf', false);
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

// This returns 13.00 because ...
test('ao100 edge case', () => {
    const cases = new Map<[CubeTime[], number], number>(
        [
            [
                [[time(14.43),
                    time(13.32),
                    time(12.55),
                    time(11.77),
                    time(13.26),
                    time(11.76),
                    time(9.71),
                    time(13.57),
                    time(11.36),
                    time(12.35),
                    time(11.00),
                    time(11.47),
                    time(12.02),
                    time(10.87),
                    time(12.55),
                    time(11.52),
                    time(12.13),
                    time(11.74),
                    time(13.63),
                    time(16.79),
                    time(15.20, true),
                    time(11.14),
                    time(13.85),
                    time(11.48),
                    time(13.19),
                    time(13.73),
                    time(15.77),
                    time(14.20),
                    time(16.80),
                    time(12.72),
                    time(16.09),
                    time(14.35),
                    time(16.80, true),
                    time(11.22),
                    time(16.84),
                    time(11.56),
                    time(13.55),
                    time(10.78),
                    time(22.63),
                    time(13.35),
                    time(13.09),
                    time(16.67, true),
                    time(13.81),
                    time(11.16),
                    time(12.68),
                    time(12.09),
                    time(11.55),
                    time(11.83),
                    time(10.10),
                    time(10.77),
                    time(12.20),
                    time(12.22),
                    time(12.10),
                    time(11.62),
                    time(10.40),
                    time(12.85),
                    time(12.76),
                    time(11.50),
                    time(13.53),
                    time(14.30),
                    time(11.13),
                    time(11.89),
                    time(12.71),
                    time(14.34, false, true),
                    time(12.85),
                    time(10.34),
                    time(14.79),
                    time(14.05),
                    time(11.58),
                    time(16.27),
                    time(11.98),
                    time(16.07),
                    time(11.48),
                    time(14.28),
                    time(10.40),
                    time(10.44),
                    time(15.71),
                    time(12.84),
                    time(12.68),
                    time(12.20),
                    time(14.96),
                    time(13.37),
                    time(11.62),
                    time(13.05),
                    time(10.48),
                    time(13.38),
                    time(13.34),
                    time(12.36),
                    time(11.94),
                    time(12.24),
                    time(11.08),
                    time(14.97),
                    time(18.38),
                    time(15.80),
                    time(11.55),
                    time(10.63),
                    time(13.16),
                    time(10.55),
                    time(13.48),
                    time(15.63),
                ], 100,
                ],
                12.89],
        ],
    );

    for (const [input, output] of cases) {
        const cubetimes = input[0];
        expect(average_of_n(cubetimes, input[1])).toHaveProperty('time', output);
    }
});
