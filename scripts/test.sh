#!/usr/bin/env bash
# Regression suite. Run after any change to measure.mjs.
#   ./scripts/test.sh
set -u
cd "$(dirname "$0")/.."
M="node scripts/measure.mjs"
fail=0

flags() { $M "$1" --lang="$2" 2>/dev/null | grep -Eo '^[0-9]+ of' | head -1 | cut -d' ' -f1; }

check() { # file lang op expected label
  local n; n=$(flags "$1" "$2"); n=${n:-0}
  if [ "$3" = "eq" ] && [ "$n" -ne "$4" ]; then
    echo "  FAIL  $5: expected $4 flags, got $n"; fail=1
  elif [ "$3" = "ge" ] && [ "$n" -lt "$4" ]; then
    echo "  FAIL  $5: expected at least $4 flags, got $n"; fail=1
  else
    echo "  ok    $5 ($n flagged)"
  fi
}

echo "Negative controls — human prose must not be flagged"
check fixtures/tr-human.md tr eq 0 "Turkish, published, never edited against these metrics"
check fixtures/en-human.md en eq 0 "English, revised to pass (regression guard only)"
check SKILL.md            en eq 0 "this skill's own documentation"

echo
echo "Positive controls — generated prose must be flagged"
check fixtures/tr-slop.md tr ge 8 "Turkish, generated"
check fixtures/en-slop.md en ge 8 "English, generated"

echo
if [ "$fail" -eq 0 ]; then echo "All checks passed."; else echo "Failures above."; fi
exit $fail
