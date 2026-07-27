import {
    CubeTime,
    get_adjacent_solve_date,
    get_solve_dates,
} from '../../../src/cube/index.ts';

test('collects unique solve dates in chronological order', () => {
    const times = [
        new CubeTime(10, false, false, '2026-07-27'),
        new CubeTime(11, false, false, '2026-07-25'),
        new CubeTime(12, false, false, '2026-07-27'),
        new CubeTime(13, false, false),
        new CubeTime(14, false, false, '2026-07-26'),
    ];

    expect(get_solve_dates(times)).toEqual([
        '2026-07-25',
        '2026-07-26',
        '2026-07-27',
    ]);
});

test('finds previous and next solve dates', () => {
    const dates = ['2026-07-25', '2026-07-27', '2026-07-30'];

    expect(get_adjacent_solve_date(dates, '2026-07-27', -1)).toBe('2026-07-25');
    expect(get_adjacent_solve_date(dates, '2026-07-27', 1)).toBe('2026-07-30');
});

test('skips dates without solves', () => {
    const dates = ['2026-07-25', '2026-07-30'];

    expect(get_adjacent_solve_date(dates, '2026-07-27', -1)).toBe('2026-07-25');
    expect(get_adjacent_solve_date(dates, '2026-07-27', 1)).toBe('2026-07-30');
});

test('returns undefined at navigation boundaries or without a selection', () => {
    const dates = ['2026-07-25', '2026-07-30'];

    expect(get_adjacent_solve_date(dates, '2026-07-25', -1)).toBeUndefined();
    expect(get_adjacent_solve_date(dates, '2026-07-30', 1)).toBeUndefined();
    expect(get_adjacent_solve_date(dates, '', 1)).toBeUndefined();
});
