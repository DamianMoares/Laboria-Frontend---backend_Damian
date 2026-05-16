const jobScraperService = require('../../jobScraperService');

jobScraperService.registerSource({
  name: 'Cabildos y Gobiernos Autonómicos',
  description: 'Ofertas de empleo de cabildos insulares, gobiernos autonómicos y diputaciones',
  urls: [
    'https://www.gobiernodecanarias.org/empleo/',
    'https://www3.gobiernodecanarias.org/empleo/portal/web/sce/ofertas-empleo',
    'https://sede.gobcan.es/sede/ofertas_empleo_publico'
  ],
  parser: ($, baseUrl) => {
    const jobs = [];

    $('article, .oferta, .plaza, .puesto-item, .empleo-item, tr, .contenido-item').each((i, el) => {
      const titleEl = $(el).find('h2, h3, h4, .titulo, .title, .puesto, a');
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = $(el).closest('a').attr('href') || titleEl.closest('a').attr('href') || titleEl.attr('href') || '';
      const fullUrl = link.startsWith('http') ? link : link ? new URL(link, baseUrl).href : null;

      const company = $(el).find('.organismo, .entidad, .departamento, .institution, .cabildo, .ayuntamiento').first().text().trim()
        || 'Gobierno de Canarias / Cabildo';

      const location = $(el).find('.isla, .municipio, .localidad, .ubicacion, .location, .provincia').first().text().trim()
        || 'Canarias';

      const contractText = ($(el).find('.tipo-contrato, .contrato, .modalidad, .tipo').first().text().trim() || '').toLowerCase();
      let contractType = null;
      if (contractText.includes('indefinido') || contractText.includes('fijo')) contractType = 'INDEFINIDO';
      else if (contractText.includes('temporal') || contractText.includes('eventual') || contractText.includes('interino')) contractType = 'TEMPORAL';
      else if (contractText.includes('funcionario') || contractText.includes('carrera')) contractType = 'FUNCIONARIO';
      else if (contractText.includes('laboral')) contractType = 'LABORAL';

      const description = $(el).find('p, .descripcion, .requisitos, .body').first().text().trim();
      const salary = $(el).find('.salario, .retribucion, .sueldo, .salary').first().text().trim() || null;

      const dateEl = $(el).find('.fecha, .date, .publicacion').first().text().trim();
      let publishedAt = dateEl ? new Date(dateEl) : null;
      if (publishedAt && isNaN(publishedAt.getTime())) publishedAt = null;

      jobs.push({
        title,
        company,
        location,
        salary,
        description: description || `Empleo público en Canarias: ${title}`,
        contractType,
        workMode: 'ONSITE',
        category: 'sector-publico',
        url: fullUrl,
        sourceUrl: baseUrl,
        publishedAt
      });
    });

    return jobs;
  }
});
