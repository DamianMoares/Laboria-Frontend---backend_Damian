const jobScraperService = require('../../jobScraperService');

jobScraperService.registerSource({
  name: 'Redes Sociales y Portales Especializados',
  description: 'Ofertas de empleo publicadas en redes sociales, foros y portales de nicho',
  urls: [
    'https://www.facebook.com/jobs/',
    'https://twitter.com/search?q=empleo+Espa%C3%B1a&f=live',
    'https://www.jobsinspain.com/'
  ],
  parser: ($, baseUrl) => {
    const jobs = [];

    $('[class*="post"], [class*="job"], article, .oferta, .vacante, [class*="item"], [class*="card"]').each((i, el) => {
      const titleEl = $(el).find('h2, h3, h4, [class*="title"], [class*="titulo"], a');
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = $(el).closest('a').attr('href') || titleEl.closest('a').attr('href') || titleEl.attr('href') || '';
      const fullUrl = link.startsWith('http') ? link : link ? new URL(link, baseUrl).href : null;

      const text = $(el).text();

      const company = $(el).find('[class*="company"], [class*="empresa"], [class*="author"]').first().text().trim()
        || 'Empresa / Red social';

      const location = $(el).find('[class*="location"], [class*="ubicacion"]').first().text().trim()
        || 'España';

      const lowerText = text.toLowerCase();

      let contractType = null;
      if (lowerText.includes('indefinido') || lowerText.includes('fijo')) contractType = 'INDEFINIDO';
      else if (lowerText.includes('temporal')) contractType = 'TEMPORAL';
      else if (lowerText.includes('prácticas') || lowerText.includes('practicas')) contractType = 'PRACTICAS';
      else if (lowerText.includes('autónomo') || lowerText.includes('freelance')) contractType = 'AUTONOMO';

      let workMode = 'ONSITE';
      if (lowerText.includes('remoto') || lowerText.includes('teletrabajo') || lowerText.includes('home office')) workMode = 'REMOTE';
      else if (lowerText.includes('híbrido') || lowerText.includes('hibrido')) workMode = 'HYBRID';

      const salaryMatch = text.match(/(\d[\d.]*\s*[€€]|\d[\d.]*\s*euros)/i);
      const salary = salaryMatch ? salaryMatch[0] : null;

      const description = $(el).find('p, [class*="description"], [class*="desc"]').first().text().trim()
        || text.substring(0, 200).trim();

      let category = 'general';
      if (lowerText.includes('informática') || lowerText.includes('tecnología') || lowerText.includes('programador')) category = 'informatica';
      else if (lowerText.includes('venta') || lowerText.includes('comercial')) category = 'comercial';
      else if (lowerText.includes('administra')) category = 'administracion';
      else if (lowerText.includes('salud') || lowerText.includes('sanidad') || lowerText.includes('enfermer')) category = 'sanidad';
      else if (lowerText.includes('hostel') || lowerText.includes('camarero') || lowerText.includes('cocina')) category = 'hosteleria';
      else if (lowerText.includes('enseñanza') || lowerText.includes('profesor') || lowerText.includes('docente')) category = 'educacion';

      jobs.push({
        title,
        company,
        location,
        salary,
        description,
        contractType,
        workMode,
        category,
        url: fullUrl,
        sourceUrl: baseUrl
      });
    });

    return jobs;
  }
});
