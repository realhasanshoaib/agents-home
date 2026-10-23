// Draws a sequence diagram into <svg id="seq">.
// lanes: [{ id, title, sub, logo?, icon?: 'server', partial? }]; no logo or icon draws a person
// logo is a bare key that loads logoBase + `${logo}.svg`, or a file name ending .svg, .png or .webp that loads as written; the default points at the shared cache from a page in references/<name>/
// steps:
//   'Phase' or { phase }                                       starts a phase
//   { from, to, label, kind: 'req' | 'res', code?, partial? }   one message; from === to draws a loop
//   { note, over: [laneId, laneId] }                           a note across lanes
//   { branch, steps: [...] }                                   a shaded block of alternative steps
const COLORS = { req: '#1f2c55', res: '#1d8a7c', partial: '#c07f12' };
const BG = '#f7f5f0';

function drawSequence({ lanes, steps, width = 1560, logoBase = '../../logos/' }) {
  const head = lanes.some((lane) => lane.partial) ? 104 : 86;
  const laneX = (id) => {
    const index = lanes.findIndex((lane) => lane.id === id);
    if (index < 0) throw new Error(`unknown lane ${id}`);
    return 90 + index * ((width - 180) / (lanes.length - 1));
  };
  const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const text = (x, y, value, attrs) => `<text x="${x}" y="${y}" ${attrs}>${esc(value)}</text>`;
  const halo = `paint-order="stroke" stroke="${BG}" stroke-width="5"`;

  let y = head;
  let number = 0;
  let back = '';
  let front = '';

  const rowHeight = (step) => (step.code ? 62 : 48);
  const message = (step) => {
    number += 1;
    const color = step.partial ? COLORS.partial : COLORS[step.kind];
    const marker = step.partial ? 'partial' : step.kind;
    const dash = step.partial ? 'stroke-dasharray="6 4"' : '';
    const x1 = laneX(step.from);
    const x2 = laneX(step.to);
    const cy = y + 30;
    let body = '';
    if (x1 === x2) {
      body += `<path d="M${x1 + 11} ${cy - 6} h 36 v 16 h -32" fill="none" stroke="${color}" stroke-width="1.6" ${dash} marker-end="url(#h-${marker})"/>`;
      body += text(x1 + 56, cy + 7, step.label, `font-size="14" font-weight="500" fill="${color}"`);
      if (step.code) body += text(x1 + 56, cy + 25, step.code, `font-size="12" fill="#80858f" font-family="ui-monospace, SF Mono, Menlo, monospace"`);
    } else {
      const dir = Math.sign(x2 - x1);
      body += `<line x1="${x1}" y1="${cy}" x2="${x2 - dir * 4}" y2="${cy}" stroke="${color}" stroke-width="1.6" ${dash} marker-end="url(#h-${marker})"/>`;
      const longest = Math.max(step.label.length * 7.4, (step.code ?? '').length * 7.3);
      const fits = longest <= Math.abs(x2 - x1) - 40;
      const offLeft = !fits && dir < 0 && x1 - 18 - longest < 0;
      const at = fits ? (x1 + x2) / 2 : offLeft ? x2 + 10 : x1 + dir * 18;
      const anchor = fits ? 'middle' : dir > 0 || offLeft ? 'start' : 'end';
      body += text(at, cy - 8, step.label, `text-anchor="${anchor}" font-size="14" font-weight="500" fill="${color}" ${halo}`);
      if (step.code) body += text(at, cy + 18, step.code, `text-anchor="${anchor}" font-size="12" fill="#80858f" font-family="ui-monospace, SF Mono, Menlo, monospace" ${halo}`);
    }
    body += `<circle cx="${x1}" cy="${cy}" r="11" fill="${BG}" stroke="${color}" stroke-width="1.6"/>`;
    body += text(x1, cy + 4.5, number, `text-anchor="middle" font-size="12.5" font-weight="700" fill="${color}"`);
    front += `<g>${body}</g>`;
    y += rowHeight(step);
  };
  const note = (step) => {
    const xs = step.over.map(laneX);
    const half = Math.max((Math.max(...xs) - Math.min(...xs)) / 2 + 70, step.note.length * 3.4 + 16);
    const middle = Math.min(Math.max((Math.min(...xs) + Math.max(...xs)) / 2, half + 10), width - half - 10);
    const left = middle - half;
    front += `<g><rect x="${left}" y="${y + 10}" width="${half * 2}" height="30" rx="8" fill="#fbfaf7" stroke="#e2ded5"/>` +
      text(middle, y + 30, step.note, `text-anchor="middle" font-size="13" fill="#454c5a"`) + `</g>`;
    y += 48;
  };
  const block = (step) => {
    const top = y + 8;
    y += 30;
    step.steps.forEach(one);
    back += `<g><rect x="20" y="${top}" width="${width - 40}" height="${y - top + 6}" rx="12" fill="#efece5" stroke="#e2ded5"/></g>`;
    front += `<g>${text(34, top + 20, step.branch, `font-size="13" font-weight="600" fill="#5f6571" paint-order="stroke" stroke="#efece5" stroke-width="5"`)}</g>`;
    y += 14;
  };
  const phase = (title) => {
    front += `<g>` + text(0, y + 30, title, `font-size="13" font-weight="700" fill="#80858f"`) +
      `<line x1="${title.length * 7.6 + 14}" y1="${y + 26}" x2="${width}" y2="${y + 26}" stroke="#e6e2da"/></g>`;
    y += 44;
  };
  const one = (step) => {
    if (typeof step === 'string') phase(step);
    else if (step.phase) phase(step.phase);
    else if (step.branch) block(step);
    else if (step.note) note(step);
    else message(step);
  };
  steps.forEach(one);
  const height = y + 30;

  let lines = '';
  for (const lane of lanes) {
    const cx = laneX(lane.id);
    lines += `<line x1="${cx}" y1="${head - 6}" x2="${cx}" y2="${height}" stroke="#d9d5cc" stroke-width="1.5" ${lane.partial ? 'stroke-dasharray="5 5"' : ''}/>`;
    if (lane.logo) {
      const file = /\.(svg|png|webp)$/.test(lane.logo) ? lane.logo : `${lane.logo}.svg`;
      lines += `<image href="${logoBase}${file}" x="${cx - 14}" y="0" width="28" height="24"/>`;
    } else if (lane.icon === 'server') lines += `<g transform="translate(${cx - 12} 0)" fill="none" stroke="#1b2233" stroke-width="1.8"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h1M6 18h1" stroke-linecap="round"/></g>`;
    else lines += `<g transform="translate(${cx - 12} 0)" fill="none" stroke="#1b2233" stroke-width="1.8"><circle cx="12" cy="7" r="4.5"/><path d="M3 23c1-4.4 4.4-7 9-7s8 2.6 9 7" stroke-linecap="round"/></g>`;
    lines += text(cx, 46, lane.title, `text-anchor="middle" font-size="16" font-weight="650" fill="#1b2233"`);
    if (lane.sub) lines += text(cx, 66, lane.sub, `text-anchor="middle" font-size="13" fill="#80858f"`);
    if (lane.partial) lines += text(cx, 85, `● ${lane.partial}`, `text-anchor="middle" font-size="12" font-weight="600" fill="${COLORS.partial}"`);
  }
  const defs = `<defs>${Object.entries(COLORS).map(([id, fill]) => `<marker id="h-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1.5 9 5 1 8.5z" fill="${fill}"/></marker>`).join('')}</defs>`;
  const svg = document.getElementById('seq');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 -4 ${width} ${height + 4}`);
  svg.setAttribute('font-family', 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, sans-serif');
  svg.innerHTML = defs + back + `<g>${lines}</g>` + front;
  addLaneBar(svg, lanes, laneX, head);
}

// Keeps the lane names in view once the diagram's own header scrolls away.
function addLaneBar(svg, lanes, laneX, head) {
  const bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.cssText = 'position:fixed;top:0;left:0;right:0;height:40px;background:rgba(247,245,240,.96);border-bottom:1px solid #e2ded5;z-index:9;display:none;font:650 14px ui-sans-serif,-apple-system,sans-serif;color:#1b2233';
  bar.innerHTML = lanes.map((lane) => `<span data-lane="${lane.id}" style="position:absolute;top:11px;transform:translateX(-50%);white-space:nowrap">${lane.title}</span>`).join('');
  document.body.append(bar);
  const place = () => {
    const box = svg.getBoundingClientRect();
    const scale = box.width / Number(svg.getAttribute('width'));
    bar.style.display = box.top + head * scale < 0 ? 'block' : 'none';
    for (const lane of lanes) bar.querySelector(`[data-lane="${lane.id}"]`).style.left = `${box.left + laneX(lane.id) * scale}px`;
  };
  addEventListener('scroll', place, { passive: true });
  addEventListener('resize', place);
  place();
}
