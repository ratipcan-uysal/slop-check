#!/usr/bin/env node
/**
 * prose-tells: measure the structural signatures of machine-written prose.
 *
 * Word blacklists date fast and only catch the laziest output. What survives
 * a search-and-replace pass is the shape of the writing: uniform sentence
 * length, one construction repeated forty times, a tidy closing line on every
 * paragraph. This measures shape.
 *
 *   node measure.mjs <file...> [--lang tr|en|auto] [--json] [--quotes]
 *
 * Node built-ins only. No install step, nothing leaves the machine.
 */
import { readFileSync } from "node:fs";

// ── input ────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flags = new Set(argv.filter(a => a.startsWith("--")));
const files = argv.filter(a => !a.startsWith("--"));
const langArg = (argv.find(a => a.startsWith("--lang=")) || "").split("=")[1] || "auto";
const asJson = flags.has("--json");
const showQuotes = flags.has("--quotes");
// Style guides quote the patterns they warn about, usually inside blockquotes.
// Counting those examples as usage makes a document about bad writing look
// like bad writing.
const skipBlockquotes = flags.has("--skip-blockquotes");

if (!files.length) {
  console.error("usage: measure.mjs <file...> [--lang=tr|en|auto] [--json] [--quotes] [--skip-blockquotes]");
  process.exit(2);
}

/** JSON content files hold prose next to slugs and URLs; keep only the prose. */
function stringsFromJson(node, out = []) {
  if (typeof node === "string") {
    if (node.split(/\s+/).length >= 4 && !/^https?:\/\//.test(node)) out.push(node);
  } else if (Array.isArray(node)) {
    node.forEach(v => stringsFromJson(v, out));
  } else if (node && typeof node === "object") {
    Object.values(node).forEach(v => stringsFromJson(v, out));
  }
  return out;
}

function extract(path) {
  const raw = readFileSync(path, "utf8");
  if (path.endsWith(".json")) {
    try { return stringsFromJson(JSON.parse(raw)).join("\n\n"); } catch { /* fall through */ }
  }
  return raw
    .replace(/^---\n[\s\S]*?\n---\n/, "")        // frontmatter
    .replace(skipBlockquotes ? /^\s*>.*$/gm : /(?!)/g, "")
    .replace(/```[\s\S]*?```/g, "")              // fenced code
    .replace(/^\s{4,}\S.*$/gm, "")               // indented code
    // Inline code spans are where a document quotes the very patterns this
    // measures. Counting them flagged this skill's own SKILL.md 6 times for
    // words it was warning against.
    .replace(/`[^`\n]*(?:\n[^`\n]*)?`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")        // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")     // links keep their text
    .replace(/^#{1,6}\s+/gm, "")                 // heading markers
    .replace(/[*_`>]/g, "");
}

const text = files.map(extract).join("\n\n").replace(/\r/g, "");

// ── segmentation ─────────────────────────────────────────────────
const ABBREV = /\b(vb|vs|bkz|Dr|Prof|Doç|Av|Sn|St|Mr|Mrs|Ms|Jr|Sr|e\.g|i\.e|etc|No|Nr)\.$/i;

const paragraphs = text.split(/\n\s*\n/).map(p => p.replace(/\s+/g, " ").trim()).filter(p => p.length > 30);

function sentences(p) {
  const out = [];
  let buf = "";
  for (const part of p.split(/(?<=[.!?…])\s+/)) {
    buf = buf ? buf + " " + part : part;
    if (ABBREV.test(buf.trim())) continue;
    out.push(buf.trim());
    buf = "";
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter(s => s.split(/\s+/).length >= 2);
}

const sents = paragraphs.flatMap(sentences);
const words = text.split(/\s+/).filter(Boolean);
const W = words.length;
const per1k = n => (W ? (n * 1000) / W : 0);

if (!sents.length || W < 50) {
  console.error("Not enough prose to measure (need ~50+ words).");
  process.exit(2);
}

// ── language ─────────────────────────────────────────────────────
const trHits = (text.match(/[ğışçöüĞİŞÇÖÜ]|\b(bir|ve|için|olarak|bu|daha|ile)\b/gi) || []).length;
const lang = langArg !== "auto" ? langArg : (per1k(trHits) > 30 ? "tr" : "en");

// ── helpers ──────────────────────────────────────────────────────
const count = re => (text.match(re) || []).length;

/**
 * An em dash after a quotation is a citation, not a prose dash. Measured
 * against 87,000 words of the author's own published Turkish, 272 of 274 em
 * dashes were attributions of the form "— Albert Camus". Counting those would
 * have flagged his own book as machine-written, which is how you get a metric
 * nobody trusts. Dialogue dashes at the start of a line come out too.
 */
const proseOnly = text
  .replace(/^\s*[—–]/gm, "")
  .replace(/[—–]\s*[\p{Lu}][^.!?\n]{0,45}$/gmu, "");
const countProse = re => (proseOnly.match(re) || []).length;
const matches = re => (text.match(re) || []);

const lens = sents.map(s => s.split(/\s+/).length);
const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
const stdev = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length);

const openers = {};
for (const s of sents) {
  const w = s.split(/\s+/)[0].replace(/[^\p{L}']/gu, "").toLowerCase();
  if (w) openers[w] = (openers[w] || 0) + 1;
}
const topOpeners = Object.entries(openers).sort((a, b) => b[1] - a[1]);

// ── metric table ─────────────────────────────────────────────────
// Thresholds are calibrated against a real before/after pair: an 8,000-word
// draft that read as machine-written, and the same text after a rewrite the
// author accepted. A metric is flagged when it lands on the wrong side.
const METRICS = [];
const add = (key, label, value, unit, bad, note) =>
  METRICS.push({ key, label, value: Number(value.toFixed(1)), unit, bad: bad(value), note });

add("emdash", "Em dashes", per1k(countProse(/—/g)), "per 1k words", v => v > 0.5,
    "The single most recognisable marker. Restructure the sentence rather than swapping in an en dash.");
add("semicolon", "Semicolons", per1k(count(/;/g)), "per 1k words", v => v > (lang === "tr" ? 5 : 1.5),
    "Reads formal and assembled. A full stop almost always works.");
add("sentvar", "Sentence length spread", stdev, "stdev, words", v => v < 5.5,
    `Mean ${mean.toFixed(1)} words. Low spread means every sentence was built the same way.`);
add("short", "Short sentences", (100 * lens.filter(l => l < 6).length) / lens.length, "% under 6 words", v => v < 5,
    "Writing with no short sentences has no rhythm. Real prose stops dead sometimes.");
add("opener", "Top sentence opener", topOpeners[0] ? (100 * topOpeners[0][1]) / sents.length : 0, `% start with "${topOpeners[0] ? topOpeners[0][0] : ""}"`, v => v > 13,
    "Above ~13% means a definitional habit: The mechanism is, The question is, The point is.");

if (lang === "en") {
  // The separator can be a comma or a dash but never a full stop. Allowing
  // one let the frame span two sentences and matched innocent prose such as
  // "...everything that is not the road. That is what makes them useful."
  add("notxbuty", "not-X-but-Y frames", per1k(
        count(/\b(is|are|was|were|isn't|aren't|it's)\s+not\s+(just\s+)?[^.,;:]{2,60}[,—–]?\s*(it|they|that|this)('s|s|\s+is|\s+are)\b/gi) +
        count(/\bnot only\b[^.]{0,80}\bbut also\b/gi)),
      "per 1k words", v => v > 0.4,
      "The fastest tell after the em dash. Say the thing, then say the other thing.");
  add("contract", "Contractions", per1k(count(/\b\w+n't\b|\b\w+'(re|ve|ll|d|s|m)\b/g)), "per 1k words", v => v < 5,
      "Their absence is what makes the register uniformly formal.");
  add("hedge", "Throat-clearing", per1k(count(/\b(it('s| is) worth noting|ultimately|at its core|in essence|fundamentally|in today's|in the world of|when it comes to|that being said|needless to say)\b/gi)),
      "per 1k words", v => v > 0.6,
      "Openers that delay the sentence without adding to it.");
  add("hype", "Inflated vocabulary", per1k(count(/\b(delve|leverage|utili[sz]e|harness|unlock|elevate|seamless|robust|testament to|tapestry|realm of|landscape of|crucial|pivotal|myriad|plethora|underscore|showcase)\b/gi)),
      "per 1k words", v => v > 1.2,
      "Words that appear far more often in generated text than in edited text.");
  add("phrases", "Stock phrasing", per1k(count(/\b(in other words|what this means is|this demonstrates that|moreover|furthermore|on the other hand|with this in mind|that said|that being said|it is worth noting|it's worth noting|at its core|in essence|fundamentally|needless to say|delve into|shed light on|pave the way|navigate the complexit|foster a culture|drive meaningful change|fundamentally reshape|a testament to|a stark reminder|a rich tapestry|unlock the potential|multifaceted|transformative|robust|seamless|ultimately|moving forward|only time will tell|the real question is|in conclusion|to sum up|all things considered|as we move forward|more important than ever|cannot be overstated|plays a crucial role|this article explores|in this essay|let us take a closer look|let's be honest|we have all been there|imagine for a moment|join me as we|you may have noticed|change is the only constant|the future is ours|change begins with|together,? we can|the truth lies somewhere in between|both sides offer|in today's rapidly|in an increasingly complex)\b/gi)),
      "per 1k words", v => v > 8,
      "Ready-made phrasing standing in where a chosen sentence should be. This is the broad net and it deliberately overlaps the two narrow lists above. Measured at 0 per 1k in prose this author approved and 37.9 in generated prose. See references/tells-en.md.");

  add("triad", "Rule-of-three lists", per1k(count(/\b\w+, \w+,? and \w+\b/g)), "per 1k words", v => v > 2.5,
      "Three parallel items, over and over, is a rhythm nobody chooses that often.");
} else {
  add("sadece", "sadece … değil, aynı zamanda", per1k(
        count(/\bsadece\b[^.!?]{0,80}\bde[ğg]il\b/gi) + count(/\baynı zamanda\b/gi)),
      "per 1k words", v => v > 2.0,
      "İngilizce not only/but also kalıbının birebir çevirisi. Türkçede doğal karşılığı iki ayrı cümledir.");
  add("dir", "-dir / -maktadır ekleri", per1k(
        count(/\b\w+(maktadır|mektedir|maktadırlar|mektedirler)\b/gi) +
        count(/\b(önemlidir|gereklidir|mümkündür|gerekmektedir|bulunmaktadır|sağlamaktadır|olmaktadır)\b/gi)),
      "per 1k words", v => v > 1.5,
      "Resmî yazışma kipi. Konuşan Türkçe önemli, gerekiyor, sağlıyor der.");
  add("ebilir", "-ebilir / -abilir yığılması", per1k(count(/\b\w+[ae]bilir(iz|siniz|ler)?\b/gi)), "per 1k words", v => v > 11,
      "Her cümleyi ihtimalle yumuşatmak. Bir şey söyleyip arkasında durmak daha insan.");
  add("baglayici", "Hazır bağlayıcılar", per1k(count(/\b(sonuç olarak|özetle|kısacası|bu bağlamda|bu noktada|bu sayede|bir diğer deyişle|unutmamak gerekir ki|belirtmek gerekir ki|ilk olarak|son olarak)\b/gi)),
      "per 1k words", v => v > 1.5,
      "Paragrafları hazır kalıplarla dikmek. Fikir zaten bağlıysa bağlaca gerek yok.");
  add("sismis", "Şişmiş ifadeler", per1k(count(/\b(kritik öneme sahip|hayati önem|büyük önem taşı\w+|dünyasında|çağında|önemli bir rol oyn\w+|dikkat çekici|göze çarp\w+|son derece)\b/gi)),
      "per 1k words", v => v > 1.2,
      "teknoloji dünyasında, kritik öneme sahip: hiçbir şey söylemeyen ağırlık.");
  add("uclu", "Üçlü sıfat dizileri", per1k(count(/\b[\wğüşıöçĞÜŞİÖÇ]+, [\wğüşıöçĞÜŞİÖÇ]+ ve [\wğüşıöçĞÜŞİÖÇ]+\b/g)), "per 1k words", v => v > 5,
      "hızlı, güvenilir ve ölçeklenebilir. Üç sıfat üst üste bir seçim değil, bir refleks.");
  add("phrases", "Hazır ibare", per1k(count(/(hızla değişen dünya|teknolojinin hayatımızın|insanlık tarihi boyunca|geçmişten günümüze|bu yazıda|bu makale|ele alacağız|incelemeyi amaçla|gelin birlikte|göz ardı edilemez|her zamankinden daha önemli|ışık tut|gözler önüne ser|derinlemesine|istifade et|yeni bir dönemin kapısını|geleceğe yön ver|fark yarat|sürdürülebilir bir gelecek|bütüncül bir yaklaşım|güçlü bir hatırlatıcı|tam da bu nedenle|belki de asıl|bu noktada|bu bağlamda|öte yandan|bununla birlikte|dahası|son olarak|başka bir deyişle|bunun anlamı şudur|bu bize şunu göster|bir yandan|her iki bakış açısı|kabul edelim|bir an için düşün|belki siz de|hepimizin bildiği gibi|peki bütün bunlar|bir yolculuk|özünde|adeta|büyük önem taş|kritik bir rol|sonuç olarak|özetle)/gi)),
      "per 1k words", v => v > 8,
      "Hazır ibare, yazarın seçeceği cümlenin yerine geçiyor. Geniş ağ; üstündeki dar listelerle bilerek çakışır. Bu yazarın iki kitabında 1,2; üretilmiş örnekte 25,0. Ayrıntı: references/tells-tr.md.");

  add("edilgen", "Edilgen çatı", per1k(count(/\b\w+(ılmakta|ilmekte|ulmakta|ünmekte|ılır|ilir|ulur|ünür|ılmış|ilmiş)\b/gi)), "per 1k words", v => v > 9,
      "Kimin yaptığı belli olmayan cümleler. Özneyi geri koy.");
}

// ── output ───────────────────────────────────────────────────────
const flagged = METRICS.filter(m => m.bad);

if (asJson) {
  console.log(JSON.stringify({ lang, words: W, sentences: sents.length, meanSentence: Number(mean.toFixed(1)), metrics: METRICS, flagged: flagged.map(m => m.key) }, null, 2));
} else {
  const pad = (s, n) => String(s).padEnd(n);
  const lpad = (s, n) => String(s).padStart(n);
  console.log(`\nprose-tells  ·  ${files.join(", ")}`);
  console.log(`${W} words, ${sents.length} sentences, mean ${mean.toFixed(1)} words, language ${lang}\n`);
  const wLabel = Math.max(...METRICS.map(m => m.label.length));
  for (const m of METRICS) {
    console.log(`  ${m.bad ? "!" : " "} ${pad(m.label, wLabel)}  ${lpad(m.value, 6)}  ${m.unit}`);
  }
  if (flagged.length) {
    console.log(`\n${flagged.length} of ${METRICS.length} over the line:\n`);
    for (const m of flagged) console.log(`  ${m.label} (${m.value} ${m.unit})\n    ${m.note}\n`);
  } else {
    console.log("\nNothing over the line.\n");
  }
  console.log(`Most repeated openers: ${topOpeners.slice(0, 5).map(([w, n]) => `${w} ${((100 * n) / sents.length).toFixed(1)}%`).join(", ")}\n`);
}

if (showQuotes && lang === "en") {
  const ex = matches(/[^.!?]*\b(is|are|it's)\s+not\s+(just\s+)?[^.,;:]{2,60}[,—–]?\s*(it|they|that|this)('s|s|\s+is|\s+are)\b[^.!?]*[.!?]/gi).slice(0, 5);
  if (ex.length) { console.log("Examples of not-X-but-Y:"); ex.forEach(e => console.log("  " + e.trim())); console.log(); }
}

process.exit(flagged.length ? 1 : 0);
