# Alexandru Ciobanu's personal web-site

This is the place where I put all my thoughts and irrelevant posts.

Live at **[pavkam.dev](https://pavkam.dev)**.

## The theme

A hand-rolled **8-bit console** theme: green phosphor on black, the page framed
as a machine rather than a document. No Bootstrap, no jQuery, no upstream theme.

| Piece | Where |
| --- | --- |
| Palette (single source of truth) | `_config.yml`, the `crt-*` keys |
| Layout + components | `assets/css/crt.css` |
| Syntax highlighting | `assets/css/crt-syntax.css` |
| Console behaviour | `assets/js/crt.js` |
| Machine chrome (HUD strips) | `_includes/hud-top.html`, `_includes/hud-bottom.html` |
| Screens | `_layouts/`, `index.html`, `tags.html`, `404.html` |

Structure: fixed HUD strips top and bottom, a scrolling "screen" between them,
and content built from framed panels, label/value readouts and catalog rows.

Interactions: `1`–`9` jump to menu entries, `/` opens search, `Esc` closes it,
and the Konami code switches the tube to amber phosphor.

### Retuning the look

Every colour resolves from `_config.yml`, so a full palette change is a config
edit — `assets/css/crt.css` needs no changes:

```yaml
crt-bg: "#000a02"        # tube black
crt-green: "#33ff66"     # primary phosphor
crt-green-hi: "#ccffdb"  # hot phosphor / headings
crt-green-mid: "#19b347" # secondary text
crt-green-dim: "#0d7a33" # meta, labels
crt-line: "#0a4d22"      # rules, borders, pixel shadows
crt-amber: "#ffb000"     # sparing accent
```

Typography lives in the `:root` block of `assets/css/crt.css`: `--font-display`
(Press Start 2P) for chrome and headings, `--font-body` (IBM Plex Mono) for
reading and code, and `--font-glyph` for block/box-drawing characters, which
Press Start 2P does not include.

Body text carries no glow on purpose -- the phosphor bloom is reserved for
chrome and headings so long posts stay legible. `--glow` / `--glow-strong`
control it.

## Running it locally

```bash
bundle install
bundle exec jekyll serve
```

GitHub Pages builds the published site with its own legacy toolchain, so keep
templates compatible with Jekyll 3.9.

## Origins

The site started as a fork of a third-party Jekyll theme. That theme is gone --
its CSS, JavaScript, layouts, includes, gemspec and unused integrations have all
been removed, and the repository is no longer part of its fork network. A few
small Liquid helpers it left behind (`head.html`, `ext-css.html`,
`footer-scripts.html`) still trace back to it, so its MIT licence is retained in
`LICENSE`.
