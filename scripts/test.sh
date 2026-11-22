#!/usr/bin/env bash
# Regression suite. Run after any change to measure.mjs.
#   ./scripts/test.sh
set -uo pipefail
cd "$(dirname "$0")/.."
fail=0

flags() {
  local report status
  if report=$(node scripts/measure.mjs "$1" --lang="$2" --json); then
    status=0
  else
    status=$?
  fi
  if [ "$status" -ne 0 ] && [ "$status" -ne 1 ]; then
    echo "Measurement failed for $1 (exit $status)" >&2
    return 1
  fi
  printf '%s' "$report" | node -e '
    let input = "";
    process.stdin.on("data", chunk => input += chunk);
    process.stdin.on("end", () => {
      try {
        const result = JSON.parse(input);
        if (!Array.isArray(result.metrics) || !Array.isArray(result.flagged)
            || !(result.words >= 50) || result.lang !== process.argv[2]
            || Number(process.argv[1]) !== (result.flagged.length ? 1 : 0)) {
          throw new Error("missing or inconsistent measurement report");
        }
        console.log(result.flagged.length);
      } catch (error) {
        console.error(`Invalid measurement: ${error.message}`);
        process.exitCode = 1;
      }
    });
  ' "$status" "$2"
}

check() { # file lang op expected label
  local n
  if ! n=$(flags "$1" "$2"); then
    echo "  FAIL  $5: measurement unavailable"; fail=1
    return
  fi
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

# The two published books the Turkish thresholds sit on are not in the
# repository. Point this at their plain-text exports to rerun the calibration:
#   SLOP_CHECK_TR_BOOKS="book1.md book2.txt" ./scripts/test.sh
for book in ${SLOP_CHECK_TR_BOOKS:-}; do
  check "$book" tr eq 0 "Turkish book $(basename "$book")"
done

echo
echo "Positive controls — generated prose must be flagged"
check fixtures/tr-slop.md tr ge 8 "Turkish, generated"
check fixtures/en-slop.md en ge 8 "English, generated"
check fixtures/tr-slop-2.md tr ge 8 "Turkish, generated, second author"

echo
if ! node scripts/test-cli.mjs; then fail=1; fi

echo
if [ "$fail" -eq 0 ]; then echo "All checks passed."; else echo "Failures above."; fi
exit $fail
