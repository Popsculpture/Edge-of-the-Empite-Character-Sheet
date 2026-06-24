import json

specs = json.load(open('data/specializations.json', encoding='utf-8'))

# Confirmed homebrew: name -> source
HOMEBREW = {
    # The reSpecialized Project (all (reSpec) variants)
    # handled below via is_respec flag

    # The Old Republic: An Era Sourcebook
    'Acolyte':              'The Old Republic: An Era Sourcebook',
    'Blademaster':          'The Old Republic: An Era Sourcebook',
    'Cartel Dealer':        'The Old Republic: An Era Sourcebook',
    'Imperial Loyalist':    'The Old Republic: An Era Sourcebook',
    'Lord':                 'The Old Republic: An Era Sourcebook',
    'Mandalorian Crusader': 'The Old Republic: An Era Sourcebook',
    'Sorcerer':             'The Old Republic: An Era Sourcebook',

    # Fires of Resistance
    'Dark Side Cultist':    'Fires of Resistance',
    'First Order Defector': 'Fires of Resistance',
    'First Order Loyalist': 'Fires of Resistance',
    'Seasoned Adventurer':  'Fires of Resistance',

    # Heroes on Both Sides
    'Temple Guardian':      'Heroes on Both Sides',

    # Blockade Runner Folio (reSpecialized sub-project)
    'Blockade Runner':      'Blockade Runner Folio',

    # For Light and Life
    'RDC Navigator':        'For Light and Life',
    'RDC Officer':          'For Light and Life',
    'RDC Peacekeeper':      'For Light and Life',

    # Jedi career (fan-made - no official FFG career named Jedi)
    'Jedi Archivist':       'Jedi Career (fan-made)',
    'Jedi Explorer':        'Jedi Career (fan-made)',
    'Jedi Wayseeker':       'Jedi Career (fan-made)',
    'Knight':               'Jedi Career (fan-made)',
    'Master':               'Jedi Career (fan-made)',
    'Padawan':              'Jedi Career (fan-made)',
    'Padawan Survivor':     'Jedi Career (fan-made)',

    # High Republic fan content
    'Shipwright (High Republic)': 'High Republic fan supplement',
    'Trader (High Republic)':     'High Republic fan supplement',

    # NOTE: Colossus (KoF), Force Adherent (DoR), Imperial Academy Cadet (DoR),
    # Magus (Unlimited Power), Retired Clone Trooper (DoR) are all confirmed official FFG.
}

flagged = 0
for sp in specs:
    if sp.get('is_respec'):
        sp['homebrew'] = True
        sp['homebrew_source'] = 'The reSpecialized Project'
        flagged += 1
    elif sp['name'] in HOMEBREW:
        sp['homebrew'] = True
        sp['homebrew_source'] = HOMEBREW[sp['name']]
        flagged += 1
    else:
        sp['homebrew'] = False
        sp['homebrew_source'] = ''

print(f'Flagged {flagged} homebrew specs out of {len(specs)} total')

with open('data/specializations.json', 'w', encoding='utf-8') as f:
    json.dump(specs, f, ensure_ascii=False, indent=2)

out = 'window.SW = window.SW || {};\nwindow.SW.specializations = ' + json.dumps(specs, ensure_ascii=False, indent=2) + ';\n'
with open('data/specializations.js', 'w', encoding='utf-8') as f:
    f.write(out)

print('Saved specializations.json and specializations.js')
