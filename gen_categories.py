# -*- coding: utf-8 -*-
"""Download representative category photos (Wikimedia Commons, free) for
user-added places. Saved to images/cat/<key>.jpg, downscaled."""
import json, os, time, urllib.parse, urllib.request
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "images", "cat")
os.makedirs(OUT, exist_ok=True)
UA = "TokyoTripApp/1.0 (personal trip planner; pirensisco@krafton.com)"
API = "https://commons.wikimedia.org/w/api.php"
RASTER = (".jpg", ".jpeg", ".png")

QUERIES = {
    "cafe": ["coffee shop interior", "cafe interior", "espresso cafe"],
    "restaurant": ["restaurant food table", "japanese restaurant food", "dining table food"],
    "bar": ["cocktail bar counter", "bar interior night", "cocktail glass bar"],
    "bakery": ["bakery bread display", "bakery shop", "fresh bread"],
    "dessert": ["dessert plate sweets", "parfait dessert", "japanese sweets"],
    "shopping": ["boutique clothing store interior", "fashion shop interior", "retail store"],
    "store": ["japanese convenience store", "grocery store interior", "shop interior"],
    "hotel": ["hotel room interior", "hotel lobby", "hotel bedroom"],
    "landmark": ["tokyo landmark", "tokyo cityscape", "japan temple"],
    "park": ["japanese garden park", "park green japan", "japan garden"],
    "default": ["tokyo street", "tokyo night street", "japan street"],
}


def commons(query, width=1000):
    p = {"action": "query", "format": "json", "generator": "search", "gsrsearch": query,
         "gsrnamespace": "6", "gsrlimit": "10", "prop": "imageinfo", "iiprop": "url|mime", "iiurlwidth": str(width)}
    req = urllib.request.Request(API + "?" + urllib.parse.urlencode(p), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    pages = (data.get("query") or {}).get("pages") or {}
    for pg in sorted(pages.values(), key=lambda x: x.get("index", 999)):
        ii = (pg.get("imageinfo") or [{}])[0]
        t = ii.get("thumburl") or ""
        if t.lower().endswith(RASTER):
            return t
    return None


def dl(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        b = r.read()
    if len(b) < 3000:
        return False
    open(dest, "wb").write(b)
    im = Image.open(dest).convert("RGB")
    w, h = im.size
    if w > 900:
        im = im.resize((900, int(h * 900 / w)), Image.LANCZOS)
    im.save(dest, "JPEG", quality=82, optimize=True)
    return True


ok, fail = [], []
for key, qs in QUERIES.items():
    dest = os.path.join(OUT, key + ".jpg")
    done = False
    for q in qs:
        try:
            t = commons(q)
            if t and dl(t, dest):
                ok.append(key); print("OK %-12s <- %s" % (key, q)); done = True; break
        except Exception as e:
            print(".. %-12s (%s) %s" % (key, q, e))
        time.sleep(0.3)
    if not done:
        fail.append(key); print("XX %-12s FAILED" % key)
print("\n%d ok, %d failed %s" % (len(ok), len(fail), fail))
