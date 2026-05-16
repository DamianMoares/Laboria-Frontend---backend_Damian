const scraperService = require('../scraperService');

scraperService.registerSource({
  name: 'Cursos Universitarios (Abiertos)',
  description: 'Cursos de universidades públicas y privadas con oferta abierta',
  urls: [
    'https://www.uned.es/universidad/cursos/cursos-de-formacion-permanente.html',
    'https://cursos.abiertos.unam.mx/'
  ],
  parser: ($, baseUrl) => {
    const courses = [];

    $('[class*="curso"], [class*="course"], .item, tr, .post, .entry').each((i, el) => {
      const titleEl = $(el).find('h2, h3, h4, [class*="title"], [class*="titulo"], a');
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = $(el).closest('a').attr('href') || titleEl.closest('a').attr('href') || titleEl.attr('href') || '';
      const fullUrl = link.startsWith('http') ? link : link ? new URL(link, baseUrl).href : null;

      const priceEl = $(el).find('[class*="price"], [class*="precio"], [class*="cost"]');
      const priceText = priceEl.text().trim() || '';
      const lower = (priceText + ' ' + $(el).text()).toLowerCase();

      const priceType = lower.includes('gratis') || lower.includes('free') || lower.includes('sin costo') ? 'FREE' : 'PAID';
      const price = priceText || (priceType === 'FREE' ? 'Gratuito' : 'Consultar');

      const duration = $(el).find('[class*="duration"], [class*="duracion"], [class*="hours"], [class*="horas"]').text().trim() || null;

      const description = $(el).find('p, [class*="description"], [class*="descripcion"]').first().text().trim();

      courses.push({
        title,
        provider: 'Universidad',
        description: description || `Curso: ${title}`,
        category: 'universitario',
        level: 'BEGINNER',
        duration,
        price,
        priceType,
        url: fullUrl,
        sourceUrl: baseUrl,
        language: 'es'
      });
    });

    return courses;
  }
});
