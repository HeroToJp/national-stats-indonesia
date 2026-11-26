// main.js — boot for NusaStat: hash routing, page rendering, and wiring for
// every control (year selectors, sortable table headings, province search).
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { NAV, aboutPage, economyPage, employmentPage, healthPage, homePage, notFoundPage, populationPage, tradePage } from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('header nav a')];

// Per-page state, kept across renders so a control keeps what the visitor set.
const state = {
  range: {
    pop: { from: 2015, to: 2024 },
    eco: { from: 2015, to: 2024 },
    emp: { from: 2021, to: 2025 },
    hea: { from: 2015, to: 2024 },
  },
  sortProv: { key: 'popNum', dir: 'desc' },
  sortExp: { key: 'share', dir: 'desc' },
  sortImp: { key: 'share', dir: 'desc' },
  query: '',
};

const PAGES = {
  home: { title: 'NusaStat · Indonesia in Numbers', render: () => homePage() },
  population: { title: 'Population · NusaStat', render: () => populationPage({ range: state.range.pop }) },
  economy: { title: 'Economy · NusaStat', render: () => economyPage({ range: state.range.eco }) },
  employment: { title: 'Employment · NusaStat', render: () => employmentPage({ range: state.range.emp }) },
  health: { title: 'Health & Education · NusaStat', render: () => healthPage({ range: state.range.hea }) },
  trade: {
    title: 'Trade & Regions · NusaStat',
    render: () => tradePage({ query: state.query, sortProv: state.sortProv, sortExp: state.sortExp, sortImp: state.sortImp }),
  },
  about: { title: 'Sources & Method · NusaStat', render: () => aboutPage() },
};

function route() {
  const hash = location.hash || '#/';
  const match = hash.match(/^#\/([a-z]+)/);
  const page = match && PAGES[match[1]] ? match[1] : (hash === '#/' || hash === '' ? 'home' : 'missing');
  return page;
}

function render() {
  window.__shotReady = false;
  const page = route();
  const def = PAGES[page];
  document.title = def ? def.title : 'Page not found · NusaStat';
  app.innerHTML = def ? def.render() : notFoundPage();
  navLinks.forEach((a) => {
    const p = NAV.find((n) => n.route === a.getAttribute('href'));
    if (p && p.page === page) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  // Keep the province search usable while typing: restore focus and caret.
  if (page === 'trade' && state.searchFocus) {
    const input = document.getElementById('prov-search');
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// Year selectors: each pair is named <prefix>-from / <prefix>-to.
document.addEventListener('change', (event) => {
  const el = event.target;
  if (!(el instanceof HTMLSelectElement)) return;
  const m = el.id.match(/^(pop|eco|emp|hea)-(from|to)$/);
  if (!m) return;
  const range = state.range[m[1]];
  const value = Number(el.value);
  if (m[2] === 'from') range.from = Math.min(value, range.to);
  else range.to = Math.max(value, range.from);
  render();
});

// Sortable table headings: click (or Enter/Space) toggles that table's sort.
function sortClick(target) {
  const th = target.closest('th[data-sort]');
  if (!th) return;
  const [table, key] = th.dataset.sort.split(':');
  const map = { prov: 'sortProv', exp: 'sortExp', imp: 'sortImp' };
  const field = map[table];
  if (!field) return;
  const sort = state[field];
  if (sort.key === key) sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
  else { sort.key = key; sort.dir = 'desc'; }
  render();
}
document.addEventListener('click', (event) => sortClick(event.target));
document.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('th[data-sort]')) {
    event.preventDefault();
    sortClick(event.target);
  }
});

// Province search: filter as the visitor types.
document.addEventListener('input', (event) => {
  if (event.target.id !== 'prov-search') return;
  state.query = event.target.value;
  state.searchFocus = true;
  render();
});
document.addEventListener('focusout', (event) => {
  if (event.target.id === 'prov-search') state.searchFocus = false;
});

window.addEventListener('hashchange', render);
render();
