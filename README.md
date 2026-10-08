# SEHS — DC International School

Revision site for **IB Sports, Exercise and Health Science SL**, 2026–27 cohort.
Ten units, released one at a time as each is taught.

## Structure

```
.
├── index.html          hub — lists all ten units, edit the UNITS block to open one
├── .nojekyll           stops GitHub's Jekyll build touching the files
├── CNAME               custom domain (one line, no https://)
├── assets/
│   ├── sehs.css        all styling, hub and units. Restyle here once.
│   └── review.js       the quiz engine. Shared. Do not edit per unit.
├── unit-01/index.html  Unit 1 — The Movement Analysts
└── _template/          starter for a new unit. Copy, rename, fill in.
```

Every unit page is the same three things: a `<head>`, a `UNIT = {...}` object holding
all the content, and a `<script src="../assets/review.js">`. The engine never changes.

## Adding a unit

1. `cp -r _template unit-02`
2. Open `unit-02/index.html` and edit the `UNIT` object: `id`, `eyebrow`, `title`,
   `sub`, `sources`, and the `topics` array.
3. In the root `index.html`, find the Unit 02 card and swap it from the "soon" shape to
   the linked shape — copy Unit 01's card and change the number, name and `href`.
4. Commit. It is live in about a minute.

Give every unit a distinct `id` (`u1`, `u2`, …). It keys the student's saved progress,
so a repeated id makes two units overwrite each other's answers.

## Content shape

```js
{s:"The question stem?",
 o:[{t:"The correct option", ok:1},
    {t:"A wrong option", f:"Why this one is tempting, and what is actually true."},
    …],
 truth:"Shown after any answer.",
 pg:"p. 259"}
```

Exactly one option carries `ok:1`. Every other option needs an `f` — that feedback is the
whole point of the tool. A written item's `ms` array must hold one entry per mark.

## Privacy

No analytics, no accounts, no network calls except Google Fonts. Student progress lives in
`localStorage` on their own device, is keyed per unit, and never leaves the browser.

## Deploying

Settings → Pages → Deploy from a branch → `main` / `(root)`.
For the custom domain, see `DNS.md`.
