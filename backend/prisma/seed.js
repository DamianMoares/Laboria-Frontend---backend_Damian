const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = (pw) => bcrypt.hash(pw, 10);

  // ─── USUARIOS ──────────────────────────────────────────────
  const usersData = [
    // Admin
    { email: 'admin@laboria.com', password: 'admin123', name: 'Admin Laboria', role: 'ADMIN' },
    // Candidatos
    { email: 'carlos@email.com', password: 'carlos123', name: 'Carlos García López', role: 'CANDIDATE' },
    { email: 'maria@email.com', password: 'maria123', name: 'María Rodríguez Pérez', role: 'CANDIDATE' },
    { email: 'javier@email.com', password: 'javier123', name: 'Javier Martínez Ruiz', role: 'CANDIDATE' },
    // Empresas
    { email: 'info@techcorp.com', password: 'techcorp123', name: 'TechCorp Solutions', role: 'COMPANY_EMPLOYEES' },
    { email: 'info@edunext.com', password: 'edunext123', name: 'EduNext Academy', role: 'COMPANY_STUDENTS' },
    { email: 'info@innovagroup.com', password: 'innova123', name: 'InnovaGroup', role: 'COMPANY_HYBRID' },
    { email: 'info@datasoft.com', password: 'datasoft123', name: 'DataSoft Technologies', role: 'COMPANY_EMPLOYEES' },
    { email: 'info@cursosalfa.com', password: 'alfa123', name: 'Cursos Alfa', role: 'COMPANY_STUDENTS' },
  ];

  const users = {};
  for (const u of usersData) {
    const hashed = await hash(u.password);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { email: u.email, password: hashed, name: u.name, role: u.role },
    });
    users[u.email] = user;
  }

  // ─── EMPLEOS ───────────────────────────────────────────────
  const jobsData = [
    { title: 'Desarrollador Full Stack', company: 'TechCorp Solutions', location: 'Madrid', salary: '40.000€ - 55.000€', description: 'Buscamos desarrollador Full Stack con experiencia en React y Node.js para unirse a nuestro equipo de producto. Trabajarás en aplicaciones web modernas con tecnologías cloud.', requirements: '• 3+ años con React\n• 2+ años con Node.js\n• Experiencia con PostgreSQL\n• Conocimientos de Docker', mode: 'HYBRID', category: 'Tecnología', authorEmail: 'info@techcorp.com' },
    { title: 'Data Scientist Senior', company: 'DataSoft Technologies', location: 'Barcelona', salary: '55.000€ - 75.000€', description: 'Buscamos un Data Scientist para liderar proyectos de machine learning y análisis de datos. Trabajarás con grandes volúmenes de datos y modelos predictivos.', requirements: '• 5+ años en ciencia de datos\n• Python, R, SQL\n• Experiencia con TensorFlow/PyTorch\n• Machine Learning', mode: 'REMOTE', category: 'Datos e IA', authorEmail: 'info@datasoft.com' },
    { title: 'Diseñador UX/UI', company: 'InnovaGroup', location: 'Valencia', salary: '32.000€ - 45.000€', description: 'Necesitamos un diseñador UX/UI creativo para rediseñar nuestra plataforma web. Experiencia en diseño de interfaces y prototipado.', requirements: '• 2+ años como UX/UI\n• Figma, Sketch, Adobe XD\n• Conocimientos de accesibilidad\n• Portfolio digital', mode: 'ONSITE', category: 'Diseño', authorEmail: 'info@innovagroup.com' },
    { title: 'DevOps Engineer', company: 'TechCorp Solutions', location: 'Madrid', salary: '50.000€ - 65.000€', description: 'Únete al equipo de infraestructura para gestionar y mejorar nuestra plataforma cloud. Automatización, CI/CD y monitorización.', requirements: '• 3+ años como DevOps\n• AWS/Azure/GCP\n• Kubernetes, Docker\n• Terraform, Ansible', mode: 'REMOTE', category: 'Tecnología', authorEmail: 'info@techcorp.com' },
    { title: 'Profesor de Programación Web', company: 'EduNext Academy', location: 'Online', salary: '30€/hora', description: 'Buscamos profesores para impartir cursos de desarrollo web full stack. Clases en vivo con grupos reducidos.', requirements: '• Experiencia docente\n• Stack MERN\n• Buenas habilidades comunicativas', mode: 'REMOTE', category: 'Educación', authorEmail: 'info@edunext.com' },
    { title: 'Analista de Ciberseguridad', company: 'DataSoft Technologies', location: 'Barcelona', salary: '45.000€ - 60.000€', description: 'Protege nuestra infraestructura y datos. Realizarás auditorías de seguridad, pentesting y planes de mitigación.', requirements: '• 3+ años en ciberseguridad\n• Certificaciones CISSP/CEH\n• Experiencia con firewalls y SIEM', mode: 'HYBRID', category: 'Tecnología', authorEmail: 'info@datasoft.com' },
    { title: 'Técnico de Marketing Digital', company: 'InnovaGroup', location: 'Valencia', salary: '28.000€ - 38.000€', description: 'Gestiona campañas digitales, SEO/SEM y redes sociales. Trabajarás con herramientas de analítica y automatización.', requirements: '• 1-2 años en marketing digital\n• Google Ads, Meta Ads\n• SEO y analítica web\n• Creatividad y orientación a resultados', mode: 'ONSITE', category: 'Marketing', authorEmail: 'info@innovagroup.com' },
    { title: 'Coordinador de Formación Online', company: 'EduNext Academy', location: 'Online', salary: '26.000€ - 34.000€', description: 'Coordina la oferta formativa, gestiona calendarios y apoya a alumnos y profesores en la plataforma e-learning.', requirements: '• Experiencia en gestión educativa\n• Moodle o Canvas\n• Organización y atención al cliente', mode: 'REMOTE', category: 'Educación', authorEmail: 'info@edunext.com' },
  ];

  const jobs = [];
  for (const j of jobsData) {
    const existing = await prisma.job.findFirst({ where: { title: j.title, authorId: users[j.authorEmail].id } });
    if (existing) { jobs.push(existing); continue; }
    const job = await prisma.job.create({
      data: {
        title: j.title,
        company: j.company,
        location: j.location,
        salary: j.salary,
        description: j.description,
        requirements: j.requirements,
        mode: j.mode,
        category: j.category,
        authorId: users[j.authorEmail].id,
      },
    });
    jobs.push(job);
  }

  // ─── CURSOS ────────────────────────────────────────────────
  const coursesData = [
    { title: 'React desde Cero', provider: 'EduNext Academy', description: 'Aprende React paso a paso: componentes, hooks, estado, rutas y proyectos reales. Ideal para quien ya sabe JavaScript.', category: 'Desarrollo Web', level: 'BEGINNER', duration: '40 horas', price: 'Gratis', url: 'https://edunext.com/react-desde-cero', image: null, authorEmail: 'info@edunext.com' },
    { title: 'Node.js Avanzado', provider: 'EduNext Academy', description: 'Arquitectura backend con Node.js: APIs REST, autenticación, bases de datos, testing y despliegue en producción.', category: 'Desarrollo Web', level: 'ADVANCED', duration: '30 horas', price: '49€', url: 'https://edunext.com/node-avanzado', image: null, authorEmail: 'info@edunext.com' },
    { title: 'Python para Data Science', provider: 'Cursos Alfa', description: 'Introducción al análisis de datos con Python: Pandas, NumPy, Matplotlib y fundamentos de Machine Learning.', category: 'Datos e IA', level: 'INTERMEDIATE', duration: '50 horas', price: '79€', url: 'https://cursosalfa.com/python-data-science', image: null, authorEmail: 'info@cursosalfa.com' },
    { title: 'Diseño UX/UI Profesional', provider: 'Cursos Alfa', description: 'Domina el diseño de experiencias de usuario: investigación, prototipado, testing y herramientas como Figma.', category: 'Diseño', level: 'BEGINNER', duration: '35 horas', price: '59€', url: 'https://cursosalfa.com/ux-ui-profesional', image: null, authorEmail: 'info@cursosalfa.com' },
    { title: 'Ciberseguridad Práctica', provider: 'EduNext Academy', description: 'Aprende a proteger sistemas y redes: ethical hacking, cifrado, firewalls y normativa de protección de datos.', category: 'Ciberseguridad', level: 'INTERMEDIATE', duration: '45 horas', price: '89€', url: 'https://edunext.com/ciberseguridad-practica', image: null, authorEmail: 'info@edunext.com' },
    { title: 'Cloud Computing con AWS', provider: 'Cursos Alfa', description: 'Arquitectura cloud, servicios AWS, despliegue de aplicaciones y buenas prácticas de seguridad y costes.', category: 'Cloud', level: 'INTERMEDIATE', duration: '40 horas', price: '99€', url: 'https://cursosalfa.com/cloud-aws', image: null, authorEmail: 'info@cursosalfa.com' },
    { title: 'Marketing Digital Completo', provider: 'EduNext Academy', description: 'Estrategias de marketing online: SEO, SEM, redes sociales, email marketing y analítica web.', category: 'Marketing', level: 'BEGINNER', duration: '30 horas', price: 'Gratis', url: 'https://edunext.com/marketing-digital', image: null, authorEmail: 'info@edunext.com' },
    { title: 'Inglés Técnico para TI', provider: 'Cursos Alfa', description: 'Vocabulario técnico, writing y speaking enfocado al entorno profesional tecnológico. Preparación para entrevistas.', category: 'Idiomas', level: 'INTERMEDIATE', duration: '25 horas', price: '39€', url: 'https://cursosalfa.com/ingles-ti', image: null, authorEmail: 'info@cursosalfa.com' },
  ];

  for (const c of coursesData) {
    const existing = await prisma.course.findFirst({ where: { title: c.title, authorId: users[c.authorEmail].id } });
    if (existing) continue;
    await prisma.course.create({
      data: {
        title: c.title,
        provider: c.provider,
        description: c.description,
        category: c.category,
        level: c.level,
        duration: c.duration,
        price: c.price,
        url: c.url,
        image: c.image,
        authorId: users[c.authorEmail].id,
      },
    });
  }

  // ─── POSTULACIONES ─────────────────────────────────────────
  const applicationsData = [
    { userEmail: 'carlos@email.com', jobTitle: 'Desarrollador Full Stack', message: 'Me encantaría formar parte de TechCorp. Tengo 4 años de experiencia con React y Node.js.' },
    { userEmail: 'maria@email.com', jobTitle: 'Data Scientist Senior', message: 'Soy Data Scientist con 6 años de experiencia. He liderado equipos de ML en startups y grandes empresas.' },
    { userEmail: 'javier@email.com', jobTitle: 'Diseñador UX/UI', message: 'Diseñador con portfolio en Figma y experiencia en rediseño de plataformas SaaS. Adjunto mi portfolio.' },
    { userEmail: 'carlos@email.com', jobTitle: 'DevOps Engineer', message: 'Experiencia en AWS, Docker y Kubernetes. Actualmente trabajo con CI/CD en entornos de producción.' },
    { userEmail: 'maria@email.com', jobTitle: 'Analista de Ciberseguridad', message: 'Certificación CEH en curso. Experiencia en auditorías de seguridad y hardening de sistemas.' },
  ];

  for (const a of applicationsData) {
    const user = users[a.userEmail];
    const job = jobs.find(j => j.title === a.jobTitle);
    if (user && job) {
      await prisma.application.upsert({
        where: { userId_jobId: { userId: user.id, jobId: job.id } },
        update: { message: a.message },
        create: { userId: user.id, jobId: job.id, message: a.message, status: 'PENDING' },
      });
    }
  }

  // ─── RESUMEN ───────────────────────────────────────────────
  console.log('✅ Seed completado');
  console.log('');
  console.log('── USUARIOS ──');
  usersData.forEach(u => console.log(`   ${u.email} / ${u.password} → ${u.name} (${u.role})`));
  console.log('');
  console.log(`── EMPLEOS: ${jobsData.length} creados ──`);
  console.log(`── CURSOS: ${coursesData.length} creados ──`);
  console.log(`── POSTULACIONES: ${applicationsData.length} creadas ──`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
