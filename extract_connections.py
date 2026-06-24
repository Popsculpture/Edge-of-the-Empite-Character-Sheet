import json, os, xml.etree.ElementTree as ET

SPEC_DIR  = r"C:\Users\Popsc\Downloads\SWCharGen\Data\Specializations"
JSON_PATH = r"C:\Users\Popsc\OneDrive\Documents\Edge of the Empire Character Sheet\data\specializations.json"

specs = json.load(open(JSON_PATH, encoding='utf-8'))

def norm(s):
    return ''.join(c for c in s.lower() if c.isalnum())

spec_by_key  = {norm(s['key']): s for s in specs}
spec_by_name = {norm(s['name']): s for s in specs}

found = 0
not_found = []

for fname in os.listdir(SPEC_DIR):
    if not fname.endswith('.xml'):
        continue
    fpath = os.path.join(SPEC_DIR, fname)
    try:
        root = ET.parse(fpath).getroot()
    except ET.ParseError:
        print(f'  parse error: {fname}')
        continue

    og_key  = (root.findtext('Key') or '').strip()
    og_name = (root.findtext('Name') or '').strip()

    spec = spec_by_key.get(norm(og_key)) or spec_by_name.get(norm(og_name))
    if not spec:
        not_found.append(f'{og_name} ({og_key})')
        continue

    talent_rows = root.find('TalentRows')
    if talent_rows is None:
        not_found.append(f'{og_name} - no TalentRows')
        continue

    rows = sorted(talent_rows.findall('TalentRow'),
                  key=lambda r: int(r.findtext('Index') or 0))

    connections = []
    for row in rows:
        dirs = row.find('Directions')
        if dirs is None:
            connections += [0, 0, 0, 0]
            continue
        for d in dirs.findall('Direction'):
            v = 0
            if d.findtext('Up')    == 'true': v |= 1   # bit 0
            if d.findtext('Down')  == 'true': v |= 2   # bit 1
            if d.findtext('Left')  == 'true': v |= 4   # bit 2
            if d.findtext('Right') == 'true': v |= 8   # bit 3
            connections.append(v)
        # pad row to 4
        while len(connections) % 4:
            connections.append(0)

    # Normalise to exactly 20
    connections = (connections + [0]*20)[:20]
    spec['connections'] = connections
    found += 1

print(f'Matched: {found}  |  Unmatched: {len(not_found)}')
for nf in not_found[:30]:
    print(f'  {nf}')

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(specs, f, ensure_ascii=False, indent=2)

out = ('window.SW = window.SW || {};\nwindow.SW.specializations = '
       + json.dumps(specs, ensure_ascii=False, indent=2) + ';\n')
with open(JSON_PATH.replace('.json', '.js'), 'w', encoding='utf-8') as f:
    f.write(out)

print('Saved specializations.json and specializations.js')
