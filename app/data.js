// NusaStat data: every figure was verified in-session on 26 Nov 2026 against the
// World Bank World Development Indicators API, BPS (Statistics Indonesia)
// releases, the ILO, UN Comtrade / BACI and the CIA World Factbook.
// Each figure carries its source and year next to it on the page; nothing here
// is an estimate of ours. Where two official sources differ (for example the
// World Bank and BPS population totals), both are shown and labelled.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// World Bank WDI, Indonesia, retrieved 26 Nov 2026 (api.worldbank.org).
export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    source: 'World Bank, World Development Indicators, 2024',
    values: {
      2015: 261.80, 2016: 264.63, 2017: 267.35, 2018: 269.95, 2019: 272.49,
      2020: 274.81, 2021: 276.76, 2022: 278.83, 2023: 281.19, 2024: 283.49,
    },
  },
  gdp: {
    label: 'GDP (current US$)',
    unit: 'US$ billion',
    source: 'World Bank, World Development Indicators, 2024',
    values: {
      2015: 860.9, 2016: 931.9, 2017: 1015.6, 2018: 1042.3, 2019: 1119.1,
      2020: 1059.1, 2021: 1186.5, 2022: 1319.1, 2023: 1371.2, 2024: 1396.3,
    },
  },
  gdpGrowth: {
    label: 'GDP growth (annual %)',
    unit: '% per year',
    source: 'World Bank, World Development Indicators, 2024',
    values: {
      2015: 4.88, 2016: 5.03, 2017: 5.07, 2018: 5.17, 2019: 5.02,
      2020: -2.07, 2021: 3.70, 2022: 5.31, 2023: 5.05, 2024: 5.03,
    },
  },
  inflation: {
    label: 'Inflation, consumer prices (annual %)',
    unit: '% per year',
    source: 'World Bank, World Development Indicators, 2024',
    values: {
      2015: 6.36, 2016: 3.53, 2017: 3.81, 2018: 3.20, 2019: 3.03,
      2020: 1.92, 2021: 1.56, 2022: 4.21, 2023: 3.67, 2024: 2.18,
    },
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'World Bank, World Development Indicators, 2024',
    values: {
      2015: 69.52, 2016: 69.73, 2017: 69.95, 2018: 70.08, 2019: 70.35,
      2020: 68.82, 2021: 67.45, 2022: 70.93, 2023: 71.15, 2024: 71.29,
    },
  },
};

// Headline indicators shown on the dashboard. Every card shows source + year.
export const HEADLINES = [
  {
    id: 'population',
    label: 'Population',
    value: '283.5 million',
    note: '4th most populous country in the world',
    source: 'World Bank, 2024',
    route: '#/population',
  },
  {
    id: 'gdp',
    label: 'GDP',
    value: 'US$ 1.40 trillion',
    note: '16th largest economy in the world',
    source: 'World Bank, 2024',
    route: '#/economy',
  },
  {
    id: 'gdpPerCapita',
    label: 'GDP per capita',
    value: 'US$ 4,925',
    note: 'Upper-middle-income economy',
    source: 'World Bank, 2024',
    route: '#/economy',
  },
  {
    id: 'inflation',
    label: 'Inflation',
    value: '2.2%',
    note: 'Consumer prices, annual. BPS annual average 2024: 1.57%',
    source: 'World Bank, 2024',
    route: '#/economy',
  },
  {
    id: 'unemployment',
    label: 'Unemployment rate',
    value: '4.76%',
    note: 'Open unemployment (TPT), lowest since 1997',
    source: 'BPS, February 2025',
    route: '#/employment',
  },
  {
    id: 'life',
    label: 'Life expectancy',
    value: '71.3 years',
    note: 'Women 73.4 years, men 69.2 years',
    source: 'World Bank, 2024',
    route: '#/health',
  },
];

// Age structure, World Bank WDI 2024. The 15-64 share is the remainder.
export const AGE_STRUCTURE = [
  { group: 'Aged 0-14', share: 24.6, source: 'World Bank, 2024' },
  { group: 'Aged 15-64', share: 68.1, source: 'World Bank, 2024 (remainder)' },
  { group: 'Aged 65+', share: 7.3, source: 'World Bank, 2024' },
];

// GDP by sector, share of nominal GDP, BPS 2024 (via BCA Research tables
// compiled from BPS). Nominal GDP 2024: Rp 22,139.0 trillion.
export const SECTORS = [
  { sector: 'Manufacturing', share: 19.0 },
  { sector: 'Wholesale and retail trade', share: 13.1 },
  { sector: 'Agriculture, forestry and fishing', share: 12.6 },
  { sector: 'Construction', share: 10.1 },
  { sector: 'Mining and quarrying', share: 9.2 },
  { sector: 'Transport and warehousing', share: 6.1 },
  { sector: 'Information and communication', share: 4.3 },
  { sector: 'Financial services and insurance', share: 4.2 },
  { sector: 'Government administration', share: 3.0 },
  { sector: 'Hotels, restaurants and catering', share: 2.6 },
  { sector: 'Real estate', share: 2.4 },
  { sector: 'Business services', share: 1.9 },
  { sector: 'Electricity and gas', share: 1.0 },
];

// Open unemployment rate (TPT), BPS annual figures.
export const UNEMPLOYMENT_SERIES = [
  { year: 2021, rate: 6.5 },
  { year: 2022, rate: 5.9 },
  { year: 2023, rate: 5.3 },
  { year: 2024, rate: 4.9 },
  { year: 2025, rate: 4.8 },
];

// Labour market, BPS National Labour Force Survey (Sakernas), February 2025.
export const LABOUR = [
  { label: 'Labour force', value: '153.05 million', source: 'BPS, Feb 2025' },
  { label: 'Employed', value: '145.77 million', source: 'BPS, Feb 2025' },
  { label: 'Unemployed', value: '7.28 million', source: 'BPS, Feb 2025' },
  { label: 'Working-age population', value: '216.79 million', source: 'BPS, Feb 2025' },
  { label: 'Informal workers', value: '59.4% of the employed', source: 'BPS, Feb 2025' },
  { label: 'Youth unemployment (15-24)', value: '13.0%', source: 'ILO modelled estimate, World Bank, 2025' },
  { label: 'Unemployment, men', value: '4.98%', source: 'BPS, Feb 2025' },
  { label: 'Unemployment, women', value: '4.41%', source: 'BPS, Feb 2025' },
];

// Health and education, World Bank WDI unless stated otherwise.
export const HEALTH_EDUCATION = [
  { label: 'Life expectancy at birth', value: '71.3 years', source: 'World Bank, 2024' },
  { label: 'Health spending', value: '2.7% of GDP', source: 'World Bank, 2023' },
  { label: 'Health spending per person', value: 'US$ 132', source: 'World Bank, 2023' },
  { label: 'Adult literacy (age 15+)', value: '96%', source: 'World Bank, 2020' },
  { label: 'Primary school enrolment', value: '100.4% (gross)', source: 'World Bank, 2025' },
  { label: 'Secondary school enrolment', value: '97.2% (gross)', source: 'World Bank, 2025' },
  { label: 'Tertiary enrolment', value: '44.9% (gross)', source: 'World Bank, 2023' },
  { label: 'Education spending', value: '1.3% of GDP', source: 'World Bank, 2023' },
  { label: 'Human Development Index', value: '0.728', source: 'UNDP, 2023' },
  { label: 'Fertility rate', value: '2.12 births per woman', source: 'World Bank, 2024' },
];

// Foreign trade in goods, BPS / WTO, 2024.
export const TRADE = {
  exports: { value: 'US$ 264.71 billion', change: '+2.3% on 2023', source: 'BPS, 2024' },
  imports: { value: 'US$ 233.67 billion', change: '+5.3% on 2023', source: 'BPS, 2024' },
  surplus: { value: 'US$ 31.04 billion', change: 'Total trade US$ 498.36 billion', source: 'BPS, 2024' },
};

// Trading partners, shares of Indonesia's trade in that direction.
// CIA World Factbook, 2023 (latest partner shares published there).
export const EXPORT_PARTNERS = [
  { partner: 'China', share: 24 },
  { partner: 'United States', share: 9 },
  { partner: 'India', share: 8 },
  { partner: 'Japan', share: 8 },
  { partner: 'Singapore', share: 5 },
];
export const IMPORT_PARTNERS = [
  { partner: 'China', share: 29 },
  { partner: 'Singapore', share: 8 },
  { partner: 'Japan', share: 7 },
  { partner: 'United States', share: 5 },
  { partner: 'Malaysia', share: 5 },
];

// Largest export product groups, share of exports, BACI reconciled data 2024.
export const EXPORT_PRODUCTS = [
  { product: 'Mineral fuels and oils (incl. coal)', share: 20.8 },
  { product: 'Animal and vegetable fats and oils (incl. palm oil)', share: 11.7 },
  { product: 'Iron and steel', share: 8.6 },
];

// Largest provinces, BPS 2024 estimates (millions). Shares are computed in
// views.js against the BPS 2024 national estimate of 281.6 million.
export const PROVINCES = [
  { province: 'West Java', capital: 'Bandung', island: 'Java', population: 50.3 },
  { province: 'East Java', capital: 'Surabaya', island: 'Java', population: 41.8 },
  { province: 'Central Java', capital: 'Semarang', island: 'Java', population: 37.9 },
  { province: 'North Sumatra', capital: 'Medan', island: 'Sumatra', population: 15.6 },
  { province: 'Banten', capital: 'Serang', island: 'Java', population: 12.4 },
  { province: 'Jakarta', capital: 'Jakarta', island: 'Java', population: 10.7 },
  { province: 'South Sulawesi', capital: 'Makassar', island: 'Sulawesi', population: 9.5 },
  { province: 'Lampung', capital: 'Bandar Lampung', island: 'Sumatra', population: 9.3 },
];
export const BPS_POPULATION_2024 = 281.6;

// Poverty, BPS.
export const POVERTY = [
  { label: 'Poverty rate', value: '8.47%', detail: '23.85 million people', source: 'BPS, March 2025' },
  { label: 'Poverty rate', value: '8.25%', detail: '23.36 million people', source: 'BPS, September 2025' },
  { label: 'Poverty rate', value: '9.03%', detail: '25.22 million people', source: 'BPS, March 2024' },
  { label: 'Poverty line', value: 'Rp 609,160 per person per month', detail: 'About Rp 20,305 a day', source: 'BPS, March 2025' },
];

// Sources page: every source the site uses, what it covers, latest year used.
export const SOURCES = [
  {
    name: 'BPS — Statistics Indonesia',
    covers: 'Population estimates, GDP and growth, unemployment (Sakernas), poverty, inflation, trade in goods, provincial populations',
    years: '2024-2025',
    note: "Indonesia's national statistics office. Its 2024 population estimate is 281.6 million; the World Bank figure (283.5 million) is shown alongside it.",
  },
  {
    name: 'World Bank — World Development Indicators',
    covers: 'Population, GDP, GDP per capita, GDP growth, inflation, life expectancy, age structure, urban share, literacy, enrolment, health and education spending, youth unemployment',
    years: '2015-2025',
    note: 'All ten-year series on this site come from the WDI, retrieved 26 November 2026.',
  },
  {
    name: 'International Labour Organization (ILO)',
    covers: 'Modelled unemployment and youth unemployment estimates, informal employment context',
    years: '2024-2025',
    note: 'The ILO modelled unemployment rate (3.2%, 2025) uses a different definition from the BPS open unemployment rate (4.76%, Feb 2025); both are shown.',
  },
  {
    name: 'UN Comtrade / CEPII BACI',
    covers: 'Export product groups and reconciled bilateral trade',
    years: '2024',
    note: 'BACI reconciles each export against the partner country’s import record, so its totals differ slightly from customs totals.',
  },
  {
    name: 'CIA World Factbook',
    covers: 'Trading-partner shares, GDP (PPP)',
    years: '2023-2024',
    note: 'Partner shares are the latest published there (2023).',
  },
  {
    name: 'UNDP — Human Development Report',
    covers: 'Human Development Index',
    years: '2023',
    note: 'HDI 0.728 combines life expectancy, schooling and income.',
  },
];
