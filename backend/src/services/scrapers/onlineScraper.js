const scraperService = require('../scraperService');

scraperService.registerSource({
  name: 'Cursos Online (Abiertos)',
  description: 'Cursos online gratuitos y de pago de plataformas abiertas',
  urls: [
    'https://www.coursera.org/courses',
    'https://www.edx.org/es/cursos',
    'https://www.miriadax.net/cursos'
  ],
  parser: ($, baseUrl) => {
    const courses = [];

    $('[class*="card"], [class*="CourseCard"], [class*="course-card"], article, .card').each((i, el) => {
      const titleEl = $(el).find('h2, h3, [class*="title"], [class*="name"]');
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = $(el).closest('a').attr('href') || titleEl.closest('a').attr('href') || '';
      const fullUrl = link.startsWith('http') ? link : link ? new URL(link, baseUrl).href : null;

      const provider = $(el).find('[class*="partner"], [class*="provider"], [class*="school"], [class*="institution"]').first().text().trim() || 'Plataforma online';

      const description = $(el).find('p, [class*="description"], [class*="desc"]').first().text().trim();
      const duration = $(el).find('[class*="duration"], [class*="hours"], [class*="weeks"]').text().trim() || null;

      const priceText = $(el).text().toLowerCase();
      const priceType = priceText.includes('gratis') || priceText.includes('free') ? 'FREE' : 'PAID';
      const price = priceType === 'FREE' ? 'Gratuito' : 'De pago';

      let level = 'BEGINNER';
      if (priceText.includes('intermediate') || priceText.includes('intermedio')) level = 'INTERMEDIATE';
      if (priceText.includes('advanced') || priceText.includes('avanzado')) level = 'ADVANCED';

      courses.push({
        title,
        provider,
        description: description || `Curso: ${title}`,
        category: 'online',
        level,
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
