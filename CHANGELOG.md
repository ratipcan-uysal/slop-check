# Changelog

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
