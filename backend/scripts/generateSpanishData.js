/**
 * Generador de datos españoles para empleos y cursos
 * 
 * Uso:
 *   node backend/scripts/generateSpanishData.js           # solo genera JSON
 *   node backend/scripts/generateSpanishData.js --seed     # genera JSON + siembra DB
 *   node backend/scripts/generateSpanishData.js --db-only  # solo siembra DB
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// DATOS ESPAÑOLES
// ============================================================

const PROVINCES = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
  'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
  'Córdoba', 'A Coruña', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Gipuzkoa',
  'Huelva', 'Huesca', 'Illes Balears', 'Jaén', 'León', 'Lleida', 'Lugo', 'Madrid',
  'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Las Palmas', 'Pontevedra',
  'La Rioja', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria',
  'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Bizkaia', 'Zamora', 'Zaragoza'
];

const SECTORS = {
  'Tecnología': {
    jobTitles: ['Desarrollador Frontend React', 'Desarrollador Backend Node.js', 'Full Stack Developer', 'DevOps Engineer', 'Arquitecto Cloud', 'Ingeniero de Software', 'Desarrollador Python', 'Desarrollador Java', 'Ingeniero de Datos', 'Científico de Datos', 'Desarrollador Mobile (iOS)', 'Desarrollador Mobile (Android)', 'QA Engineer', 'Analista Funcional', 'Product Manager', 'Scrum Master', 'CTO', 'Tech Lead', 'Administrador de Sistemas', 'Ciberseguridad Analyst'],
    companies: ['TechCorp España', 'InnovaTech Solutions', 'CloudScale Systems', 'DigitalWave', 'CodeForge', 'DataDriven Insights', 'AppMakers Studio', 'QualityFirst Solutions', 'NebulaTech', 'ByteForge', 'Sistemas Avanzados', 'Informática Global', 'Solución Digital', 'Tecnología Aplicada', 'Desarrollo Inteligente'],
    technologies: ['React', 'Node.js', 'Python', 'Java', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Angular', 'Vue.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'TensorFlow', 'Swift', 'Kotlin', 'Flutter', 'Go', 'Rust', 'GraphQL']
  },
  'Salud': {
    jobTitles: ['Médico General', 'Enfermero/a', 'Fisioterapeuta', 'Psicólogo Clínico', 'Farmacéutico', 'Odontólogo', 'Veterinario', 'Técnico de Laboratorio', 'Auxiliar de Enfermería', 'Geriatra', 'Pediatra', 'Nutricionista', 'Logopeda', 'Terapeuta Ocupacional', 'Radiólogo', 'Anestesista', 'Cardiólogo', 'Dermatólogo', 'Traumatólogo', 'Matrona'],
    companies: ['Hospital Universitario', 'Clínica Salud Vital', 'Grupo Médico Avanzado', 'Centro de Salud Integral', 'Farmacias Unidas', 'Sanidad Global', 'Clínica Dental Care', 'Instituto Médico', 'Residencias Senior', 'Laboratorios Farmacéuticos'],
    technologies: []
  },
  'Educación': {
    jobTitles: ['Profesor de Educación Infantil', 'Profesor de Educación Primaria', 'Profesor de Secundaria', 'Maestro de Educación Especial', 'Profesor de Universidad', 'Formador Corporativo', 'Profesor de Idiomas', 'Pedagogo', 'Coordinador Educativo', 'Director de Centro', 'Profesor de FP', 'Educador Social', 'Monitor de Ocio y Tiempo Libre', 'Profesor de Matemáticas', 'Profesor de Ciencias'],
    companies: ['Colegio Internacional', 'Academia de Enseñanza', 'Universidad Complutense', 'Centro de Formación Profesional', 'Instituto de Educación Secundaria', 'Escuela de Negocios', 'Centro de Idiomas', 'Fundación Educativa', 'Plataforma de E-learning', 'Consultoría Educativa'],
    technologies: []
  },
  'Finanzas': {
    jobTitles: ['Analista Financiero', 'Controller de Gestión', 'Asesor Financiero', 'Gestor de Patrimonios', 'Analista de Riesgos', 'Auditor', 'Director Financiero', 'Tesorero', 'Experto en Compliance', 'Agente de Seguros', 'Trader', 'Analista de Inversiones', 'Account Manager', 'Administrativo Contable', 'Especialista en Prevención de Blanqueo'],
    companies: ['Banco Santander', 'BBVA', 'CaixaBank', 'Grupo Financiero', 'Aseguradora Global', 'Gestora de Fondos', 'Consultora Financiera', 'Sociedad de Valores', 'Fintech Innovación', 'Auditoría y Consultoría'],
    technologies: []
  },
  'Construcción': {
    jobTitles: ['Arquitecto', 'Ingeniero Civil', 'Jefe de Obra', 'Encargado de Obra', 'Topógrafo', 'Proyectista', 'Técnico en Prevención de Riesgos', 'Director de Ejecución de Obra', 'Jefe de Proyecto', 'Delincante Industrial', 'Instalador Eléctrico', 'Fontanero', 'Albañil', 'Carpintero', 'Soldador'],
    companies: ['Constructora Nacional', 'Grupo Inmobiliario', 'Desarrollos Urbanos', 'Ingeniería y Construcción', 'Arquitectura Sostenible', 'Promotora Inmobiliaria', 'Obras Públicas', 'Reformas Integrales', 'Construcciones Metálicas', 'Instalaciones Técnicas'],
    technologies: []
  },
  'Hostelería y Turismo': {
    jobTitles: ['Director de Hotel', 'Jefe de Cocina', 'Camarero/a', 'Recepcionista de Hotel', 'Guía Turístico', 'Agente de Viajes', 'Coordinador de Eventos', 'Barman', 'Ayudante de Cocina', 'Gobernanta', 'Conserje', 'Animador Turístico', 'Responsable de Reservas', 'Gerente de Restaurante', 'Sumiller'],
    companies: ['Hoteles Meliá', 'NH Hotel Group', 'Restaurante La Brújula', 'Agencia de Viajes Global', 'Paradores Nacionales', 'Complejo Turístico Costa', 'Grupo Gastronómico', 'Alquiler Vacacional', 'Cadena de Restaurantes', 'Balneario y Spa'],
    technologies: []
  },
  'Marketing y Ventas': {
    jobTitles: ['Director de Marketing', 'Social Media Manager', 'Content Creator', 'SEO Specialist', 'SEM Specialist', 'Community Manager', 'Brand Manager', 'Analista de Marketing', 'Ejecutivo de Ventas', 'Key Account Manager', 'Trade Marketing', 'E-commerce Manager', 'Growth Hacker', 'Email Marketing Specialist', 'Copywriter'],
    companies: ['Agencia de Marketing', 'Grupo Publicitario', 'Consultora de Branding', 'Plataforma de E-commerce', 'Medios de Comunicación', 'Red de Afiliados', 'Estudio Creativo', 'Departamento Marketing Corporativo', 'Agencia SEO/SEM', 'Eventos y Patrocinios'],
    technologies: []
  },
  'Logística y Transporte': {
    jobTitles: ['Director de Logística', 'Jefe de Almacén', 'Conductor de Camión', 'Carretillero', 'Analista de Supply Chain', 'Coordinador de Transporte', 'Mozo de Almacén', 'Gestor de Flotas', 'Responsable de Import/Export', 'Técnico en Logística', 'Preparador de Pedidos', 'Operador de Tránsito', 'Supervisor de Almacén', 'Planificador de Rutas', 'Agente de Aduanas'],
    companies: ['Transportes Rápidos', 'Logística Global', 'Almacenes del Sur', 'Cadena de Suministro', 'Distribución Nacional', 'Grupo Logístico', 'Paquetería Express', 'Transporte Internacional', 'Operador Logístico', 'Almacenes Frigoríficos'],
    technologies: []
  },
  'Legal': {
    jobTitles: ['Abogado', 'Procurador', 'Asesor Jurídico', 'Abogado Laboralista', 'Abogado Mercantilista', 'Abogado Penalista', 'Abogado de Familia', 'Graduado Social', 'Notario', 'Registrador de la Propiedad', 'Mediador', 'Jurista de Empresa', 'Abogado Tributarista', 'Letrado', 'Gestor Administrativo'],
    companies: ['Despacho de Abogados', 'Bufete Jurídico', 'Asesoría Legal', 'Consultoría Jurídica', 'Estudio Legal', 'Corporación Legal', 'Abogados Asociados', 'Jurídico Empresarial', 'Mediación y Arbitraje', 'Gestoría Administrativa'],
    technologies: []
  },
  'Recursos Humanos': {
    jobTitles: ['Director de RRHH', 'Técnico de Selección', 'Responsable de Formación', 'HR Business Partner', 'Analista de Compensación', 'Talent Acquisition Specialist', 'Técnico de Prevención', 'Especialista en Employer Branding', 'Responsable de Nóminas', 'Consultor de RRHH', 'People Analytics', 'HR Manager', 'Coach Laboral', 'Especialista en Clima Laboral', 'Administrativo de RRHH'],
    companies: ['Consultora de RRHH', 'Selección de Talento', 'Grupo de Recursos Humanos', 'Agencia de Colocación', 'E-learning Corporativo', 'Headhunting Global', 'Outsourcing Laboral', 'Formación Empresarial', 'Software de RRHH', 'Consultoría Organizacional'],
    technologies: []
  },
  'Ingeniería': {
    jobTitles: ['Ingeniero Industrial', 'Ingeniero Mecánico', 'Ingeniero Eléctrico', 'Ingeniero Electrónico', 'Ingeniero Químico', 'Ingeniero de Telecomunicaciones', 'Ingeniero de Minas', 'Ingeniero Agrónomo', 'Ingeniero de Organización', 'Ingeniero de Materiales', 'Delineante Proyectista', 'Técnico de Mantenimiento', 'Jefe de Producción', 'Ingeniero de Calidad', 'Técnico en Automatización'],
    companies: ['Grupo Industrial', 'Ingeniería Avanzada', 'Producción Nacional', 'Factoría Industrial', 'Tecnología e Ingeniería', 'Automoción Industrial', 'Aeroespacial Española', 'Energía e Ingeniería', 'Maquinaria y Equipos', 'Consultoría Técnica'],
    technologies: []
  },
  'Retail y Comercio': {
    jobTitles: ['Gerente de Tienda', 'Dependiente', 'Jefe de Sección', 'Visual Merchandiser', 'Comprador', 'Category Manager', 'Responsable de Punto de Venta', 'Comercial de Calle', 'Vendedor Técnico', 'Promotor', 'Gestor de Franquicias', 'Director Comercial', 'Responsable de Expansión', 'Atención al Cliente', 'Cajero/a'],
    companies: ['El Corte Inglés', 'Mercadona', 'Inditex', 'Carrefour España', 'Leroy Merlin', 'MediaMarkt', 'Decathlon', 'Primark', 'Alcampo', 'Centro Comercial'],
    technologies: []
  },
  'Energía y Medio Ambiente': {
    jobTitles: ['Ingeniero de Energías Renovables', 'Técnico en Medio Ambiente', 'Gestor de Residuos', 'Auditor Energético', 'Responsable de Sostenibilidad', 'Ingeniero de Petróleo y Gas', 'Técnico en Eficiencia Energética', 'Consultor Ambiental', 'Ingeniero de Plantas Solares', 'Director de Operaciones Eléctricas', 'Gestor del Agua', 'Técnico en Contaminación', 'Biólogo Ambiental', 'Coordinador de Proyectos Verdes', 'Especialista en Economía Circular'],
    companies: ['Iberdrola', 'Endesa', 'Naturgy', 'Solar Energy España', 'Parques Eólicos', 'Gestión de Residuos', 'Consultoría Ambiental', 'Agua y Saneamiento', 'Eficiencia Energética', 'Energía Solar Fotovoltaica'],
    technologies: []
  },
  'Agroalimentario': {
    jobTitles: ['Ingeniero Agrónomo', 'Técnico Agrícola', 'Responsable de Explotación', 'Enólogo', 'Jefe de Producción Alimentaria', 'Control de Calidad Alimentaria', 'Técnico en Agricultura Ecológica', 'Investigador Agroalimentario', 'Gestor de Ganadería', 'Comercial Agroalimentario', 'Tecnólogo de Alimentos', 'Distribución Alimentaria', 'Export Manager Alimentación', 'Director de Bodega', 'Técnico de Industria Cárnica'],
    companies: ['Grupo Alimentario', 'Cooperativa Agrícola', 'Industria Cárnica', 'Bodega y Viñedos', 'Aceites y Oleícolas', 'Conservas del Sur', 'Productos Ecológicos', 'Lácteos y Derivados', 'Agricultura de Precisión', 'Distribución Alimentaria'],
    technologies: []
  }
};

const SCHEDULES = ['full-time', 'part-time', 'por-turnos'];
const CONTRACT_TYPES = ['indefinido', 'temporal', 'prácticas', 'autónomo', 'relevo'];
const EXPERIENCE_LEVELS = ['junior', 'intermedio', 'senior'];
const WORK_MODES = ['presencial', 'híbrido', 'remoto'];

const CITIES_BY_PROVINCE = {
  'Álava': ['Vitoria-Gasteiz', 'Llodio', 'Amurrio'],
  'Albacete': ['Albacete', 'Hellín', 'Almansa'],
  'Alicante': ['Alicante', 'Elche', 'Benidorm', 'Torrevieja'],
  'Almería': ['Almería', 'Roquetas de Mar', 'El Ejido'],
  'Asturias': ['Oviedo', 'Gijón', 'Avilés', 'Mieres'],
  'Ávila': ['Ávila', 'Arévalo', 'Piedrahíta'],
  'Badajoz': ['Badajoz', 'Mérida', 'Don Benito'],
  'Barcelona': ['Barcelona', 'L\'Hospitalet', 'Badalona', 'Terrassa', 'Sabadell'],
  'Burgos': ['Burgos', 'Miranda de Ebro', 'Aranda de Duero'],
  'Cáceres': ['Cáceres', 'Plasencia', 'Navalmoral de la Mata'],
  'Cádiz': ['Cádiz', 'Jerez de la Frontera', 'Algeciras', 'San Fernando'],
  'Cantabria': ['Santander', 'Torrelavega', 'Camargo'],
  'Castellón': ['Castellón de la Plana', 'Vila-real', 'Borriana'],
  'Ciudad Real': ['Ciudad Real', 'Puertollano', 'Tomelloso', 'Alcázar de San Juan'],
  'Córdoba': ['Córdoba', 'Lucena', 'Puente Genil'],
  'A Coruña': ['A Coruña', 'Santiago de Compostela', 'Ferrol'],
  'Cuenca': ['Cuenca', 'Tarancón', 'San Clemente'],
  'Girona': ['Girona', 'Figueres', 'Blanes', 'Lloret de Mar'],
  'Granada': ['Granada', 'Motril', 'Armilla', 'Maracena'],
  'Guadalajara': ['Guadalajara', 'Azuqueca de Henares', 'Sigüenza'],
  'Gipuzkoa': ['Donostia-San Sebastián', 'Irún', 'Eibar', 'Hondarribia'],
  'Huelva': ['Huelva', 'Lepe', 'Ayamonte'],
  'Huesca': ['Huesca', 'Monzón', 'Barbastro'],
  'Illes Balears': ['Palma de Mallorca', 'Ibiza', 'Manacor', 'Mahón'],
  'Jaén': ['Jaén', 'Linares', 'Úbeda', 'Andújar'],
  'León': ['León', 'Ponferrada', 'San Andrés del Rabanedo'],
  'Lleida': ['Lleida', 'Tàrrega', 'Balaguer'],
  'Lugo': ['Lugo', 'Monforte de Lemos', 'Viveiro'],
  'Madrid': ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Fuenlabrada', 'Leganés', 'Getafe', 'Alcorcón', 'Torrejón de Ardoz', 'Parla', 'Alcobendas'],
  'Málaga': ['Málaga', 'Marbella', 'Fuengirola', 'Vélez-Málaga', 'Torremolinos'],
  'Murcia': ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura'],
  'Navarra': ['Pamplona', 'Tudela', 'Barañáin'],
  'Ourense': ['Ourense', 'Verín', 'O Barco de Valdeorras'],
  'Palencia': ['Palencia', 'Guardo', 'Aguilar de Campoo'],
  'Las Palmas': ['Las Palmas de Gran Canaria', 'Telde', 'Santa Lucía de Tirajana', 'Arrecife'],
  'Pontevedra': ['Vigo', 'Pontevedra', 'Marín', 'Vilagarcía de Arousa'],
  'La Rioja': ['Logroño', 'Calahorra', 'Arnedo'],
  'Salamanca': ['Salamanca', 'Sansol', 'Santa Marta de Tormes'],
  'Santa Cruz de Tenerife': ['Santa Cruz de Tenerife', 'San Cristóbal de La Laguna', 'La Orotava', 'Arona'],
  'Segovia': ['Segovia', 'Cuéllar', 'El Espinar'],
  'Sevilla': ['Sevilla', 'Dos Hermanas', 'Alcalá de Guadaíra', 'Utrera', 'Écija'],
  'Soria': ['Soria', 'Almazán', 'El Burgo de Osma'],
  'Tarragona': ['Tarragona', 'Reus', 'El Vendrell', 'Tortosa'],
  'Teruel': ['Teruel', 'Alcañiz', 'Andorra'],
  'Toledo': ['Toledo', 'Talavera de la Reina', 'Illescas', 'Seseña'],
  'Valencia': ['Valencia', 'Torrent', 'Gandía', 'Paterna', 'Sagunto', 'Alzira'],
  'Valladolid': ['Valladolid', 'Laguna de Duero', 'Medina del Campo'],
  'Bizkaia': ['Bilbao', 'Barakaldo', 'Getxo', 'Santurtzi', 'Portugalete'],
  'Zamora': ['Zamora', 'Benavente', 'Toro'],
  'Zaragoza': ['Zaragoza', 'Calatayud', 'Utebo', 'Ejea de los Caballeros']
};

// Descripciones realistas de empleo
const generateJobDescription = (title, sector, province) => {
  const descs = [
    `Importante empresa del sector ${sector} en ${province} busca incorporar un/a ${title} para unirse a su equipo. Valoramos experiencia previa y pasión por el trabajo bien hecho. Ofrecemos ambiente dinámico y oportunidades de crecimiento.`,
    `Únete a nuestra compañía líder en ${sector} con presencia en toda España. Buscamos un/a ${title} con ganas de crecer profesionalmente. Desarrollarás tu carrera en un entorno innovador y colaborativo.`,
    `Empresa consolidada en ${province} precisa incorporar ${title} con experiencia demostrable. Formarás parte de un equipo multidisciplinar con proyectos ambiciosos. Te ofrecemos estabilidad laboral y plan de carrera.`,
    `Para nuestro centro en ${province}, seleccionamos ${title} con capacidad de trabajo en equipo y orientación a resultados. Valoramos iniciativa, compromiso y ganas de aprender en el sector ${sector}.`,
    `Importante compañía del sector ${sector} necesita ${title} para reforzar su plantilla. Si te apasiona tu trabajo y quieres desarrollarte en una empresa puntera, esta es tu oportunidad.`
  ];
  return descs[Math.floor(Math.random() * descs.length)];
};

const generateRequirements = (title, sector, level) => {
  const base = [
    `Experiencia demostrable como ${title}`,
    'Capacidad de trabajo en equipo',
    'Orientación a resultados',
    'Buenas habilidades de comunicación',
    'Residencia en la provincia o disponibilidad para trasladarse',
    'Carnet de conducir y vehículo propio (valorado)',
    'Inglés intermedio (valorado)',
    'Formación universitaria o FP relacionada',
    'Conocimientos ofimáticos',
    'Disponibilidad para incorporación inmediata'
  ];
  const selected = base.sort(() => Math.random() - 0.5).slice(0, 4 + Math.floor(Math.random() * 3));
  if (level === 'senior') selected.push('Experiencia liderando equipos');
  if (level === 'junior') selected.push('Ganas de aprender y desarrollarse profesionalmente');
  return selected;
};

const generateBenefits = () => {
  const all = [
    'Seguro médico privado', 'Formación continua', 'Flexibilidad horaria', 
    'Trabajo híbrido/remoto', 'Tickets restaurante', 'Bonus anual',
    'Plan de carrera', 'Eventos de empresa', 'Descuentos en productos',
    'Días libres adicionales', 'Guardería en oficina', 'Vehículo de empresa',
    'Teléfono móvil corporativo', 'Formación en idiomas', 'Club de deporte',
    'Cheque guardería', 'Seguro de vida', 'Plan de pensiones', 'Acciones de la empresa',
    'Café y fruta gratis'
  ];
  return all.sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 3));
};

const randomSalary = (sector, level) => {
  const brackets = {
    junior: { min: 18000, max: 28000 },
    intermedio: { min: 28000, max: 45000 },
    senior: { min: 42000, max: 75000 }
  };
  const b = brackets[level] || brackets.junior;
  const min = b.min + Math.floor(Math.random() * 5000);
  const max = min + 5000 + Math.floor(Math.random() * 12000);
  return `${min}€ - ${max}€`;
};

// ============================================================
// GENERACIÓN DE EMPLEOS
// ============================================================

function generateJobs(count = 300) {
  const jobs = [];
  let id = 1;

  // Repartir proporcionalmente por población
  for (let i = 0; i < count; i++) {
    const province = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const cities = CITIES_BY_PROVINCE[province];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const sectorNames = Object.keys(SECTORS);
    const sector = sectorNames[Math.floor(Math.random() * sectorNames.length)];
    const sectorData = SECTORS[sector];
    const title = sectorData.jobTitles[Math.floor(Math.random() * sectorData.jobTitles.length)];
    const company = sectorData.companies[Math.floor(Math.random() * sectorData.companies.length)];
    const level = EXPERIENCE_LEVELS[Math.floor(Math.random() * EXPERIENCE_LEVELS.length)];

    const daysAgo = Math.floor(Math.random() * 30);
    const posted = new Date();
    posted.setDate(posted.getDate() - daysAgo);

    const job = {
      id: id++,
      title,
      company,
      location: `${city}, ${province}`,
      workMode: WORK_MODES[Math.floor(Math.random() * WORK_MODES.length)],
      schedule: SCHEDULES[Math.floor(Math.random() * SCHEDULES.length)],
      experienceLevel: level,
      salary: randomSalary(sector, level),
      contractType: CONTRACT_TYPES[Math.floor(Math.random() * CONTRACT_TYPES.length)],
      sector,
      technology: sectorData.technologies.length > 0
        ? sectorData.technologies[Math.floor(Math.random() * sectorData.technologies.length)]
        : '',
      description: generateJobDescription(title, sector, province),
      requirements: generateRequirements(title, sector, level),
      benefits: generateBenefits(),
      postedDate: posted.toISOString().split('T')[0]
    };

    jobs.push(job);
  }

  // Ordenar por fecha descendente
  jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

  return jobs;
}

// ============================================================
// DATOS DE CURSOS ESPAÑOLES
// ============================================================

const COURSE_PROVIDERS = [
  { name: 'Universidad Complutense de Madrid', type: 'universidad' },
  { name: 'Universitat de Barcelona', type: 'universidad' },
  { name: 'Universidad Politécnica de Madrid', type: 'universidad' },
  { name: 'Universitat Politècnica de València', type: 'universidad' },
  { name: 'Universidad Autónoma de Madrid', type: 'universidad' },
  { name: 'Universidad de Sevilla', type: 'universidad' },
  { name: 'Universidad de Valencia', type: 'universidad' },
  { name: 'Universidad de Granada', type: 'universidad' },
  { name: 'Universidad del País Vasco', type: 'universidad' },
  { name: 'Universidad de Zaragoza', type: 'universidad' },
  { name: 'Universidad de Málaga', type: 'universidad' },
  { name: 'Coursera', type: 'plataforma' },
  { name: 'Udemy', type: 'plataforma' },
  { name: 'edX', type: 'plataforma' },
  { name: 'Domestika', type: 'plataforma' },
  { name: 'Platzi', type: 'plataforma' },
  { name: 'Google Actívate', type: 'gratuito' },
  { name: 'Fundación Telefónica', type: 'gratuito' },
  { name: 'SEPE (Servicio Público de Empleo)', type: 'gratuito' },
  { name: 'Cámara de Comercio de España', type: 'gratuito' },
  { name: 'LinkedIn Learning', type: 'plataforma' },
  { name: 'Escuela de Organización Industrial', type: 'escuela-negocios' },
  { name: 'IE Business School', type: 'escuela-negocios' },
  { name: 'IESE Business School', type: 'escuela-negocios' },
  { name: 'ESADE Business School', type: 'escuela-negocios' },
  { name: 'UNED', type: 'universidad' }
];

const COURSE_FORMATS = ['online', 'presencial', 'semipresencial'];

function generateCourses(count = 120) {
  const courses = [];
  let id = 1;

  const allSectors = Object.keys(SECTORS);

  for (let i = 0; i < count; i++) {
    const sector = allSectors[Math.floor(Math.random() * allSectors.length)];
    const provider = COURSE_PROVIDERS[Math.floor(Math.random() * COURSE_PROVIDERS.length)];
    const format = COURSE_FORMATS[Math.floor(Math.random() * COURSE_FORMATS.length)];
    const isFree = provider.type === 'gratuito' || Math.random() < 0.15;

    const levels = ['básico', 'intermedio', 'avanzado'];
    const level = levels[Math.floor(Math.random() * levels.length)];

    const titles = [
      `${sector}: Fundamentos y Aplicaciones Prácticas`,
      `Curso Avanzado de ${sector}`,
      `Especialización en ${sector}`,
      `Máster en ${sector} Profesional`,
      `Diplomatura en ${sector} Aplicado`,
      `Curso de ${sector} para Profesionales`,
      `Introducción al ${sector}`,
      `${sector} 360: Visión Completa`,
      `Programa Superior en ${sector}`,
      `Experto en ${sector} Empresarial`
    ];

    const durations = ['10 horas', '20 horas', '40 horas', '60 horas', '80 horas', '120 horas', '6 meses', '9 meses', '1 año', '2 años'];
    const prices = isFree ? 'Gratuito' : 
      ['19.99€', '29.99€', '49.99€', '79.99€', '99€', '149€', '199€', '299€', '39€/mes', '49€/mes'][Math.floor(Math.random() * 10)];

    const instructors = [
      'Equipo Docente', 'Profesores del Sector', 'Expertos en la Materia',
      'Claustro Universitario', 'Consultores Senior'
    ];

    const course = {
      id: id++,
      title: titles[Math.floor(Math.random() * titles.length)],
      platform: provider.name,
      level,
      duration: durations[Math.floor(Math.random() * durations.length)],
      format,
      price: prices,
      certification: Math.random() < 0.8,
      technology: sector === 'Tecnología' 
        ? ['Python', 'Java', 'JavaScript', 'Cloud Computing', 'Ciberseguridad', 'IA', 'Data Science'][Math.floor(Math.random() * 7)]
        : '',
      description: `Curso completo de ${sector} impartido por ${provider.name}. Aprende todo lo necesario para desarrollarte profesionalmente en este ámbito con contenido actualizado y casos prácticos reales.`,
      skills: ['Fundamentos', 'Casos prácticos', 'Metodologías aplicadas', 'Herramientas del sector'],
      requirements: level === 'básico' 
        ? ['Sin requisitos previos'] 
        : ['Conocimientos previos del sector', 'Experiencia básica recomendada'],
      instructor: instructors[Math.floor(Math.random() * instructors.length)],
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      students: Math.floor(100 + Math.random() * 50000),
      externalLink: `https://${provider.name.toLowerCase().replace(/[^a-z]/g, '')}/curso-${sector.toLowerCase().replace(/[^a-z]/g, '')}`
    };

    courses.push(course);
  }

  return courses;
}

// ============================================================
// MAIN
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const shouldSeed = args.includes('--seed') || args.includes('--db-only');
  const dbOnly = args.includes('--db-only');

  const jobsFile = path.resolve(__dirname, '../../frontend/src/data/jobs.json');
  const coursesFile = path.resolve(__dirname, '../../frontend/src/data/courses.json');

  console.log('=== Generador de Datos Españoles Laboria ===\n');

  if (!dbOnly) {
    console.log('Generando empleos...');
    const jobs = generateJobs(350);
    fs.writeFileSync(jobsFile, JSON.stringify(jobs, null, 2), 'utf-8');
    console.log(`  ✓ ${jobs.length} empleos generados → frontend/src/data/jobs.json`);

    const provincesCovered = [...new Set(jobs.map(j => j.location.split(', ')[1] || j.location.split(', ')[0]))];
    const sectorsCovered = [...new Set(jobs.map(j => j.sector))];
    console.log(`  ✓ Provincias cubiertas: ${provincesCovered.length}/50`);
    console.log(`  ✓ Sectores cubiertos: ${sectorsCovered.length}/${Object.keys(SECTORS).length}`);

    console.log('\nGenerando cursos...');
    const courses = generateCourses(150);
    fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2), 'utf-8');
    console.log(`  ✓ ${courses.length} cursos generados → frontend/src/data/courses.json`);
  }

  if (shouldSeed) {
    console.log('\nSembrando base de datos... (requiere servidor en ejecución)');
    console.log('  Ejecuta: node backend/scripts/seedDatabase.js');
    console.log('  O importa los datos manualmente desde los archivos JSON.');
  }

  console.log('\n✓ ¡Datos generados correctamente!');
}

main();
