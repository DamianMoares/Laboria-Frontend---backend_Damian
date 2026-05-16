const jobScraperService = require('../services/jobScraperService');

require('../services/scrapers/jobs/governmentJobsScraper');
require('../services/scrapers/jobs/cabildoJobsScraper');
require('../services/scrapers/jobs/portalJobsScraper');
require('../services/scrapers/jobs/socialJobsScraper');

const runAll = async (req, res, next) => {
  try {
    const results = await jobScraperService.scrapeAll();
    const summary = [];

    for (const result of results) {
      const saved = await jobScraperService.saveToDatabase(result.items, result.source);
      summary.push({ source: result.source, found: result.items.length, saved });
    }

    res.json({ message: 'Escaneo de empleos completado', results: summary });
  } catch (error) {
    next(error);
  }
};

const runSource = async (req, res, next) => {
  try {
    const { sourceName } = req.params;
    const sources = jobScraperService.getSources();
    const source = sources.find(s => s.name === sourceName);

    if (!source) {
      return res.status(404).json({ error: `Fuente "${sourceName}" no encontrada` });
    }

    const items = await jobScraperService.scrapeSource(source);
    const saved = await jobScraperService.saveToDatabase(items, source.name);

    res.json({ message: `Escaneo de "${sourceName}" completado`, found: items.length, saved });
  } catch (error) {
    next(error);
  }
};

const listSources = async (req, res, next) => {
  try {
    const sources = jobScraperService.getSources();
    res.json({ sources });
  } catch (error) {
    next(error);
  }
};

const listJobs = async (req, res, next) => {
  try {
    const { source, category, contractType, workMode, location, search, limit, offset } = req.query;
    const jobs = await jobScraperService.getScrapedJobs({
      source, category, contractType, workMode, location, search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
};

module.exports = { runAll, runSource, listSources, listJobs };
