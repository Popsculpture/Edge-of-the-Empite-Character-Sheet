import json

specs = json.load(open('data/specializations.json', encoding='utf-8'))

# Authoritative homebrew list. Any spec not here is official (or unknown) -- do NOT flag it.
HOMEBREW = {
    # [S1] The reSpecialized Project
    'Archaeologist (reSpec)':    'The reSpecialized Project',
    'Assassin (reSpec)':         'The reSpecialized Project',
    'Big Game Hunter (reSpec)':  'The reSpecialized Project',
    'Bodyguard (reSpec)':        'The reSpecialized Project',
    'Charmer (reSpec)':          'The reSpecialized Project',
    'Cyber Tech (reSpec)':       'The reSpecialized Project',
    'Demolitionist (reSpec)':    'The reSpecialized Project',
    'Doctor (reSpec)':           'The reSpecialized Project',
    'Driver (reSpec)':           'The reSpecialized Project',
    'Droid Tech (reSpec)':       'The reSpecialized Project',
    'Enforcer (reSpec)':         'The reSpecialized Project',
    'Entrepreneur (reSpec)':     'The reSpecialized Project',
    'Fringer (reSpec)':          'The reSpecialized Project',
    'Gadgeteer (reSpec)':        'The reSpecialized Project',
    'Gambler (reSpec)':          'The reSpecialized Project',
    'Gunslinger (reSpec)':       'The reSpecialized Project',
    'Heavy (reSpec)':            'The reSpecialized Project',
    'Marauder (reSpec)':         'The reSpecialized Project',
    'Marshal (reSpec)':          'The reSpecialized Project',
    'Martial Artist (reSpec)':   'The reSpecialized Project',
    'Mechanic (reSpec)':         'The reSpecialized Project',
    'Mercenary Soldier (reSpec)': 'The reSpecialized Project',
    'Modder (reSpec)':           'The reSpecialized Project',
    'Operator (reSpec)':         'The reSpecialized Project',
    'Outlaw Tech (reSpec)':      'The reSpecialized Project',
    'Performer (reSpec)':        'The reSpecialized Project',
    'Politico (reSpec)':         'The reSpecialized Project',
    'Scholar (reSpec)':          'The reSpecialized Project',
    'Scoundrel (reSpec)':        'The reSpecialized Project',
    'Scout (reSpec)':            'The reSpecialized Project',
    'Skip Tracer (reSpec)':      'The reSpecialized Project',
    'Slicer (reSpec)':           'The reSpecialized Project',
    'Survivalist (reSpec)':      'The reSpecialized Project',
    'Thief (reSpec)':            'The reSpecialized Project',
    'Trader (reSpec)':           'The reSpecialized Project',

    # [S2] The reSpecialized Project / Blockade Runner Folio
    'Blockade Runner': 'The reSpecialized Project / Blockade Runner Folio',

    # [S3/S4] The Old Republic: An Era Sourcebook
    'Acolyte':              'The Old Republic: An Era Sourcebook',
    'Blademaster':          'The Old Republic: An Era Sourcebook',
    'Cartel Dealer':        'The Old Republic: An Era Sourcebook',
    'Imperial Loyalist':    'The Old Republic: An Era Sourcebook',
    'Lord':                 'The Old Republic: An Era Sourcebook',
    'Mandalorian Crusader': 'The Old Republic: An Era Sourcebook',
    'Sorcerer':             'The Old Republic: An Era Sourcebook',

    # [S5] Fires of Resistance: An Unofficial Era Sourcebook
    'Dark Side Cultist':    'Fires of Resistance',
    'First Order Defector': 'Fires of Resistance',
    'First Order Loyalist': 'Fires of Resistance',
    'Seasoned Adventurer':  'Fires of Resistance',

    # [S6] Heroes on Both Sides
    'Temple Guardian': 'Heroes on Both Sides',

    # [S7/S8/S9] For Light and Life: An Era Sourcebook
    'RDC Navigator':           'For Light and Life',
    'RDC Officer':             'For Light and Life',
    'RDC Peacekeeper':         'For Light and Life',
    'Jedi Archivist':          'For Light and Life',
    'Jedi Explorer':           'For Light and Life',
    'Jedi Wayseeker':          'For Light and Life',
    'Shipwright (High Republic)': 'For Light and Life',
    'Trader (High Republic)':     'For Light and Life',
}

# Reset all flags, then apply only the authoritative list
for sp in specs:
    if sp['name'] in HOMEBREW:
        sp['homebrew'] = True
        sp['homebrew_source'] = HOMEBREW[sp['name']]
    else:
        sp['homebrew'] = False
        sp['homebrew_source'] = ''

flagged = sum(1 for s in specs if s['homebrew'])
print(f'Flagged {flagged} homebrew specs out of {len(specs)} total')

with open('data/specializations.json', 'w', encoding='utf-8') as f:
    json.dump(specs, f, ensure_ascii=False, indent=2)

out = 'window.SW = window.SW || {};\nwindow.SW.specializations = ' + json.dumps(specs, ensure_ascii=False, indent=2) + ';\n'
with open('data/specializations.js', 'w', encoding='utf-8') as f:
    f.write(out)

print('Saved specializations.json and specializations.js')
