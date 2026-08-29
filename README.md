# prose-tells

Measures the structural signatures of machine-written prose in **Turkish and
English**, reports each against a calibrated threshold, and only then edits.

Blacklists catch the laziest output and little else. Strip every `delve`
and `leverage` from a draft and it can still be unmistakably generated, because
the giveaway is shape: one construction repeated forty times, every sentence
built the same way, a register with no contractions in it. Shape can be
counted.

```bash
node scripts/measure.mjs draft.md --lang=en
```

```
prose-tells  ·  draft.md
8250 words, 509 sentences, mean 15.8 words, language en

  ! Em dashes                  6.8  per 1k words
  ! Semicolons                 2.1  per 1k words
    Sentence length spread     9.8  stdev, words
    Short sentences            7.3  % under 6 words
  ! Top sentence opener       18.7  % start with "the"
  ! not-X-but-Y frames         1.6  per 1k words
  ! Contractions               3.8  per 1k words
    Throat-clearing              0  per 1k words
    Inflated vocabulary          0  per 1k words
    Stock phrasing               0  per 1k words
    Rule-of-three lists        0.2  per 1k words

5 of 11 over the line
```

Exit code is 1 when something's flagged and 0 when nothing is, so it drops into
a pre-commit hook. Node built-ins only: no install, no network, nothing leaves
the machine.

## Where the thresholds come from

Not from taste. Each sits between two measured populations, and the corpora are
in `fixtures/` so you can check.

| Corpus | Flags |
|---|---|
| Turkish, published, never edited against these metrics (87k words) | **0 of 13** |
| English, drafted by a model and revised until the author accepted it | **0 of 11** |
| The same English draft before that revision | **5 of 11** |
| Turkish, generated | **10 of 13** |
| English, generated | **10 of 11** |

Run `./scripts/test.sh` to reproduce the fixture rows.

That Turkish negative control matters most, because it's published prose that
was never written with these metrics in mind. A measure which fires on
genuinely human writing is worse than no measure at all, and this one nearly
did. Before the citation
dash was excluded, the em dash metric flagged that book at 6.0 per 1k words,
because 272 of its 274 em dashes were attributions of the form `— Albert
Camus`. Citation and dialogue dashes are stripped now before anything is counted.

## Turkish

Turkish tells are the part no English guide covers, because most generated
Turkish is English reasoning carried across: grammatically flawless, and
nothing a Turkish speaker would build.

| Metric | Human baseline | Generated |
|---|---|---|
| `sadece … değil, aynı zamanda` | 0.7 | 15.2 |
| `-dir` / `-maktadır` | 0.2 | 20.2 |
| Ready-made connectives | 0.4 | 35.4 |
| Inflated phrases | 0 | 25.3 |
| Passive voice | 4.4 | 35.4 |

Per 1,000 words. Each is explained in `references/tells-tr.md`, along with how to repair it
without flattening the sentence.

Three rules from circulating anti-slop guides were **rejected on evidence**, and
why is recorded in `SKILL.md`. Here's the clearest: `hepimiz`, `herkes`,
`kimse`, `we all`, `everyone` and `no one`, commonly filed under unsupported
generalisation, appear 260 times across the two human books and zero times in
the generated sample. They measure essay register, not machine authorship.

## What it will not do

It can't tell you whether the text is true, whether it says anything, or
whether it sounds like somebody else. `references/tells-en.md` and
`references/tells-tr.md` each close with a judgment-only layer for the things
no count reaches, marked as judgment so nobody mistakes it for measurement.

It also won't chase a score. `SKILL.md` carries a fix-priority order running
from factual distortion down to surface anti-patterns, a minimal-revision rule,
and a single re-measure as the stop condition. Making every sentence short and
unlike its neighbour so it looks human produces its own signature, and that
one's just as recognisable.

## Install

As a Claude Code skill:

```bash
git clone https://github.com/ratipcan-uysal/prose-tells.git
ln -s "$(pwd)/prose-tells" ~/.claude/skills/prose-tells
```

Or use `scripts/measure.mjs` on its own. It reads `.md`, `.txt`, `.mdx` and
`.json` content files, and from JSON it takes only strings of four or more
words, so slugs and URLs stay out.

```
--lang=tr|en|auto     default auto
--json                machine-readable output
--quotes              print example sentences for the not-X-but-Y frame
--skip-blockquotes    for documents that quote bad writing as examples
```

## Licence

MIT, except `fixtures/tr-human.md` and `fixtures/en-human.md`. Those are
excerpts of the author's own published writing, included for testing only, and
their headers say so.
