# Laboria - Portal de Empleo y Formación Profesional

Portal web full-stack (Node.js + PostgreSQL + React) que agrega ofertas de empleo y cursos de formación profesional en España desde múltiples APIs públicas y feeds RSS. Sistema completo con autenticación JWT, gestión de perfiles, currículum, postulaciones, panel de administración y cumplimiento con RGPD/LOPDGDD 2026.

## 📋 Descripción

Laboria es un metabuscador que integra ofertas laborales y cursos educativos de diversas fuentes externas en una plataforma unificada. El proyecto incluye:

- **Metabuscador de Empleo**: Agrega ofertas de 9 APIs y 2 feeds RSS (14 fuentes habilitadas)
- **Metabuscador de Cursos**: Integra cursos de 5 feeds RSS
- **Backend REST API**: Node.js + Express + PostgreSQL (Prisma ORM)
- **Sistema de Autenticación**: Registro y login con JWT y roles de usuario
- **Recuperación de Contraseña**: Flujo completo con email (Resend)
- **Gestión de Perfiles**: Candidatos y empresas (empleados, estudiantes, híbridos)
- **Sistema de Currículum**: Gestión completa de currículum vía API con persistencia
- **Postulaciones**: A empleos y cursos con seguimiento de estado
- **Panel de Administración**: Gestión de usuarios, ofertas, cursos y aplicaciones
- **Panel de Usuario**: Dashboard con estadísticas y gráficos
- **Sesiones de Usuario**: Tracking de inicio/cierre con estadísticas
- **Filtros Avanzados**: Jornada, salario, certificación, precio, duración
- **Consentimiento de Cookies**: Banner granular con categorías
- **Cumplimiento Legal**: RGPD/LOPDGDD 2026 y LSSI-CE
- **Testing**: 86 tests automatizados (57 frontend + 29 backend) con Vitest
- **Despliegue**: Frontend en Vercel + Backend en Render, CI/CD automatizado

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
- Registro de usuarios con validación (solo rol candidato desde frontend)
- Login y logout con tracking de sesiones
- JWT con expiración (7 días)
- Roles: CANDIDATE, COMPANY_EMPLOYEES, COMPANY_STUDENTS, COMPANY_HYBRID, ADMIN
- Recuperación de contraseña con email (Resend)
- Consentimiento legal en registro (Términos, Privacidad, Cookies)

### Panel de Usuario
- Dashboard con estadísticas y gráficos de sesiones
- Perfil editable (bio, experiencia, salario esperado, linkedin, github, portfolio)
- Configuración de cuenta (cambio de contraseña, eliminación de cuenta)
- Currículum completo con secciones colapsables (experiencia, educación, skills, proyectos, idiomas)
- Postulaciones a empleos y cursos
- Sesiones de usuario con tracking de duración

### Backend API
- **Node.js + Express**: Servidor REST con rutas modularizadas
- **PostgreSQL + Prisma ORM**: Modelos User, Job, Course, Application, Curriculum, CourseApplication, LoginSession
- **Autenticación JWT**: bcrypt para contraseñas, middleware de autorización por rol
- **Rate Limiting**: Límites de peticiones en endpoints de autenticación
- **Validación**: express-validator en todos los endpoints
- **Email**: Resend para recuperación de contraseña
- **Seguridad**: Helmet, CORS configurable
- **Pruebas**: 29 tests con Vitest y supertest

### Cookies y Cumplimiento Legal
- Banner de consentimiento granular
- Categorías: esenciales, análisis, marketing
- Persistencia de preferencias (1 año)
- Documentos legales: Aviso Legal, Política de Privacidad, Términos y Condiciones
- Cumplimiento con RGPD/LOPDGDD 2026 y LSSI-CE

### Testing
- **86 tests total** (57 frontend + 29 backend)
- Frontend: Vitest + React Testing Library (componentes y páginas)
- Backend: Vitest + supertest (controladores y rutas) con manipulación de `require.cache` para mocking

## � Ejecución Rápida

### **Instalación Completa**
```bash
# Instalar todas las dependencias
npm run install:all

# Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Iniciar desarrollo (frontend + backend)
npm run dev
```

### **Comandos Disponibles**

#### **🔧 Desarrollo**
```bash
npm run dev              # Iniciar frontend + backend
npm run dev:frontend     # Solo frontend (Vite dev)
npm run dev:backend      # Solo backend (nodemon)
```

#### **🚀 Producción**
```bash
npm run start             # Iniciar frontend + backend
npm run start:frontend    # Solo frontend (build + preview)
npm run start:backend     # Solo backend (node server.js)
```

#### **📦 Build**
```bash
npm run build             # Build frontend + backend
npm run build:frontend    # Solo frontend
npm run build:backend     # Solo backend (Prisma + migrate)
```

#### **🧪 Testing**
```bash
npm run test              # Tests frontend + backend
npm run test:frontend     # Solo frontend
npm run test:backend      # Solo backend
```

#### **🚀 Despliegue**
```bash
npm run deploy             # Build frontend para Vercel
npm run deploy:frontend    # Build frontend para Vercel
```

## 🛠 Stack Tecnológico

- **Frontend**: React 18.3.1
- **Bundler**: Vite 5.2.11
- **Enrutamiento**: React Router DOM 6.22.3 (BrowserRouter en Vercel)
- **Backend**: Node.js + Express 5.2.1
- **Base de Datos**: PostgreSQL + Prisma ORM 6.19.3
- **Testing**: Vitest + React Testing Library + supertest
- **Estilos**: CSS Variables (paleta negro + dorado), CSS Modules
- **Lenguaje**: JavaScript (sin TypeScript)
- **Despliegue**: Vercel (frontend) + Render (backend) + GitHub Actions CI/CD

## 🔐 Variables de Entorno

### Backend
```bash
cp backend/.env.example backend/.env
# Editar backend/.env con tus valores
```

Variables requeridas:
- `DATABASE_URL`: URL de conexión PostgreSQL
- `JWT_SECRET`: Secreto para firmar tokens JWT

### Frontend
```bash
cp frontend/.env.example frontend/.env
```

Las API keys externas son opcionales para el funcionamiento básico (el sistema usa datos locales como fallback).

## 📁 Estructura del Proyecto

```
Proyecto-Laboria-Damián/

├── frontend/                     # Aplicación React (Vite)
│   ├── public/
│   │   └── legal/               # Documentos legales
│   ├── src/
│   │   ├── __tests__/            # Tests de frontend (57 tests)
│   │   ├── components/           # Componentes reutilizables
│   │   ├── config/               # Configuración de APIs, roles
│   │   ├── context/              # AuthContext, ConfirmContext
│   │   ├── data/                 # Datos locales (jobs.json, courses.json)
│   │   ├── hooks/                # Hooks personalizados
│   │   ├── pages/                # Páginas (autenticación, cursos, empleos, panel, etc.)
│   │   └── test/                 # Setup de testing
│   ├── .env / .env.example
│   └── vite.config.js
├── backend/                      # API REST (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma        # Modelos de base de datos
│   │   └── migrations/          # Migraciones de base de datos
│   ├── src/
│   │   ├── __tests__/            # Tests de backend (29 tests, 6 archivos)
│   │   ├── config/              # Conexión Prisma
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── middleware/          # Auth, validación, rate limiting, errores
│   │   └── routes/              # Definición de rutas
│   ├── server.js                # Punto de entrada
│   ├── render.yaml              # Render Blueprint
│   └── .env / .env.example
├── doc/                          # Documentación del proyecto (ensayos)
├── docs/
│   ├── db-api-guide.md
│   ├── backend-summary.md
│   ├── auditoria-completa.md
│   └── auditoria-full.md
├── Documentacion/                # Documentación completa (11 archivos)
├── .github/workflows/deploy.yml  # CI/CD GitHub Actions
├── package.json                  # Scripts raíz (dev, test, build)
├── specs/                        # Especificaciones técnicas
└── README.md
```

## 🚀 Rutas

### Frontend
- `/#/` - Home (landing page con estadísticas)
- `/#/empleos` - Búsqueda de empleos
- `/#/cursos` - Búsqueda de cursos
- `/#/login` - Login
- `/#/registro` - Registro
- `/#/olvide-mi-contrasena` - Recuperar contraseña
- `/#/reset-password` - Restablecer contraseña
- `/#/panel` - Dashboard de usuario (requiere autenticación)
- `/#/curriculum` - Gestión de currículum (candidato)
- `/#/configuracion` - Configuración de cuenta
- `/#/mis-aplicaciones` - Postulaciones (candidato)
- `/#/cursos-guardados` - Cursos guardados (candidato)
- `/#/mis-ofertas` - Ofertas publicadas (empresa)
- `/#/mis-cursos` - Cursos publicados (empresa)
- `/#/perfil/candidato` - Perfil candidato
- `/#/perfil/empresa` - Perfil empresa
- `/#/admin` - Panel de administración (ADMIN only)

### API Backend
- `GET /api/users/profile` - Perfil del usuario
- `POST /api/users/register` - Registro
- `POST /api/users/login` - Inicio de sesión
- `POST /api/users/logout` - Cierre de sesión
- `POST /api/users/forgot-password` - Solicitar recuperación
- `POST /api/users/reset-password` - Restablecer contraseña
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/change-password` - Cambiar contraseña
- `DELETE /api/users/profile` - Eliminar cuenta
- `GET /api/users/curriculum` - Obtener currículum
- `PUT /api/users/curriculum` - Guardar currículum
- `GET /api/users/session-stats` - Estadísticas de sesión
- `GET /api/jobs` - Listar empleos
- `GET /api/courses` - Listar cursos
- `GET /api/applications` - Postulaciones del usuario
- `POST /api/applications` - Postular a empleo
- `GET /api/course-applications` - Postulaciones a cursos
- `POST /api/course-applications` - Inscribirse a curso

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

La documentación del proyecto se divide en dos carpetas:

### `doc/` — Ensayos y cronología del desarrollo
- **README.md**: Índice general de documentación
- **01-INTRODUCCION.md**: Visión general, contexto, objetivos, alcance, requisitos
- **02-ARQUITECTURA-TECNICA.md**: Patrones de diseño, estructura, componentes, flujo de datos
- **03-DESARROLLO-CRONOLOGICO.md**: Cronología de desarrollo con tiempos, dificultades, soluciones
- **04-DECISIONES-TECNICAS.md**: Decisiones técnicas tomadas y justificación
- **ANEXO-A-APIS.md**: Documentación detallada de 20 APIs integradas
- **ANEXO-B-TESTING.md**: Stack de testing, 75 tests implementados, estrategia
- **ANEXO-C-DESPLIEGUE.md**: GitHub Pages, CI/CD, troubleshooting
- **ANEXO-D-CUMPLIMIENTO-LEGAL.md**: RGPD/LOPDGDD 2026, documentos legales
- **05-CRONOGRAMA-TAREAS.md**: Cronograma detallado de tareas con tiempos

### `Documentacion/` — Documentación técnica completa (11 archivos, en git)
- **README.md**: Índice
- **01-VISION-ALCANCE.md** a **10-GLOSARIO.md**: Visión, arquitectura, modelo datos, API, manuales, pruebas, seguridad, roadmap, glosario
- **especifico-backend.md**: Especificación técnica de backend (1556 líneas, 45 funciones, 40 endpoints)

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

**Tests implementados (86 total):**
- Frontend (57):
  - Home Page: 6 tests
  - JobSearchPage: 6 tests
  - CourseSearchPage: 6 tests
  - AuthContext: 12 tests
  - ProtectedRoute: 9 tests
  - LoginPage: 5 tests
  - RegisterPage: 5 tests
  - DashboardPage: 4 tests
  - CurriculumPage: 4 tests
- Backend (29):
  - userController: 6 tests (registro, login, perfil, cambio contraseña, baja)
  - authMiddleware: 4 tests
  - applicationController: 6 tests (crear, listar, cancelar, actualizar estado)
  - courseController: 4 tests (listar, crear, detalle)
  - jobController: 4 tests (listar, crear, detalle)
  - adminController: 5 tests (dashboard, usuarios, auditoría, tests)

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

### Frontend: Vercel

- **URL**: https://laboria-frontend-backend-damian.vercel.app
- **Router**: BrowserRouter (compatible con Vercel)
- **Build**: Vite (838 módulos, ~5s con code splitting + vendor chunks)
- **CI/CD**: GitHub Actions automatizado (push a main → test + build + deploy)

### Backend: Render

- **Plataforma**: Render (Web Service + Blueprint)
- **Base de datos**: PostgreSQL administrado en Render
- **URL**: https://laboria-backend.onrender.com
- **Variables de entorno**: Configuradas en `render.yaml`
- **Migraciones**: Prisma migrate deploy automático en build con resolución de conflictos

Ver `docs/GUIA_DESPLIEGUE.md` para documentación detallada.

## 🚧 Estado del Proyecto

### ✅ Completado
- Metabuscador de empleo con 7 fuentes habilitadas
- Metabuscador de cursos con 5 fuentes RSS
- Backend REST API (Node.js + Express + PostgreSQL + Prisma)
- Sistema de autenticación JWT con roles (CANDIDATE, COMPANY_*, ADMIN)
- Recuperación de contraseña con email (Resend)
- Gestión de perfiles (candidatos y empresas) con campos extendidos
- Sistema de currículum completo con persistencia vía API
- Postulaciones a empleos y cursos con seguimiento de estado
- Panel de administración completo (dashboard, usuarios, auditoría)
- Dashboard con estadísticas y gráficos de sesiones
- Tracking de sesiones de usuario con LoginSession
- 57 tests de frontend + 29 tests de backend (86 total)
- Controladores: user, auth, application, course, job, admin (6 controllers, 40 endpoints)
- Despliegue frontend en Vercel + backend en Render
- CI/CD automatizado con GitHub Actions
- Documentación técnica completa (11 archivos en Documentacion/)
- Especificación técnica backend (1556 líneas)
- Auditoría: ~90/95 hallazgos corregidos (~95%)

### 🔄 Limitaciones Conocidas
- 6 APIs externas deshabilitadas por problemas de CORS o autenticación
- Los cursos se cargan desde archivos JSON estáticos (no desde BD)
- Despliegue en Render con error P3018 en migración de userRole (require.cache pendiente)

### 📋 Futuras Mejoras
Ver `03-DESARROLLO-CRONOLOGICO.md` para roadmap de mejoras futuras.

## 🔒 Seguridad y Cumplimiento Legal

### Seguridad
- Variables de entorno para API keys y secretos
- Helmet para cabeceras HTTP seguras (backend)
- CORS configurable (backend)
- JWT con expiración y bcrypt para contraseñas
- Rate limiting en endpoints de autenticación
- Validación de entrada con express-validator
- Sanitización de HTML con DOMParser (sin innerHTML)
- Sin console.log en producción (frontend)
- Sourcemaps deshabilitados en producción
- Error Boundary global para fallos de React
- Focus indicators visibles para accesibilidad

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

**Última actualización**: 18 de mayo de 2026  
**Versión**: 2.1.0 (full-stack)
