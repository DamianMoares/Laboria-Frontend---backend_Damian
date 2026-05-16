const scraperService = require('../scraperService');

scraperService.registerSource({
  name: 'Cursos Gobierno (SEPE)',
  description: 'Cursos gratuitos del Servicio Público de Empleo Estatal y portales gubernamentales',
  urls: [
    'https://www.sepe.es/HomeSepe/Personas/Formacion/cursos-gratuitos.html',
    'https://www.mitramiss.gob.es/'
  ],
  parser: ($, baseUrl) => {
    const courses = [];

    $('article, .course-item, .oferta-item, tr').each((i, el) => {
      const titleEl = $(el).find('h2, h3, .title, .course-title, a');
      const title = titleEl.text().trim();
      if (!title || title.length < 5) return;

      const link = titleEl.closest('a').attr('href') || titleEl.attr('href') || '';
      const fullUrl = link.startsWith('http') ? link : new URL(link, baseUrl).href;
      const description = $(el).find('p, .description, .course-desc').first().text().trim();
      const duration = $(el).find('.duration, .hours, .horas').text().trim() || null;
      const modality = $(el).find('.modalidad, .mode, .tipo').text().trim().toLowerCase();

      courses.push({
        title,
        provider: 'Gobierno / SEPE',
        description: description || `Curso: ${title}`,
        category: 'formacion-profesional',
        level: 'BEGINNER',
        duration,
        price: 'Gratuito',
        priceType: 'FREE',
        url: fullUrl || null,
        sourceUrl: baseUrl,
        language: 'es'
      });
    });

    return courses;
  }
});
