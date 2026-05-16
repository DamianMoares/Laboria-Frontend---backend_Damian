const API_CONFIG = {
  JOBS_APIS: [
    { name: 'RemoteOK', url: 'https://remoteok.com/api', apiKey: '', enabled: false, type: 'api' },
    { name: 'Remotive Remote Jobs', url: import.meta.env.VITE_JOBS_API_5_URL || '/api/remotive/api/remote-jobs', apiKey: import.meta.env.VITE_JOBS_API_5_KEY || '', enabled: true, type: 'api' },
    { name: 'Jobicy Remote Jobs', url: import.meta.env.VITE_JOBS_API_3_URL || '/api/jobicy/api/v2/remote-jobs', apiKey: import.meta.env.VITE_JOBS_API_3_KEY || '', enabled: true, type: 'api' },
    { name: 'Himalayas Remote Jobs', url: import.meta.env.VITE_JOBS_API_4_URL || '/api/himalayas/jobs/api', apiKey: import.meta.env.VITE_JOBS_API_4_KEY || '', enabled: true, type: 'api' },
    { name: 'Arbeitnow Job Board', url: import.meta.env.VITE_JOBS_API_6_URL || '/api/arbeitnow/api/job-board-api', apiKey: import.meta.env.VITE_JOBS_API_6_KEY || '', enabled: true, type: 'api' },
    { name: 'Junta Castilla y León Empleo', url: import.meta.env.VITE_JOBS_API_1_URL || '/api/jcyl/api/records/1.0/search/?dataset=ofertas-de-empleo@jcyl', apiKey: import.meta.env.VITE_JOBS_API_1_KEY || '', enabled: true, type: 'api' },
    { name: 'SerpApi Google Jobs', url: import.meta.env.VITE_JOBS_API_2_URL || 'https://serpapi.com/search', apiKey: import.meta.env.VITE_JOBS_API_2_KEY || '', enabled: false, type: 'api' },
  ],
  JOBS_RSS: [
    { name: 'We Work Remotely', url: 'https://weworkremotely.com/remote-jobs.rss', enabled: true, type: 'rss' },
    { name: 'Indeed RSS', url: 'https://rss.indeed.com/rss?q=software+engineer&l=spain', enabled: false, type: 'rss' },
    { name: 'Glassdoor Blog', url: 'https://www.glassdoor.com/blog/feed/', enabled: true, type: 'rss' },
  ],
  COURSES_APIS: [
    { name: 'YouTube Data API', url: import.meta.env.VITE_COURSES_YOUTUBE_URL || 'https://www.googleapis.com/youtube/v3/search', apiKey: import.meta.env.VITE_COURSES_YOUTUBE_KEY || '', enabled: false, type: 'api' },
    { name: 'Google Custom Search', url: import.meta.env.VITE_COURSES_GOOGLE_SEARCH_URL || 'https://www.googleapis.com/customsearch/v1', apiKey: import.meta.env.VITE_COURSES_GOOGLE_SEARCH_KEY || '', enabled: false, type: 'api' },
    { name: 'Bing Search API', url: import.meta.env.VITE_COURSES_BING_URL || 'https://api.bing.microsoft.com/v7.0/search', apiKey: import.meta.env.VITE_COURSES_BING_KEY || '', enabled: false, type: 'api' },
    { name: 'Khan Academy', url: import.meta.env.VITE_COURSES_API_1_URL || '/api/khanacademy/api/v1/topic/root', apiKey: import.meta.env.VITE_COURSES_API_1_KEY || '', enabled: false, type: 'api' },
    { name: 'Coursera API', url: import.meta.env.VITE_COURSES_API_2_URL || 'https://api.coursera.org/api/courses.v1', apiKey: import.meta.env.VITE_COURSES_API_2_KEY || '', enabled: false, type: 'api' },
    { name: 'Udemy API', url: import.meta.env.VITE_COURSES_API_3_URL || 'https://www.udemy.com/api-2.0/courses', apiKey: import.meta.env.VITE_COURSES_API_3_KEY || '', enabled: false, type: 'api' },
  ],
  COURSES_RSS: [
    { name: 'Coursera Blog', url: 'https://blog.coursera.org/feed/', enabled: true, type: 'rss' },
    { name: 'edX Blog', url: 'https://blog.edx.org/feed', enabled: true, type: 'rss' },
    { name: 'SEPE Formación', url: 'https://www.sepe.es/rss/sepe/formacion.xml', enabled: true, type: 'rss' },
    { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/rss/courses/new.xml', enabled: true, type: 'rss' },
    { name: 'TED-Ed', url: 'https://ed.ted.com/rss', enabled: true, type: 'rss' },
  ],
};

export default API_CONFIG;