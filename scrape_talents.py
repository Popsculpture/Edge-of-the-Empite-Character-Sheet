# Scrape talent descriptions from FFG wiki and update talents.json
import requests, json, re, time

BASE = 'https://star-wars-rpg-ffg.fandom.com/api.php'
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}


def clean(wikitext):
    """Strip wiki markup from a text chunk, return plain description string."""
    t = re.sub(r'<ref[^/]*/>', '', wikitext)
    t = re.sub(r'<ref[^>]*>.*?</ref>', '', t, flags=re.DOTALL)
    t = re.sub(r'<references\s*/?>', '', t)
    t = re.sub(r'\[\[[^\]|]*\|([^\]]+)\]\]', r'\1', t)
    t = re.sub(r'\[\[([^\]]+)\]\]', r'\1', t)
    t = re.sub(r"'{2,}", '', t)
    t = re.sub(r'\[https?://\S+\s+([^\]]+)\]', r'\1', t)
    lines = [l.strip() for l in t.splitlines() if l.strip() and not l.strip().startswith('*')]
    return ' '.join(lines).strip()


def parse_page(wikitext, base_name):
    """Return dict of {talent_name: description} for base + Improved + Supreme."""
    results = {}
    # Split into sections by === heading ===
    sections = re.split(r'===+\s*(.*?)\s*===+', wikitext)
    # sections[0] = content before first ===heading===
    # sections[1,3,5,...] = heading text; sections[2,4,6,...] = section body

    # Base description: from sections[0], after bullet lines
    base_text = sections[0]
    # Remove the == main heading ==
    base_text = re.sub(r'==+[^=]*==+', '', base_text)
    # Remove bullet lines (activation, ranked, trees)
    base_text = re.sub(r'^\*.*$', '', base_text, flags=re.MULTILINE)
    # Remove [[Category:...]] lines
    base_text = re.sub(r'\[\[Category:[^\]]*\]\]', '', base_text)
    desc = clean(base_text)
    if desc:
        results[base_name] = desc

    # Subsections
    for i in range(1, len(sections) - 1, 2):
        heading = sections[i].strip()
        body = sections[i + 1] if i + 1 < len(sections) else ''
        # headings like "Improved", "Improved<ref...>", "Supreme", etc.
        heading_clean = re.sub(r'<ref[^>]*>.*?</ref>', '', heading, flags=re.DOTALL).strip()
        heading_clean = re.sub(r'<ref[^/]*/>', '', heading_clean).strip()
        if heading_clean.lower() in ('improved', 'supreme'):
            body_text = re.sub(r'^\*.*$', '', body, flags=re.MULTILINE)
            body_text = re.sub(r'\[\[Category:[^\]]*\]\]', '', body_text)
            sub_desc = clean(body_text)
            if sub_desc:
                variant_name = f'{base_name} ({heading_clean.capitalize()})'
                results[variant_name] = sub_desc

    return results


def get_all_category_pages():
    all_members = []
    cmcontinue = None
    while True:
        params = {
            'action': 'query', 'list': 'categorymembers',
            'cmtitle': 'Category:Talents', 'cmlimit': '500', 'format': 'json',
        }
        if cmcontinue:
            params['cmcontinue'] = cmcontinue
        r = requests.get(BASE, params=params, headers=HEADERS, timeout=20)
        data = r.json()
        members = data.get('query', {}).get('categorymembers', [])
        all_members.extend(members)
        if 'continue' in data:
            cmcontinue = data['continue']['cmcontinue']
        else:
            break
    return all_members


def fetch_wikitexts(page_ids):
    """Fetch raw wikitext for a list of page IDs, 50 at a time."""
    results = {}
    BATCH = 50
    for i in range(0, len(page_ids), BATCH):
        batch = page_ids[i:i + BATCH]
        params = {
            'action': 'query', 'prop': 'revisions',
            'rvprop': 'content', 'pageids': '|'.join(str(p) for p in batch),
            'format': 'json',
        }
        r = requests.get(BASE, params=params, headers=HEADERS, timeout=30)
        pages = r.json().get('query', {}).get('pages', {})
        for pid_str, page in pages.items():
            revs = page.get('revisions', [])
            if revs:
                results[int(pid_str)] = revs[0].get('*', '')
        pct = min(i + BATCH, len(page_ids)) * 100 // len(page_ids)
        print(f'  {min(i+BATCH, len(page_ids))}/{len(page_ids)} ({pct}%)', flush=True)
        time.sleep(0.15)
    return results


def main():
    print('Step 1: Getting Category:Talents members...')
    members = get_all_category_pages()
    print(f'  Found {len(members)} pages')
    title_map = {m['pageid']: m['title'] for m in members}
    page_ids = list(title_map.keys())

    print('Step 2: Fetching all wikitexts...')
    wikitexts = fetch_wikitexts(page_ids)

    print('Step 3: Parsing descriptions...')
    wiki_descs = {}
    for pid, wikitext in wikitexts.items():
        title = title_map.get(pid, '')
        # Strip " talent" suffix (case insensitive)
        base_name = re.sub(r'\s+talent$', '', title, flags=re.IGNORECASE).strip()
        parsed = parse_page(wikitext, base_name)
        wiki_descs.update(parsed)

    print(f'  Got {len(wiki_descs)} descriptions (base + improved/supreme)')

    # Load our talents data
    data_path = 'data/talents.json'
    with open(data_path, encoding='utf-8') as f:
        talents = json.load(f)

    # Build lookup: exact name -> wiki desc, plus title-cased fallback
    def lookup(name):
        if name in wiki_descs:
            return wiki_descs[name]
        # Try title case
        tc = name.title()
        if tc in wiki_descs:
            return wiki_descs[tc]
        # Try with (Improved) -> (improved)
        lower_key = name.replace('(Improved)', '(Improved)').replace('(Supreme)', '(Supreme)')
        if lower_key in wiki_descs:
            return wiki_descs[lower_key]
        return None

    print('Step 4: Matching to talents.json...')
    matched = 0
    for t in talents:
        desc = lookup(t['name'])
        if desc:
            t['description'] = desc
            matched += 1
        # else keep existing "Please see page..." description

    print(f'  Matched {matched}/{len(talents)} talents with real descriptions')

    # Save updated data
    with open(data_path, 'w', encoding='utf-8') as f:
        json.dump(talents, f, ensure_ascii=False, indent=2)
    print(f'  Saved {data_path}')

    # Report unmatched
    unmatched = [t['name'] for t in talents if not lookup(t['name'])]
    print(f'\n{len(unmatched)} still unmatched:')
    for name in unmatched:
        print(f'  {name!r}')


if __name__ == '__main__':
    main()
