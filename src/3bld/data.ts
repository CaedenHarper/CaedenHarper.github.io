/**
 * Letter pairs used by the 3BLD trainer.
 */
export const letters = 'ABCDEFGHIJKLMNOPQRSTUVWX'.split('');

/**
 * Mapping from letter pairs to their memorization words.
 *
 * Add or replace mappings here. Keys are always two-letter pairs using A-X.
 * Same-letter pairs are displayed as a single letter by the UI (e.g. NN -> N).
 */
export const word_map: Readonly<Partial<Record<string, string>>> = {
    NA: 'Salt',
    NB: 'Nutter Butter',
    NC: 'Nyan Cat',
    ND: 'Nerd',
    NE: 'Knee',
    NF: 'Knife',
    NG: 'Nuggets',
    NH: 'Neil Patrick Harris',
    NI: 'Knight',
    NJ: 'Ninja',
    NK: 'Nuke',
    NL: 'Nail',
    NM: 'Norm Macdonald',
    NN: 'Nun',
    NO: 'Nose',
    NP: 'Nap',
    NQ: 'Nacho',
    NR: 'Naruto',
    NS: 'Nest',
    NT: 'Gnat',
    NU: 'Nut',
    NV: 'Navy',
    NW: 'Newt',
    NX: 'Nixon',
};
