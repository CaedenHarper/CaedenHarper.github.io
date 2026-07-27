import {
    calculate_interquartile_range,
    calculate_median,
} from '../../../src/cube/index.ts';

test('calculates median for odd and even samples', () => {
    expect(calculate_median([5, 1, 3])).toBe(3);
    expect(calculate_median([4, 1, 3, 2])).toBe(2.5);
});

test('returns undefined median for an empty sample', () => {
    expect(calculate_median([])).toBeUndefined();
});

test('calculates interquartile range with interpolation', () => {
    expect(calculate_interquartile_range([1, 2, 3, 4, 5])).toBe(2);
    expect(calculate_interquartile_range([1, 2, 3, 4])).toBe(1.5);
});

test('requires at least two values for consistency', () => {
    expect(calculate_interquartile_range([])).toBeUndefined();
    expect(calculate_interquartile_range([1])).toBeUndefined();
});
