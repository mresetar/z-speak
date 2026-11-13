#!/usr/bin/env python3
"""Lint the ZSpeak sources before you build or push.

Checks, with no third-party dependencies:
  * front matter is present and parses
  * every term has title, short, exactly one category
  * `related:` entries point at terms that exist
  * `params.ref`, if present, is an inline map with a title and an http(s) url
  * category is one of the agreed set
  * no duplicate titles

Usage: python3 tools/check.py [content/terms]
"""
import os
import re
import sys

CATEGORIES = {
    "Hardware", "Operating System", "System Services", "Storage",
    "Middleware", "Development", "Security", "Modern Z",
}

LIST_RE = re.compile(r"^\s*(\w+):\s*\[(.*)\]\s*$")
SCALAR_RE = re.compile(r"^\s*(\w+):\s*(.*?)\s*$")
REF_RE = re.compile(r'\{\s*title:\s*"([^"]*)"\s*,\s*url:\s*"([^"]*)"\s*\}\s*$')


def unquote(s):
    s = s.strip()
    if len(s) >= 2 and s[0] == s[-1] and s[0] in "\"'":
        return s[1:-1]
    return s


def parse_front_matter(text):
    """Good enough for the subset of YAML this glossary uses."""
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    fm, out = text[3:end], {}
    for line in fm.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        m = LIST_RE.match(line)
        if m:
            items = [unquote(x) for x in m.group(2).split(",") if x.strip()]
            out[m.group(1)] = items
            continue
        m = SCALAR_RE.match(line)
        if m and m.group(2) and not m.group(2).startswith("#"):
            out.setdefault(m.group(1), unquote(m.group(2)))
    return out


def main(path):
    errors, warnings, titles = [], [], {}
    files = sorted(f for f in os.listdir(path)
                   if f.endswith(".md") and f != "_index.md")

    parsed = {}
    for name in files:
        full = os.path.join(path, name)
        with open(full, encoding="utf-8") as fh:
            text = fh.read()
        fm = parse_front_matter(text)
        if fm is None:
            errors.append(f"{name}: no parsable front matter")
            continue
        parsed[name] = fm

        title = fm.get("title")
        if not title:
            errors.append(f"{name}: missing title")
        else:
            if title in titles:
                errors.append(f"{name}: duplicate title '{title}' (also {titles[title]})")
            titles[title] = name

        if not fm.get("short"):
            errors.append(f"{name}: missing params.short — the index line")
        elif len(fm["short"]) > 160:
            warnings.append(f"{name}: short is {len(fm['short'])} chars; aim for under 160")

        cats = fm.get("categories") or []
        if len(cats) != 1:
            errors.append(f"{name}: needs exactly one category, found {cats}")
        else:
            if cats[0] not in CATEGORIES:
                errors.append(f"{name}: unknown category '{cats[0]}'")

        if not fm.get("tags"):
            warnings.append(f"{name}: no tags")

        for value in cats + (fm.get("tags") or []):
            if "/" in value:
                errors.append(
                    f"{name}: taxonomy value '{value}' contains '/' — "
                    "Hugo turns it into a URL path segment. Use 'zos', not 'z/os'.")

        ref = fm.get("ref")
        if ref is not None:
            m = REF_RE.match(ref)
            if not m:
                errors.append(
                    f"{name}: params.ref must be an inline map "
                    'ref: { title: "…", url: "https://…" }')
            else:
                if not m.group(1):
                    errors.append(f"{name}: params.ref is missing a title")
                if not m.group(2).startswith("http"):
                    errors.append(f"{name}: params.ref url must start with http(s)://")

    known = set(titles)
    for name, fm in parsed.items():
        for rel in fm.get("related") or []:
            if rel not in known:
                warnings.append(f"{name}: related '{rel}' has no entry yet")

    for w in warnings:
        print(f"warn  {w}")
    for e in errors:
        print(f"ERROR {e}")
    print(f"\n{len(parsed)} terms checked · {len(errors)} errors · {len(warnings)} warnings")
    return 1 if errors else 0


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "content/terms"
    sys.exit(main(target))
