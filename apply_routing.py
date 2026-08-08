"""Fold talent-tree routing drawn in the app back into the data files.

The app's routing editor (Talents tab -> Edit routing) keeps what you draw in
localStorage and hands it over with "Copy all edited". Paste that JSON into a
file and run:

    python apply_routing.py routing.json

Each entry is a specialization key mapped to the tree's 20 link bitmasks, in
row-major order, one per box: up=1, down=2, left=4, right=8. Both boxes on a
link carry it, so a left-to-right join sets 8 on the left box and 4 on the
right one; the script checks that before writing anything.

Writes data/specializations.json and regenerates data/specializations.js.
"""
import json, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE, 'data', 'specializations.json')


def check_symmetry(key, conns):
    """Every link has to be recorded on both boxes it joins."""
    problems = []
    for r in range(5):
        for c in range(4):
            i = r * 4 + c
            if c < 3:
                j = r * 4 + c + 1
                if bool(conns[i] & 8) != bool(conns[j] & 4):
                    problems.append(f'{key}: horizontal link at row {r + 1} between columns {c + 1} and {c + 2} is one-sided')
            if r < 4:
                j = (r + 1) * 4 + c
                if bool(conns[i] & 2) != bool(conns[j] & 1):
                    problems.append(f'{key}: vertical link at column {c + 1} between rows {r + 1} and {r + 2} is one-sided')
    # Nothing may point off the edge of the grid.
    for r in range(5):
        for c in range(4):
            v = conns[r * 4 + c]
            if c == 0 and v & 4:  problems.append(f'{key}: box r{r + 1}c1 links left, off the grid')
            if c == 3 and v & 8:  problems.append(f'{key}: box r{r + 1}c4 links right, off the grid')
            if r == 0 and v & 1:  problems.append(f'{key}: box r1c{c + 1} links up, off the grid')
            if r == 4 and v & 2:  problems.append(f'{key}: box r5c{c + 1} links down, off the grid')
    return problems


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 1
    with open(sys.argv[1], encoding='utf-8') as f:
        drawn = json.load(f)
    with open(JSON_PATH, encoding='utf-8') as f:
        specs = json.load(f)

    by_key = {s['key']: s for s in specs}
    problems, applied, unknown = [], [], []

    for key, conns in drawn.items():
        if key not in by_key:
            unknown.append(key)
            continue
        if not (isinstance(conns, list) and len(conns) == 20
                and all(isinstance(n, int) and 0 <= n <= 15 for n in conns)):
            problems.append(f'{key}: not 20 integers in the range 0 to 15')
            continue
        if not any(conns):
            problems.append(f'{key}: every box is 0, so the tree has no links at all. '
                            'Draw it before copying, or drop it from the patch.')
            continue
        problems += check_symmetry(key, conns)
        applied.append((key, conns))

    for key in unknown:
        print(f'  unknown specialization key, skipped: {key}')
    if problems:
        print('Refusing to write. Fix these first:')
        for p in problems:
            print(f'  {p}')
        return 1

    for key, conns in applied:
        was = by_key[key].get('connections')
        by_key[key]['connections'] = conns
        print(f'  {"updated" if was else "added  "}  {by_key[key]["name"]}')

    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(specs, f, ensure_ascii=False, indent=2)
    out = ('window.SW = window.SW || {};\nwindow.SW.specializations = '
           + json.dumps(specs, ensure_ascii=False, indent=2) + ';\n')
    with open(JSON_PATH.replace('.json', '.js'), 'w', encoding='utf-8') as f:
        f.write(out)

    missing = [s['name'] for s in specs
               if not (isinstance(s.get('connections'), list) and len(s['connections']) == 20)]
    print(f'\nWrote {len(applied)} tree(s). Still without routing: {len(missing)}')
    for name in missing:
        print(f'  {name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
