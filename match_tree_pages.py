"""Map each PDF page to the specialization it draws.

Headers read "CAREER SPEC NAME Career Skills: ..." or "UNIVERSAL SPEC NAME ...",
so the spec name is whatever sits between the career prefix and the first field
label. Leading words are dropped one at a time until a name matches, which
handles both a career prefix and specs whose printed name repeats it.
"""
import json, re, sys

def norm(s): return re.sub(r'[^a-z0-9]', '', (s or '').lower())

def main():
    raw = json.load(open(sys.argv[1]))
    specs = json.load(open(sys.argv[2], encoding='utf-8'))
    by = {norm(s['name']): s for s in specs}

    STOP = re.compile(r'\b(Career Skills:|Bonus Career Skills:|Gain:|SIGNATURE ABILITY|FORCE POWER)', re.I)
    out, unmatched, dupes = {}, [], {}
    for pg, v in sorted(raw.items(), key=lambda kv: int(kv[0])):
        if not v['conns']: continue
        head = v['head']
        m = STOP.search(head)
        prefix = (head[:m.start()] if m else head[:60]).strip()
        words = prefix.split()
        hit = None
        for start in range(len(words)):
            cand = ' '.join(words[start:])
            if norm(cand) in by: hit = by[norm(cand)]; break
        if not hit:
            unmatched.append((pg, prefix)); continue
        if hit['key'] in dupes:
            dupes[hit['key']].append(pg)
        else:
            dupes[hit['key']] = [pg]
        out[hit['key']] = v['conns']
    json.dump(out, open(sys.argv[3], 'w'), indent=1)
    print(f'matched {len(out)} specializations')
    if unmatched:
        print(f'unmatched ({len(unmatched)}):')
        for pg, p in unmatched: print(f'   p.{pg}  "{p}"')
    multi = {k: v for k, v in dupes.items() if len(v) > 1}
    if multi: print('MULTIPLE PAGES for one spec:', multi)

if __name__ == '__main__':
    main()
