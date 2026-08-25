"""Turn the extracted Force powers into data/force-powers.js.

Box geometry is reduced to a column, a column span and a row so the app can lay
the tree out without carrying page coordinates around.
"""
import json, re, sys, io

COLX = [50.0, 177.73, 305.45, 433.17]
COLR = [153.82, 281.55, 409.28, 545.0]

SMALL = {'a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'is', 'of', 'on',
         'or', 'the', 'to', 'with'}


def title(s):
    out = []
    for i, w in enumerate(s.split()):
        lw = w.lower()
        out.append(w.capitalize() if (i == 0 or lw not in SMALL) else lw)
    return ' '.join(out)


def key_of(name):
    return 'fp_' + re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')


def glyphs(t):
    """The trees PDF renders the Force symbol with a symbol font, which extracts
    as a bare Y where a point is spent and a bare C where a die is committed.
    Both are only ever preceded by spend/generate or commit wording, so they are
    unambiguous; every other stray letter is left alone because a and s are real
    words in this text."""
    def rep(m):
        return ' '.join(['[FORCE]'] * len(m.group(0)))
    t = re.sub(r'(?<![A-Za-z])Y+(?![A-Za-z])', rep, t)
    t = re.sub(r'(?<![A-Za-z])C+(?![A-Za-z])', rep, t)
    return t


def col_span(x0, x1):
    col = min(range(4), key=lambda c: abs(COLX[c] - x0))
    end = min(range(4), key=lambda c: abs(COLR[c] - x1))
    return col, max(1, end - col + 1)


def main():
    raw = json.load(open(sys.argv[1]))
    out = []
    for p in raw:
        tops = sorted({round(c['y1']) for c in p['cells']}, reverse=True)
        cells = []
        for c in p['cells']:
            col, span = col_span(c['x0'], c['x1'])
            row = min(range(len(tops)), key=lambda i: abs(tops[i] - round(c['y1'])))
            nm = c['name']
            # A box's text can end on the Force glyph and a full stop, which the
            # name pattern then swallows into the NEXT box's name. Hand it back.
            lead = re.match(r'^([A-Z])\.\s+(.*)$', nm)
            if lead and cells:
                cells[-1]['text'] = (cells[-1]['text'] + ' [FORCE].').strip()
                nm = lead.group(2)
            cells.append({'row': row, 'col': col, 'span': span,
                          'name': title(nm), 'xp': c['xp'],
                          'text': glyphs(c['text'])})
        m = re.search(r'(\d+)', p['prereq'])
        out.append({
            'key': key_of(p['name']),
            'name': '/'.join(title(part) for part in p['name'].split('/')).replace(' /', '/').replace('/ ', '/'),
            'prereqRating': int(m.group(1)) if m else 1,
            'source': p['source'],
            'page': p['page'],
            'baseXp': p['baseXp'],
            'baseText': glyphs(p['baseText']),
            'rows': len(tops),
            'cells': cells,
            # 0 is the basic power, 1..n index into cells in the same order.
            'links': p['links'],
        })
    out.sort(key=lambda r: r['name'])
    body = json.dumps(out, ensure_ascii=False, indent=2)
    js = ('window.SW = window.SW || {};\n'
          '// Force powers, read from the printed trees. Box 0 of links is the basic\n'
          '// power; the rest index into cells. An upgrade may only be bought if it\n'
          '// links to the basic power or to an upgrade already owned.\n'
          'window.SW.forcePowers = ' + body + ';\n')
    io.open(sys.argv[2], 'w', encoding='utf-8', newline='').write(js)
    print(f'wrote {len(out)} Force powers')
    for p in out:
        print(f"   {p['name']:20} FR{p['prereqRating']}+  base {p['baseXp']:>2} XP  "
              f"{len(p['cells']):2} upgrades  rows={p['rows']}")


if __name__ == '__main__':
    main()
