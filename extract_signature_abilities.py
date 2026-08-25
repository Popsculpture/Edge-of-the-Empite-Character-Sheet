"""Read the signature ability trees out of the trees PDF.

All 38 pages share one shape: four attachment nodes across the top, a basic
form spanning the first row, and two rows of four upgrades. Per Enter the
Unknown p.34, the active nodes name the bottom-row talents of the destination
tree the character must already own, and an upgrade may only be bought if it
connects to the basic form or to an upgrade already bought.

Content comes from the page's reading order, which runs row by row and left to
right. Connections come from the vector geometry, the same way the talent tree
routing does.
"""
import re, json, sys
try:
    import pypdf
except ImportError:
    import PyPDF2 as pypdf

NUM = r'(-?\d+(?:\.\d+)?)'
RE_RECT = re.compile(NUM + r'\s+' + NUM + r'\s+' + NUM + r'\s+' + NUM + r'\s+re')
RE_PATH = re.compile(NUM + r'\s+' + NUM + r'\s+m((?:\s+' + NUM + r'\s+' + NUM + r'\s+l)+)')
RE_LINE = re.compile(NUM + r'\s+' + NUM + r'\s+l')

COLX = [(50, 153.82), (177.73, 281.55), (305.45, 409.28), (433.17, 537.0)]
CENT = [(a + b) / 2 for a, b in COLX]

# Each box opens with its name in capitals and its price. Some pages print a
# source shorthand and page between the two, so that is allowed for.
RE_BOX = re.compile(r"([A-Z][A-Z0-9' /&.-]{2,60}?)(?:\s+[A-Za-z]{1,6}\s+\d{1,4})?\s+(\d{1,3})\s*XP")


def paths(s):
    out = []
    for m in RE_PATH.finditer(s):
        pts = [(float(m.group(1)), float(m.group(2)))]
        for lm in RE_LINE.finditer(m.group(3)):
            pts.append((float(lm.group(1)), float(lm.group(2))))
        if len(pts) == 2:
            out.append((pts[0], pts[1]))
    return out


def cluster(vals, tol=14):
    vals = sorted(vals, reverse=True)
    groups = [[vals[0]]]
    for v in vals[1:]:
        if groups[-1][-1] - v <= tol:
            groups[-1].append(v)
        else:
            groups.append([v])
    return [sum(g) / len(g) for g in groups]


def col_of(x):
    for c, cx in enumerate(CENT):
        if abs(x - cx) < 14:
            return c
    return None


def geometry(page):
    s = page.get_contents().get_data().decode('latin-1', 'replace')
    segs = [(a, b) for a, b in paths(s) if abs(a[0] - b[0]) < 1.5 or abs(a[1] - b[1]) < 1.5]
    rects = [tuple(map(float, m.groups())) for m in RE_RECT.finditer(s)]
    mk = [(x, y) for x, y, w, h in rects if 7 <= w <= 10 and 7 <= h <= 10 and x < 520]
    rows = cluster([y for x, y in mk])
    if len(rows) != 3:
        return None
    base_y, r1_y, r2_y = rows

    nodes = [False] * 4
    base_down = [False] * 4
    r1_to_r2 = [False] * 4
    for (ax, ay), (bx, by) in segs:
        if abs(ax - bx) > 1.5:
            continue                                   # keep verticals only
        c = col_of(ax)
        if c is None:
            continue
        lo, hi = min(ay, by), max(ay, by)
        if hi > base_y + 20:
            nodes[c] = True                            # stub above the basic form
        elif hi < base_y and lo > r1_y:
            base_down[c] = True                        # basic form down to row 1
        elif hi < r1_y and lo > r2_y:
            r1_to_r2[c] = True                         # row 1 down to row 2

    def hlink(row_y):
        got = [False] * 3
        for (ax, ay), (bx, by) in segs:
            if abs(ay - by) > 1.5 or abs(ax - bx) < 3:
                continue
            if not (row_y - 8 <= ay <= row_y + 32):
                continue
            for c in range(3):
                if COLX[c][1] - 6 <= min(ax, bx) and max(ax, bx) <= COLX[c + 1][0] + 6:
                    got[c] = True
        return got

    return {'nodes': nodes, 'baseDown': base_down,
            'row1h': hlink(r1_y), 'row2h': hlink(r2_y), 'row1to2': r1_to_r2}


def parse_text(flat):
    m = re.match(r'^(.*?)\s+SIGNATURE ABILITY TREE\s+(.*?)\s+Active\s+Passive\s+Ranked\s+(.*)$', flat)
    if not m:
        return None
    career, head, body = (g.strip() for g in m.groups())

    # The name is printed twice, in the heading and again above the basic form,
    # so the words the two share are the name. What trails it in the heading is
    # the source book, and what trails it in the body is an optional "BASE
    # ABILITY" label and source shorthand, both of which vary page to page.
    hw, bw = head.split(), body.split()
    n = 0
    while n < len(hw) and n < len(bw) and hw[n].upper() == bw[n].upper():
        n += 1
    if not n:
        return None
    name = ' '.join(hw[:n])
    source = ' '.join(hw[n:])
    rest = ' '.join(bw[n:])

    # The first price after the name is the basic form's.
    bm = re.search(r'(\d{1,3})\s*XP', rest)
    if not bm:
        return None
    base_xp = int(bm.group(1))
    body2 = rest[bm.end():]

    boxes = [{'name': b.group(1).strip(), 'xp': int(b.group(2)),
              'start': b.start(), 'end': b.end()} for b in RE_BOX.finditer(body2)]
    base_text = ' '.join(body2[:boxes[0]['start']].split()) if boxes else ' '.join(body2.split())
    for i, b in enumerate(boxes):
        stop = boxes[i + 1]['start'] if i + 1 < len(boxes) else len(body2)
        b['text'] = ' '.join(body2[b['end']:stop].split())
        del b['start'], b['end']
    return {'career': career, 'name': name, 'source': source,
            'baseXp': base_xp, 'baseText': base_text, 'upgrades': boxes}


# One box on Desperate Allies 41 has a name that does not render in the PDF's
# text layer. Its printed text is the standard Destiny wording, which 26 other
# signature abilities carry under the name DESTINY, so it is restored by that
# evidence rather than left as a hole.
TEXT_GAPS = {
    ('DIPLOMAT', 'UNMATCHED INSIGHT'): [
        (5, {'name': 'DESTINY', 'xp': 15,
             'text': 'Unmatched Insight costs 1 Destiny Point instead of 2.'}),
    ],
}


def repair(rec):
    for at, box in TEXT_GAPS.get((rec['career'], rec['name']), []):
        if len(rec['upgrades']) < 8:
            rec['upgrades'].insert(at, dict(box))
            rec['repaired'] = True
    return rec


def main():
    r = pypdf.PdfReader(sys.argv[1])
    out, bad = [], []
    for i, pg in enumerate(r.pages):
        flat = ' '.join((pg.extract_text() or '').split())
        if 'SIGNATURE ABILITY TREE' not in flat.upper():
            continue
        geo, txt = geometry(pg), parse_text(flat)
        if not geo or not txt:
            bad.append((i + 1, 'geometry' if not geo else 'text'))
            continue
        rec = dict(txt)
        rec.update(geo)
        rec['page'] = i + 1
        out.append(repair(rec))
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
    print(f'{len(out)} extracted, {len(bad)} failed')
    for pg, why in bad:
        print(f'   p.{pg} failed on {why}')


if __name__ == '__main__':
    main()
