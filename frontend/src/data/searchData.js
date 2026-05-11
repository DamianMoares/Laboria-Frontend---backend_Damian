// Datos de municipios de España para búsqueda
export const spainMunicipalities = [
  // Comunidad de Madrid
  "Madrid", "Alcalá de Henares", "Alcobendas", "Alcorcón", "Leganes", "Getafe", "Móstoles", "Fuenlabrada",
  "Parla", "Torrejón de Ardoz", "San Sebastián de los Reyes", "Pozuelo de Alarcón",
  "Coslada", "Las Rozas", "Rivas-Vaciamadrid", "Valdemoro", "Majadahonda", "Collado Villalba",
  
  // Barcelona
  "Barcelona", "L'Hospitalet de Llobregat", "Badalona", "Sabadell", "Terrassa", "Mataró", "Santa Coloma de Gramenet",
  "Cornellà de Llobregat", "Sant Cugat del Vallès", "Manresa", "Rubí", "El Prat de Llobregat", "Vilanova i la Geltrú",
  "Viladecans", "Granollers", "Castelldefels", "Sant Boi de Llobregat", "Mollet del Vallès", "Esplugues de Llobregat",
  
  // Valencia
  "Valencia", "Alicante", "Elche", "Castellón de la Plana", "Torrent", "Paterna", "Gandia", "Sagunto",
  "Alzira", "Orihuela", "Benidorm", "Elda", "Petrer", "Villena", "Alcoy", "Burriana",
  "Vila-real", "La Vila Joiosa", "El Campello", "Ontinyent", "Xàtiva", "Requena", "Utiel",
  
  // Sevilla
  "Sevilla", "Málaga", "Córdoba", "Granada", "Jerez de la Frontera", "Algeciras", "Marbella", "Dos Hermanas",
  "Almería", "Huelva", "Cádiz", "San Fernando", "El Puerto de Santa María", "Chiclana de la Frontera",
  "Fuengirola", "Mijas", "Benalmádena", "Torremolinos", "Estepona", "Ronda", "Antequera",
  
  // País Vasco
  "Bilbao", "Vitoria-Gasteiz", "San Sebastián", "Barakaldo", "Getxo", "Irun", "Portugalete", "Santurtzi",
  "Basauri", "Erandio", "Sestao", "Amorebieta", "Durango", "Eibar", "Hernani", "Andoain",
  
  // Asturias
  "Gijón", "Oviedo", "Avilés", "Siero", "Langreo", "Mieres", "Cangas del Narcea", "Castrillón",
  "Laviana", "San Martín del Rey Aurelio", "Allande", "Tineo", "Cudillero", "Carreño", "Gozón",
  
  // Galicia
  "A Coruña", "Vigo", "Ourense", "Lugo", "Santiago de Compostela", "Ferrol", "Pontevedra", "Narón",
  "Oleiros", "Lalín", "Carballo", "Arteixo", "Vilagarcía de Arousa", "Redondela", "Marín", "Cee",
  
  // Castilla y León
  "Valladolid", "Burgos", "Salamanca", "León", "Palencia", "Zamora", "Ávila", "Segovia",
  "Soria", "Miranda de Ebro", "Aranda de Duero", "Medina del Campo", "Ponferrada", "Béjar", "San Andrés del Rabanedo",
  
  // Castilla-La Mancha
  "Toledo", "Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Talavera de la Reina", "Almansa",
  "Puertollano", "Hellín", "Alcázar de San Juan", "Quintanar de la Orden", "La Roda", "Tomelloso",
  
  // Aragón
  "Zaragoza", "Huesca", "Teruel", "Barbastro", "Calatayud", "Utebo", "Fraga", "Monzón",
  "Tarazona", "Alcañiz", "Caspe", "Ejea de los Caballeros", "Jaca", "Binéfar",
  
  // Islas Baleares
  "Palma de Mallorca", "Ibiza", "Manacor", "Mahón", "Llucmajor", "Santa Eulària des Riu",
  "Ciutadella de Menorca", "Inca", "Alaior", "Sant Josep de sa Talaia", "Eivissa",
  
  // Islas Canarias
  "Las Palmas de Gran Canaria", "Santa Cruz de Tenerife", "San Cristóbal de La Laguna", "Telde",
  "Santa Lucía de Tirajana", "Arona", "San Bartolomé de Tirajana", "Granadilla de Abona",
  "Los Llanos de Aridane", "Arrecife", "Vecindario", "Maspalomas", "Puerto del Rosario",
  
  // Extremadura
  "Badajoz", "Cáceres", "Mérida", "Plasencia", "Don Benito", "Almendralejo", "Villanueva de la Serena",
  "Navalmoral de la Mata", "Montijo", "Zafra", "Coria", "Trujillo",
  
  // Cantabria
  "Santander", "Torrelavega", "Castro Urdiales", "Camargo", "Piélagos", "Laredo", "Los Corrales de Buelna",
  "El Astillero", "Santillana del Mar", "Reinosa", "Santa Cruz de Bezana",
  
  // La Rioja
  "Logroño", "Calahorra", "Arnedo", "Haro", "Nájera", "Santo Domingo de la Calzada", "Alfaro",
  "Torrecilla en Cameros", "Lardero", "Villamediana de Iregua",
  
  // Navarra
  "Pamplona", "Tudela", "Barañáin", "Burlada", "Estella", "Tafalla", "Zizur Mayor",
  "Aoiz", "Berriozar", "Beriain", "Cizur Mayor", "Huarte-Araquil",
  
  // Murcia
  "Murcia", "Cartagena", "Lorca", "Molina de Segura", "Alcantarilla", "Cieza", "Águilas",
  "Torre-Pacheco", "Jumilla", "Yecla", "Caravaca de la Cruz", "La Unión", "San Javier",
  
  // Ceuta
  "Ceuta",
  
  // Melilla
  "Melilla"
];

// Categorías de trabajo expandidas (no solo tecnología)
export const jobCategories = [
  // Tecnología
  "Desarrollador Web", "Desarrollador Móvil", "Desarrollador Backend", "Desarrollador Frontend",
  "Ingeniero de Software", "Arquitecto de Software", "DevOps", "Administrador de Sistemas",
  "Analista de Datos", "Científico de Datos", "Ingeniero de Machine Learning", "Ciberseguridad",
  "QA Tester", "Scrum Master", "Product Manager", "UX/UI Designer",
  
  // Salud
  "Médico", "Enfermero", "Farmacéutico", "Psicólogo", "Fisioterapeuta", "Odontólogo",
  "Veterinario", "Nutricionista", "Técnico Sanitario", "Auxiliar de Enfermería",
  
  // Educación
  "Profesor", "Maestro", "Profesor Universitario", "Formador", "Educador Social",
  "Pedagogo", "Psicopedagogo", "Monitor de Actividades", "Tutor Online",
  
  // Finanzas y Negocios
  "Contable", "Auditor", "Economista", "Analista Financiero", "Gestor Administrativo",
  "Comercial", "Vendedor", "Marketing Manager", "Community Manager (Marketing)", "RRHH",
  "Recursos Humanos", "Técnico de Prevención de Riesgos", "Abogado", "Notario",
  
  // Ingeniería e Industria
  "Ingeniero Industrial", "Ingeniero Civil", "Ingeniero Mecánico", "Ingeniero Eléctrico",
  "Ingeniero Químico", "Arquitecto", "Técnico de Edificación", "Jefe de Obra",
  "Operario de Producción", "Mecánico", "Electricista", "Fontanero", "Carpintero",
  
  // Hostelería y Turismo
  "Camarero", "Cocinero", "Chef", "Recepcionista", "Guía Turístico",
  "Amanuense", "Barman", "Sommelier", "Ayudante de Cocina", "Jefe de Sala",
  
  // Retail y Comercio
  "Dependiente", "Cajero", "Encargado de Tienda", "Visual Merchandiser", "Comprador",
  "Almacenero (Retail)", "Reponedor", "Promotor de Ventas", "Asesor de Imagen",
  
  // Transporte y Logística
  "Conductor", "Repartidor", "Chofer", "Piloto", "Marinero",
  "Operario Logístico", "Almacenero (Logística)", "Despachante", "Agente de Aduanas",
  
  // Servicios
  "Limpieza", "Mantenimiento", "Jardinero", "Cuidador", "Personal de Servicios",
  "Seguridad Privada", "Vigilante", "Controlador de Accesos",
  
  // Arte y Diseño
  "Diseñador Gráfico", "Diseñador de Moda", "Fotógrafo", "Vídeo Editor",
  "Ilustrador", "Arquitecto de Interiores", "Director de Arte", "Copywriter",
  
  // Medios y Comunicación
  "Periodista", "Redactor", "Presentador", "Locutor", "Productor Audiovisual",
  "Guionista", "Editor de Contenido", "Community Manager (Social Media)", "Social Media Manager",
  
  // Otros
  "Obrero", "Peón", "Ayudante General", "Sin Especificar"
];

// Niveles de experiencia
export const experienceLevels = [
  "Sin experiencia", "Junior", "Principiante", "Intermedio", "Senior", "Experto", "Director"
];

// Tipos de contrato
export const contractTypes = [
  "Indefinido", "Fijo Discontinuo", "Temporal", "Prácticas", "Formación", "Por Obra",
  "Freelance", "Autónomo", "Beca", "Voluntario"
];

// Modalidades de trabajo
export const workModes = [
  "Presencial", "Remoto", "Híbrido", "Teletrabajo", "Flexible"
];

// Salarios (rangos anuales brutos en €)
export const salaryRanges = [
  "0 - 15.000", "15.000 - 20.000", "20.000 - 25.000", "25.000 - 30.000",
  "30.000 - 40.000", "40.000 - 50.000", "50.000 - 60.000", "60.000 - 75.000",
  "75.000 - 90.000", "90.000 - 120.000", "120.000+"
];
