---
name: slop-check
description: Measure and remove the structural signatures of machine-written prose in Turkish and English. Runs a deterministic script that counts em dashes, not-X-but-Y frames, sentence-opener concentration, contraction rate, and language-specific tells, reports each against a calibrated threshold, then rewrites what is over the line and shows a before/after table. Use this whenever writing or editing prose a human will read, such as blog posts, landing pages, documentation, reports, essays, newsletters, README bodies, long commit messages - and always before delivering substantial written content. Trigger it on "this reads like AI", "make it sound human", "anti-slop", "no em dashes", "yapay zeka yazmis gibi", "daha insan olsun", "em dashleri ucur", or any request to check, humanise, de-slop, or tighten a draft's voice.
---

# slop-check

Banned-word lists catch the laziest output and nothing else. Strip every
`delve` and `leverage` out of a draft and it can still be unmistakably machine
written. The giveaway is shape rather than vocabulary: one construction
repeated forty times, every sentence built the same way, a tidy closing line on
every paragraph, and a register with no contractions in it.

Shape can be counted. This skill counts it, shows the numbers next to
thresholds calibrated on real writing, and only then edits.

One principle governs everything below. **No word or construction is artificial
by itself.** It becomes a problem when it stands in for thought, evidence,
specificity, uncertainty, or the author's own voice. A flagged metric is a
place to look, never a verdict, and the repair is always the smallest change
that does real work.

One thing outranks every metric below: **a revision that changed what the text
says has failed, however well it now scores.** Elegance never buys back
meaning. Check that first, and if it went wrong, stop and fix that instead of
reporting numbers.

## Why measure instead of just reading

Three reasons, and the third is the one that matters.

You can't see your own rhythm. A draft that repeats one frame ten times reads
fine sentence by sentence. The repetition is only visible in aggregate.

Word lists rot fast. The vocabulary that marks generated text in one model
generation is gone in the next. Structure is far more stable, because it comes
from how the text is produced rather than from a token preference.

And a number can be argued with, which prose feelings can't. "This feels more human now" is not something
anyone can check. "Em dashes went from 6.8 per thousand words to zero, and
sentences opening with The went from 18.7% to 9.4%" is a claim the author can
verify, disagree with, or hold you to.

## Workflow

1. **Measure the draft first.** Do this before editing anything, so you have a
   baseline to show at the end.

   ```bash
   node ~/.claude/skills/slop-check/scripts/measure.mjs <file...> [--lang=tr|en|auto]
   ```

   It reads `.md`, `.txt`, `.mdx` and `.json` content files (from JSON it
   pulls only strings of four or more words, so slugs and URLs stay out).
   Multiple files are concatenated. Add `--json` for machine-readable output,
   `--quotes` to print example sentences for the English not-X-but-Y frame, and
   `--skip-blockquotes` when the document quotes bad writing as examples (a
   style guide measures itself as slop otherwise).
   Exit code is 1 when anything is flagged, 0 when nothing is.

   If Node is unavailable, count by hand with grep. Don't skip the step and edit on instinct. The whole point here is that
   instinct is what produced the draft.

2. **Read the flags, not just the count.** Each flagged metric prints what it
   means and what to do about it. Look up anything unfamiliar in
   `references/tells-en.md` or `references/tells-tr.md`, which explain every
   tell, why it reads as machine-written, and how to repair it.

3. **Fix by restructuring, never by substituting.** This is the part that usually goes wrong. Replacing an em dash with a comma leaves the sentence with the same
   rhythm and the same three-part shape, so it still reads as generated, and now it's evasive too. Break the sentence in two, or reorder it, or cut the
   clause that was doing nothing. The em dash count is a symptom. The sentence is what you're fixing.

   Same for the not-X-but-Y frame. `It is not a technology problem, it is a
   culture problem` does not improve by becoming `It is a culture problem, not
   a technology problem`. Say the thing: `Culture is what breaks here.`

   **When several metrics fire at once, fix in this order.** It runs from
   damage to decoration, and most of what this script measures sits at the
   bottom. Working upwards from the surface is how a draft ends up polished
   and wrong.

   1. Factual distortion
   2. Meaning distortion
   3. Lost uncertainty or qualification
   4. Lost authorial voice
   5. Weak reasoning
   6. Unnatural syntax
   7. Structural repetition
   8. Surface anti-patterns, which is where the em dashes live

   Change only the passages responsible. Leaving an unaffected sentence alone
   is not laziness. Rewriting it for variety is how the voice goes.

4. **Measure again and show the table.** Report before and after side by side.
   If a metric didn't move, say so rather than quietly dropping it.

   ```
   | Metric              | Before | After |
   |---------------------|--------|-------|
   | Em dashes /1k       |    6.8 |     0 |
   | not-X-but-Y /1k     |    1.6 |     0 |
   | Sentences from "The"|  18.7% |  9.4% |
   ```

   **Measure once more, not repeatedly.** Confirm the edit did not introduce a
   new distortion, then stop. There is no version of this where every number
   reaches zero and the text is better for it, and a loop that runs until the
   script is silent will contort the prose to get there.

5. **Then read it with your eyes.** The script can't see the things at the bottom of this file. A draft that passes every metric can still be lifeless.

## What you must not do while fixing

Every item here is a way to improve the score and damage the writing. They
matter more than the metrics, because a green score on a draft you have quietly
rewritten into somebody else's voice is worse than the problem you started with.

**Do not add anything the source did not have.** No new factual claim, no
invented example, no fresh causal explanation, no metaphor, no emotional
reading, no moral, no recommendation the author did not make. Improving style
does not license expanding the argument. This is the rule most easily broken
while trying to replace a flat sentence with a vivid one.

**Do not resolve productive ambiguity.** `may` is not `does`. `suggests` is not
`proves`. `appears to be` is not `is`. In Turkish, `olabilir` is not `öyledir`,
and `emin değilim` is not `bilmiyorum`. Hedging is sometimes evasion and
sometimes the most honest thing on the page, and usually only the author knows
which. When you can't tell, leave it.

**Do not polish away the person.** Keep the odd sentence, the abrupt turn, the
dry joke, the deliberate repetition, the regional expression, the visible
hesitation, the section that runs longer than its neighbours because the author
cared more about it. A perfectly smooth text can read as less human, because
the writer's decisions have stopped being visible.

**Do not chase the metrics into contortion.** Making every sentence short,
plain, or structurally unlike its neighbour so that it looks human produces its
own signature, and that signature is just as recognisable. Vary rhythm where
the thought varies. If a document is deliberately formal, symmetrical or
repetitive for a reason, the reason outranks the threshold.

**Do not swap synonyms mechanically.** A flagged phrase is a prompt to rewrite
the sentence, not to find a different word for the same empty gesture.

## Hard failures and the verdict

The section above is the reasoning. This is the checkable version of it. Any
one of these voids the result no matter what the metrics say, because they are
all ways of damaging the text while improving its score.

- A factual claim, example, quotation, or citation that is not in the source
- A causal explanation the source does not make
- A qualification or hedge removed, or a possibility stated as a fact
- The author's central position changed, softened, or reversed
- A meaningful contradiction, hesitation, or ambiguity smoothed away
- A moral, recommendation, or conclusion the author did not reach
- A metaphor or emotional reading imported from nowhere
- Material argument dropped to make the text shorter
- Prose left ungrammatical or unclear by the edit

Note that these apply when there is a source to be unfaithful to. Editing
somebody's draft, they all bite. Measuring something written from scratch in
this same session, only the last one does, and the rest are simply not in play.
Say which situation you are in rather than pretending to check all nine.

**Close with one of three verdicts, and give the evidence for it.**

- **PASSED.** No hard failure, nothing over a threshold, and the read-through
  found nothing. Show the before/after table.
- **REVISE.** No hard failure, but something is still over a threshold or the
  read-through caught something the script can't see. Name the passage, not the
  category.
- **REWRITE.** A hard failure, or so many flags that the draft is not worth
  editing sentence by sentence. Say which, and go back to what the text is
  trying to argue.

Do not attach a score. A number nobody can reproduce is worse than a sentence
saying what is wrong and where, because it invites a discussion about the
number instead of about the passage.

## What the metrics mean

Full explanations and repairs live in the reference files. The short version:

| Metric | Reads as machine-written when |
|---|---|
| Em dashes | Over 0.5 per 1k words. Citation dashes (`— Camus`) and dialogue dashes are excluded automatically. |
| Semicolons | Over 1.5 per 1k (English) or 5 per 1k (Turkish, which uses them more). |
| Sentence length spread | Standard deviation under 5.5 words. Everything built to the same length. |
| Short sentences | Under 5% below six words. Prose with no short sentences has no rhythm. |
| Top sentence opener | One word starting over 13% of sentences. Usually the definitional habit: `The mechanism is`, `The question is`. |
| not-X-but-Y (EN) | Over 0.4 per 1k. The fastest tell after the em dash. |
| Contractions (EN) | Under 5 per 1k. Their absence is what makes the register uniform. |
| Throat-clearing (EN) | Over 0.6 per 1k. `Ultimately`, `At its core`, `It is worth noting`. |
| Inflated vocabulary (EN) | Over 1.2 per 1k. `delve`, `leverage`, `robust`, `seamless`, `tapestry`. |
| Rule-of-three lists (EN) | Over 2.5 per 1k. Three parallel items, again and again. |
| Stock phrasing (EN) | Over 8 per 1k across ~55 ready-made phrases. A broad net that overlaps the two lists above on purpose. |
| sadece … değil, aynı zamanda (TR) | Over 2.0 per 1k. A literal calque of `not only`/`but also`. |
| -dir / -maktadır (TR) | Over 1.5 per 1k. Official-correspondence register. |
| -ebilir yığılması (TR) | Over 11 per 1k. Every claim softened into a possibility. |
| Hazır bağlayıcılar (TR) | Over 1.5 per 1k. `Sonuç olarak`, `Bu bağlamda`, `Unutmamak gerekir ki`. |
| Şişmiş ifadeler (TR) | Over 1.2 per 1k. `kritik öneme sahip`, `teknoloji dünyasında`. |
| Üçlü sıfat dizileri (TR) | Over 5 per 1k. |
| Edilgen çatı (TR) | Over 9 per 1k. Sentences with nobody in them. |
| Hazır ibare (TR) | Over 8 per 1k across ~45 ready-made phrases. A broad net that overlaps the narrow lists on purpose. |

## Where the thresholds come from

They are not invented. Each one sits between two measured populations.

**Turkish negative control:** 87,000 words of published human writing (two of
the author's own books). Zero of twelve metrics flagged after the citation-dash
correction. Before that correction the em dash metric flagged his own book at
6.0 per 1k, because 272 of its 274 em dashes were attributions of the
form `— Albert Camus`. That near miss is why the script strips citation and dialogue
dashes before counting, and it's a good reminder that a metric which fires on
genuinely human writing is worse than no metric at all.

**Turkish positive control:** `fixtures/tr-slop.md`. Nine of twelve flagged.
The separation is roughly an order of magnitude on most: 0.7 against 15.2 for
the `sadece` frame, 0.2 against 20.2 for `-maktadır`, 0.4 against 35.4 for the
ready-made connectives.

**Stock phrasing and Hazır ibare:** 1.2 per 1k in both Turkish books and 0 in
the approved English, against 20.2 and 46.2 in the generated fixtures.

Those lists deliberately exclude `hepimiz`, `herkes`, `kimse`, `we all`,
`everyone`, `no one` and `people naturally`, which a widely circulated
anti-slop guide files under unsupported generalisation. Measurement says
otherwise. Those six account for 260 hits across the author's two published
books and zero in the generated sample, so they track Turkish and English essay
register rather than machine authorship. Two further rules from that guide were
dropped for a different reason: false balance and epistemic flattening are
faults of argument and accuracy rather than of prose, and belong somewhere else.

**A scoring rubric was offered and declined.** It marked prose out of 100
across seven dimensions with mandatory floors per dimension. Three things ruled
it out, and they are recorded here so nobody rebuilds it.

The arithmetic contradicted itself. Passing required a total of 85 with floors
of 20/25, 11/15 and 11/15, which leaves 43 of the remaining 45 points, so a
text sitting exactly on the published floors needed 96% everywhere else. The
floors were decorative and the real bar was undisclosed.

The dimensions overlapped, so the weights described nothing. A single generic
inspirational ending lost points under specificity, structure and restraint at
once. Stylistic restraint was billed at 10 of 100 and behaved like 30.

And 48 of its 100 points required a source text to compare against, including
the gated meaning-fidelity dimension. Prose written from scratch in the same
session, which is the common case here, could not be scored at all, let alone
pass. What the rubric was good for is now in the workflow above: the priority
order, the minimal-revision rule, the single re-measure, the meaning-outranks-
style gate, and hard failures as a pass/fail category rather than a deduction.
Its instruction to return only the revised text was declined for the second
time, since the before/after table is the point.

**English:** an 8,000-word draft that the author rejected as machine-written,
against the same text after a rewrite he accepted. Five of ten flagged before,
zero after. `fixtures/en-slop.md` is a compact positive that trips nine of ten.

**Self-test.** After changing anything in the script, rerun all of these:

```bash
S=~/.claude/skills/slop-check
node $S/scripts/measure.mjs $S/SKILL.md --lang=en             # expect: nothing flagged
node $S/scripts/measure.mjs $S/fixtures/en-slop.md --lang=en  # expect: 9 of 10
node $S/scripts/measure.mjs $S/fixtures/tr-slop.md --lang=tr  # expect: 9 of 12
```

The two reference files are meant to trip the detector and always will, because
they are catalogues of the patterns and quote them on every page. Contorting
them to score clean would make them worse as documentation. Do not treat their
flags as a regression.

If a fixture stops firing, or a threshold moves without a measured reason, the
number has become decoration.

## What this cannot see

Say so rather than implying the score is the whole picture.

- **Whether it is true.** The metrics are blind to accuracy. Confident, well-shaped,
  wrong prose scores perfectly.
- **Whether it says anything.** A paragraph can pass every check and still
  carry no claim. Ask what would have to change in the world for this sentence
  to be false. If nothing, cut it.
- **The tidy closer.** Machine paragraphs tend to end on a quotable line that
  restates the paragraph. This was measured and dropped: length proxies scored
  13.5% against 9.0% on ground truth, which is not enough to act on. Check it
  by reading. If every paragraph lands a punchline, let some of them trail off
  into a qualification instead.
- **Borrowed voice.** Text can be structurally clean and still sound like
  someone else. Nothing here can detect that.

## Notes

- The script is Node built-ins only. No install, no network, nothing leaves the
  machine.
- Thresholds are a starting point, not a verdict. A technical reference page
  legitimately runs formal, and a personal essay legitimately does not. Report the
  numbers, then use judgement.
- Do not report a metric as improved unless you re-ran the script. The whole value here is that the claims are checkable, and they aren't if you
  guessed.
