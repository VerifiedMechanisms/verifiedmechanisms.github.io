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
| `assets/site.js` | Nav behaviour and scroll reveal |
| `assets/hero.js` | Hero node-graph canvas (index only) |
| `assets/logo.svg`, `assets/favicon.svg` | The mark |
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

Two things to preserve in particular:

- **Epistemic tiers.** Only Lemmas 1-12 and the Theorem 13 separation are Lean-checked; the wider
  autoresearch ledger is verified to a weaker standard. The research section says so explicitly.
- **Scope on XOR.** `H*(XOR_n) = n` is the general result; the LessWrong post covers the two-bit
  case. They are consistent, but do not merge them into one claim.

## The mark

`assets/logo.svg` is a contour trace of `project-management/artifacts/logo.png`, recoloured for the
dark ground: navy `#071737` to `#7BA6F0`, coral `#f94f44` to `#D48FC4`, cyan `#31d5fc` to `#4FD8F5`,
and the cream ground dropped to transparent. The geometry is unchanged from the original.

## Custom domain

`CNAME` sets the domain on GitHub's side. DNS lives in Cloudflare and needs four `A` records on the
apex pointing at `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, plus
a `www` `CNAME` to `verifiedmechanisms.github.io`. Records must be **DNS only** (grey cloud), or
GitHub cannot complete certificate issuance.
