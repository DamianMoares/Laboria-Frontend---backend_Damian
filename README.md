# Laboria - Portal de Empleo y Formación Profesional

Portal web frontend-only que agrega ofertas de empleo y cursos de formación profesional en España desde múltiples APIs públicas y feeds RSS. Sistema completo con autenticación, gestión de perfiles, currículum, y cumplimiento con RGPD/LOPDGDD 2026.

## 📋 Descripción

Laboria es un metabuscador que integra ofertas laborales y cursos educativos de diversas fuentes externas en una plataforma unificada. El proyecto incluye:

- **Metabuscador de Empleo**: Agrega ofertas de 9 APIs y 2 feeds RSS (14 fuentes habilitadas)
- **Metabuscador de Cursos**: Integra cursos de 5 feeds RSS
- **Sistema de Autenticación**: Registro y login con roles de usuario
- **Gestión de Perfiles**: Candidatos y empresas (empleados, estudiantes, híbridos)
- **Sistema de Currículum**: Gestión completa de currículum para candidatos
- **Panel de Usuario**: Pestañas específicas por rol con funcionalidades completas
- **Filtros Avanzados**: Jornada, salario, certificación, precio, duración
- **Consentimiento de Cookies**: Banner granular con categorías
- **Cumplimiento Legal**: RGPD/LOPDGDD 2026 y LSSI-CE
- **Testing**: 18 tests automatizados con Vitest y React Testing Library
- **Despliegue**: GitHub Pages con CI/CD automatizado

## ✨ Características

### Búsqueda de Empleo
- Filtros por ubicación, modalidad, categoría, jornada, salario
- Búsqueda en tiempo real con debounce (500ms)
- Normalización de datos de múltiples APIs
- Sistema de fallback con datos locales
- APIs habilitadas: Remotive, Jobicy, Himalayas, Arbeitnow, Junta Castilla y León, We Work Remotely (RSS), Stack Overflow Jobs (RSS)

### Búsqueda de Cursos
- Filtros por categoría, nivel, modalidad, certificación, precio, duración
- Feeds RSS de plataformas educativas: Coursera, edX, SEPE, MIT OpenCourseWare, TED-Ed
- Normalización de datos de múltiples fuentes
- Sistema de fallback con datos locales

### Sistema de Autenticación
- Registro de usuarios con validación de datos
- Login y logout
- Persistencia en localStorage
- Roles: candidato, empresa empleados, empresa estudiantes, empresa híbrido
- Consentimiento legal en registro (Términos, Privacidad, Cookies)

### Panel de Usuario
- Sistema de pestañas global por rol
- Pestañas para candidatos: perfil, currículum, aplicaciones, cursos guardados
- Pestañas para empresas: perfil, ofertas publicadas, cursos publicados
- Edición y eliminación de perfiles

### Sistema de Currículum
- Secciones: experiencia, educación, skills, proyectos, idiomas
- Agregar, eliminar y editar elementos
- Validación de fechas
- Colapso/expansión de secciones
- Sistema de dos estados (lectura/edición)
- Persistencia en localStorage

### Cookies y Cumplimiento Legal
- Banner de consentimiento granular
- Categorías: esenciales, análisis, marketing
- Persistencia de preferencias (1 año)
- Documentos legales: Aviso Legal, Política de Privacidad, Términos y Condiciones
- Cumplimiento con RGPD/LOPDGDD 2026 y LSSI-CE

### Testing
- 18 tests automatizados (Home, JobSearchPage, CourseSearchPage)
- Stack: Vitest + React Testing Library
- Mock de APIs para testing aislado

## 🛠 Stack Tecnológico

- **Frontend**: React 18.3.1
- **Bundler**: Vite 5.2.11
- **Enrutamiento**: React Router DOM 6.22.3 (HashRouter para GitHub Pages)
- **Testing**: Vitest 1.4.0 + React Testing Library 14.2.1
- **Estilos**: CSS Variables (paleta negro + dorado)
- **Lenguaje**: JavaScript (sin TypeScript)
- **Despliegue**: GitHub Pages + GitHub Actions CI/CD

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env (opcional - ver sección Variables de Entorno)
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Ejecutar tests
npm test

# Ejecutar tests con UI
npm run test:ui
```

## 🔐 Variables de Entorno

Las API keys son opcionales para el funcionamiento básico. Crear archivo `.env` en la raíz del proyecto:

```bash
# APIs de Empleo (opcional - actualmente deshabilitadas por CORS)
VITE_JOBS_API_2_KEY=tu_serpapi_key

# APIs de Cursos (opcional - actualmente deshabilitadas por CORS/auth)
VITE_COURSES_YOUTUBE_KEY=tu_youtube_api_key
VITE_COURSES_GOOGLE_SEARCH_KEY=tu_google_search_key
VITE_GOOGLE_CSE_ID=tu_custom_search_engine_id
VITE_COURSES_BING_KEY=tu_bing_search_key
```

**Cómo obtener las API keys:**
- YouTube: https://console.cloud.google.com/
- Google Custom Search: https://programmablesearchengine.google.com/
- Bing Search: https://www.microsoft.com/cognitive-services/
- SerpApi: https://serpapi.com/

## 📁 Estructura del Proyecto

```
Proyecto-Laboria-Damián/

├── public/                       # Assets estáticos y documentos legales
│   └── legal/                    # Documentos legales
│       ├── aviso-legal.html
│       ├── politica-privacidad.html
│       └── terminos-condiciones.html
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── CookieConsent.jsx    # Banner de cookies
│   │   ├── Footer.jsx           # Footer global
│   │   ├── Header.jsx           # Header global
│   │   └── TabsNavigation.jsx   # Navegación por pestañas
│   ├── context/                  # Context API
│   │   ├── AuthContext.jsx      # Gestión de autenticación
│   │   └── ConexionApi.jsx      # Gestión de APIs
│   ├── data/                     # Datos locales
│   │   ├── courses.json
│   │   └── jobs.json
│   ├── hooks/                    # Hooks personalizados
│   │   └── useSearch.js
│   ├── pages/                    # Páginas principales
│   │   ├── autenticacion/        # Autenticación
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── cursos/               # Cursos
│   │   │   ├── CourseSearchPage.jsx
│   │   │   └── __tests__/
│   │   ├── empleos/              # Empleo
│   │   │   ├── JobSearchPage.jsx
│   │   │   └── __tests__/
│   │   ├── inicio/               # Inicio
│   │   │   ├── Home.jsx
│   │   │   └── __tests__/
│   │   ├── panel/                # Panel de usuario
│   │   │   ├── PanelPage.jsx
│   │   │   ├── CurriculumPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   └── perfiles/             # Perfiles
│   │       ├── CandidateProfile.jsx
│   │       └── CompanyProfile.jsx
│   ├── services/                 # Servicios
│   └── test/                     # Setup de testing
│       └── setup.js
├── .env                          # Variables de entorno (no en git)
├── .env.example                  # Ejemplo de variables
├── .gitignore
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vite.config.js                # Configuración de Vite
└── README.md
```

## 🚀 Rutas

- `/#/` - Home (landing page con estadísticas)
- `/#/empleos` - Búsqueda de empleos
- `/#/cursos` - Búsqueda de cursos
- `/#/login` - Login
- `/#/registro` - Registro
- `/#/panel` - Panel de usuario (requiere autenticación)
- `/#/panel/curriculum` - Gestión de currículum
- `/#/panel/perfil` - Edición de perfil
- `/#/legal/aviso-legal.html` - Aviso legal
- `/#/legal/politica-privacidad.html` - Política de privacidad
- `/#/legal/terminos-condiciones.html` - Términos y condiciones

## 🎨 Estilos

Paleta de colores consistente (negro + dorado):

- **Negro base**: `#0a0a0a`
- **Dorado acento**: `#d4af37`
- **Dorado claro**: `#f4d03f`
- **Gris medio**: `#2a2a2a`
- **Gris claro**: `#4a4a4a`
- **Blanco**: `#ffffff`
- **Verde éxito**: `#22c55e`
- **Rojo error**: `#dc2626`

## 📚 Documentación

La documentación completa del proyecto está en la carpeta `DOC/`:

- **README.md**: Índice general de documentación
- **01-INTRODUCCION.md**: Visión general, contexto, objetivos, alcance, requisitos
- **02-ARQUITECTURA-TECNICA.md**: Patrones de diseño, estructura, componentes, flujo de datos
- **03-DESARROLLO-CRONOLOGICO.md**: Cronología de desarrollo con tiempos, dificultades, soluciones
- **04-DECISIONES-TECNICAS.md**: Decisiones técnicas tomadas y justificación
- **ANEXO-A-APIS.md**: Documentación detallada de 20 APIs integradas
- **ANEXO-B-TESTING.md**: Stack de testing, 18 tests implementados, estrategia
- **ANEXO-C-DESPLIEGUE.md**: GitHub Pages, CI/CD, troubleshooting
- **ANEXO-D-CUMPLIMIENTO-LEGAL.md**: RGPD/LOPDGDD 2026, documentos legales
- **05-CRONOGRAMA-TAREAS.md**: Cronograma detallado de tareas con tiempos

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con interfaz visual
npm run test:ui

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con coverage
npm run test:coverage
```

**Tests implementados:**
- Home Page: 6 tests
- JobSearchPage: 6 tests
- CourseSearchPage: 6 tests
- Total: 18 tests

## 📊 APIs Integradas

### Empleo (9 APIs + 2 RSS)
**Habilitadas (7):**
- Remotive Remote Jobs
- Jobicy Remote Jobs
- Himalayas Remote Jobs
- Arbeitnow Job Board
- Junta Castilla y León Empleo (datos locales)
- We Work Remotely (RSS)
- Stack Overflow Jobs (RSS)

**Deshabilitadas (2):**
- RemoteOK (problemas de CORS)
- SerpApi Google Jobs (problemas de CORS)

### Cursos (0 APIs + 5 RSS)
**Habilitadas (5):**
- Coursera (RSS del blog)
- edX (RSS del blog)
- SEPE Formación (RSS)
- MIT OpenCourseWare (RSS)
- TED-Ed (RSS)

**Deshabilitadas (4):**
- YouTube Data API (error 401 Unauthorized)
- Google Custom Search (error 401 Unauthorized)
- Bing Search API (error 404 Resource Not Found)
- Khan Academy (problemas de CORS)

Ver `ANEXO-A-APIS.md` para documentación detallada.

## 🚀 Despliegue

El proyecto está desplegado en GitHub Pages:

- **URL**: https://damianmoares.github.io/Proyect-Laboria-Damian/
- **Router**: HashRouter (para evitar problemas de routing en hosting estático)
- **CI/CD**: GitHub Actions automatizado
- **Build**: Vite build en cada push a main

Ver `ANEXO-C-DESPLIEGUE.md` para documentación detallada.

## 🚧 Estado del Proyecto

### ✅ Completado
- Metabuscador de empleo con 7 fuentes habilitadas
- Metabuscador de cursos con 5 fuentes RSS
- Sistema de autenticación con roles
- Gestión de perfiles (candidatos y empresas)
- Sistema de currículum completo
- Panel de usuario con pestañas por rol
- Filtros funcionales para empleo y cursos
- Consentimiento granular de cookies
- Documentos legales (Aviso Legal, Política de Privacidad, Términos)
- Cumplimiento con RGPD/LOPDGDD 2026
- Sistema de testing con 18 tests
- Despliegue en GitHub Pages con CI/CD
- Documentación técnica completa (10 documentos)

### 🔄 Limitaciones Conocidas
- Frontend-only con localStorage (sin backend)
- 6 APIs deshabilitadas por problemas de CORS o autenticación
- Sin sincronización entre dispositivos
- Límites de localStorage (~5MB)
- HashRouter en lugar de BrowserRouter (URLs con #)

### 📋 Futuras Mejoras
Ver `03-DESARROLLO-CRONOLOGICO.md` para roadmap de mejoras futuras.

## 🔒 Seguridad y Cumplimiento Legal

### Seguridad
- Variables de entorno para API keys
- Sanitización de HTML de fuentes externas
- Validación de datos de entrada
- HTTPS en producción (GitHub Pages)

### Cumplimiento Legal
- **RGPD/LOPDGDD 2026**: Cumple con regulaciones de protección de datos
- **LSSI-CE**: Cumple con ley de servicios de la sociedad de la información
- **Cookies**: Consentimiento granular con banner
- **Documentos legales**: Aviso Legal, Política de Privacidad, Términos y Condiciones

Ver `ANEXO-D-CUMPLIMIENTO-LEGAL.md` para documentación detallada.

## 🤝 Contribución

Este es un proyecto personal/educativo. Las contribuciones son bienvenidas a través de pull requests.

## 📄 Licencia

© 2026 Laboria. Todos los derechos reservados.

## 👤 Autor

**Damian Moares** - Desarrollador Frontend

---

**Última actualización**: 27 de abril de 2026  
**Versión**: 1.0.0
