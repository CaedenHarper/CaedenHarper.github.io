import { letters, word_map } from './data.ts';
import type { PracticeMode } from './utils.ts';
import {
    available_pairs,
    choose_random,
    display_pair,
    grade_answer,
    make_all_pairs,
    most_needs_work,
    selection_title,
    sorted_failures,
    update_failure_count,
} from './utils.ts';

type Screen = 'menu' | 'letter-select' | 'pair-select' | 'practice';

interface LastResult {
    pair: string;
    guess: string;
    answer: string;
    accepted: boolean;
    exact: boolean;
    retroactively_marked_incorrect: boolean;
}

interface PracticeStats {
    total: number;
    correct: number;
    incorrect: number;
    failures: Record<string, number>;
    last_result?: LastResult;
}

interface Warning {
    guess: string;
    answer: string;
}

interface State {
    screen: Screen;
    mode?: PracticeMode;
    selected_letters: Set<string>;
    selected_pairs: Set<string>;
    practice_pairs: string[];
    current_pair?: string;
    stats: PracticeStats;
    warning?: Warning;
    finish_open: boolean;
    reconfiguring: boolean;
}

function get_element<T extends HTMLElement>(
    id: string,
    element_type: new () => T,
): T {
    const element = document.getElementById(id);

    if (!(element instanceof element_type)) {
        throw new Error(`Unable to find expected element #${id}`);
    }

    return element;
}

const page_title = get_element('page-title', HTMLHeadingElement);
const back_main_button = get_element('back-main', HTMLButtonElement);
const practice_controls = get_element('practice-controls', HTMLDivElement);
const change_constraint_button = get_element('change-constraint', HTMLButtonElement);
const finish_button = get_element('finish-button', HTMLButtonElement);

const menu_screen = get_element('menu-screen', HTMLElement);
const letter_screen = get_element('letter-screen', HTMLElement);
const pair_screen = get_element('pair-screen', HTMLElement);
const practice_screen = get_element('practice-screen', HTMLElement);

const all_words_button = get_element('all-words-button', HTMLButtonElement);
const specific_letters_button = get_element('specific-letters-button', HTMLButtonElement);
const specific_pairs_button = get_element('specific-pairs-button', HTMLButtonElement);

const letter_grid = get_element('letter-grid', HTMLDivElement);
const continue_letters_button = get_element('continue-letters', HTMLButtonElement);
const pair_grid = get_element('pair-grid', HTMLDivElement);
const continue_pairs_button = get_element('continue-pairs', HTMLButtonElement);

const pair_display = get_element('pair-display', HTMLDivElement);
const no_words_div = get_element('no-words', HTMLDivElement);
const answer_form = get_element('answer-form', HTMLFormElement);
const answer_input = get_element('answer-input', HTMLInputElement);
const warning_row = get_element('warning-row', HTMLDivElement);
const warning_text = get_element('warning-text', HTMLSpanElement);
const mark_incorrect_button = get_element('mark-incorrect', HTMLButtonElement);

const total_guesses = get_element('total-guesses', HTMLElement);
const total_correct = get_element('total-correct', HTMLElement);
const total_incorrect = get_element('total-incorrect', HTMLElement);
const correct_percentage = get_element('correct-percentage', HTMLElement);
const needs_work_row = get_element('needs-work-row', HTMLDivElement);
const needs_work = get_element('needs-work', HTMLElement);

const finish_modal = get_element('finish-modal', HTMLDivElement);
const finish_total_guesses = get_element('finish-total-guesses', HTMLElement);
const finish_total_correct = get_element('finish-total-correct', HTMLElement);
const finish_total_incorrect = get_element('finish-total-incorrect', HTMLElement);
const finish_correct_percentage = get_element('finish-correct-percentage', HTMLElement);
const failed_list = get_element('failed-list', HTMLDivElement);
const modal_main_button = get_element('modal-main', HTMLButtonElement);

const all_pairs = make_all_pairs(letters);

const state: State = {
    screen: 'menu',
    selected_letters: new Set(),
    selected_pairs: new Set(),
    practice_pairs: [],
    stats: fresh_stats(),
    finish_open: false,
    reconfiguring: false,
};

function fresh_stats(): PracticeStats {
    return {
        total: 0,
        correct: 0,
        incorrect: 0,
        failures: {},
    };
}

function create_letter_selector(): void {
    for (const letter of letters) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'letter-choice';
        button.dataset.letter = letter;
        button.textContent = letter;
        button.setAttribute('aria-pressed', 'false');
        letter_grid.append(button);
    }
}

function create_grid_cell(class_name: string): HTMLDivElement {
    const cell = document.createElement('div');
    cell.className = `grid-cell ${class_name}`;
    return cell;
}

function create_pair_selector(): void {
    const corner = create_grid_cell('grid-corner');
    corner.textContent = '1st \\ 2nd';
    pair_grid.append(corner);

    for (const letter of letters) {
        const cell = create_grid_cell('grid-header');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'axis-choice';
        button.dataset.column = letter;
        button.textContent = letter;
        button.setAttribute('aria-label', `Toggle column ${letter}`);
        button.setAttribute('aria-pressed', 'false');
        cell.append(button);
        pair_grid.append(cell);
    }

    for (const first of letters) {
        const row_header = create_grid_cell('grid-row-header');
        const row_button = document.createElement('button');
        row_button.type = 'button';
        row_button.className = 'axis-choice';
        row_button.dataset.row = first;
        row_button.textContent = first;
        row_button.setAttribute('aria-label', `Toggle row ${first}`);
        row_button.setAttribute('aria-pressed', 'false');
        row_header.append(row_button);
        pair_grid.append(row_header);

        for (const second of letters) {
            const pair = first + second;
            const cell = create_grid_cell('');
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'pair-choice';
            button.dataset.pair = pair;
            button.textContent = display_pair(pair);
            button.setAttribute('aria-pressed', 'false');
            cell.append(button);
            pair_grid.append(cell);
        }
    }
}

function set_screen(screen: Screen): void {
    state.screen = screen;

    menu_screen.hidden = screen !== 'menu';
    letter_screen.hidden = screen !== 'letter-select';
    pair_screen.hidden = screen !== 'pair-select';
    practice_screen.hidden = screen !== 'practice';

    back_main_button.hidden = screen === 'menu';
    practice_controls.hidden = screen !== 'practice';

    if (screen === 'practice' && state.mode !== undefined) {
        page_title.textContent = selection_title(state.mode, state.selected_letters);
        update_practice_controls();
        update_practice_view();
        if (state.current_pair !== undefined && !state.finish_open) answer_input.focus();
        return;
    }

    page_title.textContent = '3BLD Letter Pair Practice';

    if (screen === 'letter-select') update_letter_selector();
    if (screen === 'pair-select') update_pair_selector();
}

function update_practice_controls(): void {
    if (state.mode === 'letters') {
        change_constraint_button.hidden = false;
        change_constraint_button.textContent = 'Change Letter';
        return;
    }

    if (state.mode === 'pairs') {
        change_constraint_button.hidden = false;
        change_constraint_button.textContent = 'Change Specific Words';
        return;
    }

    change_constraint_button.hidden = true;
}

function update_letter_selector(): void {
    const buttons = letter_grid.querySelectorAll<HTMLButtonElement>('[data-letter]');

    buttons.forEach((button) => {
        const letter = button.dataset.letter;
        if (letter === undefined) return;
        const selected = state.selected_letters.has(letter);
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', selected.toString());
    });

    continue_letters_button.disabled = state.selected_letters.size === 0;
}

function row_is_selected(letter: string): boolean {
    return letters.every((second) => state.selected_pairs.has(letter + second));
}

function column_is_selected(letter: string): boolean {
    return letters.every((first) => state.selected_pairs.has(first + letter));
}

function update_pair_selector(): void {
    const pair_buttons = pair_grid.querySelectorAll<HTMLButtonElement>('[data-pair]');
    pair_buttons.forEach((button) => {
        const pair = button.dataset.pair;
        if (pair === undefined) return;
        const selected = state.selected_pairs.has(pair);
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', selected.toString());
    });

    const row_buttons = pair_grid.querySelectorAll<HTMLButtonElement>('[data-row]');
    row_buttons.forEach((button) => {
        const row = button.dataset.row;
        if (row === undefined) return;
        const selected = row_is_selected(row);
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', selected.toString());
    });

    const column_buttons = pair_grid.querySelectorAll<HTMLButtonElement>('[data-column]');
    column_buttons.forEach((button) => {
        const column = button.dataset.column;
        if (column === undefined) return;
        const selected = column_is_selected(column);
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', selected.toString());
    });

    continue_pairs_button.disabled = state.selected_pairs.size === 0;
}

function get_correct_percentage(): string {
    if (state.stats.total === 0) return '0.00%';
    return `${(state.stats.correct / state.stats.total * 100).toFixed(2)}%`;
}

function update_stats_view(): void {
    const percentage = get_correct_percentage();

    total_guesses.textContent = state.stats.total.toString();
    total_correct.textContent = state.stats.correct.toString();
    total_incorrect.textContent = state.stats.incorrect.toString();
    correct_percentage.textContent = percentage;

    finish_total_guesses.textContent = state.stats.total.toString();
    finish_total_correct.textContent = state.stats.correct.toString();
    finish_total_incorrect.textContent = state.stats.incorrect.toString();
    finish_correct_percentage.textContent = percentage;

    const pair = most_needs_work(state.stats.failures, word_map);
    needs_work_row.hidden = pair === undefined;

    if (pair !== undefined) {
        needs_work.textContent = `${word_map[pair] ?? pair} (${display_pair(pair)})`;
    }
}

function update_warning_view(): void {
    warning_row.hidden = state.warning === undefined;

    if (state.warning !== undefined) {
        warning_text.textContent = `Warning: your previous answer '${state.warning.guess}' was close to the correct answer, '${state.warning.answer}'.`;
    }
}

function update_practice_view(): void {
    const no_words = state.practice_pairs.length === 0;

    no_words_div.hidden = !no_words;
    pair_display.hidden = no_words;
    answer_form.hidden = no_words;

    if (!no_words && state.current_pair !== undefined) {
        pair_display.textContent = display_pair(state.current_pair);
    }

    update_stats_view();
    update_warning_view();
}

function go_main_menu(): void {
    state.mode = undefined;
    state.practice_pairs = [];
    state.current_pair = undefined;
    state.stats = fresh_stats();
    state.warning = undefined;
    state.finish_open = false;
    state.reconfiguring = false;
    finish_modal.hidden = true;
    set_screen('menu');
}

function setup_practice(mode: PracticeMode): void {
    state.mode = mode;
    let candidates: string[] = [];

    if (mode === 'all') candidates = all_pairs;
    else if (mode === 'letters') {
        candidates = all_pairs.filter((pair) => state.selected_letters.has(pair[0]));
    } else {
        candidates = [...state.selected_pairs];
    }

    state.practice_pairs = available_pairs(candidates, word_map);
    if (!state.reconfiguring) state.stats = fresh_stats();
    state.warning = undefined;
    state.finish_open = false;
    state.current_pair = choose_random(state.practice_pairs);
    state.reconfiguring = false;
    finish_modal.hidden = true;
    set_screen('practice');
}

function next_pair(): void {
    state.current_pair = choose_random(state.practice_pairs);
}

function submit_guess(guess: string): void {
    if (state.current_pair === undefined) return;

    const answer = word_map[state.current_pair];
    if (answer === undefined) return;

    const current_pair = state.current_pair;
    const result = grade_answer(guess, answer, 2);

    state.warning = undefined;
    state.stats.total += 1;

    if (result.accepted) {
        state.stats.correct += 1;
    } else {
        state.stats.incorrect += 1;
        state.stats.failures = update_failure_count(state.stats.failures, current_pair, 1);
    }

    state.stats.last_result = {
        pair: current_pair,
        guess,
        answer,
        accepted: result.accepted,
        exact: result.exact,
        retroactively_marked_incorrect: false,
    };

    if (result.accepted && !result.exact) {
        state.warning = { guess, answer };
    }

    next_pair();
    answer_input.value = '';
    update_practice_view();
    answer_input.focus();
}

function mark_previous_incorrect(): void {
    const last_result = state.stats.last_result;
    if (
        last_result === undefined ||
        !last_result.accepted ||
        last_result.exact ||
        last_result.retroactively_marked_incorrect
    ) return;

    state.stats.correct = Math.max(0, state.stats.correct - 1);
    state.stats.incorrect += 1;
    state.stats.failures = update_failure_count(state.stats.failures, last_result.pair, 1);
    last_result.retroactively_marked_incorrect = true;
    state.warning = undefined;
    update_practice_view();
}

function toggle_letter(letter: string): void {
    if (state.selected_letters.has(letter)) state.selected_letters.delete(letter);
    else state.selected_letters.add(letter);
    update_letter_selector();
}

function toggle_pair(pair: string): void {
    if (state.selected_pairs.has(pair)) state.selected_pairs.delete(pair);
    else state.selected_pairs.add(pair);
    update_pair_selector();
}

function toggle_row(first: string): void {
    const pairs = letters.map((second) => first + second);
    const all_selected = pairs.every((pair) => state.selected_pairs.has(pair));

    for (const pair of pairs) {
        if (all_selected) state.selected_pairs.delete(pair);
        else state.selected_pairs.add(pair);
    }

    update_pair_selector();
}

function toggle_column(second: string): void {
    const pairs = letters.map((first) => first + second);
    const all_selected = pairs.every((pair) => state.selected_pairs.has(pair));

    for (const pair of pairs) {
        if (all_selected) state.selected_pairs.delete(pair);
        else state.selected_pairs.add(pair);
    }

    update_pair_selector();
}

function change_constraint(): void {
    if (state.mode === 'letters') set_screen('letter-select');
    else if (state.mode === 'pairs') set_screen('pair-select');
    else return;

    state.finish_open = false;
    state.reconfiguring = true;
}

function update_finish_modal(): void {
    update_stats_view();
    failed_list.replaceChildren();

    const failures = sorted_failures(state.stats.failures, word_map);
    if (failures.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No failed words.';
        failed_list.append(message);
    } else {
        for (const [pair, count] of failures) {
            const row = document.createElement('div');
            row.className = 'failed-item';

            const label = document.createElement('span');
            label.textContent = `${word_map[pair] ?? pair} (${display_pair(pair)})`;

            const count_element = document.createElement('strong');
            count_element.textContent = count.toString();

            row.append(label, count_element);
            failed_list.append(row);
        }
    }

    finish_modal.hidden = false;
}

function handle_letter_grid_click(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest<HTMLButtonElement>('[data-letter]');
    const letter = button?.dataset.letter;
    if (letter !== undefined) toggle_letter(letter);
}

function handle_pair_grid_click(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const pair_button = target.closest<HTMLButtonElement>('[data-pair]');
    const pair = pair_button?.dataset.pair;
    if (pair !== undefined) {
        toggle_pair(pair);
        return;
    }

    const row_button = target.closest<HTMLButtonElement>('[data-row]');
    const row = row_button?.dataset.row;
    if (row !== undefined) {
        toggle_row(row);
        return;
    }

    const column_button = target.closest<HTMLButtonElement>('[data-column]');
    const column = column_button?.dataset.column;
    if (column !== undefined) toggle_column(column);
}

create_letter_selector();
create_pair_selector();

all_words_button.addEventListener('click', () => setup_practice('all'));
specific_letters_button.addEventListener('click', () => {
    state.mode = 'letters';
    set_screen('letter-select');
});
specific_pairs_button.addEventListener('click', () => {
    state.mode = 'pairs';
    set_screen('pair-select');
});

back_main_button.addEventListener('click', go_main_menu);
modal_main_button.addEventListener('click', go_main_menu);
letter_grid.addEventListener('click', handle_letter_grid_click);
pair_grid.addEventListener('click', handle_pair_grid_click);
continue_letters_button.addEventListener('click', () => setup_practice('letters'));
continue_pairs_button.addEventListener('click', () => setup_practice('pairs'));
change_constraint_button.addEventListener('click', change_constraint);
mark_incorrect_button.addEventListener('click', mark_previous_incorrect);
finish_button.addEventListener('click', () => {
    state.finish_open = true;
    update_finish_modal();
});
answer_form.addEventListener('submit', (event) => {
    event.preventDefault();
    submit_guess(answer_input.value);
});

set_screen('menu');
