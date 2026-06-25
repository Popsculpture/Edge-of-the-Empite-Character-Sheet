"""Remove all homebrew content, keep only official FFG material.

Homebrew is identified authoritatively:
  - species / specializations: the curated `homebrew: true` flag.
  - talents: not present in the official SWCharGen Talents.xml AND referenced by no
    official spec tree AND not granted by any official species. (Every such talent
    was verified to appear only in a homebrew spec tree.) Homebrew "addendum" notes
    are stripped from surviving official talents.
  - careers: none are homebrew; references to removed specs are pruned.

Writes both data/<name>.json and data/<name>.js in the existing format, but only if
all referential-integrity checks pass.
"""
import re, json, sys

XML_PATH = r'C:\Users\Popsc\Downloads\SWCharGen\Data\Talents.xml'
ADDENDUM = 'The following is a homebrew expansion'

def load(name):
    return json.load(open(f'data/{name}.json', encoding='utf-8'))

def write_pair(name, data, var):
    with open(f'data/{name}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    out = 'window.SW = window.SW || {};\nwindow.SW.' + var + ' = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n'
    with open(f'data/{name}.js', 'w', encoding='utf-8') as f:
        f.write(out)

def norm(s):
    return re.sub(r'[^a-z0-9]', '', s.lower())

# --- official talent reference set ---
xml = open(XML_PATH, encoding='utf-8-sig').read()
xkeys, xnames = set(), set()
for b in re.findall(r'<Talent>(.*?)</Talent>', xml, re.S):
    k = re.search(r'<Key>(.*?)</Key>', b); n = re.search(r'<Name>(.*?)</Name>', b)
    if k: xkeys.add(k.group(1).strip())
    if n: xnames.add(norm(n.group(1)))

species = load('species'); specs = load('specializations')
careers = load('careers'); talents = load('talents')
orig_talent_norms = {norm(t['name']) for t in talents}

# protected talent names: official XML + official spec trees + official species grants
prot = set(xnames)
for s in specs:
    if s.get('homebrew'): continue
    for row in s.get('talent_tree', []):
        for t in row.get('talents', []):
            if t: prot.add(norm(t))
grant_re = re.compile(r'ranks?\s+(?:of|in)\s+(?:the\s+)?(.+?)\s+talent', re.I)
for sp in species:
    if sp.get('homebrew'): continue
    for ab in sp.get('special_abilities', []):
        for sent in ab.split('.'):
            m = grant_re.search(sent)
            if m: prot.add(norm(m.group(1)))

# --- removals ---
sp_before = len(species)
species = [s for s in species if not s.get('homebrew')]

removed_spec_keys = {s['key'] for s in specs if s.get('homebrew')}
spec_before = len(specs)
specs = [s for s in specs if not s.get('homebrew')]

for c in careers:
    c['specialization_keys'] = [k for k in c.get('specialization_keys', []) if k not in removed_spec_keys]

removed_talents, kept, stripped = [], [], 0
for t in talents:
    if (t['key'] not in xkeys) and (norm(t['name']) not in prot):
        removed_talents.append(t['name']); continue
    d = t.get('description', '')
    i = d.find(ADDENDUM)
    if i >= 0:
        t['description'] = d[:i].rstrip(); stripped += 1
    kept.append(t)
talents = kept

# --- integrity checks ---
kept_norms = {norm(t['name']) for t in talents}
broken = []
for s in specs:
    for row in s.get('talent_tree', []):
        for t in row.get('talents', []):
            if t and norm(t) in orig_talent_norms and norm(t) not in kept_norms:
                broken.append((s['name'], t))
empty_careers = [c['name'] for c in careers if not c['specialization_keys']]
dangling = [(c['name'], k) for c in careers for k in c['specialization_keys'] if k in removed_spec_keys]

print(f'species:       {sp_before} -> {len(species)}  (removed {sp_before-len(species)})')
print(f'specializations: {spec_before} -> {len(specs)}  (removed {len(removed_spec_keys)})')
print(f'talents:       removed {len(removed_talents)}, kept {len(talents)}, addendum notes stripped {stripped}')
print(f'careers:       {len(careers)} (spec refs pruned)')
print(f'INTEGRITY -> broken spec->talent: {len(broken)} | empty careers: {empty_careers} | dangling career->spec: {len(dangling)}')

if broken or empty_careers or dangling:
    print('!! INTEGRITY FAILURE - nothing written')
    print('broken sample:', broken[:10])
    sys.exit(1)

if '--write' in sys.argv:
    write_pair('species', species, 'species')
    write_pair('specializations', specs, 'specializations')
    write_pair('careers', careers, 'careers')
    write_pair('talents', talents, 'talents')
    print('WROTE species, specializations, careers, talents (.json + .js)')
else:
    print('DRY RUN ok (pass --write to apply)')
