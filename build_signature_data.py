"""Turn the extracted signature abilities into data/signature-abilities.js."""
import json, re, sys, io

CAREER_KEYS = {
    'ACE': 'THEACE', 'BOUNTY HUNTER': 'BOUNT', 'CLONE SOLDIER': 'CLONE',
    'COLONIST': 'COLO', 'COMMANDER': 'COMMANDER', 'CONSULAR': 'CONSULAR',
    'DIPLOMAT': 'DIPLOMAT', 'ENGINEER': 'ENGINEER', 'EXPLORER': 'EXPLORER',
    'GUARDIAN': 'GUARD', 'HIRED GUN': 'HIREDGUN', 'JEDI': 'JEDI',
    'MYSTIC': 'MYSTIC', 'SEEKER': 'SEEKER', 'SENTINEL': 'SENTINEL',
    'SMUGGLER': 'SMUG', 'SOLDIER': 'SOLDIER', 'SPY': 'SPY',
    'TECHNICIAN': 'TECHNICIAN', 'WARRIOR': 'WAR',
}

SMALL = {'a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'is', 'of', 'on',
         'or', 'the', 'to', 'with'}


def title(s):
    words = s.split()
    out = []
    for i, w in enumerate(words):
        lw = w.lower()
        out.append(w.capitalize() if (i == 0 or lw not in SMALL) else lw)
    return ' '.join(out)


def key_of(name):
    return 'sig_' + re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')


def main():
    raw = json.load(open(sys.argv[1]))
    out = []
    for a in raw:
        ck = CAREER_KEYS.get(a['career'])
        if not ck:
            raise SystemExit(f'unmapped career: {a["career"]}')
        ups = []
        for i, u in enumerate(a['upgrades']):
            ups.append({'row': i // 4, 'col': i % 4, 'name': title(u['name']),
                        'xp': u['xp'], 'text': u['text']})
        out.append({
            'key': key_of(a['name']),
            'name': title(a['name']),
            'careerKey': ck,
            'source': a['source'],
            'page': a['page'],
            'nodes': a['nodes'],
            'baseXp': a['baseXp'],
            'baseText': a['baseText'],
            'upgrades': ups,
            'links': {'baseDown': a['baseDown'], 'row1h': a['row1h'],
                      'row2h': a['row2h'], 'row1to2': a['row1to2']},
        })
    out.sort(key=lambda r: (r['careerKey'], r['name']))
    body = json.dumps(out, ensure_ascii=False, indent=2)
    js = ('window.SW = window.SW || {};\n'
          '// Signature abilities, read from the printed trees. Each is attached to the\n'
          '// bottom of one in-career specialization; the active nodes name the bottom-row\n'
          '// talents that tree must already have (Enter the Unknown p.34).\n'
          'window.SW.signatureAbilities = ' + body + ';\n')
    io.open(sys.argv[2], 'w', encoding='utf-8', newline='').write(js)
    print(f'wrote {len(out)} signature abilities')


if __name__ == '__main__':
    main()
