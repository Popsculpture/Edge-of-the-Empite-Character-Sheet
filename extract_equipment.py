# Extract weapons, armor, and gear from OggDude SWCharGen XML into clean JS data files.
# Source: C:\Users\Popsc\Downloads\SWCharGen\Data\{Weapons,Armor,Gear,ItemDescriptors}.xml
# Output: data/weapons.js, data/armor.js, data/gear.js, data/qualities.js
import os, re, json
import xml.etree.ElementTree as ET

DATA = r"C:\Users\Popsc\Downloads\SWCharGen\Data"
OUT  = os.path.join(os.path.dirname(__file__), "data")

RANGE_MAP = {
    "wrEngaged": "Engaged", "wrShort": "Short", "wrMedium": "Medium",
    "wrLong": "Long", "wrExtreme": "Extreme", "wrClose": "Close", "wrNoRange": "",
}

SKILL_MAP = {
    "RANGLT": "Ranged - Light", "RANGHVY": "Ranged - Heavy", "MELEE": "Melee",
    "BRAWL": "Brawl", "LTSABER": "Lightsaber", "GUNN": "Gunnery", "MECH": "Mechanics",
}

# The 3 core rulebooks (for a "core only" filter and book grouping)
CORE_BOOKS = {
    "Edge of the Empire Core Rulebook",
    "Age of Rebellion Core Rulebook",
    "Force and Destiny Core Rulebook",
}


def text(el):
    return (el.text or "").strip() if el is not None else ""


def num(el, default=None):
    t = text(el)
    if t == "":
        return default
    try:
        return int(t)
    except ValueError:
        try:
            return float(t)
        except ValueError:
            return t  # keep odd values (e.g. "varies") as-is


def strip_markup(s):
    if not s:
        return ""
    # OggDude inline tags: [H3]..[h3], [B]..[b], [P], dice glyphs [BOOST] etc.
    s = re.sub(r"\[/?[A-Za-z0-9]+\]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def get_sources(item):
    """Collect every <Source> under an item (handles <Sources><Source> and bare <Source>)."""
    out = []
    for src in item.iter("Source"):
        name = (src.text or "").strip()
        if not name:
            continue
        page = src.get("Page", "")
        out.append({"book": name, "page": page})
    # de-dup preserving order
    seen, uniq = set(), []
    for s in out:
        k = (s["book"], s["page"])
        if k not in seen:
            seen.add(k)
            uniq.append(s)
    return uniq


def is_core(sources):
    return any(s["book"] in CORE_BOOKS for s in sources)


def categories(item):
    cats = item.find("Categories")
    if cats is None:
        return []
    return [text(c) for c in cats.findall("Category") if text(c)]


# ── Quality glossary (key -> {name, ranked, desc}) ────────────────────────────
def build_qualities():
    tree = ET.parse(os.path.join(DATA, "ItemDescriptors.xml"))
    quals = {}
    for d in tree.getroot().iter("ItemDescriptor"):
        if text(d.find("IsQuality")).lower() != "true":
            continue
        key = text(d.find("Key"))
        name = re.sub(r"\s*Quality$", "", text(d.find("Name"))).strip()
        qd = text(d.find("QualDesc"))
        ranked = "{0}" in qd
        quals[key] = {"name": name, "ranked": ranked}
    return quals


QUAL = build_qualities()

# Hand-written one-line rules summaries for the weapon qualities (core rulebooks).
QUALITY_DESCS = {
    "ACCURATE":    "Add [BOOST] per rank to combat checks made with this weapon.",
    "AUTOFIRE":    "May spend [ADVANTAGE][ADVANTAGE] to hit additional targets or the same target again; attacker may activate but adds [DIFFICULTY].",
    "BLAST":       "On a hit with [ADVANTAGE][ADVANTAGE] (or any [ADVANTAGE] if it misses), deals Blast damage to everyone engaged with the target.",
    "BREACH":      "Ignores 1 point of armor or vehicle Soak per rank (each rank = 10 armor on vehicle scale).",
    "BURN":        "Target continues to suffer the weapon's listed damage for rounds equal to Burn rating.",
    "CONCUSSIVE":  "On a hit, target is staggered (cannot act) for a number of rounds equal to Concussive rating.",
    "CORTOSIS":    "Weapon cannot be damaged by Sunder; it can never gain the Defensive quality.",
    "CUMBERSOME":  "Requires Brawn equal to the Cumbersome rating; each point short adds [SETBACK] to checks.",
    "DEFENSIVE":   "Grants melee defense equal to the Defensive rating.",
    "DEFLECTION":  "Grants ranged defense equal to the Deflection rating.",
    "DISORIENT":   "On a hit with [ADVANTAGE], target is disoriented for rounds equal to Disorient rating (adds [SETBACK] to its checks).",
    "ENSNARE":     "On a hit, may immobilize the target for rounds equal to Ensnare rating.",
    "GUIDED":      "Missed attacks may still hit on a later round using [ADVANTAGE] spent from the original check.",
    "INACCURATE":  "Add [SETBACK] per rank to combat checks made with this weapon.",
    "INFERIOR":    "A poorly made item; the wielder suffers added [THREAT] or reduced effect.",
    "ION":         "Damages droids and vehicles as strain/system strain rather than wounds.",
    "KNOCKDOWN":   "On a hit, may spend [ADVANTAGE] to knock the target prone.",
    "LIMITEDAMMO": "May be fired a number of times equal to the rating before it must be reloaded.",
    "LINKED":      "On a hit, may spend [ADVANTAGE][ADVANTAGE] per rank to score one additional hit.",
    "PIERCE":      "Ignores points of the target's Soak equal to the Pierce rating.",
    "PREPARE":     "Requires a number of preparation maneuvers equal to the rating before it can be used.",
    "SLOWFIRING":  "Cannot be fired again until a number of rounds equal to the rating have passed.",
    "STUN":        "May deal stun damage equal to the Stun rating instead of normal damage.",
    "STUNDAMAGE":  "Deals only stun damage (wounds, but ignores Soak from armor as the rules describe).",
    "STUNSETTING": "May be set to stun, dealing strain instead of wounds with no change to damage.",
    "SUNDER":      "On a hit, may spend [ADVANTAGE] to damage (one step) a weapon or item the target is using.",
    "TRACTOR":     "Locks a target in place with a tractor beam of strength equal to the rating.",
    "UNWIELDY":    "Requires Agility equal to the Unwieldy rating; each point short adds [SETBACK] to checks.",
    "VICIOUS":     "Add +10 per rank to any Critical Injury result inflicted by this weapon.",
}


def emit(path, varname, rows):
    lines = [f"window.SW = window.SW || {{}};", f"window.SW.{varname} = ["]
    for r in rows:
        lines.append("  " + json.dumps(r, ensure_ascii=False) + ",")
    lines.append("];")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"  wrote {len(rows):4d} -> {os.path.relpath(path, os.path.dirname(__file__))}")


# ── Weapons ───────────────────────────────────────────────────────────────────
def do_weapons():
    tree = ET.parse(os.path.join(DATA, "Weapons.xml"))
    rows = []
    for w in tree.getroot().iter("Weapon"):
        sources = get_sources(w)
        dmg_add = w.find("DamageAdd")
        if dmg_add is not None and text(dmg_add) != "":
            dmg_type, dmg_val = "add", num(dmg_add, 0)
        else:
            dmg_type, dmg_val = "base", num(w.find("Damage"), 0)
        quals = []
        qroot = w.find("Qualities")
        if qroot is not None:
            for q in qroot.findall("Quality"):
                qk = text(q.find("Key"))
                info = QUAL.get(qk, {"name": qk.title(), "ranked": False})
                entry = {"key": qk, "name": info["name"]}
                if info["ranked"]:
                    entry["count"] = num(q.find("Count"), 1)
                quals.append(entry)
        skill_key = text(w.find("SkillKey"))
        rows.append({
            "key": text(w.find("Key")),
            "name": text(w.find("Name")),
            "skillKey": skill_key,
            "skill": SKILL_MAP.get(skill_key, skill_key),
            "damageType": dmg_type,
            "damage": dmg_val,
            "crit": num(w.find("Crit")),
            "range": RANGE_MAP.get(text(w.find("RangeValue")), text(w.find("RangeValue"))),
            "encumbrance": num(w.find("Encumbrance")),
            "hp": num(w.find("HP")),
            "price": num(w.find("Price")),
            "rarity": num(w.find("Rarity")),
            "restricted": text(w.find("Restricted")).lower() == "true",
            "type": text(w.find("Type")),
            "categories": categories(w),
            "qualities": quals,
            "core": is_core(sources),
            "sources": sources,
        })
    rows.sort(key=lambda r: r["name"].lower())
    emit(os.path.join(OUT, "weapons.js"), "weapons", rows)


# ── Armor ─────────────────────────────────────────────────────────────────────
def do_armor():
    tree = ET.parse(os.path.join(DATA, "Armor.xml"))
    rows = []
    for a in tree.getroot().iter("Armor"):
        sources = get_sources(a)
        rows.append({
            "key": text(a.find("Key")),
            "name": text(a.find("Name")),
            "defense": num(a.find("Defense"), 0),
            "soak": num(a.find("Soak"), 0),
            "encumbrance": num(a.find("Encumbrance")),
            "hp": num(a.find("HP")),
            "price": num(a.find("Price")),
            "rarity": num(a.find("Rarity")),
            "restricted": text(a.find("Restricted")).lower() == "true",
            "categories": categories(a),
            "core": is_core(sources),
            "sources": sources,
        })
    rows.sort(key=lambda r: r["name"].lower())
    emit(os.path.join(OUT, "armor.js"), "armor", rows)


# ── Gear ──────────────────────────────────────────────────────────────────────
def do_gear():
    tree = ET.parse(os.path.join(DATA, "Gear.xml"))
    rows = []
    for g in tree.getroot().iter("Gear"):
        sources = get_sources(g)
        rows.append({
            "key": text(g.find("Key")),
            "name": text(g.find("Name")),
            "short": strip_markup(text(g.find("Short"))),
            "encumbrance": num(g.find("Encumbrance")),
            "price": num(g.find("Price")),
            "rarity": num(g.find("Rarity")),
            "restricted": text(g.find("Restricted")).lower() == "true",
            "type": text(g.find("Type")),
            "core": is_core(sources),
            "sources": sources,
        })
    rows.sort(key=lambda r: r["name"].lower())
    emit(os.path.join(OUT, "gear.js"), "gear", rows)


# ── Qualities glossary ────────────────────────────────────────────────────────
def do_qualities():
    out = {}
    for key, info in sorted(QUAL.items()):
        out[key] = {"name": info["name"], "ranked": info["ranked"],
                    "desc": QUALITY_DESCS.get(key, "")}
    path = os.path.join(OUT, "qualities.js")
    with open(path, "w", encoding="utf-8") as f:
        f.write("window.SW = window.SW || {};\n")
        f.write("window.SW.weaponQualities = " + json.dumps(out, ensure_ascii=False, indent=2) + ";\n")
    print(f"  wrote {len(out):4d} -> data/qualities.js")


if __name__ == "__main__":
    print("Extracting equipment from OggDude XML...")
    do_weapons()
    do_armor()
    do_gear()
    do_qualities()
    print("Done.")
