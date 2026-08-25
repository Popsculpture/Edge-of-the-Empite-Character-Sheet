"""Read talent-tree routing out of the vector geometry of the trees PDF.

Each page draws one specialization. The small Active/Passive/Ranked square in
every talent box anchors the 4x5 grid, and the connectors between boxes are
plain two-point paths in the gaps. Reading those gives the printed layout
directly instead of guessing at it.

Validated against Padawan Survivor, whose routing was drawn by hand from the
book: the extractor reproduces all 10 horizontal and all 10 vertical links.
"""
import re, sys, json
try: import pypdf
except ImportError: import PyPDF2 as pypdf

NUM = r'(-?\d+(?:\.\d+)?)'
RE_RECT = re.compile(NUM + r'\s+' + NUM + r'\s+' + NUM + r'\s+' + NUM + r'\s+re')
RE_PATH = re.compile(NUM + r'\s+' + NUM + r'\s+m((?:\s+' + NUM + r'\s+' + NUM + r'\s+l)+)')
RE_LINE = re.compile(NUM + r'\s+' + NUM + r'\s+l')

def stream(page):
    return page.get_contents().get_data().decode('latin-1', 'replace')

def markers(s):
    """The little activation squares, one per talent box."""
    out = []
    for m in RE_RECT.finditer(s):
        x, y, w, h = map(float, m.groups())
        if 7.0 <= w <= 10.0 and 7.0 <= h <= 10.0:
            out.append((x, y))
    return out

def two_point_paths(s):
    out = []
    for m in RE_PATH.finditer(s):
        pts = [(float(m.group(1)), float(m.group(2)))]
        for lm in RE_LINE.finditer(m.group(3)):
            pts.append((float(lm.group(1)), float(lm.group(2))))
        if len(pts) == 2:
            out.append((pts[0], pts[1]))
    return out

def cluster(vals, tol):
    """Group nearby values, returning (centre, member count) per group."""
    vals = sorted(vals)
    groups = [[vals[0]]]
    for v in vals[1:]:
        if v - groups[-1][-1] <= tol: groups[-1].append(v)
        else: groups.append([v])
    return [(sum(g) / len(g), len(g)) for g in groups]

def grid_anchors(mk):
    """4 column anchors (ascending x) and 5 row anchors (descending y).

    The page also carries a legend square, which forms a cluster of one. A real
    row or column holds four boxes, so clusters are kept on membership rather
    than on position.
    """
    xs = [c for c, n in cluster([x for x, y in mk], 20) if n >= 3]
    ys = [c for c, n in sorted(cluster([y for x, y in mk], 20), reverse=True) if n >= 3]
    return (xs, ys) if len(xs) == 4 and len(ys) == 5 else (None, None)

def routing(page):
    s = stream(page)
    mk = markers(s)
    xs, ys = grid_anchors(mk)
    if not xs: return None, 'grid not found'
    if len(mk) < 20: return None, f'only {len(mk)} boxes'
    paths = two_point_paths(s)
    conns = [0] * 20
    for (ax, ay), (bx, by) in paths:
        horiz, vert = abs(ay - by) < 1.5, abs(ax - bx) < 1.5
        if horiz and abs(ax - bx) >= 3:
            # A link between columns c and c+1 sits in their gap, on a row band.
            for r, ry in enumerate(ys):
                if abs(ay - ry) > 12: continue
                for c in range(3):
                    if xs[c] < min(ax, bx) and max(ax, bx) < xs[c + 1] + 30:
                        if min(ax, bx) > xs[c] + 40:
                            conns[r*4+c] |= 8; conns[r*4+c+1] |= 4
                break
        elif vert and abs(ay - by) >= 3:
            for c, cx in enumerate(xs):
                if abs(ax - (cx + 48)) > 20: continue     # box centre, not its left edge
                lo, hi = min(ay, by), max(ay, by)
                for r in range(4):
                    if ys[r+1] < lo and hi < ys[r] + 20:
                        conns[r*4+c] |= 2; conns[(r+1)*4+c] |= 1
                break
    return conns, None

def main():
    path = sys.argv[1]
    r = pypdf.PdfReader(path)
    out = {}
    for i, pg in enumerate(r.pages):
        try: txt = ' '.join((pg.extract_text() or '').split())
        except Exception: txt = ''
        conns, err = routing(pg)
        out[i + 1] = { 'head': txt[:90], 'conns': conns, 'err': err }
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
    ok = sum(1 for v in out.values() if v['conns'])
    print(f'{ok} of {len(out)} pages yielded a grid')

if __name__ == '__main__':
    main()
