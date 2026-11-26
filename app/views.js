// views.js — page rendering and routing for NusaStat. Every figure shown here
// comes from data.js, which carries its source and year. Controls (year
// selectors, sortable tables, the province search) are wired up in main.js;
// this file only renders the current state.

import {
  AGE_STRUCTURE, BPS_POPULATION_2024, EXPORT_PARTNERS, EXPORT_PRODUCTS,
  HEADLINES, HEALTH_EDUCATION, IMPORT_PARTNERS, LABOUR, POVERTY,
  PROVINCES, SECTORS, SERIES, SOURCES, TRADE, UNEMPLOYMENT_SERIES, YEARS,
} from './data.js';
import { barChart, lineChart, shareBars } from './charts.js';

export const NAV = [
  { route: '#/', label: 'Dashboard', page: 'home' },
  { route: '#/population', label: 'Population', page: 'population' },
  { route: '#/economy', label: 'Economy', page: 'economy' },
  { route: '#/employment', label: 'Employment', page: 'employment' },
  { route: '#/health', label: 'Health & Education', page: 'health' },
  { route: '#/trade', label: 'Trade & Regions', page: 'trade' },
  { route: '#/about', label: 'Sources', page: 'about' },
];

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function srcTag(source) {
  return `<p class="source">Source: ${esc(source)}</p>`;
}

function yearOptions(selected, minY, maxY) {
  let out = '';
  for (let y = minY; y <= maxY; y++) {
    out += `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`;
  }
  return out;
}

// Two selects that bound the years a chart and its table show.
function yearRange(prefix, from, to, minY, maxY) {
  return `<div class="controls"><label>From <select id="${prefix}-from" aria-label="Start year">${yearOptions(from, minY, maxY)}</select></label>`
    + `<label>To <select id="${prefix}-to" aria-label="End year">${yearOptions(to, minY, maxY)}</select></label>`
    + `<span class="control-hint">Change the years to redraw the chart and the table.</span></div>`;
}

function seriesPoints(series, from, to) {
  return YEARS.filter((y) => y >= from && y <= to).map((y) => ({ year: y, value: series.values[y] }));
}

function seriesTable(series, from, to) {
  const rows = seriesPoints(series, from, to).map(
    (p) => `<tr><td>${p.year}</td><td>${p.value.toLocaleString('en-US')}</td></tr>`,
  ).join('');
  return `<div class="tablewrap"><table class="data"><caption>${esc(series.label)} — ${esc(series.unit)}</caption>`
    + `<thead><tr><th>Year</th><th>${esc(series.unit)}</th></tr></thead><tbody>${rows}</tbody></table></div>`
    + srcTag(series.source);
}

function kpiCard(h) {
  return `<a class="kpi" href="${h.route}"><span class="kpi-label">${esc(h.label)}</span>`
    + `<span class="kpi-value">${esc(h.value)}</span>`
    + `<span class="kpi-note">${esc(h.note)}</span>`
    + `<span class="kpi-source">Source: ${esc(h.source)}</span></a>`;
}

function factRow(label, value, source) {
  return `<div class="fact"><span class="fact-label">${esc(label)}</span>`
    + `<span class="fact-value">${esc(value)}</span>`
    + `<span class="fact-source">Source: ${esc(source)}</span></div>`;
}

// ---------- Home / dashboard ----------

export function homePage() {
  const pop = seriesPoints(SERIES.population, 2015, 2024);
  return `<section class="hero"><p class="eyebrow">Indonesia · Official statistics, in one place</p>`
    + `<h1>Indonesia in numbers</h1>`
    + `<p class="lede">Population, the economy, jobs, health and trade — the headline figures for the world’s fourth most populous country, each with its source and year. Figures verified 26 November 2026.</p></section>`
    + `<section><h2>At a glance</h2><div class="kpis">${HEADLINES.map(kpiCard).join('')}</div></section>`
    + `<section class="split"><div><h2>People: still growing</h2>`
    + `<p>Indonesia added about 21.7 million people between 2015 and 2024, reaching <strong>283.5 million</strong>. Growth has slowed to <strong>0.81% a year</strong> (2024), and <strong>58.8%</strong> of people now live in towns and cities.</p>`
    + `<p><a class="btn" href="#/population">Explore population →</a></p></div>`
    + `<div class="chartbox"><h3>Population, 2015–2024 (millions)</h3>${lineChart(pop, { label: 'Population of Indonesia 2015 to 2024' })}${srcTag(SERIES.population.source)}</div></section>`
    + `<section class="split"><div><h2>Economy: steady near 5% growth</h2>`
    + `<p>GDP reached <strong>US$ 1.40 trillion</strong> in 2024, growing <strong>5.03%</strong> in real terms. Manufacturing is the largest sector at <strong>19.0%</strong> of GDP, ahead of trade (13.1%) and agriculture (12.6%).</p>`
    + `<p><a class="btn" href="#/economy">Explore the economy →</a></p></div>`
    + `<div><h2>Latest releases</h2><ul class="releases">`
    + `<li><strong>Feb 2025</strong> — Unemployment 4.76%, the lowest since 1997 (BPS, Sakernas).</li>`
    + `<li><strong>Mar 2025</strong> — Poverty 8.47%, 23.85 million people (BPS).</li>`
    + `<li><strong>2024</strong> — GDP grew 5.03%; exports US$ 264.71 billion (BPS).</li>`
    + `<li><strong>2024</strong> — Life expectancy 71.3 years (World Bank).</li></ul>`
    + `<p><a class="btn" href="#/about">See all sources →</a></p></div></section>`;
}

// ---------- Population ----------

export function populationPage(state) {
  const { from, to } = state.range;
  const pop = seriesPoints(SERIES.population, from, to);
  const top3 = PROVINCES.slice(0, 3).map((p) => `<li><strong>${esc(p.province)}</strong> — ${p.population.toFixed(1)} million people (BPS, 2024 estimate)</li>`).join('');
  return `<section><p class="eyebrow">People</p><h1>Population</h1>`
    + `<p class="lede">283.5 million people in 2024 — the world’s 4th largest population — spread over 38 provinces and more than 17,000 islands.</p></section>`
    + `<section><h2>Population over time</h2>`
    + yearRange('pop', from, to, 2015, 2024)
    + `<div class="chartbox">${lineChart(pop, { label: `Population of Indonesia ${from} to ${to}` })}${srcTag(SERIES.population.source)}</div>`
    + seriesTable(SERIES.population, from, to) + `</section>`
    + `<section class="split"><div><h2>Age structure, 2024</h2>`
    + shareBars(AGE_STRUCTURE.map((a) => ({ label: a.group, share: a.share })))
    + `<p>Indonesia is still young: about a quarter of the population is under 15, and only 7.3% is 65 or older. The working-age share (15–64) is 68.1%.</p>${srcTag('World Bank, 2024')}</div>`
    + `<div><h2>Largest provinces</h2><ul class="plain">${top3}</ul>`
    + `<p>Java holds about 56% of the national population, making it the most densely populated large island on earth.</p>`
    + `<p><a class="btn" href="#/trade">Full provinces table →</a></p></div></section>`;
}

// ---------- Economy ----------

export function economyPage(state) {
  const { from, to } = state.range;
  const gdp = seriesPoints(SERIES.gdp, from, to);
  const growth = seriesPoints(SERIES.gdpGrowth, from, to);
  const infl = seriesPoints(SERIES.inflation, from, to);
  return `<section><p class="eyebrow">Money</p><h1>Economy</h1>`
    + `<p class="lede">A US$ 1.40 trillion economy in 2024 — the 16th largest in the world — growing 5.03% in real terms, with inflation at 2.2%.</p></section>`
    + `<section><h2>GDP, 2015–2024</h2>`
    + yearRange('eco', from, to, 2015, 2024)
    + `<div class="chartbox">${barChart(gdp, { label: `GDP of Indonesia ${from} to ${to}, current US dollars` })}${srcTag(SERIES.gdp.source)}</div>`
    + seriesTable(SERIES.gdp, from, to) + `</section>`
    + `<section class="split"><div><h2>GDP growth</h2><div class="chartbox">`
    + `${lineChart(growth, { label: 'GDP growth of Indonesia 2015 to 2024', color: '#b3261e' })}${srcTag(SERIES.gdpGrowth.source)}</div>`
    + `<p>Growth stayed near 5% every year except 2020, when the economy shrank 2.07% during the pandemic, and 2021, when it recovered 3.70%.</p></div>`
    + `<div><h2>Inflation</h2><div class="chartbox">`
    + `${lineChart(infl, { label: 'Inflation in Indonesia 2015 to 2024', color: '#8a6d00' })}${srcTag(SERIES.inflation.source)}</div>`
    + `<p>Consumer-price inflation fell from 6.36% in 2015 to 2.18% in 2024. The BPS annual average for 2024 was 1.57%.</p></div></section>`
    + `<section><h2>What the economy makes — share of GDP, 2024</h2>`
    + shareBars(SECTORS.map((s) => ({ label: s.sector, share: s.share })))
    + srcTag('BPS, 2024. Nominal GDP 2024: Rp 22,139.0 trillion.')
    + `<div class="facts">`
    + factRow('GDP per capita', 'US$ 4,925', 'World Bank, 2024')
    + factRow('GDP (PPP)', 'US$ 4.10 trillion', 'IMF / CIA World Factbook, 2024')
    + factRow('Household consumption', '54.0% of GDP', 'BPS, 2024')
    + factRow('Poverty rate', '8.47% (Mar 2025)', 'BPS, March 2025')
    + `</div></section>`;
}

// ---------- Employment ----------

export function employmentPage(state) {
  const { from, to } = state.range;
  const pts = UNEMPLOYMENT_SERIES.filter((p) => p.year >= from && p.year <= to)
    .map((p) => ({ year: p.year, value: p.rate }));
  const rows = UNEMPLOYMENT_SERIES.filter((p) => p.year >= from && p.year <= to)
    .map((p) => `<tr><td>${p.year}</td><td>${p.rate.toFixed(1)}%</td></tr>`).join('');
  return `<section><p class="eyebrow">Work</p><h1>Employment</h1>`
    + `<p class="lede">153.05 million people in the labour force in February 2025, and an open unemployment rate of 4.76% — the lowest since 1997.</p></section>`
    + `<section><h2>Unemployment rate, 2021–2025</h2>`
    + yearRange('emp', from, to, 2021, 2025)
    + `<div class="chartbox">${lineChart(pts, { label: `Open unemployment rate ${from} to ${to}`, color: '#b3261e' })}${srcTag('BPS, National Labour Force Survey (Sakernas)')}</div>`
    + `<div class="tablewrap"><table class="data"><caption>Open unemployment rate (TPT)</caption><thead><tr><th>Year</th><th>Rate</th></tr></thead><tbody>${rows}</tbody></table></div>${srcTag('BPS, 2021–2025')}`
    + `</section>`
    + `<section><h2>Labour force at a glance</h2><div class="facts">`
    + LABOUR.map((l) => factRow(l.label, l.value, l.source)).join('')
    + `</div>`
    + `<p class="note">Two unemployment numbers circulate for Indonesia. The BPS open unemployment rate (4.76%, Feb 2025) counts people with no work at all in the survey week. The ILO modelled estimate (3.2%, 2025) uses an internationally harmonised definition. Both are shown here; they are not the same measure.</p></section>`;
}

// ---------- Health & education ----------

export function healthPage(state) {
  const { from, to } = state.range;
  const le = seriesPoints(SERIES.lifeExpectancy, from, to);
  return `<section><p class="eyebrow">People’s wellbeing</p><h1>Health &amp; Education</h1>`
    + `<p class="lede">Life expectancy is 71.3 years (2024), adult literacy is 96%, and nearly every child is enrolled in primary school.</p></section>`
    + `<section><h2>Life expectancy at birth</h2>`
    + yearRange('hea', from, to, 2015, 2024)
    + `<div class="chartbox">${lineChart(le, { label: `Life expectancy in Indonesia ${from} to ${to}` })}${srcTag(SERIES.lifeExpectancy.source)}</div>`
    + seriesTable(SERIES.lifeExpectancy, from, to)
    + `<p class="note">Life expectancy dipped in 2020–2021 during the pandemic (68.8, then 67.5 years) and has since recovered past its 2019 level.</p></section>`
    + `<section><h2>Health and schooling</h2><div class="facts">`
    + HEALTH_EDUCATION.map((h) => factRow(h.label, h.value, h.source)).join('')
    + `</div>`
    + `<p class="note">Health spending is low by world standards — 2.7% of GDP in 2023 (US$ 132 per person) — while primary enrolment is effectively universal at 100.4% gross.</p></section>`;
}

// ---------- Trade & regions ----------

// Sortable table: columns [{key, label, numeric}], rows are plain objects.
export function sortableTable(id, columns, rows, sort) {
  const key = sort.key, dir = sort.dir;
  const sorted = [...rows].sort((a, b) => {
    const av = a[key], bv = b[key];
    const cmp = typeof av === 'number' && typeof bv === 'number'
      ? av - bv : String(av).localeCompare(String(bv));
    return dir === 'asc' ? cmp : -cmp;
  });
  const head = columns.map((c) => {
    const arrow = key === c.key ? (dir === 'asc' ? ' ▲' : ' ▼') : '';
    return `<th data-sort="${id}:${c.key}" class="${c.numeric ? 'num' : ''}" role="button" tabindex="0" aria-sort="${key === c.key ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}">${esc(c.label)}${arrow}</th>`;
  }).join('');
  const body = sorted.map((r) => `<tr>${columns.map((c) => `<td class="${c.numeric ? 'num' : ''}">${esc(c.fmt ? c.fmt(r[c.key]) : r[c.key])}</td>`).join('')}</tr>`).join('');
  return `<div class="tablewrap"><table class="data"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export function tradePage(state) {
  const q = (state.query || '').toLowerCase();
  const provRows = PROVINCES
    .filter((p) => !q || p.province.toLowerCase().includes(q) || p.island.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q))
    .map((p) => ({
      province: p.province,
      capital: p.capital,
      island: p.island,
      popNum: p.population,
      shareNum: p.population / BPS_POPULATION_2024 * 100,
    }));
  const provCols = [
    { key: 'province', label: 'Province' },
    { key: 'capital', label: 'Capital' },
    { key: 'island', label: 'Island' },
    { key: 'popNum', label: 'Population (million)', numeric: true, fmt: (v) => v.toFixed(1) },
    { key: 'shareNum', label: 'Share of Indonesia', numeric: true, fmt: (v) => v.toFixed(1) + '%' },
  ];
  const expCols = [
    { key: 'partner', label: 'Export market' },
    { key: 'share', label: 'Share of exports (%)', numeric: true, fmt: (v) => v + '%' },
  ];
  const impCols = [
    { key: 'partner', label: 'Import source' },
    { key: 'share', label: 'Share of imports (%)', numeric: true, fmt: (v) => v + '%' },
  ];
  const expRows = EXPORT_PARTNERS.map((p) => ({ partner: p.partner, share: p.share }));
  const impRows = IMPORT_PARTNERS.map((p) => ({ partner: p.partner, share: p.share }));
  return `<section><p class="eyebrow">Trade &amp; regions</p><h1>Trade &amp; Regions</h1>`
    + `<p class="lede">Indonesia exported US$ 264.71 billion of goods in 2024 and imported US$ 233.67 billion — a surplus of US$ 31.04 billion. China is the largest partner on both sides.</p></section>`
    + `<section><div class="facts">`
    + factRow('Exports, 2024', TRADE.exports.value + ' (' + TRADE.exports.change + ')', TRADE.exports.source)
    + factRow('Imports, 2024', TRADE.imports.value + ' (' + TRADE.imports.change + ')', TRADE.imports.source)
    + factRow('Trade surplus, 2024', TRADE.surplus.value, TRADE.surplus.source)
    + factRow('Total trade, 2024', 'US$ 498.36 billion', 'BPS, 2024')
    + `</div></section>`
    + `<section class="split"><div><h2>Where Indonesia sells</h2>`
    + sortableTable('exp', expCols, expRows, state.sortExp)
    + srcTag('CIA World Factbook, 2023') + `</div>`
    + `<div><h2>Where Indonesia buys</h2>`
    + sortableTable('imp', impCols, impRows, state.sortImp)
    + srcTag('CIA World Factbook, 2023') + `</div></section>`
    + `<section><h2>Top export products, 2024</h2>`
    + shareBars(EXPORT_PRODUCTS.map((p) => ({ label: p.product, share: p.share })))
    + srcTag('UN Comtrade / CEPII BACI, 2024. Shares of total exports.') + `</section>`
    + `<section><h2>Provinces — largest first</h2>`
    + `<div class="controls"><label>Search provinces <input id="prov-search" type="search" placeholder="Type a province, island or capital…" value="${esc(state.query || '')}" aria-label="Search provinces"></label>`
    + `<span class="control-hint">Click a column heading to sort. ${provRows.length} of ${PROVINCES.length} provinces shown.</span></div>`
    + sortableTable('prov', provCols, provRows, state.sortProv)
    + srcTag('BPS, 2024 estimates. Shares are of the BPS 2024 national estimate of 281.6 million; the World Bank total for 2024 is 283.5 million.')
    + `</section>`;
}

// ---------- Sources / about ----------

export function aboutPage() {
  return `<section><p class="eyebrow">About this site</p><h1>Sources &amp; method</h1>`
    + `<p class="lede">NusaStat is an independent dashboard of Indonesia’s official statistics. It is not affiliated with BPS, the World Bank or any government body. Every figure on this site was verified on 26 November 2026 and carries its source and year where it appears.</p></section>`
    + `<section><h2>Every source used</h2><div class="sources">`
    + SOURCES.map((s) => `<article class="source-card"><h3>${esc(s.name)}</h3>`
      + `<p><strong>Covers:</strong> ${esc(s.covers)}</p>`
      + `<p><strong>Latest year used:</strong> ${esc(s.years)}</p>`
      + `<p>${esc(s.note)}</p></article>`).join('')
    + `</div></section>`
    + `<section><h2>How to read the numbers</h2><ul class="plain">`
    + `<li><strong>Two population totals.</strong> BPS estimates 281.6 million people in 2024; the World Bank counts 283.5 million. The difference is method, not error: BPS uses its own projections, the World Bank uses UN population data. Both are shown where they matter.</li>`
    + `<li><strong>Two unemployment rates.</strong> BPS (4.76%, Feb 2025) and the ILO modelled estimate (3.2%, 2025) use different definitions. The Employment page explains both.</li>`
    + `<li><strong>Money.</strong> GDP is shown in current US dollars unless stated. BPS also publishes GDP in rupiah: Rp 22,139.0 trillion in 2024.</li>`
    + `<li><strong>Rounding.</strong> Shares may not add to 100% because of rounding.</li></ul>`
    + `<p><a class="btn" href="#/">Back to the dashboard →</a></p></section>`;
}

export function notFoundPage() {
  return `<section><h1>Page not found</h1><p>That section does not exist. Start from the dashboard, or pick a section above.</p><p><a class="btn" href="#/">Back to the dashboard →</a></p></section>`;
}
