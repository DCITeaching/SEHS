# SEHS — Unit 1 review

Self-paced revision for **IB Sports, Exercise and Health Science SL, Unit 1: The Movement Analysts**
(DC International School, 2026–27 cohort).

**Live site:** https://<your-username>.github.io/SEHS/

## What it is

A single-page study tool covering syllabus statements B.1.1 to B.1.4, plus a Paper 1B
data-skills module. Five topics, 57 multiple-choice questions and 11 written items.

Every wrong answer returns three things: why that option was tempting, what is actually
correct, and the page in the course textbook that settles it. Written items reveal a
markscheme the student ticks themselves, point by point.

Nothing is recorded or transmitted. Progress is kept in the browser's own storage on the
student's device and never leaves it.

## Deploying

This is one self-contained file with no build step and no dependencies to install.

1. Put `index.html` in the repository root.
2. Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)`.
3. The site appears at `https://<your-username>.github.io/SEHS/` within a minute or two.

Fonts load from Google Fonts; everything else is inline. The page works offline once cached,
falling back to system fonts.

## Editing the questions

All content lives in the `T` array near the top of the `<script>` block at the end of the file.
Each topic has `study`, `mcq` and `written`. One MCQ looks like this:

```js
{s:"The question stem",
 o:[{t:"The correct option", ok:1},
    {t:"A wrong option", f:"Why this one is tempting, and what is actually true."},
    …],
 truth:"The explanation shown after any answer.",
 pg:"p. 259"}
```

Exactly one option carries `ok:1`. Every other option needs an `f`. A written item's
`ms` array must have one entry per mark.

## Sources

Content and page references come from the course textbook, chapters B.1.1 (pp. 252–268),
B.1.2 (269–280), B.1.3 (281–299) and B.1.4 (300–307). Sections marked **AHL** are
Additional Higher Level and are not assessed at SL.
