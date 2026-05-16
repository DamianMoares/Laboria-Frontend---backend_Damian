const axios = require('axios');
const cheerio = require('cheerio');
const prisma = require('../config/database');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const sources = [];

const registerSource = (source) => {
  sources.push(source);
};

const fetchPage = async (url) => {
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': USER_AGENT },
    timeout: 15000
  });
  return cheerio.load(data);
};

const scrapeSource = async (source) => {
  console.log(`[JobScraper] Scaneando fuente: ${source.name}`);
  const results = [];

  for (const url of source.urls) {
    try {
      const $ = await fetchPage(url);
      const items = source.parser($, url);
      results.push(...items);
      console.log(`  -> ${items.length} empleos de ${url}`);
    } catch (err) {
      console.error(`  -> Error en ${url}: ${err.message}`);
    }
  }

  return results;
};

const scrapeAll = async () => {
  const allResults = [];
  for (const source of sources) {
    const items = await scrapeSource(source);
    allResults.push({ source: source.name, items });
  }
  return allResults;
};

const saveToDatabase = async (items, sourceName) => {
  let saved = 0;
  for (const item of items) {
    try {
      await prisma.scrapedJob.upsert({
        where: { id: item.id || undefined },
        update: {
          title: item.title,
          company: item.company,
          location: item.location || '',
          salary: item.salary || null,
          description: item.description || '',
          contractType: item.contractType || null,
          workMode: item.workMode || 'REMOTE',
          category: item.category || 'general',
          url: item.url || null,
          source: sourceName,
          sourceUrl: item.sourceUrl || null,
          publishedAt: item.publishedAt || null
        },
        create: {
          title: item.title,
          company: item.company,
          location: item.location || '',
          salary: item.salary || null,
          description: item.description || '',
          contractType: item.contractType || null,
          workMode: item.workMode || 'REMOTE',
          category: item.category || 'general',
          url: item.url || null,
          source: sourceName,
          sourceUrl: item.sourceUrl || null,
          publishedAt: item.publishedAt || null
        }
      });
      saved++;
    } catch (err) {
      console.error(`Error guardando empleo "${item.title}": ${err.message}`);
    }
  }
  return saved;
};

const getScrapedJobs = async (filters = {}) => {
  const where = {};
  if (filters.source) where.source = filters.source;
  if (filters.category) where.category = filters.category;
  if (filters.contractType) where.contractType = filters.contractType;
  if (filters.workMode) where.workMode = filters.workMode;
  if (filters.location) where.location = { contains: filters.location, mode: 'insensitive' };
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { company: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  return prisma.scrapedJob.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: filters.limit || 100,
    skip: filters.offset || 0
  });
};

const getSources = () => sources.map(s => ({ name: s.name, description: s.description, url: s.urls[0] }));

module.exports = {
  registerSource,
  scrapeSource,
  scrapeAll,
  saveToDatabase,
  getScrapedJobs,
  getSources,
  fetchPage
};
