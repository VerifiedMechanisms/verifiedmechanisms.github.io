# verifiedmechanisms.github.io

Website for [verifiedmechanisms.ai](https://verifiedmechanisms.ai). Static HTML, no build step,
served by GitHub Pages from `main` at the repository root.

## Layout

| Path | What |
| --- | --- |
| `index.html` | The one-pager: hero, about, research, open outputs, team, careers |
| `careers/research-scientist/` | Research Scientist role page |
| `careers/research-engineer/` | Research Engineer role page |
| `assets/site.css` | Shared stylesheet for all three pages |
| `assets/site.js` | Nav behaviour, theme toggle, scroll reveal |
| `assets/hero.js` | Hero node-graph canvas (index only) |
| `assets/logo.svg`, `assets/logo-light.svg` | The mark, one per theme |
| `assets/favicon.svg`, `assets/favicon-light.svg` | The mark on a rounded ground |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Serve files as-is, no Jekyll processing |

## Running it locally

```sh
python3 -m http.server 8000
```

Then open <http://127.0.0.1:8000>. Root-relative paths (`/assets/...`) mean the site must be served,
not opened as a `file://` URL.

## Copy

Site copy is drawn from the project's existing public material rather than written fresh, chiefly
the [Manifund project page](https://manifund.org/projects/formally-verified-autoresearch-for-theoretical-mech-interp),
the [xorformer](https://github.com/VerifiedMechanisms/xorformer) README and `formalization/` docs,
the SPAR project proposal, and the LessWrong post. When editing, keep it that way and do not
introduce technical claims that no source supports.

Two things to watch if detailed results are ever added back:

- **Epistemic tiers.** Only Lemmas 1-12 and the Theorem 13 separation are Lean-checked; the wider
  autoresearch ledger is verified to a weaker standard. The site currently makes no claim specific
  enough to need the caveat, but anything that names a count of verified theorems does.
- **Scope on XOR.** `H*(XOR_n) = n` is the general result; the LessWrong post covers the two-bit
  case. They are consistent, but do not merge them into one claim.

## Theme

Dark is the default. A small inline script in each `<head>` stamps `data-theme` on `<html>` before
first paint, from `localStorage` or the OS preference, so there is no flash. The nav toggle writes
`vm-theme` to `localStorage`; until a visitor picks for themselves, the site follows the OS. A
`prefers-color-scheme` block in the CSS covers the no-JS case, and `hero.js` listens for the
`themechange` event to repaint the canvas.

## The mark

Both marks are contour traces of `project-management/artifacts/logo.png`, so the geometry is
identical to the original in each.

- `logo-light.svg` keeps the original fills unchanged: navy `#071737`, coral `#F94F44`, cyan
  `#31D5FC`, with the cream ground dropped to transparent.
- `logo.svg` recolours them for the dark ground: `#6E9BF0`, `#9B97E8`, `#4FD8F5`.

The two themes therefore run on different palettes by design. Light is the original mark's world,
cream and navy with a coral accent. Dark follows the reference screenshot and holds to one cool
band (cyan 190°, blue 219°, violet 243°), which is why the coral arm reads violet there.

## Custom domain

`CNAME` sets the domain on GitHub's side. DNS lives in Cloudflare and needs four `A` records on the
apex pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus
a `www` `CNAME` to `verifiedmechanisms.github.io`. Records must be **DNS only** (grey cloud), or
GitHub cannot complete certificate issuance.
