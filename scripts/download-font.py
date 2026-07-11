import urllib.parse
import urllib.request
import os

# Build the text parameter with all characters used on the site
chars = (
    # Latin uppercase + lowercase + numbers + common punctuation
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789"
    " .,;:!?—–-–—'\"«»()[]{}@#%&*+/=<>~^`|\\$€£¥©®™°•·…"
    # Cyrillic uppercase
    "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
    # Cyrillic lowercase
    "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"
)

encoded = urllib.parse.quote(chars, safe='')
url = f"https://fonts.googleapis.com/css2?family=Bebas+Neue&text={encoded}&display=swap"

print(f"Fetching CSS...")
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    css = resp.read().decode('utf-8')

print("CSS Response:")
print(css[:500])

import re
match = re.search(r'src: url\(([^)]+)\)', css)
if match:
    font_url = match.group(1)
    print(f"\nFont URL: {font_url[:100]}...")
    
    font_req = urllib.request.Request(font_url)
    with urllib.request.urlopen(font_req) as resp:
        data = resp.read()
    
    out_path = "/Users/namoneo/develop/bestmetall/fonts/bebas-neue.woff2"
    with open(out_path, "wb") as f:
        f.write(data)
    
    print(f"Downloaded {len(data)} bytes to {out_path}")
    
    # Verify
    from fontTools.ttLib import TTFont
    font = TTFont(out_path)
    cmap = font['cmap'].getBestCmap()
    print(f"Total glyphs: {len(cmap)}")
    print(f"Has 'А': {ord('А') in cmap}")
    print(f"Has 'а': {ord('а') in cmap}")
    print(f"Has 'A': {ord('A') in cmap}")
else:
    print("No font URL found")
    print(css)
