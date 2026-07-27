import { CubeTime, filter_times_by_date } from '../../../src/cube/index.ts';

test('filters solves by date', () => {
    const first = new CubeTime(10, false, false, '2026-07-26');
    const second = new CubeTime(11, false, false, '2026-07-27');
    const third = new CubeTime(12, false, false, '2026-07-27');

    expect(filter_times_by_date([first, second, third], '2026-07-27')).toEqual([second, third]);
});

test('empty date keeps every solve in a new array', () => {
    const times = [
        new CubeTime(10, false, false, '2026-07-26'),
        new CubeTime(11, false, false, '2026-07-27'),
    ];

    const filtered = filter_times_by_date(times, '');

    expect(filtered).toEqual(times);
    expect(filtered).not.toBe(times);
});

test('undated solves do not match a selected date', () => {
    const times = [new CubeTime(10, false, false)];

    expect(filter_times_by_date(times, '2026-07-27')).toEqual([]);
});
