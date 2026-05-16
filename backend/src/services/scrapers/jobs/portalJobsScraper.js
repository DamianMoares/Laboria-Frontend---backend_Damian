const jobScraperService = require('../../jobScraperService');

jobScraperService.registerSource({
  name: 'Portales de Empleo (InfoJobs, LinkedIn, Indeed)',
  description: 'Ofertas de empleo de los principales portales de trabajo online',
  urls: [
    'https://www.infojobs.net/ofertas-empleo',
    'https://es.linkedin.com/jobs/search?location=Espa%C3%B1a',
    'https://es.indeed.com/ofertas-de-trabajo'
  ],
  parser: ($, baseUrl) => {
    const jobs = [];

    $('[class*="card"], [class*="job"], [class*="oferta"], [class*="result"], article, li, .job-card').each((i, el) => {
      const titleEl = $(el).find('h2, h3, [class*="title"], [class*="titulo"], a');
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = $(el).closest('a').attr('href') || titleEl.closest('a').attr('href') || titleEl.attr('href') || '';
      const fullUrl = link.startsWith('http') ? link : link ? new URL(link, baseUrl).href : null;

      const company = $(el).find('[class*="company"], [class*="empresa"], [class*="employer"]').first().text().trim()
        || 'Empresa del sector';

      const location = $(el).find('[class*="location"], [class*="ubicacion"], [class*="place"]').first().text().trim()
        || 'España';

      const text = $(el).text();
      const lowerText = text.toLowerCase();

      let contractType = null;
      if (lowerText.includes('indefinido') || lowerText.includes('fijo') || lowerText.includes('permanente')) contractType = 'INDEFINIDO';
      else if (lowerText.includes('temporal') || lowerText.includes('eventual')) contractType = 'TEMPORAL';
      else if (lowerText.includes('prácticas') || lowerText.includes('practicas') || lowerText.includes('intern')) contractType = 'PRACTICAS';
      else if (lowerText.includes('autónomo') || lowerText.includes('freelance')) contractType = 'AUTONOMO';
      else if (lowerText.includes('relevo') || lowerText.includes('sustitución')) contractType = 'RELEVO';

      let workMode = 'ONSITE';
      if (lowerText.includes('remoto') || lowerText.includes('remote') || lowerText.includes('teletrabajo')) workMode = 'REMOTE';
      else if (lowerText.includes('híbrido') || lowerText.includes('hibrido') || lowerText.includes('mixto')) workMode = 'HYBRID';

      const description = $(el).find('p, [class*="description"], [class*="descripcion"]').first().text().trim();

      const salaryEl = $(el).find('[class*="salary"], [class*="salario"], [class*="sueldo"]').first().text().trim() || null;

      const dateEl = $(el).find('[class*="date"], [class*="fecha"], [class*="published"], [class*="time"]').first().text().trim();
      let publishedAt = dateEl ? new Date(dateEl) : null;
      if (publishedAt && isNaN(publishedAt.getTime())) publishedAt = null;

      let category = 'general';
      if (lowerText.includes('informática') || lowerText.includes('tecnología') || lowerText.includes('developer') || lowerText.includes('programador')) category = 'informatica';
      else if (lowerText.includes('venta') || lowerText.includes('comercial') || lowerText.includes('marketing')) category = 'comercial';
      else if (lowerText.includes('administra') || lowerText.includes('secretaria') || lowerText.includes('oficina')) category = 'administracion';
      else if (lowerText.includes('enfermer') || lowerText.includes('medico') || lowerText.includes('salud') || lowerText.includes('sanidad')) category = 'sanidad';
      else if (lowerText.includes('hosteler') || lowerText.includes('camarero') || lowerText.includes('cocinero')) category = 'hosteleria';
      else if (lowerText.includes('enseñanza') || lowerText.includes('profesor') || lowerText.includes('docente')) category = 'educacion';
      else if (lowerText.includes('ingenier') || lowerText.includes('arquitect') || lowerText.includes('obra')) category = 'ingenieria';

      jobs.push({
        title,
        company,
        location,
        salary: salaryEl,
        description: description || `Oferta de empleo: ${title}`,
        contractType,
        workMode,
        category,
        url: fullUrl,
        sourceUrl: baseUrl,
        publishedAt
      });
    });

    return jobs;
  }
});
