#!/usr/bin/env node
/** Input-contract regressions. Uses only synthetic temporary files and built-ins. */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const script = process.env.SLOP_MEASURE_SCRIPT
  || fileURLToPath(new URL("./measure.mjs", import.meta.url));
const human = fileURLToPath(new URL("../fixtures/en-human.md", import.meta.url));
const temp = mkdtempSync(join(tmpdir(), "slop-check-cli-"));
const paragraph = "This synthetic passage supplies ordinary prose for an input contract test. "
  + "Its content has no calibration role and must not be mistaken for a published source. "
  + "A valid export can be measured, while damaged serialization must produce an explicit error. ";
const valid = join(temp, "valid.json");
const broken = join(temp, "broken.json");
const empty = join(temp, "empty.txt");
writeFileSync(valid, JSON.stringify({ article: paragraph.repeat(3) }));
writeFileSync(broken, '{"article": "' + paragraph.repeat(3));
writeFileSync(empty, "");
// Each Turkish pattern below starts or ends with ö, ç, ş, ı or ü, or opens a
// sentence with İ. JavaScript's ASCII-only \b skipped all of them until 1.1.0.
const trEdges = join(temp, "tr-edges.md");
const trFalse = join(temp, "tr-false.md");
const trFiller = "Sabah erkenden kalkıp denize yürüdük ve kahvaltıyı taş evin bahçesinde yaptık. ".repeat(4);
writeFileSync(trEdges, trFiller + "Özetle iş bitti. Kısacası kimse gelmedi. Dijital çağında yaşıyoruz. "
  + "Toplantı önemli bir rol oynuyor. Rapor yapılmış. Hedef görülmüş. Bu konu önemlidir. İlk olarak dosyayı açtık.");
const trRun = join(temp, "tr-run.md");
writeFileSync(trRun, trFiller + "Bu yöntem hızlıdır. Kurulumu kolaydır. Bakımı da ucuzdur. Yıllardır kullanıyoruz.");
writeFileSync(trFalse, trFiller + "Usta bir düşünür gibi baktı. Dağ buradan görünür. Hâlâ düşünmekte.");

let failures = 0;
function run(args) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
  if (result.error) throw result.error;
  return result;
}
function check(name, fn) {
  try { fn(); console.log(`  ok    ${name}`); }
  catch (error) { failures++; console.error(`  FAIL  ${name}: ${error.message}`); }
}
function inputError(args) {
  const result = run(args);
  assert.equal(result.status, 2, "input errors must exit 2");
  assert.equal(result.stdout.trim(), "", "an invalid input must not produce metrics");
  assert.notEqual(result.stderr.trim(), "", "an input error needs an explanation");
}

try {
  console.log("Input errors — never a successful metric result");
  check("missing source file", () => inputError([join(temp, "missing.md"), "--lang=en", "--json"]));
  check("malformed JSON", () => inputError([broken, "--lang=en", "--json"]));
  check("unsupported language", () => inputError([human, "--lang=de", "--json"]));
  check("empty language option", () => inputError([human, "--lang=", "--json"]));
  check("unknown option", () => inputError([human, "--lang=en", "--jsno", "--json"]));
  check("not enough prose", () => inputError([empty, "--lang=en", "--json"]));
  check("missing file argument", () => inputError(["--json"]));
  check("JSON and examples remain one parseable report", () => {
    const generated = fileURLToPath(new URL("../fixtures/en-slop.md", import.meta.url));
    const result = run([generated, "--lang=en", "--json", "--quotes"]);
    const report = JSON.parse(result.stdout);
    assert.ok(Array.isArray(report.examples));
    assert.ok(report.examples.length > 0);
    assert.equal(report.metrics.length, 11);
  });
  console.log("\nTurkish matching");
  check("Turkish patterns at non-ASCII word edges are counted", () => {
    const report = JSON.parse(run([trEdges, "--lang=tr", "--json"]).stdout);
    const n = key => Math.round(report.metrics.find(m => m.key === key).value * report.words / 1000);
    assert.equal(n("baglayici"), 3, "Özetle, Kısacası, İlk olarak");
    assert.equal(n("sismis"), 2, "çağında, önemli bir rol oynuyor");
    assert.equal(n("edilgen"), 2, "yapılmış, görülmüş");
    assert.equal(n("dir"), 1, "önemlidir");
  });
  check("active -ünür and -ünmekte forms are not counted as passive", () => {
    const report = JSON.parse(run([trFalse, "--lang=tr", "--json"]).stdout);
    assert.equal(report.metrics.find(m => m.key === "edilgen").value, 0);
  });
  check("three -dır endings in a row count as one run, yıllardır does not extend it", () => {
    const report = JSON.parse(run([trRun, "--lang=tr", "--json"]).stdout);
    const m = report.metrics.find(x => x.key === "dirseri");
    assert.equal(Math.round(m.value * report.words / 1000), 1);
  });
  check("valid JSON still produces metrics", () => {
    const result = run([valid, "--lang=en", "--json"]);
    assert.ok(result.status === 0 || result.status === 1);
    const report = JSON.parse(result.stdout);
    assert.equal(report.lang, "en");
    assert.ok(report.words >= 50);
    assert.equal(report.metrics.length, 11);
    assert.equal(result.status, report.flagged.length ? 1 : 0);
  });
} finally {
  rmSync(temp, { recursive: true });
  assert.equal(existsSync(temp), false);
  console.log(`Temporary input fixtures removed: ${temp}`);
}
process.exitCode = failures ? 1 : 0;
