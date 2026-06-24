import json

species = json.load(open('data/species.json', encoding='utf-8'))

# Map source string prefix -> homebrew source label
# Only sources confirmed or strongly suspected as fan supplements are listed here.
HOMEBREW_SOURCES = {
    'Fires of Resistance: An Unofficial Era Sourcebook':
        'Fires of Resistance (unofficial)',
    'Heroes on Both Sides: The Unofficial Collection of Clone Wars Heroes & Villains':
        'Heroes on Both Sides (unofficial)',
    'The Old Republic: An Era Sourcebook':
        'The Old Republic: An Era Sourcebook',
    'For Light and Life: An Era Sourcebook':
        'For Light and Life',
    'Adventures in Babysitting: A Source Book for "The Mandalorian" Seasons 1 and 2':
        'Adventures in Babysitting (fan supplement)',
    "Neo-Crusader's Arc of Doom: Adventure Module":
        "Neo-Crusader's Arc of Doom (fan module)",
    'The Thrawn Trilogy: An Era Sourcebook':
        'The Thrawn Trilogy: An Era Sourcebook (fan supplement)',
    'The Living Force: A Sourcebook for the Cularin System':
        'The Living Force: A Sourcebook for the Cularin System (likely fan)',
}

flagged = 0
for sp in species:
    srcs = sp.get('sources', [])
    src_str = srcs[0].split('(')[0].strip() if srcs else ''
    label = HOMEBREW_SOURCES.get(src_str, '')
    if label:
        sp['homebrew'] = True
        sp['homebrew_source'] = label
        flagged += 1
    else:
        sp['homebrew'] = False
        sp['homebrew_source'] = ''

print(f'Flagged {flagged} homebrew species out of {len(species)} total')

with open('data/species.json', 'w', encoding='utf-8') as f:
    json.dump(species, f, ensure_ascii=False, indent=2)

out = 'window.SW = window.SW || {};\nwindow.SW.species = ' + json.dumps(species, ensure_ascii=False, indent=2) + ';\n'
with open('data/species.js', 'w', encoding='utf-8') as f:
    f.write(out)

print('Saved species.json and species.js')
