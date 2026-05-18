# Visión y Alcance del Producto

> **Documento:** 01-VISION-ALCANCE.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## 1. Visión del producto

Laboria es una plataforma digital integral que centraliza la búsqueda de empleo y
formación profesional en España. Su objetivo es eliminar la fragmentación entre
portales de empleo, buscadores de cursos y herramientas de currículum, ofreciendo
una experiencia unificada tanto para candidatos como para empresas e instituciones
educativas.

**Declaración de visión:** *Ser el punto de encuentro de referencia para el talento
y la formación en España, conectando personas con oportunidades.*

---

## 2. Objetivos estratégicos

| # | Objetivo | Indicador | Meta |
|---|----------|-----------|------|
| OE1 | Centralizar ofertas de empleo multi-fuente | APIs externas integradas | >= 6 APIs + 3 RSS |
| OE2 | Agregar catálogo de cursos formativos | Fuentes de cursos | >= 6 APIs + 5 RSS |
| OE3 | Proveer herramientas de currículum digital | Editor de CV funcional | Secciones editables 100% |
| OE4 | Garantizar seguridad y privacidad | Tests de seguridad | 0 vulnerabilidades críticas |
| OE5 | Facilitar gestión administrativa | Panel admin completo | CRUD todas las entidades |
| OE6 | Asegurar calidad mediante tests | Cobertura de tests | >80 tests pasando |

---

## 3. Roles de usuario

| Rol | Descripción | Permisos clave |
|-----|-------------|----------------|
| **CANDIDATE** | Persona que busca empleo o formación | Buscar empleos, aplicar, gestionar CV, inscribirse en cursos |
| **COMPANY_EMPLOYEES** | Empresa que contrata | Publicar empleos, gestionar aplicaciones |
| **COMPANY_STUDENTS** | Institución educativa | Publicar cursos, gestionar inscripciones |
| **COMPANY_HYBRID** | Empresa mixta | Publicar empleos y cursos |
| **ADMIN** | Super-administrador | Panel completo, estadísticas, auditoría, gestión usuarios |

---

## 4. Funcionalidades por módulo

### 4.1 Autenticación y usuarios
- Registro con validación de email y contraseña
- Inicio de sesión con JWT (access + refresh token)
- Recuperación de contraseña por email
- Perfil de usuario editable
- Cierre de sesión con registro de duración

### 4.2 Empleos
- Búsqueda y filtrado (categoría, ubicación, modalidad)
- Publicación de ofertas (empresas)
- Detalle de empleo con información completa
- Aplicación a ofertas (candidatos)
- Agregación de APIs externas (RemoteOK, Remotive, Arbeitnow, Jobicy, JCYL, SerpApi)
- Sindicación RSS (We Work Remotely, Indeed, Glassdoor)

### 4.3 Cursos
- Catálogo con búsqueda y filtros (categoría, nivel)
- Publicación de cursos (instituciones)
- Detalle de curso con información completa
- Inscripción a cursos (candidatos)
- Agregación de APIs externas (YouTube, Google CSE, Bing, Khan Academy, Coursera, Udemy)

### 4.4 Currículum Vitae
- Editor interactivo por secciones
- Secciones: Datos personales, Resumen, Experiencia, Educación, Habilidades, Idiomas, Proyectos, Certificaciones
- Añadir/editar/eliminar items por sección
- Validación de campos requeridos

### 4.5 Panel de administración
- Dashboard con estadísticas (usuarios, empleos, cursos, aplicaciones)
- Gestión de usuarios (listar, detalles, cambio de rol, eliminar)
- Gestión de empleos (listar, editar, eliminar)
- Gestión de cursos (listar, editar, eliminar)
- Gestión de aplicaciones (listar, cambiar estado)
- Registro de auditoría
- Ejecución de tests del backend

### 4.6 Dashboard de candidato
- Estadísticas de sesión (gráfico de duración)
- Resumen de aplicaciones activas
- Enlaces rápidos a funcionalidades principales

---

## 5. Fuera de alcance (v2.0)

- Mensajería interna entre candidatos y empresas
- Sistema de valoraciones y reseñas
- Pagos y suscripciones premium
- Aplicación móvil nativa (iOS/Android)
- Internacionalización multi-idioma (actualmente solo español)
- Integración con LinkedIn, InfoJobs u otros portales españoles
- Notificaciones push en tiempo real
- Tests de integración E2E con Cypress/Playwright
