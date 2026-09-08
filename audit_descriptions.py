"""Regenerate missing_descriptions.json and missing_descriptions.md.

Both files list every weapon, armor, gear and vehicle entry whose description
field is empty. A weapon, armor or gear entry then shows a "please see page N of
BOOK" message in place of the text, and a vehicle shows no Description block at
all. They are the worklist that scrape_equipment_descriptions.py and
scrape_vehicle_descriptions.py exist to burn down, so they go stale as that work
happens. Run this to refresh them:

    python audit_descriptions.py            # rewrite both files
    python audit_descriptions.py --check    # report drift, write nothing

--check exits 1 when the files on disk no longer match the data, so it can
gate a commit without changing anything.
"""
import argparse
import datetime
import io
import json
import os
import re
import sys

# Reading order, which is also the order the summary table uses.
FILES = [
    ('Weapon',  os.path.join('data', 'weapons.js')),
    ('Armor',   os.path.join('data', 'armor.js')),
    ('Gear',    os.path.join('data', 'gear.js')),
    ('Vehicle', os.path.join('data', 'vehicles.js')),
]

JSON_PATH = 'missing_descriptions.json'
MD_PATH = 'missing_descriptions.md'


def strip_comments(text):
    """Remove // line comments that sit outside string literals.

    The data files are JavaScript, not JSON: gear.js carries explanatory
    comments between entries, and a plain json.loads chokes on them. Tracking
    string state matters because a comment marker can legitimately appear
    inside a description.
    """
    out = []
    i = 0
    n = len(text)
    in_str = False
    esc = False
    while i < n:
        c = text[i]
        if in_str:
            out.append(c)
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
            i += 1
        elif c == '"':
            in_str = True
            out.append(c)
            i += 1
        elif c == '/' and i + 1 < n and text[i + 1] == '/':
            while i < n and text[i] != '\n':
                i += 1
        else:
            out.append(c)
            i += 1
    return ''.join(out)


def load(path):
    """Read one window.SW.<name> = [...] data file as a list of dicts."""
    with io.open(path, encoding='utf-8') as f:
        src = f.read()
    body = strip_comments(src[src.index('= [') + 2:]).rstrip().rstrip(';').rstrip()
    return json.loads(re.sub(r',(\s*\])$', r'\1', body))     # tolerate a trailing comma


def citations(rec):
    """The sources worth listing for one item, in page order.

    A few entries carry the same book twice, once with a page and once without.
    The page-less copy says nothing the paged one does not, and printing it
    would put a blank row in the per-book table, so it is dropped. A book with
    no paged citation at all still gets listed, because that is all there is.
    """
    paged = {s.get('book', '') for s in rec['sources'] if (s.get('page') or '').strip()}
    out = []
    for s in rec['sources']:
        book, page = s.get('book', ''), (s.get('page') or '').strip()
        if not page and book in paged:
            continue
        out.append({'book': book, 'page': page})
    return sorted(out, key=lambda s: (page_key(s['page']), s['book']))


def page_key(page):
    """Sort pages numerically where possible; some are ranges or blank."""
    m = re.match(r'\s*(\d+)', page or '')
    return (0, int(m.group(1))) if m else (1, 0)


def collect():
    """Every item missing a description, plus the placeholders that are exempt."""
    items = []
    exempt = []
    for cat, path in FILES:
        for rec in load(path):
            if (rec.get('description') or '').strip():
                continue
            # Generic gear placeholders (Small Item, Large Item and friends)
            # have no book to cite, so there is nothing to go and write.
            if not (rec.get('sources') or []):
                exempt.append((cat, rec.get('key', ''), rec.get('name', '')))
                continue
            items.append({
                'category': cat,
                'key': rec.get('key', ''),
                'name': rec.get('name', ''),
                'sources': citations(rec),
            })
    items.sort(key=lambda i: (i['category'], i['name'].lower()))
    return items, exempt


def build_json(items, exempt, generated):
    by_cat = {}
    books = set()
    cites = 0
    for it in items:
        by_cat[it['category']] = by_cat.get(it['category'], 0) + 1
        for s in it['sources']:
            books.add(s['book'])
            cites += 1
    # The consequence of an empty description differs by category, so the note
    # says so rather than claiming one fallback for all of them: the equipment
    # detail panel substitutes a page reference (wizard.js), while the vehicle
    # panel simply omits its Description block.
    note = (
        'Items across %s whose description field is empty. A weapon, armor or gear entry '
        'then shows a "please see page N of BOOK" message in place of the text; a vehicle '
        'shows no Description block at all. Excludes the %d intentionally generic gear '
        'placeholders (Small Item, Large Item, etc.), which have no source to cite.'
        % ('/'.join(os.path.basename(p) for _, p in FILES), len(exempt))
    )
    return {
        'generated': generated,
        'note': note,
        'summary': {
            'items': len(items),
            'citations': cites,
            'sourcebooks': len(books),
            'by_category': {k: by_cat.get(k, 0) for k in sorted(by_cat)},
        },
        'items': items,
    }


def build_md(report, generated, exempt_count):
    items = report['items']
    s = report['summary']

    # One row per (book, item) citation, grouped by book.
    by_book = {}
    for it in items:
        for src in it['sources']:
            by_book.setdefault(src['book'], []).append((src['page'], it))

    # Most-cited book first; ties broken by name so the file is stable run to run.
    order = sorted(by_book, key=lambda b: (-len(by_book[b]), b))

    L = []
    L.append('# Missing Equipment & Vehicle Descriptions')
    L.append('')
    L.append('Generated %s from the live app data files (%s).'
             % (generated, ', '.join('`%s`' % os.path.basename(p) for _, p in FILES)))
    L.append('')
    L.append('Every weapon, armor, gear, and vehicle entry whose `description` field is '
             'empty. A weapon, armor or gear entry then shows a "please see page N of BOOK" '
             'message in place of the text; a vehicle shows no Description block at all. '
             'Excludes the %d intentionally generic gear placeholders (Small Item, Large '
             'Item, etc.), which have no source to cite.' % exempt_count)
    L.append('')
    L.append('## Summary')
    L.append('')
    L.append('| Category | Missing |')
    L.append('|---|---|')
    for cat, _ in FILES:
        L.append('| %s | %d |' % (cat, s['by_category'].get(cat, 0)))
    L.append('| **Total items** | **%d** |' % s['items'])
    L.append('')
    # One item really is printed on two pages of one book, so the count below is
    # citations rather than items and the wording has to allow for that.
    L.append('%d citations across %d sourcebooks. An item contributes one row per '
             'citation, so anything printed in two books, or on two pages of the same '
             'book, appears more than once.' % (s['citations'], s['sourcebooks']))
    L.append('')
    L.append('## By sourcebook')
    L.append('')
    L.append('Grouped by book (most-cited first), sorted by page within each book, so you '
             'can work through one sourcebook at a time.')
    L.append('')
    for book in order:
        rows = sorted(by_book[book], key=lambda r: (page_key(r[0]), r[1]['name'].lower()))
        L.append('### %s (%d)' % (book, len(rows)))
        L.append('')
        L.append('| Page | Category | Item | Key |')
        L.append('|---|---|---|---|')
        for page, it in rows:
            L.append('| %s | %s | %s | `%s` |'
                     % (page or '--', it['category'], it['name'], it['key']))
        L.append('')
    return '\n'.join(L)


def main():
    ap = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--check', action='store_true',
                    help='report drift and exit 1 instead of writing')
    ap.add_argument('--date', help='date stamp to use (default: today)')
    args = ap.parse_args()

    # Keep the existing stamp on --check so a date change alone is not "drift".
    today = args.date or datetime.date.today().isoformat()
    generated = today
    if args.check and os.path.exists(JSON_PATH):
        try:
            with io.open(JSON_PATH, encoding='utf-8') as f:
                generated = json.load(f)['generated']
        except Exception:
            pass

    items, exempt = collect()
    report = build_json(items, exempt, generated)
    js = json.dumps(report, indent=2, ensure_ascii=False) + '\n'
    md = build_md(report, generated, len(exempt)) + '\n'

    s = report['summary']
    print('%d items missing a description (%s)'
          % (s['items'], ', '.join('%s %d' % (c, s['by_category'].get(c, 0)) for c, _ in FILES)))
    print('%d citations across %d sourcebooks; %d generic placeholders exempt'
          % (s['citations'], s['sourcebooks'], len(exempt)))

    if args.check:
        drift = []
        for path, want in ((JSON_PATH, js), (MD_PATH, md)):
            have = None
            if os.path.exists(path):
                with io.open(path, encoding='utf-8') as f:
                    have = f.read()
            if have != want:
                drift.append(path)
        if drift:
            print('\nout of date: %s' % ', '.join(drift))
            print('run "python audit_descriptions.py" to refresh')
            return 1
        print('\nboth files are up to date')
        return 0

    # Written through a context manager: an unclosed write handle leaves the
    # report flushed only by finalisation, which on a bad day is a truncated file.
    for path, text in ((JSON_PATH, js), (MD_PATH, md)):
        with io.open(path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
    print('\nwrote %s and %s' % (JSON_PATH, MD_PATH))
    return 0


if __name__ == '__main__':
    sys.exit(main())
