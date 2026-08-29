# English tells: what each one is, why it reads as machine-written, how to repair it

Read this when a metric fires and the one-line note in the script output is not
enough. Each entry says what the pattern is, why it shows up in generated text,
and what to do instead. The repairs matter more than the diagnoses: almost every
one of these gets worse if you fix it by substitution.

## Contents

1. The em dash
2. not-X-but-Y
3. Sentence-opener concentration
4. Missing contractions
5. Throat-clearing
6. Inflated vocabulary
7. Rule-of-three
8. Semicolons
9. Sentence-length uniformity
10. Things no script can see

---

## 1. The em dash

**What fires:** more than 0.5 per thousand words, counting only prose dashes.
Citation dashes and dialogue dashes are stripped before counting.

**Why it happens:** the em dash is the most flexible punctuation mark in
English. It can stand in for a comma, a colon, a semicolon, or a pair of
brackets, so a writer who is unsure which relationship holds between two
clauses can reach for it and be technically correct every time. Generated text
is unsure constantly.

**The repair that fails:** swapping in a comma. The sentence keeps its shape,
which was the actual problem, and now the relationship between the clauses is
even vaguer.

**What to do instead:** work out what the dash was standing in for.

- Standing in for a colon (the second half explains the first): use the colon.
- Standing in for brackets (the middle is an aside): use brackets, or cut it.
  Most parenthetical asides in a first draft are not carrying anything.
- Standing in for "and so" or "because": write the connective.
- Standing in for a full stop, which is the most common case: use a full stop.

> Before: There is no template to fill in — you need one sentence and twenty
> minutes of tolerance.
> After: There is no template to fill in. You need one sentence and twenty
> minutes of tolerance.

---

## 2. not-X-but-Y

**What fires:** more than 0.4 per thousand of `is not X, it is Y`,
`isn't just X, it's Y`, or `not only X but also Y`.

**Why it happens:** it feels like insight without requiring any. The frame
manufactures a contrast, and a manufactured contrast reads as a correction of
the reader's assumption, which reads as authority. It costs nothing to produce
and it fits any two nouns.

**Why it is the fastest tell after the em dash:** a human writer reaches for it
once or twice in an essay, for a contrast that genuinely matters. Generated text
reaches for it whenever a sentence needs to sound like a point.

**What to do instead:** delete the negative half and see whether the sentence
still says anything. Usually it says more.

> Before: Data isn't just an asset, it's the foundation of every decision.
> After: Every decision here runs on data.

> Before: The problem is not the tooling, it is the culture.
> After: Culture is what breaks here. The tooling is fine.

If the contrast is real and load-bearing, keep it, but make the reader work
for it: state the wrong belief as a belief somebody holds, then say why it is
wrong. That is an argument. The frame is a rhythm.

---

## 3. Sentence-opener concentration

**What fires:** one word beginning more than 13% of sentences.

**Why it happens:** almost always `The`, and almost always the definitional
habit: `The mechanism is`, `The question is`, `The point is`, `The real risk
is`. Each one announces that a definition is coming, which is a comfortable
shape to produce and a monotonous one to read.

**What to do instead:** vary the entry point, not the words.

- Start with the verb: `Ask what would guarantee failure.`
- Start with a subordinate clause: `Once you have a direction, this works.`
- Start with the object: `Failure has five causes, and they repeat.`
- Invert: `Staying in questions is the discipline.` for `The discipline is
  staying in questions.`
- Just delete the announcement: `The mechanism is simple and it needs nobody to
  behave badly` becomes `Nothing here requires anyone to behave badly.`

Around 8-10% is normal English. Below 6% usually means you have overcorrected
into contortions.

---

## 4. Missing contractions

**What fires:** fewer than 5 per thousand words.

**Why it happens:** generated prose defaults to a uniform middle register,
and the uniformity is more noticeable than the formality. Real writing shifts:
formal in a definition, casual two sentences later.

**What to do instead:** put them where the sentence is doing something casual
and leave the formal ones alone. `You can't see your own rhythm` and `It does
not follow that the metric is wrong` can sit in the same paragraph. That mixture
is the signal.

Technical reference documents legitimately run lower. Use judgement rather than
hitting a number.

---

## 5. Throat-clearing

**What fires:** more than 0.6 per thousand of `Ultimately`, `At its core`,
`In essence`, `Fundamentally`, `It's worth noting`, `When it comes to`,
`In today's`, `That being said`, `Needless to say`.

**Why it happens:** they buy a beat before the sentence commits to anything.

**What to do instead:** delete the opener and read the sentence. It is almost
always better, and if it is worse, the sentence needed work rather than a
preamble.

`Needless to say` is the special case: if it were needless, it would not be
there.

---

## 6. Inflated vocabulary

**What fires:** more than 1.2 per thousand of `delve`, `leverage`, `utilize`,
`harness`, `unlock`, `elevate`, `seamless`, `robust`, `testament to`,
`tapestry`, `realm of`, `landscape of`, `crucial`, `pivotal`, `myriad`,
`plethora`, `underscore`, `showcase`.

**Why it happens:** these words score as sophisticated without carrying
anything. Most have a short common word underneath.

**What to do instead:** `leverage` is `use`. `utilize` is `use`. `delve into`
is `look at` or `read`. `robust` is `hard to break`, and if you cannot say how
it is hard to break, the word was doing nothing. `seamless` is usually a claim
you have not tested. `crucial` and `pivotal` are asking the reader to take your
word for the importance; say what happens if it is missing instead.

The list dates fast, which is why it is only one metric out of ten. A draft can
be clean here and still be obviously generated.

---

## 7. Rule-of-three

**What fires:** more than 2.5 per thousand of `X, Y, and Z`.

**Why it happens:** three parallel items is a satisfying rhythm and a
convenient length. It becomes a tell when it is the only list shape in the
document, because real thinking produces lists of two, four and seven as well.

**What to do instead:** count how many things there actually are. If the third
item was added for cadence, cut it. If there are five, write five.

---

## 8. Semicolons

**What fires:** more than 1.5 per thousand.

**Why it happens:** the same uncertainty as the em dash, in a more formal
register. A semicolon joins two independent clauses whose relationship the
writer has not named.

**What to do instead:** a full stop, nearly always. Keep the semicolon for lists
whose items contain their own commas, which is the one job nothing else does.

---

## 9. Sentence-length uniformity

**What fires:** standard deviation under 5.5 words.

**Why it happens:** two opposite failure modes produce it. Either everything is
a medium-length declarative, or everything has been chopped into short punchy
fragments for effect. Both read as machine-made because both are consistent.

**What to do instead:** you need genuinely short sentences (under six words)
and genuinely long ones (over thirty-five) in the same piece. Short ones land a
point. Long ones carry a qualification that a short one cannot hold. If your
draft has neither, you are writing at one volume.

This metric will not fire on every bad draft. A draft with heavy em dash and
semicolon use often has high variance for the wrong reason, and passes.

---

## 10. Judgment only, not measured

Nothing below has a number attached, and the script will never flag any of it.
That is not a reason to skip it. It is a reason to say plainly which part of
your assessment is measurement and which part is opinion, so the author can
disagree with the opinion.

### Manufactured paradox

An ordinary qualification dressed as a reversal. `Sometimes we must slow down
to move forward.` `The way to gain control is to let go.` `Our greatest
strength lies in accepting weakness.` A paradox should expose a real
contradiction. These decorate a familiar observation and ask to be admired for
it.

### Fake depth

Sentences that sound philosophical and make no claim you could interpret,
test, or disagree with. `Change is the only constant.` `We are all authors of
our own stories.` `Life is not about answers but about asking the right
questions.` Ask what the reader can now understand that they could not before.
If nothing, cut the sentence rather than rewriting it.

### Forced imagery

Metaphor added to make informational prose feel literary. The recurring set is
small and recognisable: journey, landscape, tapestry, dance, bridge, compass,
unlock, navigate, the dawn of a new era. Keep a metaphor when it clarifies a
relationship or genuinely belongs to how this author talks. Cut it when it is
there for texture.

### Borrowed intimacy

Simulating a relationship with the reader that the piece has not earned.
`We have all been there.` `Let's be honest.` `Imagine for a moment.` `Join me
as we explore.` `You may have noticed.` Direct address is fine when the genre
supports it and the author actually writes that way. It is a tell when it
arrives in paragraph one of an analytical piece.

### Unmotivated rhetorical questions

Questions whose answers are obvious, supplied immediately, or beside the point.
`What does this mean for the future?` `So where do we go from here?` State the
next claim. A rhetorical question earns its place only when it creates real
pressure the reader has to sit with.

### Generic endings

Three variants, all of which end the piece without concluding it.

*Summary without development.* `In conclusion`, `To sum up`, `All things
considered`, `The importance of X will only continue to grow.` The ending
restates the opening and adds nothing.

*Inspirational inflation.* `The future is ours to shape.` `Change begins with
us.` `Together we can build a better tomorrow.` An analytical piece converted
into motivation in its last paragraph.

*Artificial open-endedness.* `Perhaps the real question is not what will change
but who we will become.` `Only time will tell.` A vague question attached to
manufacture depth.

A good ending does at least one real thing: states the consequence of the
argument, exposes the tension that survives it, narrows the claim, returns to a
concrete image, names what is still unknown, or leaves one precise question.
Otherwise stop where the reasoning stops.

### Heading overload and listification

A heading every second paragraph, or generic ones like `The Challenge`, `The
Opportunity`, `The Future`, simulates structure rather than revealing it. The
same goes for bullets: when one idea causes another, when sequence matters, or
when a qualification depends on the claim before it, that is prose. Lists are
for items that are genuinely parallel and independent.

### Synonym rotation

The same thing renamed to avoid repetition, so a product becomes a platform,
then a solution, then an ecosystem, then an offering. In technical and
reference writing this is a real fault: stable terminology is clearer than
variety, and each new word implies a distinction that does not exist. In
essays and criticism, elegant variation is normal and long-standing. Judge by
whether the reader could be misled into thinking two things are meant.

### Abstract noun chains

Sentences built almost entirely from abstractions, with no actor and no action.
`The effective management of digital transformation processes is of critical
importance for the sustainability of organisational agility.` Ask who is
acting, what they are doing, under what conditions, and what changes as a
result. Rewrite with whichever of those the source actually supplies, and no
more.

### Causal language beyond the evidence

`X leads to Y`, `X is the reason why`, `this inevitably results in`, where the
source supports only sequence, correlation, or possibility. The repair is not
to hedge everything, which flattens the text in the other direction. It is to
make the strength of the language match the strength of the evidence: `may
contribute to`, `appears to be associated with`, `is one possible explanation`.

### Unnecessary explanation

`In other words`, `What this means is`, `This demonstrates that`, followed by a
restatement a competent reader already made. Keep the gloss when it adds
precision. Cut it when it repeats the previous sentence in duller words.

### The tidy closer

Every paragraph ending on a short quotable line that restates the paragraph.
This was measured and dropped: length proxies scored 13.5% against 9.0% on
ground truth, which is not enough to act on. Check by reading. Let some
paragraphs end on a qualification, or on the least important sentence, or just
stop.

### Empty claims

A sentence that could not be false is carrying nothing. Ask what would have to
change in the world for it to be wrong. If nothing, cut it.

### Symmetry

Four sections of four paragraphs, each with the same internal shape. Real
writing is lumpy, because some parts deserve more room than others.

### Borrowed voice

Structurally clean text that sounds like somebody else. The usual cause is that
the draft summarises what has already been written on the subject instead of
saying what this author thinks. No script detects this.

### Translation-shaped English

English carrying Turkish syntax: very long sentences with stacked subordinate
clauses, omitted subjects where English requires them, abstract nominal
constructions, and unnatural `therefore`, `thus` and `in this context`. Rewrite
to English rhythm rather than translating clause by clause.
