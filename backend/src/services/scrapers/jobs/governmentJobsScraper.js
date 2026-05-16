const jobScraperService = require('../../jobScraperService');

jobScraperService.registerSource({
  name: 'Empleo Público (SEPE / Gobierno)',
  description: 'Ofertas de empleo del Servicio Público de Empleo Estatal y boletines oficiales',
  urls: [
    'https://www.sepe.es/HomeSepe/Personas/encontrar-trabajo/ofertas-de-empleo.html',
    'https://www.empleate.gob.es/',
    'https://www.boe.es/diario_boe/'
  ],
  parser: ($, baseUrl) => {
    const jobs = [];

    $('article, .oferta-item, .job-item, .vacante, tr, .resultado-item').each((i, el) => {
      const titleEl = $(el).find('h2, h3, .title, .puesto, .job-title, a');
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = $(el).closest('a').attr('href') || titleEl.closest('a').attr('href') || titleEl.attr('href') || '';
      const fullUrl = link.startsWith('http') ? link : link ? new URL(link, baseUrl).href : null;

      const company = $(el).find('.empresa, .company, .organismo, .institution, .entidad').first().text().trim() || 'Administración Pública';

      const location = $(el).find('.ubicacion, .location, .localidad, .provincia, .ciudad').first().text().trim() || 'España';

      const contractText = ($(el).find('.contrato, .contract, .tipo, .modalidad').first().text().trim() || '').toLowerCase();
      let contractType = null;
      if (contractText.includes('indefinido') || contractText.includes('fijo')) contractType = 'INDEFINIDO';
      else if (contractText.includes('temporal') || contractText.includes('eventual')) contractType = 'TEMPORAL';
      else if (contractText.includes('practicas') || contractText.includes('prácticas')) contractType = 'PRACTICAS';
      else if (contractText.includes('relevo')) contractType = 'RELEVO';

      const description = $(el).find('p, .descripcion, .description, .requisitos').first().text().trim();

      const salary = $(el).find('.salario, .salary, .retribucion, .sueldo').first().text().trim() || null;

      const dateEl = $(el).find('.fecha, .date, .publicacion, .published').first().text().trim();
      let publishedAt = dateEl ? new Date(dateEl) : null;
      if (publishedAt && isNaN(publishedAt.getTime())) publishedAt = null;

      jobs.push({
        title,
        company,
        location,
        salary: salary || null,
        description: description || `Oferta de empleo: ${title} en ${company}`,
        contractType,
        workMode: 'REMOTE',
        category: 'sector-publico',
        url: fullUrl,
        sourceUrl: baseUrl,
        publishedAt
      });
    });

    return jobs;
  }
});
