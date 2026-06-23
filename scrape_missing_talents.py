# Scrape descriptions for spec-tree talents not in talents.json, then merge them in.
import requests, json, re, time

BASE = 'https://star-wars-rpg-ffg.fandom.com/api.php'
HEADS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}


# ── helpers ───────────────────────────────────────────────────────────────────

def strip_wiki(text):
    t = re.sub(r'<ref[^/]*/>', '', text)
    t = re.sub(r'<ref[^>]*>.*?</ref>', '', t, flags=re.DOTALL)
    t = re.sub(r'<references\s*/?>', '', t)
    t = re.sub(r'\[\[[^\]|]*\|([^\]]+)\]\]', r'\1', t)
    t = re.sub(r'\[\[([^\]]+)\]\]', r'\1', t)
    t = re.sub(r"'{2,}", '', t)
    t = re.sub(r'\[https?://\S+\s+([^\]]+)\]', r'\1', t)
    return t


def parse_section(wikitext):
    """Return (activation, ranked, description) from a section body."""
    activation = 'Passive'
    ranked = False
    m = re.search(r"\*'''Activation:'''\s*(.+)", wikitext)
    if m:
        activation = strip_wiki(m.group(1)).strip()
    m = re.search(r"\*'''Ranked:'''\s*(.+)", wikitext)
    if m:
        ranked = 'yes' in m.group(1).lower()

    body = re.sub(r'^\*.*$', '', wikitext, flags=re.MULTILINE)
    body = re.sub(r'\[\[Category:[^\]]*\]\]', '', body)
    body = re.sub(r'={2,}[^=\n]*={2,}', '', body)
    body = strip_wiki(body)
    desc = ' '.join(body.split()).strip()
    return activation, ranked, desc


def parse_full_page(wikitext, base_name):
    """Return list of dicts: [{name, activation, ranked, description}, ...]"""
    results = []

    # Split into level-2 sections (==...==) which are the talent variants
    # First handle the main section (before any ===...===)
    parts = re.split(r'(===+\s*.*?\s*===+)', wikitext)
    main_body = parts[0]
    # Remove the top-level == heading ==
    main_body = re.sub(r'^==+[^\n]*==+', '', main_body, flags=re.MULTILINE)

    act, rnk, desc = parse_section(main_body)
    if desc:
        results.append({'name': base_name, 'activation': act, 'ranked': rnk, 'description': desc})

    # Subsections: ===Improved=== / ===Supreme===
    for i in range(1, len(parts) - 1, 2):
        heading_raw = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ''
        heading = re.sub(r'<ref[^>]*>.*?</ref>', '', heading_raw, flags=re.DOTALL)
        heading = re.sub(r'<ref[^/]*/>', '', heading)
        heading = re.sub(r'={2,}', '', heading).strip()
        if heading.lower() in ('improved', 'supreme'):
            act2, rnk2, desc2 = parse_section(body)
            if desc2:
                variant = f'{base_name} ({heading.capitalize()})'
                results.append({'name': variant, 'activation': act2, 'ranked': rnk2, 'description': desc2})

    return results


def search_page(query):
    """Return (pageid, title) for top wiki search result, or (None, None)."""
    r = requests.get(BASE, params={
        'action': 'query', 'list': 'search',
        'srsearch': query, 'format': 'json', 'srlimit': 1,
    }, headers=HEADS, timeout=15)
    hits = r.json().get('query', {}).get('search', [])
    if hits:
        return hits[0]['pageid'], hits[0]['title']
    return None, None


def fetch_wikitext(pageid):
    r = requests.get(BASE, params={
        'action': 'query', 'prop': 'revisions', 'rvprop': 'content',
        'pageids': str(pageid), 'format': 'json',
    }, headers=HEADS, timeout=20)
    page = r.json()['query']['pages'].get(str(pageid), {})
    revs = page.get('revisions', [])
    return revs[0]['*'] if revs else ''


# ── collect missing names ─────────────────────────────────────────────────────

def collect_missing():
    talents = json.load(open('data/talents.json', encoding='utf-8'))
    specs   = json.load(open('data/specializations.json', encoding='utf-8'))
    existing = {t['name'].lower(): t for t in talents}

    tree_names = set()
    for sp in specs:
        for row in sp.get('talent_tree', []):
            for t in row.get('talents', []):
                if t:
                    # Skip wiki-markup artifacts
                    if '[[' in t or ']]' in t:
                        continue
                    tree_names.add(t.strip())

    missing = sorted(n for n in tree_names if n.lower() not in existing)
    return talents, existing, missing


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    talents, existing, missing = collect_missing()
    print(f'{len(missing)} missing talent names to resolve')

    # Cache of pageid -> parsed results, keyed by pageid to avoid double-fetching
    page_cache = {}   # pageid -> [parsed entries]
    new_entries = {}  # name.lower() -> talent dict

    # For Improved/Supreme: strip the prefix to find the base page
    def base_of(name):
        m = re.match(r'^(Improved|Supreme)\s+(.+)$', name, re.IGNORECASE)
        if m:
            return m.group(2), m.group(1).capitalize()
        return name, None

    # First pass: group names to minimise requests
    # Build: base_name -> list of (full_name, variant_label)
    from collections import defaultdict
    groups = defaultdict(list)
    for name in missing:
        base, variant = base_of(name)
        groups[base].append((name, variant))

    total = len(groups)
    done = 0

    for base, variants in groups.items():
        done += 1
        # Try: "<base> talent" search first
        pid, title = search_page(f'{base} talent')
        if not pid:
            # Try plain name
            pid, title = search_page(base)
        if not pid:
            print(f'  [{done}/{total}] NOT FOUND: {base!r}')
            continue

        if pid not in page_cache:
            wikitext = fetch_wikitext(pid)
            time.sleep(0.12)
            # Derive base name from page title (strip " talent" suffix)
            page_base = re.sub(r'\s+talent$', '', title, flags=re.IGNORECASE).strip()
            page_cache[pid] = parse_full_page(wikitext, page_base)

        parsed = page_cache[pid]   # list of {name, activation, ranked, description}
        parsed_map = {e['name'].lower(): e for e in parsed}

        for (full_name, variant_label) in variants:
            # Try exact match first
            entry = parsed_map.get(full_name.lower())
            if not entry:
                # Try matching just the variant label against subsections
                if variant_label:
                    # e.g. full_name = "Improved Full Throttle", look for base "Full Throttle (Improved)"
                    page_base = parsed[0]['name'] if parsed else base
                    candidate = f'{page_base} ({variant_label})'
                    entry = parsed_map.get(candidate.lower())
            if entry and full_name.lower() not in existing:
                new_entries[full_name.lower()] = {
                    'key': re.sub(r'[^A-Z0-9]', '', full_name.upper())[:12],
                    'name': full_name,
                    'ranked': entry['ranked'],
                    'activation': entry['activation'],
                    'description': entry['description'],
                }
                print(f'  [{done}/{total}] OK  {full_name}: {entry["description"][:60]}...')
            elif full_name.lower() not in existing:
                print(f'  [{done}/{total}] MISS {full_name!r} (page: {title!r})')

    print(f'\nFound descriptions for {len(new_entries)} new talents')

    # Merge into talents list
    for entry in new_entries.values():
        talents.append(entry)

    talents.sort(key=lambda t: t['name'].lower())

    with open('data/talents.json', 'w', encoding='utf-8') as f:
        json.dump(talents, f, ensure_ascii=False, indent=2)

    out = 'window.SW = window.SW || {};\nwindow.SW.talents = ' + json.dumps(talents, ensure_ascii=False, indent=2) + ';\n'
    with open('data/talents.js', 'w', encoding='utf-8') as f:
        f.write(out)

    print(f'Saved. talents.json now has {len(talents)} entries.')

    # Report still-missing
    _, _, still_missing = collect_missing()
    if still_missing:
        print(f'\n{len(still_missing)} still unresolved after scrape:')
        for n in still_missing:
            print(f'  {n!r}')


if __name__ == '__main__':
    main()
