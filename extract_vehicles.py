# Extract vehicles and vehicle weapons from OggDude SWCharGen XML.
# Source: C:\Users\Popsc\Downloads\SWCharGen\Data\Vehicles\*.xml
#         C:\Users\Popsc\Downloads\SWCharGen\Data\Weapons.xml (Type=Vehicle entries)
# Output: data/vehicles.js, data/vehicleWeapons.js
import os, re, json, glob
import xml.etree.ElementTree as ET

DATA   = r"C:\Users\Popsc\Downloads\SWCharGen\Data"
VEH_DIR = os.path.join(DATA, "Vehicles")
OUT    = os.path.join(os.path.dirname(__file__), "data")

SENSOR_MAP = {
    "srNone": "None", "srClose": "Close", "srShort": "Short",
    "srMedium": "Medium", "srLong": "Long", "srExtreme": "Extreme",
    # Some older XMLs store the display value directly
    "None": "None", "Close": "Close", "Short": "Short",
    "Medium": "Medium", "Long": "Long", "Extreme": "Extreme",
}

RANGE_MAP = {
    "wrEngaged": "Engaged", "wrShort": "Short", "wrMedium": "Medium",
    "wrLong": "Long", "wrExtreme": "Extreme", "wrClose": "Close", "wrNoRange": "",
}

CORE_BOOKS = {
    "Edge of the Empire Core Rulebook",
    "Age of Rebellion Core Rulebook",
    "Force and Destiny Core Rulebook",
}


def _norm(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def _load_descs():
    path = os.path.join(OUT, "vehicle_descriptions.json")
    try:
        with open(path, encoding="utf-8") as f:
            raw = json.load(f)
    except FileNotFoundError:
        return {}
    return {_norm(title): desc for title, desc in raw.items()}


DESCS = _load_descs()


def desc_for(name):
    n = _norm(name)
    if n in DESCS:
        return DESCS[n]
    base = re.sub(r"\s*\([^)]*\)\s*$", "", name or "")
    nb = _norm(base)
    if nb != n and nb in DESCS:
        return DESCS[nb]
    if len(n) >= 9:
        cands = [k for k in DESCS if len(k) >= 9 and (k.startswith(n) or n.startswith(k))]
        if len(cands) == 1:
            return DESCS[cands[0]]
    return ""


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
            return t


def strip_markup(s):
    if not s:
        return ""
    s = re.sub(r"\[/?[A-Za-z0-9]+\]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def get_sources(item):
    out = []
    # Try <Sources><Source> first
    sources_el = item.find("Sources")
    if sources_el is not None:
        for src in sources_el.findall("Source"):
            name = (src.text or "").strip()
            if name:
                out.append({"book": name, "page": src.get("Page", "")})
    # Then bare <Source> elements
    for src in item.findall("Source"):
        name = (src.text or "").strip()
        if name:
            out.append({"book": name, "page": src.get("Page", "")})
    # De-dup preserving order
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


def emit(path, varname, rows):
    lines = [f"window.SW = window.SW || {{}};", f"window.SW.{varname} = ["]
    for r in rows:
        lines.append("  " + json.dumps(r, ensure_ascii=False) + ",")
    lines.append("];")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print(f"  wrote {len(rows):4d} -> {os.path.relpath(path, os.path.dirname(__file__))}")


# ── Vehicle weapons (from Weapons.xml, Type=Vehicle) ─────────────────────────
def do_vehicleWeapons():
    tree = ET.parse(os.path.join(DATA, "Weapons.xml"))
    rows = []
    for w in tree.getroot().iter("Weapon"):
        if text(w.find("Type")) != "Vehicle":
            continue
        sources = get_sources(w)
        quals = []
        qroot = w.find("Qualities")
        if qroot is not None:
            for q in qroot.findall("Quality"):
                qk = text(q.find("Key"))
                if not qk:
                    continue
                entry = {"key": qk}
                cnt = q.find("Count")
                if cnt is not None and text(cnt):
                    entry["count"] = num(cnt, 1)
                quals.append(entry)
        rows.append({
            "key":      text(w.find("Key")),
            "name":     text(w.find("Name")),
            "damage":   num(w.find("Damage"), 0),
            "crit":     num(w.find("Crit")),
            "range":    RANGE_MAP.get(text(w.find("RangeValue")), text(w.find("RangeValue"))),
            "skill":    text(w.find("SkillKey")),
            "hp":       num(w.find("HP"), 0),
            "qualities": quals,
            "core":     is_core(sources),
            "sources":  sources,
        })
    rows.sort(key=lambda r: r["name"].lower())
    emit(os.path.join(OUT, "vehicleWeapons.js"), "vehicleWeapons", rows)


# ── Vehicles (from Vehicles/*.xml) ────────────────────────────────────────────
def do_vehicles():
    rows = []
    skipped = 0
    for xml_path in glob.glob(os.path.join(VEH_DIR, "*.xml")):
        try:
            tree = ET.parse(xml_path)
        except ET.ParseError as e:
            print(f"  SKIP (parse error): {os.path.basename(xml_path)}: {e}")
            skipped += 1
            continue
        root = tree.getroot()
        if root.tag != "Vehicle":
            skipped += 1
            continue

        sources = get_sources(root)

        # Sensor range: some XMLs use <SensorRangeValue>, older ones use <SensorRange>
        sensor_raw = text(root.find("SensorRangeValue")) or text(root.find("SensorRange"))
        sensor = SENSOR_MAP.get(sensor_raw, sensor_raw or "")

        # BaseMods: collect non-empty MiscDesc strings
        base_mods = []
        mods_el = root.find("BaseMods")
        if mods_el is not None:
            for mod in mods_el.findall("Mod"):
                desc = strip_markup(text(mod.find("MiscDesc")))
                if desc:
                    base_mods.append(desc)

        # Vehicle weapons
        veh_weapons = []
        vw_el = root.find("VehicleWeapons")
        if vw_el is not None:
            for vw in vw_el.findall("VehicleWeapon"):
                wkey = text(vw.find("Key"))
                if not wkey:
                    continue
                arcs_el = vw.find("FiringArcs")
                arcs = {}
                if arcs_el is not None:
                    for arc in ["Fore", "Aft", "Port", "Starboard", "Dorsal", "Ventral"]:
                        arcs[arc.lower()] = text(arcs_el.find(arc)).lower() == "true"
                quals = []
                qroot = vw.find("Qualities")
                if qroot is not None:
                    for q in qroot.findall("Quality"):
                        qk = text(q.find("Key"))
                        if not qk:
                            continue
                        entry = {"key": qk}
                        cnt = q.find("Count")
                        if cnt is not None and text(cnt):
                            entry["count"] = num(cnt, 1)
                        quals.append(entry)
                veh_weapons.append({
                    "key":        wkey,
                    "location":   text(vw.find("Location")),
                    "turret":     text(vw.find("Turret")).lower() == "true",
                    "retractable": text(vw.find("Retractable")).lower() == "true",
                    "count":      num(vw.find("Count"), 1) or 1,
                    "firingArcs": arcs,
                    "qualities":  quals,
                })

        name = text(root.find("Name"))
        rows.append({
            "key":                text(root.find("Key")),
            "name":               name,
            "description":        desc_for(name),
            "type":               text(root.find("Type")),
            "categories":         categories(root),
            "silhouette":         num(root.find("Silhouette"), 3),
            "speed":              num(root.find("Speed"), 1),
            "handling":           num(root.find("Handling"), 0),
            "armor":              num(root.find("Armor"), 0),
            "hullTrauma":         num(root.find("HullTrauma"), 1),
            "systemStrain":       num(root.find("SystemStrain"), 1),
            "defFore":            num(root.find("DefFore"), 0),
            "defAft":             num(root.find("DefAft"), 0),
            "defPort":            num(root.find("DefPort"), 0),
            "defStarboard":       num(root.find("DefStarboard"), 0),
            "hp":                 num(root.find("HP"), 0),
            "price":              num(root.find("Price")),
            "rarity":             num(root.find("Rarity"), 0),
            "restricted":         text(root.find("Restricted")).lower() == "true",
            "hyperdrivePrimary":  num(root.find("HyperdrivePrimary"), 0) or 0,
            "hyperdriveBackup":   num(root.find("HyperdriveBackup"), 0) or 0,
            "navicomputer":       text(root.find("NaviComputer")).lower() == "true",
            "sensorRange":        sensor,
            "maxAltitude":        text(root.find("MaxAltitude")),
            "crew":               text(root.find("Crew")),
            "encumbranceCapacity": num(root.find("EncumbranceCapacity"), 0) or 0,
            "passengers":         num(root.find("Passengers"), 0) or 0,
            "consumables":        text(root.find("Consumables")),
            "starship":           text(root.find("Starship")).lower() == "true",
            "singlePilot":        text(root.find("SinglePilot")).lower() == "true",
            "massive":            num(root.find("Massive"), 0) or 0,
            "baseMods":           base_mods,
            "weapons":            veh_weapons,
            "core":               is_core(sources),
            "sources":            sources,
        })

    rows.sort(key=lambda r: r["name"].lower())
    emit(os.path.join(OUT, "vehicles.js"), "vehicles", rows)
    if skipped:
        print(f"  skipped {skipped} non-vehicle XML files")


if __name__ == "__main__":
    print("Extracting vehicles from OggDude XML...")
    do_vehicleWeapons()
    do_vehicles()
    print("Done.")
