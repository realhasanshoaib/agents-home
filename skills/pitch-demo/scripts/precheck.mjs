import { readFile, mkdir, mkdtemp, rm, copyFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const usage = 'precheck.sh --deck <url> --email <path> [--max-slides N] [--ultravox-key <op:// ref>] [--out <dir>]';
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const name = process.argv[i];
  if (name === '--help') { console.log(usage); process.exit(0); }
  if (!['--deck', '--email', '--max-slides', '--ultravox-key', '--out'].includes(name) || !process.argv[i + 1]) {
    console.error(`FAIL arguments: ${usage}`); process.exit(1);
  }
  args[name.slice(2)] = process.argv[i + 1];
}
let deck;
try { deck = new URL(args.deck); } catch { /* Report together with missing arguments. */ }
const limit = Number(args['max-slides'] ?? 6);
if (!deck || !['http:', 'https:'].includes(deck.protocol) || !args.email ||
    !Number.isSafeInteger(limit) || limit < 1 ||
    (args['ultravox-key'] && !args['ultravox-key'].startsWith('op://'))) {
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

if (args['ultravox-key']) {
  // The child is the only secret consumer; stdout is a non-secret account capacity.
  const result = spawnSync('2password', ['run', '--env', `UVK=${args['ultravox-key']}`, '--', process.execPath, '--input-type=module', '-e', `
    try {
      const r = await fetch('https://api.ultravox.ai/api/accounts/me', {
        headers: {'X-API-Key': process.env.UVK}, signal: AbortSignal.timeout(30000)
      });
      if (!r.ok) process.exit(1);
      const account = await r.json();
      const n = account.allowedConcurrentCalls;
      if (typeof n !== 'number' || !Number.isFinite(n)) process.exit(1);
      console.log(n);
    } catch { process.exit(1); }
  `], { encoding: 'utf8', timeout: 90000 });
  const capacity = Number(result.stdout?.trim());
  check('Ultravox concurrency', result.status === 0 && result.stdout?.trim() !== '' && capacity > 0,
    result.status === 0 && result.stdout?.trim() !== '' ? `allowedConcurrentCalls=${capacity}` : 'account request or credential resolution failed (secret output suppressed)');
} else {
  check('Ultravox concurrency', true, 'not requested; no key supplied (no live call or credit/balance test)');
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
  await mkdir(out, { recursive: true });
  temp = await mkdtemp(join(out, '.precheck-'));
  for (const [label, width, height] of [['desktop', 1440, 900], ['phone', 390, 844]]) {
    await page.setViewportSize({ width, height });
    for (let i = 0; i < count; i++) {
      const slide = slides.nth(i);
      if (width === 1440) {
        // Both current decks expose show(index); it loads lazy embeds and updates branding.
        await page.evaluate(index => {
          if (typeof window.show !== 'function') throw new Error('Deck lacks show(index) navigation');
          window.show(index);
        }, i);
      }
      await slide.evaluate(el => el.scrollIntoView({ block: 'start' }));
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
      await page.screenshot({ path, animations: 'disabled', timeout: 20000 });
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
  check('slide screenshots', true, `${count} slides at 1440×900 and 390×844; extra whole-slide PNGs for tall slides in ${out}`);
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
  if (!captured) check('slide screenshots', false, 'incomplete');
  check('contact sheets', false, redact(error.message).replace(/\s+/g, ' '));
} finally {
  await cleanup();
}
check('prospect-visible cost/team text', scanned && matches === 0,
  `${matches} matches (desktop and phone reported separately)${scanned ? '' : '; deck scan incomplete'}`);
console.log(passed ? 'PASS precheck' : 'FAIL precheck');
process.exitCode = passed ? 0 : 1;
