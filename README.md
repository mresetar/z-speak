# ZSpeak — The IBM Z Mainframe Glossary

Short, accurate explanations of the terms you meet on IBM Z and z/OS.
One Markdown file per term in, a static HTML site out.

```
content/terms/cics.md   →   hugo   →   public/terms/cics/index.html
```

---

## Source form

Everything lives in `content/terms/`. One term, one file, named after its slug
(`parallel-sysplex.md`, `db2-zos.md`). The file is Markdown with YAML front matter:

```yaml
---
title: "CICS"                                   # the term as people write it
params:
  expansion: "Customer Information Control System"   # full name, if it is an acronym
  short: "IBM's transaction server — …"              # ONE sentence; this is the index line
  ref: { title: "IBM Docs: CICS TS", url: "https://…" }  # THE definitive online reference
  aka: ["CICS TS"]                                   # other names in use
  related: ["IMS", "Db2 for z/OS"]                   # exact titles of other terms
  links:
    - title: "A good blog post"                      # further reading (optional)
      url: "https://…"
categories: ["Middleware"]                      # exactly one, from the list below
tags: ["transactions", "online"]                # free-form, lower case
---

Two to five paragraphs. What problem it solves, where you meet it,
and the thing newcomers get wrong about it.
```

**Categories** (exactly one per term, so the front page stays navigable):
`Hardware` · `Operating System` · `System Services` · `Storage` · `Middleware` ·
`Development` · `Security` · `Modern Z`

**House style**

- `short` is one sentence and reads on its own — it is what shows in the A–Z list
  and in the "related terms" cards. Under ~160 characters.
- `ref` is the ONE definitive online reference for the term — IBM Docs for IBM
  products, the project site for open source. Rendered as a button on the term
  page and a ↗ marker in the A–Z index (opens in a new tab). Link to the page
  that actually *describes the term* — a concept page or "What is …?", not a
  generic product landing. `links` stays for further reading.
- The body explains *why the thing exists*, not just what the letters stand for.
- Cross-reference with `related:` rather than inline links; the site renders them
  as cards, and an entry that does not exist yet shows as "not documented yet" —
  a visible backlog.
- Say what people actually call it. `aka` exists for `USS`, `CEC`, `zLinux`.

## Adding a term

```bash
hugo new content/terms/wlm-service-class.md   # scaffolds from archetypes/terms.md
$EDITOR content/terms/wlm-service-class.md    # remove `draft: true` when it is ready
python3 tools/check.py content/terms          # lint before committing
```

`tools/check.py` is stdlib-only Python. It catches a missing `short`, a bad or
missing category, duplicate titles, and `related:` pointing at nothing. Zero
exit code means the sources are publishable.

## Build

```bash
hugo server -D            # http://localhost:1313, live reload, drafts included
hugo --gc --minify        # production build into ./public
```

`public/` is generated and git-ignored — never edit it.

To hand the built site to someone without Hugo, zip `public/` and serve it with
anything static:

```bash
hugo --gc --minify          # writes ./public
python3 -m http.server 8000 --directory public
```

Opening `public/index.html` directly with `file://` mostly works, but links to
the section and category pages point at directories, so use the one-line server
above instead.

## How the site is put together

| Path | What it is |
|---|---|
| `hugo.toml` | Site config: taxonomies, params, front-matter defaults |
| `content/terms/*.md` | **The glossary. The only thing most contributors touch.** |
| `archetypes/terms.md` | Template used by `hugo new` |
| `layouts/baseof.html` | Page shell |
| `layouts/home.html` | Front page: hero with the **term of the day**, category cards, full A–Z index |
| `layouts/terms/section.html` | `/terms/` — the same A–Z index |
| `layouts/terms/page.html` | A single term |
| `layouts/taxonomy.html`, `layouts/term.html` | Category and tag browsing |
| `layouts/partials/index-list.html` | The A–Z cards, letter jump bar, client-side filter and the “Surprise me” random pick |
| `assets/css/main.css` | The whole stylesheet; light and dark, one colour per category |
| `tools/check.py` | Source linter |

Search is deliberately dependency-free: the A–Z page carries a `data-search`
attribute per term and ~30 lines of JavaScript filter the DOM. No index to
build, no service to run, works offline. Press <kbd>/</kbd> to focus it.

No external Hugo theme, no npm, no submodule — `hugo` and a git clone are the
whole toolchain.

## Publishing (not wired up yet)

The build is a single command producing a directory, so any of these is a small
step when you want it:

- **GitLab Pages** — a `.gitlab-ci.yml` with a `hugo` image, `script: hugo --gc
  --minify -d public`, and `artifacts: paths: [public]` under a `pages` job.
  Run `python3 tools/check.py` as a preceding stage so a bad merge request fails
  before it publishes.
- **Confluence** — the source Markdown converts cleanly
  (`pandoc -f markdown -t html content/terms/cics.md`), so a page-per-term or a
  single rolled-up page can be pushed through the Confluence REST API. Keep the
  Markdown as the source of truth and treat Confluence as a rendering target,
  not a second place to edit.

---

IBM, IBM Z, z/OS, CICS, Db2, IMS and MQ are trademarks of IBM Corp. This glossary
is an independent reference and is not affiliated with IBM.
