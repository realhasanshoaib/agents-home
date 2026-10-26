import { readFile, mkdir, mkdtemp, rm, copyFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const usage = 'precheck.sh --deck <url> --email <path> [--max-slides N] [--demo <engine demo id>] [--out <dir>]';
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const name = process.argv[i];
  if (name === '--help') { console.log(usage); process.exit(0); }
  if (!['--deck', '--email', '--max-slides', '--demo', '--out'].includes(name) || !process.argv[i + 1]) {
    console.error(`FAIL arguments: ${usage}`); process.exit(1);
  }
  args[name.slice(2)] = process.argv[i + 1];
}
let deck;
try { deck = new URL(args.deck); } catch { /* Report together with missing arguments. */ }
const limit = Number(args['max-slides'] ?? 6);
if (!deck || !['http:', 'https:'].includes(deck.protocol) || !args.email ||
    !Number.isSafeInteger(limit) || limit < 1 ||
    (args.demo && !/^[a-z0-9-]+$/.test(args.demo))) {
  console.error(`FAIL arguments: ${usage} (default slide limit: 6)`); process.exit(1);
}

let passed = true;
function check(name, ok, detail) {
  if (!ok) passed = false;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${detail}`);
}
// Never expose a deck access key, even when it appears inside a draft or browser error.
const secrets = [...deck.searchParams.values()].filter(Boolean);
function redact(text) {
  for (const secret of secrets) text = text.split(secret).join('[redacted]').split(encodeURIComponent(secret)).join('[redacted]');
  return text;
}
const forbidden = /\b(?:team\s+(?:of|size)|dedicated\s+team|\d+[\s-]+(?:person|people)[\s-]+team|engineers?|developers?|project\s+managers?|headcount|person[\s-]*weeks?|man[\s-]*days?|day\s+rates?|hourly\s+rates?|margins?|(?:our|vendor|model)\s+costs?)\b|(?:\b(?:USD|AED|EUR|GBP)\s*|[$€£])\d+(?:[.,]\d+)*\s*(?:\/\s*|per\s+)(?:(?:\d+\s+)?(?:thousand|million)\s+)?(?:run|call|minute|second|token|request|completion|inference)s?\b|\b\d+(?:[.,]\d+)*\s*(?:USD|AED|EUR|GBP)\s*(?:\/\s*|per\s+)(?:(?:\d+\s+)?(?:thousand|million)\s+)?(?:run|call|minute|second|token|request|completion|inference)s?\b/gi;
let matches = 0;
function scan(source, text) {
  text = text.replace(/\s+/g, ' ');
  for (const match of text.matchAll(forbidden)) {
    matches++;
    const start = Math.max(0, match.index - 75);
    const end = Math.min(text.length, match.index + match[0].length + 75);
    console.log(redact(`  MATCH ${source}: ${text.slice(start, match.index)}[${match[0]}]${text.slice(match.index + match[0].length, end)}`));
  }
}

let email = '';
try { email = await readFile(args.email, 'utf8'); check('email readable', true, 'draft loaded'); }
catch { check('email readable', false, 'cannot read draft'); }
check('email deck link', email.includes(args.deck), 'exact supplied deck URL, including any access key');
const datePattern = /\b(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?)\b|\b\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}\b|\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[\/-]\d{1,2}(?:[\/-]\d{2,4})?\b/i;
const askPattern = /\?|\b(?:please|can|could|would|shall|let['’]s|meet|meeting|call|book|schedule|available|availability|reply|confirm|review|discuss|join|send|share|approve)\b/i;
const datedAsk = email.split(/\n\s*\n|(?<=[.!?])\s+/).some(part => datePattern.test(part) && askPattern.test(part));
check('email dated ask', datedAsk, 'ask and weekday/date in the same sentence or paragraph');
scan('email', email);

const engine = 'https://agent.q9labs.ai';
if (args.demo) {
  let face = false;
  try {
    const r = await fetch(`${engine}/v1/demos/${args.demo}/ui`, { signal: AbortSignal.timeout(30000) });
    face = r.ok && (await r.json()).avatar?.enabled === true;
    check('engine demo config', r.ok, r.ok ? `${args.demo} found, face ${face ? 'on' : 'off'}` : `GET /ui returned ${r.status}`);
  } catch { check('engine demo config', false, 'engine unreachable'); }
  // The child is the only consumer of the admin key; stdout is the non-secret vendor status.
  const result = spawnSync('2password', ['run', '--env', 'ADMIN=op://dev/Pitch Kit Engine Admin Key/credential', '--', process.execPath, '--input-type=module', '-e', `
    try {
      const r = await fetch('${engine}/v1/health', {
        headers: {Authorization: 'Bearer ' + process.env.ADMIN}, signal: AbortSignal.timeout(60000)
      });
      if (!r.ok) process.exit(1);
      const h = await r.json();
      console.log(JSON.stringify({ultravox: h.ultravox?.available === true, tavus: h.tavus?.available === true}));
    } catch { process.exit(1); }
  `], { encoding: 'utf8', timeout: 120000 });
  let health = null;
  try { if (result.status === 0) health = JSON.parse(result.stdout.trim()); } catch { /* Reported below. */ }
  check('Ultravox can start a call', health?.ultravox === true, health ? `ultravox available=${health.ultravox}` : 'health request or credential resolution failed (secret output suppressed)');
  check('Tavus can start a face', !face || health?.tavus === true, face ? `tavus available=${health?.tavus}` : 'face off for this demo');
} else {
  check('engine vendors', true, 'not requested; pass --demo <id> for an Ava demo (live call and face credit test)');
}

let browser;
let temp;
const out = resolve(args.out ?? './precheck-out');
const shots = { desktop: [], phone: [] };
let scanned = false;
let fetched = false;
let indexed = false;
let counted = false;
let captured = false;
let linked = false;
// A bounded process lifetime also cleans up if the invoking SSH session disappears.
const deadline = setTimeout(() => process.emit('SIGTERM'), 10 * 60 * 1000);
async function cleanup() {
  clearTimeout(deadline);
  await browser?.close().catch(() => {});
  if (temp) await rm(temp, { recursive: true, force: true });
}
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.once(signal, async () => {
  await cleanup(); console.error('FAIL precheck: interrupted or ten-minute deadline exceeded'); process.exit(1);
});
try {
  const require = createRequire(import.meta.url);
  const fromCwd = createRequire(join(process.cwd(), 'package.json'));
  let playwright;
  for (const name of [process.env.PLAYWRIGHT_MODULE, 'playwright', '@playwright/test'].filter(Boolean)) {
    try { playwright = require(name); break; } catch {
      try { playwright = fromCwd(name); break; } catch { /* Try the next installed package. */ }
    }
  }
  if (!playwright) throw new Error('Playwright missing; install it or set PLAYWRIGHT_MODULE to its package path');
  browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const response = await page.goto(args.deck, { waitUntil: 'domcontentloaded', timeout: 45000 });
  fetched = true;
  check('deck HTTP', response?.status() === 200, `HTTP ${response?.status() ?? 'no response'}`);
  indexed = true;
  const noindex = await page.locator('meta[name]').evaluateAll(metas => metas.some(m =>
    m.name.toLowerCase() === 'robots' && /(?:^|[\s,])noindex(?:$|[\s,])/i.test(m.content)));
  check('deck noindex', noindex, noindex ? 'robots meta contains noindex' : 'robots noindex meta missing');
  const slides = page.locator('.slide');
  const count = await slides.count();
  counted = true;
  check('slide count', count > 0 && count <= limit, `${count} .slide sections; maximum ${limit}`);
  if (!count) throw new Error('No .slide sections; refusing incomplete text scan/screenshots');
  // A demo behind an access key must open from the deck's own buttons, so the prospect never meets a key prompt.
  await page.waitForLoadState('load');
  const deckPath = new URL(page.url()).pathname.replace(/\/$/, '');
  const demoLinks = [...new Set(await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.href)))]
    .map(href => new URL(href))
    .filter(url => url.origin === deck.origin && url.pathname.replace(/\/$/, '') !== deckPath &&
      !/\.(pdf|png|jpe?g|webp|gif|svg|mp4|webm|mov)$/i.test(url.pathname));
  const refused = [];
  for (const url of demoLinks) {
    const tab = await context.newPage();
    let denied = false;
    tab.on('response', r => { if ([401, 403].includes(r.status()) && new URL(r.url()).origin === deck.origin) denied = true; });
    const opened = await tab.goto(url.href, { waitUntil: 'load', timeout: 30000 }).catch(() => null);
    await tab.waitForTimeout(2000);
    const text = await tab.locator('body').innerText().catch(() => '');
    const prompted = /\baccess (link|key|code)\b|\benter (the|your) (key|code)\b/i.test(text);
    if (!opened?.ok() || denied || prompted) refused.push(url.pathname);
    await tab.close();
  }
  linked = true;
  check('demo links', refused.length === 0, refused.length ? `access refused, key prompt or load failed: ${refused.join(', ')}`
    : `${demoLinks.length} same-site links from the deck open without an access error`);
  await mkdir(out, { recursive: true });
  temp = await mkdtemp(join(out, '.precheck-'));
  for (const [label, width, height] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    await page.setViewportSize({ width, height });
    const fingerprints = new Set();
    for (let i = 0; i < count; i++) {
      const slide = slides.nth(i);
      const inView = () => slide.evaluate(el => {
        const box = el.getBoundingClientRect();
        const left = Math.max(0, box.left), right = Math.min(innerWidth, box.right);
        const top = Math.max(0, box.top), bottom = Math.min(innerHeight, box.bottom);
        if (right <= left || bottom <= top) return false;
        const front = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
        return front?.closest('.slide') === el;
      });
      await page.evaluate(index => {
        if (typeof window.show === 'function') window.show(index);
      }, i);
      await slide.evaluate(el => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(400);
      if (!await inView()) {
        // Reset a clamped keyboard deck at the start of each viewport pass.
        if (i === 0) {
          for (let step = 0; step < count; step++) await page.keyboard.press('ArrowLeft');
          await page.waitForTimeout(400);
        }
        for (let step = 0; step < count && !await inView(); step++) {
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(400);
        }
      }
      if (!await inView()) throw new Error(`${label} slide ${i + 1}: navigation did not reveal the intended slide`);
      await slide.waitFor({ state: 'visible' });
      await page.evaluate(() => document.fonts.ready);
      await slide.locator('img').evaluateAll(images => Promise.all(images.map(img =>
        img.complete ? Promise.resolve() : new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 5000);
        }))));
      await page.waitForTimeout(400);
      scan(`${label} slide ${i + 1}`, await slide.innerText());
      const path = join(out, `${label}-${String(i + 1).padStart(2, '0')}.png`);
      if (!await inView()) throw new Error(`${label} slide ${i + 1}: intended slide left the viewport before capture`);
      const png = await page.screenshot({ path, animations: 'disabled', timeout: 20000 });
      const fingerprint = createHash('sha256').update(png).digest('hex');
      if (fingerprints.has(fingerprint)) throw new Error(`${label} slide ${i + 1}: duplicate slide screenshot`);
      fingerprints.add(fingerprint);
      const box = await slide.boundingBox();
      if (box && box.height > height + 1) {
        // Preserve the rest of a stacked phone slide as well as its exact-size viewport shot.
        const whole = path.replace('.png', '-whole.png');
        await slide.screenshot({ path: whole, animations: 'disabled', timeout: 20000 });
        shots[label].push(whole);
      } else {
        shots[label].push(path);
      }
    }
  }
  scanned = true;
  captured = true;
  check('slide screenshots', true, `${count} distinct slides verified at 1440×900 and 390×844; extra whole-slide PNGs for tall slides in ${out}`);
  for (const label of Object.keys(shots)) {
    // Keep sheets to four slides so each remains readable at two tiles wide.
    for (let i = 0; i < shots[label].length; i += 4) {
      const destination = join(temp, `${label}-sheet-${String(i / 4 + 1).padStart(2, '0')}.jpg`);
      const result = spawnSync('montage', [...shots[label].slice(i, i + 4), '-auto-orient',
        '-tile', '2x', '-geometry', '1000x+16+16', '-background', 'white',
        '-font', '/System/Library/Fonts/Supplemental/Arial.ttf', '-title', `${label}: slides ${i + 1}–${Math.min(i + 4, count)}`, destination],
      { encoding: 'utf8', timeout: 60000 });
      if (result.status !== 0) throw new Error('ImageMagick montage failed; verify montage and the Arial font are installed');
      await copyFile(destination, join(out, `${label}-sheet-${String(i / 4 + 1).padStart(2, '0')}.jpg`));
    }
  }
  check('contact sheets', true, `two-wide, up to four slides each, in ${out}`);
} catch (error) {
  if (!fetched) check('deck HTTP', false, 'not verified');
  if (!indexed) check('deck noindex', false, 'not verified');
  if (!counted) check('slide count', false, 'not verified');
  if (!linked) check('demo links', false, 'not verified');
  if (!captured) check('slide screenshots', false, 'incomplete');
  check('contact sheets', false, redact(error.message).replace(/\s+/g, ' '));
} finally {
  await cleanup();
}
check('prospect-visible cost/team text', scanned && matches === 0,
  `${matches} matches (desktop and phone reported separately)${scanned ? '' : '; deck scan incomplete'}`);
console.log(passed ? 'PASS precheck' : 'FAIL precheck');
process.exitCode = passed ? 0 : 1;
