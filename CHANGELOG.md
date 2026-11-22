# Changelog

## 1.1.0 (2026-11-22)

- Turkish patterns now use Unicode letter boundaries and Turkish lower-casing.
  JavaScript's `\b` and `\w` are ASCII-only, so every Turkish pattern starting
  or ending in ş, ı, ö, ç, ü or ğ (`Özetle`, `çağında`, `önemlidir`, `-ılmış`)
  had never been counted. A regression test fails on the old boundary.
- Passive list completed for vowel harmony (`-ülür`, `-ulmuş`, `-ülmüş`,
  `-ülmekte`); `-ünür` and `-ünmekte` removed because they matched the active
  `düşünür`, `görünür`, `düşünmekte`.
- New Turkish metric: runs of three or more sentences ending on the same
  `-dır` family. Books 0.3 per 1k, generated fixture 10.1, threshold 3.
- Hazır ibare gains fourteen phrases from yucezerey/turkish-anti-ai-skill
  (MIT), each absent from both books.
- Second generated Turkish fixture, `fixtures/tr-slop-2.md`, from the same
  project's examples, so positive controls come from two authors.
- `references/tells-tr.md` gains the syntax tells that cannot be counted:
  right-branching relative clauses, cleft sentences, `ve` instead of
  converbs, redundant pronouns, `bir` and `kendi`, light verbs.
- `SLOP_CHECK_TR_BOOKS` in `scripts/test.sh` reruns the book calibration from
  local exports.

## 1.0.0

First release.

- Eleven metrics for English, thirteen for Turkish, each threshold sitting
  between a measured human corpus and a measured generated one.
- Turkish tells that no English guide covers: the `sadece … değil, aynı
  zamanda` calque, the `-maktadır` register, ready-made connectives, inflated
  phrases, passive voice with nobody in it.
- Citation and dialogue dashes excluded before em dashes are counted. Without
  that the metric flagged a published human book at 6.0 per 1k words.
- Three rules from circulating anti-slop guides rejected on evidence, with the
  measurements recorded in `SKILL.md`.
- Fix-priority order, hard failures, minimal-revision rule, and a single
  re-measure as the stop condition, so the skill does not chase its own score.
- `scripts/test.sh` reproduces the calibration rows.
