/* eslint-disable @stylistic/array-bracket-newline */
/* eslint-disable @stylistic/function-paren-newline */
import { compute_stats, Stats, CubeTime, Average } from '../../../src/cube/index.ts';

interface input_obj {
    times: CubeTime[];
    average_list: number[];
    graph_min: number;
    graph_max: number;
    solve_nums: number;
    step: number;
    streaks: number[];
    ignore_dnf: boolean;
    ignore_plus_two: boolean;
}
type TestCase = Map<input_obj, Stats | undefined>;

// helper function to call compute_stats with input_obj
function compute(input: input_obj): Stats | undefined {
    const times = input.times;
    const average_list = input.average_list;
    const graph_min = input.graph_min;
    const graph_max = input.graph_max;
    const solve_nums = input.solve_nums;
    const step = input.step;
    const streaks = input.streaks;
    const ignore_dnf = input.ignore_dnf;
    const ignore_plus_two = input.ignore_plus_two;
    return compute_stats(times, average_list, graph_min, graph_max, solve_nums, step, streaks, ignore_dnf, ignore_plus_two);
}

test('empty times', () => {
    const cases: TestCase = new Map(
        [
            [
                {
                    times: [],
                    average_list: [],
                    graph_min: NaN,
                    graph_max: NaN,
                    solve_nums: NaN,
                    step: NaN,
                    streaks: [],
                    ignore_dnf: false,
                    ignore_plus_two: false,
                }, undefined,
            ],
        ],
    );

    for (const [input, output] of cases) {
        console.log(input);
        expect(compute(input)).toEqual(output);
    }
});

test('simple', () => {
    const cases: TestCase = new Map(
        [
            [
                {
                    times: [
                        new CubeTime(12.34, false, false),
                        new CubeTime(15.23, false, false),
                        new CubeTime(10.63, false, false),
                        new CubeTime(18.22, false, false),
                        new CubeTime(25.22, false, false),
                        new CubeTime(30.27, false, true),
                    ],
                    average_list: [5, 12],
                    graph_min: 5,
                    graph_max: 6,
                    solve_nums: NaN,
                    step: NaN,
                    streaks: [12, 15, 40],
                    ignore_dnf: false,
                    ignore_plus_two: false,
                }, new Stats(
                    6,
                    10.63,
                    25.22,
                    0,
                    1,
                    111.91,
                    new Map([
                        [5, [
                            new Average(5, 15.26, false, [
                                new CubeTime(12.34, false, false),
                                new CubeTime(15.23, false, false),
                                new CubeTime(10.63, false, false),
                                new CubeTime(18.22, false, false),
                                new CubeTime(25.22, false, false),
                            ]),
                            new Average(5, 19.55, false, [
                                new CubeTime(15.23, false, false),
                                new CubeTime(10.63, false, false),
                                new CubeTime(18.22, false, false),
                                new CubeTime(25.22, false, false),
                                new CubeTime(30.27, false, true),
                            ]),
                        ]],
                        [12, []],
                    ]),
                    new Map([
                        [12, [0, 1]],
                        [15, [0, 1]],
                        [40, [0, 6]],
                    ]),
                    [
                        {
                            time: 5,
                            count: 0,
                        },
                        {
                            time: 6,
                            count: 0,
                        },
                        {
                            time: 7,
                            count: 0,
                        },
                    ],
                ),
            ],
        ],
    );

    for (const [input, output] of cases) {
        console.log(input);
        expect(compute(input)).toEqual(output);
    }
});
