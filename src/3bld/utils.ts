export type PracticeMode = 'all' | 'letters' | 'pairs';

export interface GradeResult {
    distance: number;
    exact: boolean;
    accepted: boolean;
}

/**
 * Make every possible ordered pair from a list of letters.
 */
export function make_all_pairs(letters: string[]): string[] {
    const pairs: string[] = [];

    for (const first of letters) {
        for (const second of letters) {
            pairs.push(first + second);
        }
    }

    return pairs;
}

/**
 * Same-letter pairs are displayed as a single letter.
 */
export function display_pair(pair: string): string {
    // We are not checking the start of a string, we are checking string equality
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    return pair[0] === pair[1] ? pair[0] : pair;
}

/**
 * Normalize a practice answer before comparison.
 */
export function normalize_answer(value: string): string {
    return value.trim().toLocaleLowerCase();
}

/**
 * Calculate the Levenshtein edit distance between two strings.
 */
export function levenshtein_distance(a: string, b: string): number {
    const left = normalize_answer(a);
    const right = normalize_answer(b);

    if (left === right) return 0;
    if (left.length === 0) return right.length;
    if (right.length === 0) return left.length;

    let previous = Array.from({ length: right.length + 1 }, (_value, index) => index);

    for (let i = 1; i <= left.length; i += 1) {
        const current = [i];

        for (let j = 1; j <= right.length; j += 1) {
            const insertion = current[j - 1] + 1;
            const deletion = previous[j] + 1;
            const substitution = previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1);
            current[j] = Math.min(insertion, deletion, substitution);
        }

        previous = current;
    }

    return previous[right.length];
}

/**
 * Grade an answer using a configurable edit-distance tolerance.
 */
export function grade_answer(guess: string, answer: string, tolerance = 2): GradeResult {
    const distance = levenshtein_distance(guess, answer);

    return {
        distance,
        exact: distance === 0,
        accepted: distance <= tolerance,
    };
}

/**
 * Select a random item from a list.
 */
export function choose_random<T>(items: T[], random_function = Math.random): T | undefined {
    if (items.length === 0) return undefined;
    return items[Math.floor(random_function() * items.length)];
}

/**
 * Remove pairs that do not have a configured memorization word.
 */
export function available_pairs(
    candidate_pairs: string[],
    word_map: Readonly<Partial<Record<string, string>>>,
): string[] {
    return candidate_pairs.filter((pair) => Object.prototype.hasOwnProperty.call(word_map, pair));
}

/**
 * Build the practice-session title for the selected mode.
 */
export function selection_title(mode: PracticeMode, selected_letters: Set<string>): string {
    if (mode === 'all') return 'Practicing: All Words';
    if (mode === 'pairs') return 'Practicing: Specific Pairs';

    const sorted_letters = [...selected_letters].sort();
    return `Practicing: ${sorted_letters.join(', ')} Pairs`;
}

/**
 * Return a copied failure-count map with one pair adjusted by delta.
 */
export function update_failure_count(
    failures: Record<string, number>,
    pair: string,
    delta: number,
): Record<string, number> {
    const updated_failures = { ...failures };
    const new_count = Math.max(0, (updated_failures[pair] ?? 0) + delta);

    // TODO: abstract deletion method instead of using `delete`
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (new_count === 0) delete updated_failures[pair];
    else updated_failures[pair] = new_count;

    return updated_failures;
}

/**
 * Return failed pairs from most to least misses, then alphabetically by word.
 */
export function sorted_failures(
    failures: Record<string, number>,
    word_map: Readonly<Partial<Record<string, string>>>,
): [string, number][] {
    return Object.entries(failures).
        filter(([_pair, count]) => count > 0).
        sort((a, b) => {
            const count_difference = b[1] - a[1];
            if (count_difference !== 0) return count_difference;

            const a_word = word_map[a[0]] ?? a[0];
            const b_word = word_map[b[0]] ?? b[0];
            return a_word.localeCompare(b_word) || a[0].localeCompare(b[0]);
        });
}

/**
 * Return the pair with the most recorded misses.
 */
export function most_needs_work(
    failures: Record<string, number>,
    word_map: Readonly<Partial<Record<string, string>>>,
): string | undefined {
    return sorted_failures(failures, word_map)[0]?.[0];
}
