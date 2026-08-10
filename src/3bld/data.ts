/**
 * Letters used by the 3BLD trainer.
 */
export const letters = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('');

export type WordMap = Partial<Record<string, string>>;

export interface ParsedWordData {
    word_map: WordMap;
    warning_count: number;
}

interface WordEntry {
    pair?: unknown;
    answer?: unknown;
}

/**
 * Parse uploaded letter-pair data.
 *
 * The expected JSON format is an array of objects shaped like:
 * { "pair": "NA", "answer": "Salt" }
 *
 * The first occurrence of a pair is kept. Invalid pairs and duplicate pairs are
 * discarded with a console warning.
 */
export function parse_word_json(file_content: string): ParsedWordData {
    const parsed: unknown = JSON.parse(file_content);

    if (!Array.isArray(parsed)) {
        throw new Error('Word data must be a JSON array.');
    }

    return json_to_word_map(parsed);
}

export function json_to_word_map(parsed: unknown[]): ParsedWordData {
    const word_map: WordMap = {};
    let warning_count = 0;

    for (const [index, raw_entry] of parsed.entries()) {
        if (typeof raw_entry !== 'object' || raw_entry === null || Array.isArray(raw_entry)) {
            warning_count += 1;
            console.warn(`Ignoring entry ${index + 1}: expected an object with "pair" and "answer".`);
            continue;
        }

        const entry = raw_entry as WordEntry;
        if (typeof entry.pair !== 'string' || typeof entry.answer !== 'string') {
            warning_count += 1;
            console.warn(`Ignoring entry ${index + 1}: "pair" and "answer" must both be strings.`);
            continue;
        }

        const pair = entry.pair.trim().toUpperCase();
        const answer = entry.answer.trim();

        if (!(/^[A-X]{2}$/).test(pair)) {
            warning_count += 1;
            console.warn(`Ignoring non-letter-pair "${entry.pair}" at entry ${index + 1}. Expected two letters from A-X.`);
            continue;
        }

        if (answer.length === 0) {
            warning_count += 1;
            console.warn(`Ignoring ${pair} at entry ${index + 1}: answer cannot be empty.`);
            continue;
        }

        if (Object.prototype.hasOwnProperty.call(word_map, pair)) {
            warning_count += 1;
            console.warn(`Ignoring duplicate letter pair ${pair} at entry ${index + 1}.`);
            continue;
        }

        word_map[pair] = answer;
    }

    return { word_map, warning_count };
}
