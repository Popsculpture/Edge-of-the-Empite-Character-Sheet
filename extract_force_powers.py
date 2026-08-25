"""Read the Force power trees out of the trees PDF.

Unlike a talent tree, a Force power is not a tidy grid: the basic power spans
the page and upgrade boxes can be one, two or four columns wide, so the shape
differs per power. The boxes are drawn as rounded rectangles and the links
between them as plain segments, so both are read as geometry and the links are
resolved box to box rather than against an assumed grid.

Content comes from the page's reading order, which runs top to bottom then left
to right, matching the order the boxes sort into.
"""
import re, json, sys
try:
    import pypdf
except ImportError:
    import PyPDF2 as pypdf

NUM = r'(-?\d+(?:\.\d+)?)'
RE_PATH = re.compile(NUM + r'\s+' + NUM + r'\s+m((?:\s+' + NUM + r'\s+' + NUM + r'\s+[lc])+)')
RE_PT = re.compile(NUM + r'\s+' + NUM + r'\s+[lc]')
RE_BOX = re.compile(r"([A-Z][A-Z0-9' /&.-]{2,60}?)(?:\s+[A-Za-z]{1,6}\s+\d{1,4})?\s+(\d{1,3})\s*XP")

TOL = 4.0


def paths(s):
    out = []
    for m in RE_PATH.finditer(s):
        pts = [(float(m.group(1)), float(m.group(2)))]
        for pm in RE_PT.finditer(m.group(3)):
            pts.append((float(pm.group(1)), float(pm.group(2))))
        out.append(pts)
    return out


def boxes_and_segs(s):
    boxes, segs = [], []
    for p in paths(s):
        xs = [x for x, y in p]
        ys = [y for x, y in p]
        w, h = max(xs) - min(xs), max(ys) - min(ys)
        if len(p) >= 4 and w > 40 and h > 20:
            boxes.append({'x0': min(xs), 'x1': max(xs), 'y0': min(ys), 'y1': max(ys)})
        elif len(p) == 2:
            a, b = p
            if abs(a[0] - b[0]) < 1.5 or abs(a[1] - b[1]) < 1.5:
                segs.append((a, b))
    return boxes, segs


def link_boxes(boxes, segs):
    """A segment joins the two boxes whose facing edges it bridges."""
    links = set()
    for (ax, ay), (bx, by) in segs:
        if abs(ax - bx) < 1.5:
            x, lo, hi = ax, min(ay, by), max(ay, by)
            up = [i for i, b in enumerate(boxes)
                  if abs(b['y0'] - hi) < TOL and b['x0'] - TOL <= x <= b['x1'] + TOL]
            dn = [i for i, b in enumerate(boxes)
                  if abs(b['y1'] - lo) < TOL and b['x0'] - TOL <= x <= b['x1'] + TOL]
            for i in up:
                for j in dn:
                    if i != j:
                        links.add((min(i, j), max(i, j)))
        else:
            y, lo, hi = ay, min(ax, bx), max(ax, bx)
            lf = [i for i, b in enumerate(boxes)
                  if abs(b['x1'] - lo) < TOL and b['y0'] - TOL <= y <= b['y1'] + TOL]
            rt = [i for i, b in enumerate(boxes)
                  if abs(b['x0'] - hi) < TOL and b['y0'] - TOL <= y <= b['y1'] + TOL]
            for i in lf:
                for j in rt:
                    if i != j:
                        links.add((min(i, j), max(i, j)))
    return sorted(links)


def parse(page):
    s = page.get_contents().get_data().decode('latin-1', 'replace')
    boxes, segs = boxes_and_segs(s)
    if len(boxes) < 2:
        return None
    boxes.sort(key=lambda b: (-round(b['y1']), b['x0']))
    links = link_boxes(boxes, segs)

    flat = ' '.join((page.extract_text() or '').split())
    m = re.match(r'^FORCE POWER\s+(.*?)\s+Prerequisite:\s*(Force rating \d+\+)\s+(.*?)'
                 r'\s+Force Power\s+Ranked\s+(.*)$', flat)
    if not m:
        return None
    name, prereq, source, body = (g.strip() for g in m.groups())
    bw, nw = body.split(), name.split()
    if [w.upper() for w in bw[:len(nw)]] == [w.upper() for w in nw]:
        body = ' '.join(bw[len(nw):])
    body = re.sub(r'^BASIC POWER\s+', '', body)
    bm = re.search(r'(\d{1,3})\s*XP', body)
    if not bm:
        return None
    base_xp = int(bm.group(1))
    rest = body[bm.end():]

    found = [{'name': b.group(1).strip(), 'xp': int(b.group(2)),
              'start': b.start(), 'end': b.end()} for b in RE_BOX.finditer(rest)]
    base_text = ' '.join(rest[:found[0]['start']].split()) if found else ' '.join(rest.split())
    for i, b in enumerate(found):
        stop = found[i + 1]['start'] if i + 1 < len(found) else len(rest)
        b['text'] = ' '.join(rest[b['end']:stop].split())
        del b['start'], b['end']

    cells = []
    for i, b in enumerate(boxes[1:]):
        got = found[i] if i < len(found) else {'name': '', 'xp': 0, 'text': ''}
        cells.append({'x0': round(b['x0'], 1), 'x1': round(b['x1'], 1),
                      'y0': round(b['y0'], 1), 'y1': round(b['y1'], 1),
                      'name': got['name'], 'xp': got['xp'], 'text': got['text']})
    return {'name': name, 'prereq': prereq, 'source': source,
            'baseXp': base_xp, 'baseText': base_text,
            'cells': cells, 'links': [list(l) for l in links],
            'boxesFound': len(found), 'slotsFound': len(cells),
            'base': {'x0': round(boxes[0]['x0'], 1), 'x1': round(boxes[0]['x1'], 1)}}


def main():
    r = pypdf.PdfReader(sys.argv[1])
    out, bad = [], []
    for i, pg in enumerate(r.pages):
        flat = ' '.join((pg.extract_text() or '').split())
        if not flat.upper().startswith('FORCE POWER '):
            continue
        d = parse(pg)
        if not d:
            bad.append(i + 1)
            continue
        d['page'] = i + 1
        out.append(d)
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
    print(f'{len(out)} powers extracted, {len(bad)} failed {bad}')
    for d in out:
        adj = {}
        for a, b in d['links']:
            adj.setdefault(a, set()).add(b)
            adj.setdefault(b, set()).add(a)
        seen, st = {0}, [0]
        while st:
            n = st.pop()
            for mn in adj.get(n, ()):
                if mn not in seen:
                    seen.add(mn)
                    st.append(mn)
        orphan = sorted(set(range(1, len(d['cells']) + 1)) - seen)
        flag = ''
        if d['boxesFound'] != d['slotsFound']:
            flag += f"  TEXT/BOX MISMATCH {d['boxesFound']}/{d['slotsFound']}"
        if orphan:
            flag += f"  UNREACHABLE {orphan}"
        print(f"   {d['name']:20} boxes={d['slotsFound']:2} links={len(d['links']):2}{flag}")


if __name__ == '__main__':
    main()
