"""Tidy up text pulled out of the trees PDF.

Two kinds of damage show up, and they have to be repaired at different points
in the pipeline.

The first is the PDF's own line breaking, which leaves a hyphen and a space in
the middle of a word once the lines are joined back up, plus the stray space
the symbol font leaves before its punctuation. Both only move whitespace
around, so clean() is safe to run in the builders, before the text is aligned
against the page to work out which letters are dice symbols.

The second is a handful of typos in the printed book. Correcting those changes
actual letters, which would break that alignment, so fix_typos() runs after the
symbols have been resolved. Each correction is listed here so the change to the
printed wording is visible rather than buried.
"""
import re

# Hyphen at a line break, joined back up. Only fires between two word
# characters, so a real dash between words is left alone.
RE_SPLIT = re.compile(r'(\w)-\s+(\w)')

# A space the symbol font leaves sitting before its punctuation.
RE_SPACE_PUNCT = re.compile(r'\s+([.,;:)])')

# Typos in the printed book. "withing" is not a word, and "cannot he used"
# appears as "cannot be used" in the identical sentence on the Smuggler page.
BOOK_TYPOS = [
    (re.compile(r'\bwithing\b'), 'within'),
    (re.compile(r'\bcannot he used\b'), 'cannot be used'),
]


def clean(text):
    """Whitespace repairs only, so the text still lines up with the page."""
    if not text:
        return text
    out = RE_SPLIT.sub(r'\1-\2', text)
    out = RE_SPACE_PUNCT.sub(r'\1', out)
    return re.sub(r'\s{2,}', ' ', out).strip()


def fix_typos(text):
    """Corrections to the printed wording. Changes letters, so run this last."""
    if not text:
        return text
    for pat, fix in BOOK_TYPOS:
        text = pat.sub(fix, text)
    return text
