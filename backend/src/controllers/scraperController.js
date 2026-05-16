const scraperService = require('../services/scraperService');

require('../services/scrapers/governmentScraper');
require('../services/scrapers/onlineScraper');
require('../services/scrapers/universityScraper');

const runAll = async (req, res, next) => {
  try {
    const results = await scraperService.scrapeAll();
    const summary = [];

    for (const result of results) {
      const saved = await scraperService.saveToDatabase(result.items, result.source);
      summary.push({ source: result.source, found: result.items.length, saved });
    }

    res.json({ message: 'Escaneo completado', results: summary });
  } catch (error) {
    next(error);
  }
};

const runSource = async (req, res, next) => {
  try {
    const { sourceName } = req.params;
    const sources = scraperService.getSources();
    const source = sources.find(s => s.name === sourceName);

    if (!source) {
      return res.status(404).json({ error: `Fuente "${sourceName}" no encontrada` });
    }

    const items = await scraperService.scrapeSource(source);
    const saved = await scraperService.saveToDatabase(items, source.name);

    res.json({ message: `Escaneo de "${sourceName}" completado`, found: items.length, saved });
  } catch (error) {
    next(error);
  }
};

const listSources = async (req, res, next) => {
  try {
    const sources = scraperService.getSources();
    res.json({ sources });
  } catch (error) {
    next(error);
  }
};

const listCourses = async (req, res, next) => {
  try {
    const { source, category, priceType, search, limit, offset } = req.query;
    const courses = await scraperService.getScrapedCourses({
      source, category, priceType, search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });
    res.json({ courses });
  } catch (error) {
    next(error);
  }
};

module.exports = { runAll, runSource, listSources, listCourses };
