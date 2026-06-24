# Scrape real item descriptions for weapons / armor / gear from the FFG wiki and
# cache them to data/equipment_descriptions.json (keyed by exact wiki title).
# extract_equipment.py reads that cache and injects a `description` field.
import requests, re, json, os, time

BASE = 'https://star-wars-rpg-ffg.fandom.com/api.php'
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
OUT = os.path.join(os.path.dirname(__file__), 'data', 'equipment_descriptions.json')


def category_members(cat):
    out, cont = [], None
    while True:
        p = {'action': 'query', 'list': 'categorymembers', 'cmtitle': f'Category:{cat}',
             'cmlimit': '500', 'cmnamespace': '0', 'format': 'json'}
        if cont:
            p['cmcontinue'] = cont
        r = requests.get(BASE, params=p, headers=H, timeout=30).json()
        out += [m['title'] for m in r.get('query', {}).get('categorymembers', [])]
        if 'continue' in r:
            cont = r['continue']['cmcontinue']
        else:
            break
    return out


def fetch_wikitexts(titles):
    """title -> wikitext, 50 titles per request."""
    res = {}
    for i in range(0, len(titles), 50):
        batch = titles[i:i + 50]
        p = {'action': 'query', 'prop': 'revisions', 'rvprop': 'content', 'rvslots': 'main',
             'titles': '|'.join(batch), 'format': 'json'}
        r = requests.get(BASE, params=p, headers=H, timeout=40).json()
        for pid, pg in r.get('query', {}).get('pages', {}).items():
            revs = pg.get('revisions', [])
            if revs:
                wt = revs[0].get('slots', {}).get('main', {}).get('*') or revs[0].get('*', '')
                res[pg['title']] = wt
        print(f'  {min(i + 50, len(titles))}/{len(titles)}', flush=True)
        time.sleep(0.1)
    return res


def clean(t):
    if not t:
        return ''
    t = re.sub(r'<ref[^>]*?/>', '', t)
    t = re.sub(r'<ref[^>]*?>.*?</ref>', '', t, flags=re.DOTALL)
    t = re.sub(r'<blockquote>.*?</blockquote>', '', t, flags=re.DOTALL | re.IGNORECASE)
    t = re.sub(r'<references\s*/?>', '', t)
    t = re.sub(r'\[\[File:[^\]]*\]\]', '', t)
    t = re.sub(r'\[\[Category:[^\]]*\]\]', '', t)
    t = re.sub(r"'''Models Include:'''[^\n]*", '', t)
    t = re.sub(r'\{\{[^{}]*\}\}', '', t)
    t = re.sub(r'={2,}[^=\n]*={2,}', '', t)               # headings
    t = re.sub(r'\[\[[^\]|]*\|([^\]]+)\]\]', r'\1', t)    # [[link|text]] -> text
    t = re.sub(r'\[\[([^\]]+)\]\]', r'\1', t)             # [[text]] -> text
    t = re.sub(r"'{2,}", '', t)                            # bold / italic
    t = re.sub(r'<[^>]+>', '', t)                          # stray tags
    lines = [l.strip() for l in t.splitlines()]
    t = ' '.join(l for l in lines if l)
    return re.sub(r'\s+', ' ', t).strip()


def extract_description(wt):
    if not wt:
        return ''
    lead = clean(re.split(r'\n==', wt, 1)[0])
    body = ''
    m = re.search(r'\[\[File:\s*Profile[^\]]*\]\]', wt)
    if m:
        body = clean(re.split(r'<references', wt[m.end():], 1)[0])
    # Prefer the lead flavor; append the mechanical body when the lead is thin.
    desc = lead
    if body and (len(lead) < 120):
        desc = (lead + ' ' + body).strip() if lead else body
    # Trim to a sensible length on a sentence boundary
    if len(desc) > 900:
        cut = desc.rfind('.', 0, 900)
        desc = desc[:cut + 1] if cut > 400 else desc[:900].rstrip() + '...'
    return desc.strip()


def main():
    print('Fetching Category:Equipment members...')
    titles = sorted(set(category_members('Equipment')))
    print(f'  {len(titles)} pages')
    print('Fetching wikitexts...')
    wts = fetch_wikitexts(titles)
    print('Extracting descriptions...')
    out = {}
    for title, wt in wts.items():
        d = extract_description(wt)
        if d:
            out[title] = d
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f'  wrote {len(out)} descriptions -> {OUT}')


if __name__ == '__main__':
    main()
