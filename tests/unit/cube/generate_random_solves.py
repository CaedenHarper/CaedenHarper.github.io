"""Generate a list of random mock solves to test with into solves.txt."""
from pathlib import Path
import random

CWD = Path().cwd().resolve()
OUT_FILE = CWD / 'tests' / 'unit' / 'cube' / 'solves.txt'

NUM_SOLVES = 20000
MIN_TIME = 5
MAX_TIME = 70
DNF_CHANCE = 0.005
PLUS_TWO_CHANCE = 0.008

def generate_random_solve() -> str:
    time = random.uniform(5, 70)
    dnf = 1 if random.uniform(0, 1) < DNF_CHANCE else 0
    plus_two = 1 if random.uniform(0, 1) < PLUS_TWO_CHANCE else 0

    return f'{time} {dnf} {plus_two}'

def main() -> None:
    solves = [generate_random_solve() for _ in range(NUM_SOLVES)]
    OUT_FILE.write_text('\n'.join(solves))

if __name__ == '__main__':
    main()