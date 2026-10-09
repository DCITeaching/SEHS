# SEHS — DC International School

Revision site for **IB Sports, Exercise and Health Science SL**, 2026–27 cohort.
Ten units, released one at a time as each is taught.

## Structure

```
.
├── index.html          hub — lists all ten units, edit the cards to open one
├── .nojekyll           stops GitHub's Jekyll build touching the files
├── CNAME               custom domain (one line, no https://) — add when you set DNS
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
 o:[{t:"A wrong option", f:"Why this one is tempting, and what is actually true."},
    {t:"The correct option", ok:1},
    …],
 truth:"Shown after any answer.",
 pg:"p. 259"}
```

Exactly one option carries `ok:1`. Every other option needs an `f` — that feedback is the
whole point of the tool. A written item's `ms` array must hold one entry per mark.

**Vary which position holds `ok:1`.** The page labels options A–D in array order, so if every
item is keyed first, every answer is A. Unit 1 runs roughly even across the four positions.
Keep a superset option ("All of these…") in last position wherever one appears.

## The dossier coach

`unit-01/dossier/` is a different kind of page and deliberately contains no subject content.
Every student's dossier analyses a different movement, so nothing generic could supply an
answer. It asks interrogating questions, carries the four criteria from the brief verbatim,
takes the student's own best-fit self-mark, and turns the result into a prioritised list of
what to fix. Content questions are routed back to the unit review and the book.

If you build one for a later unit's anchor task, keep that rule: questions about *their*
work, never statements about the subject.

## Privacy

No analytics, no accounts, no network calls except Google Fonts. Student progress lives in
`localStorage` on their own device, is keyed per unit, and never leaves the browser.

## Deploying

Settings → Pages → Deploy from a branch → `main` / `(root)`.
For the custom domain, see `DNS.md`.
