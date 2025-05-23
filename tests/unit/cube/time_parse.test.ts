/* eslint-disable @stylistic/array-bracket-newline */
/* eslint-disable @stylistic/function-paren-newline */
import { time_parse, CubeTime } from '../../../src/cube/index.ts';

type TestCase = Map<string, CubeTime | undefined>;

test('empty string input', () => {
    const cases: TestCase = new Map(
        [
            ['', undefined],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});

test('zeroes', () => {
    const cases: TestCase = new Map(
        [
            ['0.00', undefined],
            ['00.00', undefined],
            ['0:00.00', undefined],
            ['00:00.00', undefined],
            ['000:00.00', undefined],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});

test('s.ss formats', () => {
    const cases: TestCase = new Map(
        [
            ['1.23', new CubeTime(1.23, false, false)],
            ['4.50', new CubeTime(4.50, false, false)],
            ['0.25', new CubeTime(0.25, false, false)],
            ['8.05', new CubeTime(8.05, false, false)],
            ['4.20+', new CubeTime(4.20, true, false)],
            ['DNF(6.53)', new CubeTime(6.53, false, true)],
            ['DNF(7.33)+', new CubeTime(7.33, true, true)],
            ['4.6', undefined],
            ['6', undefined],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});

test('ss.ss formats', () => {
    const cases: TestCase = new Map(
        [
            ['01.23', new CubeTime(1.23, false, false)],
            ['12.45', new CubeTime(12.45, false, false)],
            ['90.14', new CubeTime(90.14, false, false)],
            ['23.34', new CubeTime(23.34, false, false)],
            ['14.20+', new CubeTime(14.20, true, false)],
            ['DNF(16.53)', new CubeTime(16.53, false, true)],
            ['DNF(47.33)+', new CubeTime(47.33, true, true)],
            ['17.3', undefined],
            ['15', undefined],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});

test('m:ss.ss formats', () => {
    const cases: TestCase = new Map(
        [
            ['1:23.23', new CubeTime(83.23, false, false)],
            ['0:12.45', new CubeTime(12.45, false, false)],
            ['9:41.14', new CubeTime(581.14, false, false)],
            ['1:23.45+', new CubeTime(83.45, true, false)],
            ['DNF(1:23.45)', new CubeTime(83.45, false, true)],
            ['DNF(1:23.45)+', new CubeTime(83.45, true, true)],
            ['2:17.3', undefined],
            ['2:15', undefined],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});

test('mm:ss.ss formats', () => {
    const cases: TestCase = new Map(
        [
            ['41:23.23', new CubeTime(2483.23, false, false)],
            ['01:23.45', new CubeTime(83.45, false, false)],
            ['00:41.14', new CubeTime(41.14, false, false)],
            ['12:34.56+', new CubeTime(754.56, true, false)],
            ['DNF(12:34.56)', new CubeTime(754.56, false, true)],
            ['DNF(12:34.56)+', new CubeTime(754.56, true, true)],
            ['12:34.5', undefined],
            ['12:34', undefined],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});

test('(h/hh/hhh):m:ss.ss formats', () => {
    const cases: TestCase = new Map(
        [
            ['1:23:45.67', new CubeTime(5025.67, false, false)],
            ['01:23:45.67', new CubeTime(5025.67, false, false)],
            ['001:23:45.67', new CubeTime(5025.67, false, false)],
            ['999:99:99.99', new CubeTime(3602439.99, false, false)],
            ['12:34:56.78', new CubeTime(45296.78, false, false)],
            ['123:45:67.89', new CubeTime(445567.89, false, false)],
            ['1:23:45.67+', new CubeTime(5025.67, true, false)],
            ['DNF(12:34:56.78)', new CubeTime(45296.78, false, true)],
            ['DNF(123:45:67.89)+', new CubeTime(445567.89, true, true)],
            ['123:45:67.8', undefined],
            ['123:45:67', undefined],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});

test('CSTimer number formats', () => {
    const cases: TestCase = new Map(
        [
            ['Time List:', undefined],
            [`1. 14.58   F' U' R F' R U B D R' B2 L2 F' D2 L2 D2 F D2 F' L2 F' U2 `, new CubeTime(14.58, false, false)],
            [`2. 12.43   L' B2 U B R B' D R F L2 F' U2 L2 U2 R2 B' D2 B2 R2 U' `, new CubeTime(12.43, false, false)],
            [`3. 8.35   F R' D F2 R2 U B2 R2 U' B2 U F2 U F' L2 U' R D' R U2 `, new CubeTime(8.35, false, false)],
            [`4. 1:25.23+   D R2 D' R2 B2 U' F2 D' F2 R2 D2 B' R2 U L U2 L B' F' R U `, new CubeTime(85.23, true, false)],
            [`5. 16.23   B2 L D2 U2 B2 F2 R U2 R D2 B2 L' U B D2 R' B' L B' F' `, new CubeTime(16.23, false, false)],
            [`6. DNF(14.34)[How'd I DNF?! Should have been a 12.12!]   L' U2 B2 U2 R' D2 U2 L' D2 F2 R2 U' F U B' U F2 L' F D'`, new CubeTime(14.34, false, true)],
        ],
    );

    for (const [input, output] of cases) {
        expect(time_parse(input)).toEqual(output);
    }
});
