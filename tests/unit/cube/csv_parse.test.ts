import { csv_parse } from '../../../src/cube/index.ts';

test('stores the date from a csTimer CSV timestamp', () => {
    const csv = [
        'No.;Time;Comment;Scramble;Date;P.1',
        '1;10.25;;R U R\';2026-07-27 14:35:19;',
    ].join('\n');

    const times = csv_parse(csv);

    expect(times).toHaveLength(1);
    expect(times[0].date).toBe('2026-07-27');
});

test('keeps a solve when its CSV date is missing', () => {
    const csv = [
        'No.;Time;Comment;Scramble;Date;P.1',
        '1;10.25;;R U R\';;',
    ].join('\n');

    const times = csv_parse(csv);

    expect(times).toHaveLength(1);
    expect(times[0].date).toBeUndefined();
});
