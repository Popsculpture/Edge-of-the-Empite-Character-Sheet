import json, re

talents = json.load(open('data/talents.json', encoding='utf-8'))
by_name = {t['name'].lower(): t for t in talents}

updates = {
    'Cargo Drop': ('Active (Action)', False, 'Once per encounter, dump cargo with a Hard Skulduggery check. Nearby foes equal to successes must slow to speed 1 or suffer a major collision; Advantage/Triumph can trigger cargo-specific effects.'),
    'Fly Casual': ('Active (Incidental)', False, 'Once per encounter while aboard or piloting a familiar craft, spend a Destiny Point to add Setback equal to Cunning to attempts to identify, scan, or inspect the craft or cargo.'),
    'Mustafar Special': ('Active (Action)', False, 'Once per round while piloting, make opposed Piloting against a close craft. On success, inflict system strain equal to Cunning plus successes; 2 Advantage can affect another close craft.'),
    'Wretched Hive': ('Active (Action)', False, 'Once per session, make a Hard Astrogation or Knowledge Underworld check to locate the nearest Shadowport; upgrade checks to reach or interact with it this session.'),
    'Cease Hostilities!': ('Active (Action)', False, 'Once per encounter, opposed Coercion vs Discipline to stagger a Rival or Minion in short range. Improved allows twice per encounter and can target a Nemesis by spending a Destiny Point.'),
    'Sentinel of the Order': ('Active (Maneuver)', False, 'As a maneuver, suffer 3 strain to give your equipped weapon Defensive 1 and Deflection 1 until the end of the next round, or increase those ratings if already present.'),
    "Sentry's Rest": ('Passive', False, 'Use waking meditation instead of sleep, remaining conscious and alert while resting.'),
    'Stalwart': ('Passive', False, 'Enemy checks opposed by your Discipline suffer automatic Failure and Threat results.'),
    'Darkest Secret': ('Active (Action)', False, 'Once per encounter, make a Daunting Knowledge check. On success, you may add a Despair to one adversary check if it relates to the information uncovered.'),
    'Defy Fate': ('Active (Incidental)', False, 'Once per session when you roll a Despair, spend a Destiny Point to cancel the Despair when it would be spent. Improved lets allies use it once per session.'),
    'Reckless Zeal': ('Active (Incidental)', False, 'Once per session, suffer 2 strain and 2 wounds to reroll a failed check.'),
    'Touched by Darkness': ('Passive', True, 'Whenever the GM spends a Destiny Point, recover 1 strain and 1 wound per rank before the effect resolves.'),
    'Deferred Blame': ('Active (Action)', False, 'Once per session, make an Average Deception check to shift blame for your mistake onto someone else.'),
    'Imperial Valor': ('Active (Action)', False, 'Once per encounter, Hard Discipline check; on success, you and allies in short range equal to successes increase strain threshold by 1 for the encounter.'),
    'Rule By Fear': ('Passive', True, 'Remove one Setback die per rank from Leadership and Coercion checks.'),
    'Brainwash': ('Active (Action)', False, 'Hard Leadership check; one short-range ally suffers 2 strain and upgrades their next check. Improved lets you suffer 1 strain to use it as a maneuver instead.'),
    'Domination': ('Active (Incidental)', False, 'Suffer 2 strain to make a Leadership check using Willpower instead of Presence.'),
    'Fight What You Hate': ('Active (Incidental)', False, 'Once per encounter, suffer 3 strain and choose a long-range adversary; checks between you and that adversary have reduced critical rating.'),
    'Programmed': ('Active (Incidental)', False, 'When making a check, suffer strain up to twice your Discipline ranks; gain one Boost die for every 2 strain suffered. Improved can upgrade dice instead by flipping a Destiny Point.'),
    'Save What You Love': ('Active (Incidental, Out of Turn)', False, 'Once per session, prevent a short-range ally from being incapacitated by a hit; you then suffer 5 wounds and a Critical Injury at +20.'),
    'Scapegoat': ('Active (Action)', False, 'Once per session, Hard Deception check to avoid blame for your decision or action and place it on someone else.'),
    'Snap Out Of It': ('Active (Action)', False, 'Once per session, Daunting Discipline check to recover strain equal to half your current strain, rounded down.'),
    'Darasuum Kote': ('Active (Incidental, Out of Turn)', False, 'Once per encounter after an enemy wounds you, spend a Destiny Point to automatically hit that enemy with a wielded weapon if they are in range.'),
    'Cartel License': ('Passive', False, 'On civilized worlds, you avoid legal trouble for merely possessing restricted gear, though unlawful use can still get you punished.'),
    'Local Businesses': ('Active (Action)', False, 'Once per session, Hard Knowledge Underworld check to locate a friendly nearby black market and know how to access it.'),
    'Freedom in Victory': ('Active (Incidental)', False, 'Force talent. Commit a Force die; when you would become immobilized or staggered, suffer 2 strain to ignore it.'),
    'Passion Over Peace': ('Passive', False, 'Once per round, recover strain equal to dark side Destiny Points in the pool. Purchasing this talent adds 1 Conflict at session start.'),
    'Victory From Strength': ('Active (Incidental)', False, 'Once per session before a non-combat check, spend a Destiny Point to automatically succeed with one success and no other results.'),
    'Reckless Charge': ('Active (Incidental)', False, 'After maneuvering to engage an enemy, suffer 2 strain to add 2 Success and 2 Threat to your next Brawl, Melee, or Lightsaber check that turn.'),
    'A Lesson in Pain': ('Active (Incidental)', False, 'Once per session, suffer a Critical Injury to reroll a failed check; the GM may allow sacrificing something personally significant instead.'),
    'Strength From Passion': ('Active (Incidental)', False, 'Once per session, spend a Destiny Point to add successes and threats equal to dark side Destiny Points in the pool. Purchasing this talent adds 1 Conflict at session start.'),
    'Old Buddy': ('Active (Action)', False, 'Once per session, Hard Streetwise check to establish a prior relationship with an NPC; extra results shape how helpful or hostile that relationship is.'),
    'Pragmatic': ('Passive', True, 'Add one Boost die per rank of Pragmatic to Cool and Streetwise checks.'),
    'Reassuring Presence': ('Passive', False, 'At the end of each encounter, allies equal to your Cool ranks each recover 1 additional strain.'),
    'Watch This': ('Active (Incidental)', True, 'Once per encounter on a Daunting or harder check, add successes equal to ranks of Watch This.'),
    'Keen Insight': ('Passive', True, 'Add one Boost die per rank of Keen Insight to Perception checks.'),
    'RDC Specialised Training': ('Passive', False, 'Choose one career skill when this talent is acquired; when using that skill, add Boost dice equal to your ranks in that skill.'),
    'Questionable Ethics': ('Active (Incidental)', True, 'Once per round before a Medicine or Coercion check, suffer strain and Conflict up to ranks in Questionable Ethics to add an equal number of Success or Advantage results.'),
}

added = 0
updated = 0
for name, (act, ranked, desc) in updates.items():
    key = name.lower()
    if key in by_name:
        by_name[key]['description'] = desc
        by_name[key]['activation'] = act
        by_name[key]['ranked'] = ranked
        updated += 1
    else:
        entry = {'name': name, 'key': re.sub(r'[^A-Z0-9]', '', name.upper())[:12],
                 'ranked': ranked, 'activation': act, 'description': desc}
        talents.append(entry)
        by_name[key] = entry
        added += 1

print(f'Updated {updated}, added {added}')

talents.sort(key=lambda t: t['name'].lower())
with open('data/talents.json', 'w', encoding='utf-8') as f:
    json.dump(talents, f, ensure_ascii=False, indent=2)

out = 'window.SW = window.SW || {};\nwindow.SW.talents = ' + json.dumps(talents, ensure_ascii=False, indent=2) + ';\n'
with open('data/talents.js', 'w', encoding='utf-8') as f:
    f.write(out)
print(f'Saved {len(talents)} entries')
