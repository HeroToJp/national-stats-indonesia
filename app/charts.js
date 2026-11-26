// charts.js — small SVG chart builders written for this site. No library:
// a line chart and a vertical bar chart, both with axes, gridlines and
// readable value labels, sized by viewBox so they scale on a phone.

function niceMax(values) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const step = span / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / pow;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return { lo: Math.floor(min / (nice * pow)) * nice * pow, hi: Math.ceil(max / (nice * pow)) * nice * pow, step: nice * pow };
}

function fmt(v) {
  if (Math.abs(v) >= 100) return String(Math.round(v));
  if (Math.abs(v) >= 10) return v.toFixed(1).replace(/\.0$/, '');
  return String(Math.round(v * 10) / 10);
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// points: [{year, value}] sorted by year. Returns an SVG string.
export function lineChart(points, opts = {}) {
  const w = 760, h = 320, padL = 56, padR = 16, padT = 18, padB = 34;
  const values = points.map((p) => p.value);
  const { lo, hi, step } = niceMax(values);
  const x = (i) => padL + (i * (w - padL - padR)) / Math.max(points.length - 1, 1);
  const y = (v) => padT + ((hi - v) * (h - padT - padB)) / (hi - lo || 1);
  const color = opts.color || '#0e5e57';
  let grid = '';
  for (let v = lo; v <= hi + 1e-9; v += step) {
    grid += `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" stroke="#e3ddd0" stroke-width="1"/>`
      + `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="#6b7280">${fmt(v)}</text>`;
  }
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${y(lo)} L${x(0).toFixed(1)},${y(lo)} Z`;
  let dots = '';
  points.forEach((p, i) => {
    const showLabel = i === 0 || i === points.length - 1 || i % 2 === 0;
    dots += `<circle cx="${x(i)}" cy="${y(p.value)}" r="4.5" fill="${color}" stroke="#fff" stroke-width="1.5">`
      + `<title>${p.year}: ${p.value}</title></circle>`;
    if (showLabel) {
      dots += `<text x="${x(i)}" y="${y(p.value) - 10}" text-anchor="middle" font-size="12" font-weight="600" fill="#1a2e2b">${fmt(p.value)}</text>`;
    }
  });
  let labels = '';
  points.forEach((p, i) => {
    if (points.length <= 10 || i % 2 === 0) {
      labels += `<text x="${x(i)}" y="${h - 10}" text-anchor="middle" font-size="12" fill="#6b7280">${p.year}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.label || 'Line chart')}" class="chart">`
    + grid
    + `<path d="${area}" fill="${color}" opacity="0.10"/>`
    + `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`
    + dots + labels + '</svg>';
}

// bars: [{year, value}] — vertical bars with value labels on top.
export function barChart(points, opts = {}) {
  const w = 760, h = 320, padL = 56, padR = 16, padT = 26, padB = 34;
  const values = points.map((p) => p.value);
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values) * 1.08;
  const slot = (w - padL - padR) / points.length;
  const bw = Math.min(46, slot * 0.62);
  const y = (v) => padT + ((hi - v) * (h - padT - padB)) / (hi - lo || 1);
  const color = opts.color || '#0e5e57';
  const neg = opts.negColor || '#b3261e';
  let grid = '';
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = lo + ((hi - lo) * i) / steps;
    grid += `<line x1="${padL}" y1="${y(v)}" x2="${w - padR}" y2="${y(v)}" stroke="#e3ddd0" stroke-width="1"/>`
      + `<text x="${padL - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="#6b7280">${fmt(v)}</text>`;
  }
  let bars = '';
  points.forEach((p, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = y(Math.max(p.value, 0));
    const bottom = y(Math.min(p.value, 0));
    bars += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(bottom - top, 1).toFixed(1)}" rx="3" fill="${p.value < 0 ? neg : color}">`
      + `<title>${p.year}: ${p.value}</title></rect>`
      + `<text x="${cx}" y="${(top - 7).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="600" fill="#1a2e2b">${fmt(p.value)}</text>`
      + `<text x="${cx}" y="${h - 10}" text-anchor="middle" font-size="12" fill="#6b7280">${p.year}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(opts.label || 'Bar chart')}" class="chart">`
    + grid + bars + '</svg>';
}

// Horizontal share bars (HTML, one row per item) for sector / product shares.
export function shareBars(items, opts = {}) {
  const color = opts.color || '#0e5e57';
  return '<ul class="sharebars">' + items.map((it) => {
    const pct = Math.max(it.share, 0);
    return `<li><span class="share-label">${esc(it.label)}</span>`
      + `<span class="share-track"><span class="share-fill" style="width:${pct.toFixed(1)}%;background:${color}"></span></span>`
      + `<span class="share-value">${pct.toFixed(1)}%</span></li>`;
  }).join('') + '</ul>';
}
