"""Put the real dice symbols back into the signature ability and Force power text.

The trees PDF draws symbols in EotESymbol-Regular, the same font the app
embeds, so the text layer extracts them as bare letters. The font gives shape
only: b is Boost or Setback, d is Ability or Difficulty, c is Proficiency or
Challenge, and only the fill colour separates each pair. That colour survives
extraction, so every letter is matched back to its symbol by the colour it was
printed in rather than guessed from context.

Which letters are symbols cannot be decided from the text either, because a
lone "a" is usually the English article and "power's" ends in a bare s. So the
stored text is aligned character by character against the page's own character
stream, where the font name says outright whether a letter was drawn in the
symbol font. A record is only rewritten when that alignment accounts for every
symbol the page draws; anything else is reported and left untouched.
"""
import io
import json
import re
import sys
from collections import Counter

import pdfplumber

from swtext import fix_typos

# Colour to symbol, read off the PDF itself by survey_glyphs.py. The three
# shape-sharing pairs are the reason this table has to exist at all.
COLOURED = {
    ('b', '#000000'): 'SETBACK',
    ('b', '#51A1C9'): 'BOOST',
    ('d', '#40174F'): 'DIFFICULTY',
    ('d', '#55803B'): 'ABILITY',
    ('c', '#CD1B1D'): 'CHALLENGE',
    ('c', '#DDCE3F'): 'PROFICIENCY',
}
# Letters whose shape is unique, so colour carries no extra information.
PLAIN = {
    's': 'SUCCESS', 'f': 'FAILURE', 'a': 'ADVANTAGE', 't': 'THREAT',
    'x': 'TRIUMPH', 'y': 'DESPAIR',
    'C': 'FORCE',        # the Force die, the one you commit
    'Y': 'FORCEPOINT',   # a Force point, the one you spend
    'Z': 'LIGHT', 'z': 'DARK',
}

SENT = chr(0xE000)
SPACE = re.compile(r'\s')


def to_hex(col):
    if not isinstance(col, (list, tuple)):
        return None
    v = [float(c) for c in col]
    if len(v) == 1:
        v = v * 3
    elif len(v) == 4:
        c, m, y, k = v
        v = [(1 - c) * (1 - k), (1 - m) * (1 - k), (1 - y) * (1 - k)]
    if len(v) != 3:
        return None
    return '#%02X%02X%02X' % tuple(int(round(x * 255)) for x in v)


def page_stream(pdf, pno):
    """Every non-space character on the page, with its symbol token if it has one."""
    chars, toks = [], []
    for ch in pdf.pages[pno - 1].chars:
        t = ch['text']
        if not t.strip():
            continue
        if 'EotESymbol' in ch['fontname']:
            hexc = to_hex(ch.get('non_stroking_color'))
            toks.append(COLOURED.get((t, hexc)) or PLAIN.get(t) or '?' + t)
        else:
            toks.append(None)
        chars.append(t)
    return ''.join(chars), toks


def fields_of(rec, kind):
    """The record's text fields, in the order they were read off the page."""
    sub = 'cells' if kind == 'force' else 'upgrades'
    return [('baseText', None)] + [(sub, i) for i in range(len(rec.get(sub, [])))]


def get(rec, f):
    key, idx = f
    return rec[key] if idx is None else rec[key][idx]['text']


def put(rec, f, val):
    key, idx = f
    if idx is None:
        rec[key] = val
    else:
        rec[key][idx]['text'] = val


def align(parts, page_text, page_toks):
    """Match every stored character to a page character, in order.

    Box names and prices were dropped when the text was parsed, so page
    characters may be skipped, but never re-visited. Returns one token slot per
    stored non-space character, or None if the text runs off the page.
    """
    out = []
    pi = 0
    for part in parts:
        for sc in part:
            if SPACE.match(sc):
                continue
            want_symbol = (sc == SENT)
            while pi < len(page_text):
                if want_symbol:
                    if page_toks[pi] is not None:
                        break
                elif page_text[pi] == sc:
                    break
                pi += 1
            if pi >= len(page_text):
                return None
            out.append(page_toks[pi])
            pi += 1
    return out


def rewrite(rec, kind, page_text, page_toks, report):
    def note(msg):
        report.append('%-24s p.%-4s %s' % (rec['name'], rec.get('page'), msg))

    on_page = sum(1 for t in page_toks if t is not None)
    if not on_page:
        return 0        # nothing printed in the symbol font, nothing to do

    flds = fields_of(rec, kind)
    parts = [get(rec, f).replace('[FORCE]', SENT) for f in flds]

    slots = align(parts, page_text, page_toks)
    if slots is None:
        note('text ran past the end of the page, left alone')
        return 0

    matched = sum(1 for t in slots if t is not None)
    if matched != on_page:
        note('matched %d of the %d symbols the page draws, left alone' % (matched, on_page))
        return 0

    unknown = sorted({t for t in slots if t and t.startswith('?')})
    if unknown:
        note('glyph(s) %s are not in the symbol map, left alone' % unknown)
        return 0

    k = 0
    total = 0
    for f, part in zip(flds, parts):
        buf = []
        for ch in part:
            if SPACE.match(ch):
                buf.append(ch)
                continue
            tok = slots[k]
            k += 1
            if tok is None:
                buf.append(ch)
            else:
                buf.append('[%s]' % tok)
                total += 1
        # The printed book's typos are corrected only now, because fixing a
        # letter earlier would stop the text lining up with the page.
        put(rec, f, fix_typos(''.join(buf)))
    return total


def load_js(path):
    s = io.open(path, encoding='utf-8').read()
    i = s.index('= [')
    return s[:i + 2], json.loads(s[i + 2:].rstrip().rstrip(';'))


def main():
    pdf_path, force_js, sig_js = sys.argv[1], sys.argv[2], sys.argv[3]
    write = '--write' in sys.argv
    report = []
    tally = Counter()
    with pdfplumber.open(pdf_path) as pdf:
        for path, kind in ((force_js, 'force'), (sig_js, 'sig')):
            head, recs = load_js(path)
            total = ok = 0
            for rec in recs:
                ptext, ptoks = page_stream(pdf, rec['page'])
                got = rewrite(rec, kind, ptext, ptoks, report)
                if got:
                    ok += 1
                    total += got
                    for f in fields_of(rec, kind):
                        for m in re.finditer(r'\[([A-Z]+)\]', get(rec, f)):
                            tally[m.group(1)] += 1
            print('%-32s %2d/%-3d records rewritten, %4d symbols'
                  % (path, ok, len(recs), total))
            if write:
                body = json.dumps(recs, ensure_ascii=False, indent=2)
                io.open(path, 'w', encoding='utf-8', newline='').write(head + body + ';\n')
    print('\nsymbols written: %s' % dict(tally.most_common()))
    if report:
        print('\n%d record(s) left alone:' % len(report))
        for r in report:
            print('   ' + r)
    else:
        print('\nevery record lined up')
    if not write:
        print('\n(dry run, pass --write to save)')


if __name__ == '__main__':
    main()
