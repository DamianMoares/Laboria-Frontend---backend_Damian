# Documentación Completa de Laboria

Plataforma de empleos y cursos con enfoque en el mercado español.  
**Stack:** React 18 + Vite 5 (frontend) · Node.js + Express 5 + Prisma + PostgreSQL (backend)

---

## Índice

1. [Visión general](#1-visión-general)
2. [Estructura del proyecto](#2-estructura-del-proyecto)
3. [Backend API](#3-backend-api)
   - 3.1 [Entry point (server.js)](#31-entry-point-serverjs)
   - 3.2 [Base de datos y Prisma](#32-base-de-datos-y-prisma)
   - 3.3 [Modelos de datos](#33-modelos-de-datos)
   - 3.4 [Enumeraciones](#34-enumeraciones)
   - 3.5 [Middleware](#35-middleware)
   - 3.6 [Controladores](#36-controladores)
   - 3.7 [Rutas](#37-rutas)
   - 3.8 [Servicio de email](#38-servicio-de-email)
   - 3.9 [Seguridad](#39-seguridad)
   - 3.10 [Seed de datos demo](#310-seed-de-datos-demo)
   - 3.11 [Generador de datos españoles](#311-generador-de-datos-españoles)
   - 3.12 [Tests del backend](#312-tests-del-backend)
4. [Frontend](#4-frontend)
   - 4.1 [Entry point y configuración Vite](#41-entry-point-y-configuración-vite)
   - 4.2 [Routing (HashRouter)](#42-routing-hashrouter)
   - 4.3 [Contexto de autenticación](#43-contexto-de-autenticación)
   - 4.4 [Servicios API](#44-servicios-api)
   - 4.5 [Componentes compartidos](#45-componentes-compartidos)
   - 4.6 [Páginas públicas](#46-páginas-públicas)
   - 4.7 [Páginas protegidas](#47-páginas-protegidas)
   - 4.8 [Páginas de administración](#48-páginas-de-administración)
   - 4.9 [Estrategia de perfil en localStorage](#49-estrategia-de-perfil-en-localstorage)
   - 4.10 [Datos estáticos españoles](#410-datos-estáticos-españoles)
   - 4.11 [External API proxying](#411-external-api-proxying)
   - 4.12 [Tests del frontend](#412-tests-del-frontend)
5. [Despliegue](#5-despliegue)
   - 5.1 [Frontend en Vercel](#51-frontend-en-vercel)
   - 5.2 [Backend en Render](#52-backend-en-render)
6. [Usuarios demo](#6-usuarios-demo)

---

## 1. Visión general

Laboria es una plataforma que conecta candidatos con empresas y cursos de formación. Los candidatos pueden buscar empleo, inscribirse en cursos, gestionar su currículum y postularse a ofertas. Las empresas pueden publicar empleos y cursos, gestionar postulaciones y acceder a estadísticas del sistema.

### Roles de usuario

| Rol | Descripción |
|---|---|
| `CANDIDATE` | Persona que busca empleo o formación. Puede postularse a empleos, inscribirse en cursos y gestionar su CV. |
| `COMPANY_EMPLOYEES` | Empresa que busca empleados. Puede publicar ofertas de trabajo y gestionar postulaciones. |
| `COMPANY_STUDENTS` | Empresa que busca estudiantes. Puede publicar cursos y gestionar inscripciones. |
| `COMPANY_HYBRID` | Empresa híbrida. Puede publicar tanto empleos como cursos. |
| `ADMIN` | Administrador del sistema. Accede al panel de administración con estadísticas y gestión completa de usuarios, empleos y cursos. |

### Funcionalidades principales

- Autenticación JWT con registro, login y recuperación de contraseña
- Roles con permisos diferenciados (candidato, empresa, admin)
- Búsqueda y filtrado de empleos y cursos
- Postulación a empleos con restricción de unicidad (única por usuario+empleo)
- Inscripción a cursos con modelo propio
- Gestión completa de currículum vitae (experiencia, educación, habilidades, proyectos, idiomas)
- Panel de administración con estadísticas y CRUD completo
- Dashboard con gráfico de duración de sesiones
- Configuración de perfil con campos extendidos
- Seguimiento de sesiones de login (LoginSession)
- Recuperación de contraseña por email (Resend)
- Cambio de contraseña desde configuración
- Eliminación de cuenta
- 350 empleos y 150 cursos generados con datos realistas españoles

---

## 2. Estructura del proyecto

```
Laboria-Frontend---backend_Damian/
├── backend/                        # API REST (Node.js + Express)
│   ├── server.js                   # Entry point del servidor
│   ├── package.json
│   ├── .env                        # Variables de entorno
│   ├── prisma/
│   │   ├── schema.prisma           # Modelos de base de datos
│   │   ├── seed.js                 # Datos de prueba (9 usuarios)
│   │   └── migrations/             # Migraciones SQL generadas por Prisma
│   ├── scripts/
│   │   └── generateSpanishData.js  # Generador de datos españoles
│   └── src/
│       ├── config/
│       │   └── database.js         # Cliente Prisma singleton
│       ├── controllers/
│       │   ├── userController.js
│       │   ├── jobController.js
│       │   ├── courseController.js
│       │   ├── applicationController.js
│       │   ├── courseApplicationController.js
│       │   └── adminController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── ownerMiddleware.js
│       │   ├── adminMiddleware.js
│       │   ├── errorHandler.js
│       │   ├── rateLimiter.js
│       │   └── validate.js
│       ├── routes/
│       │   ├── userRoutes.js
│       │   ├── jobRoutes.js
│       │   ├── courseRoutes.js
│       │   ├── applicationRoutes.js
│       │   ├── courseApplicationRoutes.js
│       │   └── adminRoutes.js
│       ├── services/
│       │   └── emailService.js     # Resend para emails transaccionales
│       ├── utils/
│       │   └── jwt.js              # Generación y verificación de JWT
│       └── __tests__/              # Tests (Vitest)
│           ├── userController.test.js
│           ├── jobController.test.js
│           ├── courseController.test.js
│           └── authMiddleware.test.js
├── frontend/                       # SPA (React + Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env / .env.production
│   ├── public/
│   │   ├── data/
│   │   │   ├── jobs.json           # 350 empleos españoles
│   │   │   └── courses.json        # 150 cursos españoles
│   │   ├── favicon.png
│   │   └── legal/                  # Aviso legal, privacidad, términos
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                 # Router + Layout
│   │   ├── App.module.css
│   │   ├── index.css
│   │   ├── assets/
│   │   │   └── img/
│   │   │       └── Laboria_Fondo_Negro.png
│   │   ├── config/
│   │   │   ├── api.js              # URL base del backend
│   │   │   ├── enums.js            # Constantes de roles y enums
│   │   │   └── externalApis.js     # Config APIs externas
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Estado de autenticación global
│   │   │   └── ConexionApi.jsx     # Conexión a APIs externas
│   │   ├── services/
│   │   │   ├── api.js              # Cliente HTTP (Fetch API)
│   │   │   ├── authService.js
│   │   │   ├── jobService.js
│   │   │   ├── courseService.js
│   │   │   ├── applicationService.js
│   │   │   ├── courseApplicationService.js
│   │   │   ├── curriculumService.js
│   │   │   ├── sessionService.js
│   │   │   └── adminService.js
│   │   ├── hooks/
│   │   │   ├── useFetch.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useCurriculum.js
│   │   │   ├── useSearch.js
│   │   │   ├── useToggle.js
│   │   │   ├── useForm.js
│   │   │   └── useLocalStorage.js
│   │   ├── data/
│   │   │   └── searchData.js       # Tags/filtros para búsqueda
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── navigation/
│   │   │   ├── jobs/
│   │   │   ├── courses/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SessionDurationChart.jsx
│   │   │   └── CookieConsent.jsx
│   │   ├── pages/
│   │   │   ├── inicio/             # Home
│   │   │   ├── autenticacion/      # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── empleos/            # JobSearch, JobDetail, PostJob, MyJobs
│   │   │   ├── cursos/             # CourseSearch, CourseDetail, PostCourse, MyCourses, SavedCourses
│   │   │   ├── perfiles/           # CandidateProfile, CompanyProfile
│   │   │   ├── panel/              # Dashboard
│   │   │   ├── configuracion/      # Settings
│   │   │   ├── curriculo/          # Curriculum
│   │   │   ├── aplicaciones/       # MyApplications
│   │   │   ├── informacion/        # About, FAQ
│   │   │   ├── compartidos/        # CSS compartido
│   │   │   └── admin/              # AdminDashboard, AdminUsers, etc.
│   │   └── test/
│   │       └── setup.js
├── README.md
├── package.json                    # Scripts raíz
├── vercel.json                     # Config despliegue Vercel
├── render.yaml                     # Config despliegue Render
├── USUARIOS_DEMO.md                # Tabla de cuentas demo
├── GUIA_DESPLIEGUE.md
├── TAREAS.md
└── AUDITORIA.md
```

---

## 3. Backend API

### 3.1 Entry point (server.js)

**Archivo:** `backend/server.js`

El servidor Express arranca en el puerto `3000` (o el definido en `PORT`). Carga variables de entorno con `dotenv`, configura CORS dinámico con soporte para patrones wildcard (ej: `*.vercel.app`), monta las rutas API bajo `/api/`, y registra el middleware de errores al final.

**Rutas montadas:**

| Prefijo | Router | Propósito |
|---|---|---|
| `/api/users` | `userRoutes.js` | Autenticación, perfil, curriculum, sesiones |
| `/api/jobs` | `jobRoutes.js` | CRUD de empleos |
| `/api/courses` | `courseRoutes.js` | CRUD de cursos |
| `/api/applications` | `applicationRoutes.js` | Postulaciones a empleo |
| `/api/course-applications` | `courseApplicationRoutes.js` | Inscripciones a cursos |
| `/api/admin` | `adminRoutes.js` | Administración del sistema |

Incluye graceful shutdown: al recibir `SIGTERM` o `SIGINT`, cierra el servidor y desconecta Prisma.

### 3.2 Base de datos y Prisma

**ORM:** Prisma 6 sobre PostgreSQL.  
**Cliente:** Singleton en `backend/src/config/database.js`.

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```

**Comandos útiles:**

```bash
cd backend
npx prisma generate          # Regenerar cliente Prisma
npx prisma migrate dev       # Crear y aplicar migración
npx prisma migrate deploy    # Aplicar migraciones en producción
npx prisma studio            # UI visual para explorar datos
npm run seed                 # Poblar BD con datos demo
```

### 3.3 Modelos de datos

#### User

Representa un usuario del sistema con autenticación y roles.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `email` | String (único) | Email del usuario |
| `password` | String | Hash bcrypt de la contraseña |
| `name` | String | Nombre visible |
| `role` | Role enum | Rol del usuario |
| `resetPasswordToken` | String? | Token para restablecer contraseña |
| `resetPasswordExpires` | DateTime? | Expiración del token de reset |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de última modificación |

**Relaciones:** `applications`, `courseApplications`, `courses`, `jobs`, `curriculum`, `loginSessions`

#### Job

Representa una oferta de empleo publicada por una empresa.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `title` | String | Título del puesto |
| `company` | String | Nombre de la empresa |
| `location` | String | Ubicación |
| `salary` | String? | Rango salarial |
| `description` | String | Descripción del puesto |
| `requirements` | String? | Requisitos |
| `mode` | WorkMode enum | REMOTE, HYBRID o ONSITE |
| `category` | String | Categoría profesional |
| `authorId` | String | FK al usuario que publicó |

**Relaciones:** `author` (User), `applications`

#### Course

Representa un curso publicado por una empresa.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `title` | String | Título del curso |
| `provider` | String | Proveedor/institución |
| `description` | String | Descripción |
| `category` | String | Categoría |
| `level` | Level enum | BEGINNER, INTERMEDIATE o ADVANCED |
| `duration` | String? | Duración |
| `price` | String? | Precio |
| `url` | String? | Enlace al curso |
| `image` | String? | URL de imagen |
| `authorId` | String | FK al usuario que publicó |

#### Application

Representa la postulación de un candidato a un empleo.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `status` | ApplicationStatus enum | PENDING, ACCEPTED o REJECTED |
| `message` | String? | Mensaje del candidato |
| `userId` | String | FK al candidato |
| `jobId` | String | FK al empleo |

**Restricción:** `@@unique([userId, jobId])` — un candidato solo puede postularse una vez al mismo empleo.

#### Curriculum

Almacena el currículum vitae de un candidato en formato JSON.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `userId` | String (único) | Relación 1:1 con User |
| `data` | Json | CV completo en JSON |
| `createdAt` | DateTime | Fecha de creación |
| `updatedAt` | DateTime | Fecha de modificación |

**Estructura del JSON `data`:**

```json
{
  "experience": [{ "id": 1, "company": "...", "position": "...", "startDate": "...", "endDate": "...", "description": "...", "sendToApplication": true }],
  "education":  [{ "id": 1, "institution": "...", "degree": "...", "field": "...", "startDate": "...", "endDate": "...", "sendToApplication": true }],
  "skills":     [{ "id": 1, "name": "...", "level": "...", "sendToApplication": true }],
  "projects":   [],
  "languages":  [{ "id": 1, "language": "...", "level": "...", "sendToApplication": true }]
}
```

**Persistencia:** El frontend guarda automáticamente en API + localStorage en cada add/edit/delete (no solo al hacer clic en "Guardar").

#### CourseApplication

Representa la inscripción de un candidato a un curso.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `status` | ApplicationStatus enum | PENDING, ACCEPTED o REJECTED |
| `message` | String? | Mensaje |
| `userId` | String | FK al candidato |
| `courseId` | String | ID del curso (sin FK — los cursos son datos estáticos) |

**Restricción:** `@@unique([userId, courseId])` — un candidato no puede inscribirse dos veces al mismo curso.

#### LoginSession

Registra cada inicio y cierre de sesión para estadísticas.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Identificador único |
| `userId` | String | FK al usuario |
| `userRole` | String | Rol del usuario en el momento del login |
| `loginAt` | DateTime | Momento del inicio de sesión |
| `logoutAt` | DateTime? | Momento del cierre (null si activa) |
| `duration` | Int? | Duración en segundos |

**Propósito:** El Dashboard usa `session-stats` para mostrar un gráfico de barras con la duración promedio de sesión de candidatos vs empresas.

### 3.4 Enumeraciones

```prisma
enum Role {
  CANDIDATE
  COMPANY_EMPLOYEES
  COMPANY_STUDENTS
  COMPANY_HYBRID
  ADMIN
}

enum WorkMode {
  REMOTE
  HYBRID
  ONSITE
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum ApplicationStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

### 3.5 Middleware

#### authMiddleware (`backend/src/middleware/authMiddleware.js`)

Verifica el token JWT del header `Authorization: Bearer <token>`. Si es válido, busca el usuario en BD y lo agrega a `req.user`. Si falla, responde con 401.

**Flujo:** Header → extraer token → `verifyToken()` → buscar usuario → `req.user = user` → `next()`.

#### ownerMiddleware (`backend/src/middleware/ownerMiddleware.js`)

Verifica que el `id` en los parámetros de la ruta coincida con `req.user.id`, o que el usuario sea ADMIN. Responde 403 si no.

**Uso:** Rutas `GET/PUT/DELETE /api/users/:id`.

#### adminMiddleware (`backend/src/middleware/adminMiddleware.js`)

Verifica que `req.user.role === 'ADMIN'`. Responde 403 si no.

**Uso:** Todas las rutas bajo `/api/admin/*`.

#### errorHandler (`backend/src/middleware/errorHandler.js`)

Captura errores lanzados con `next(error)`. Responde con el `statusCode` y mensaje del error, o 500 genérico. En desarrollo incluye el stack trace.

#### rateLimiter (`backend/src/middleware/rateLimiter.js`)

Usa `express-rate-limit`. Dos limitadores:
- **authLimiter:** 30 requests por 15 minutos (login y registro)
- **generalLimiter:** 100 requests por 15 minutos (disponible para otras rutas)

#### validate (`backend/src/middleware/validate.js`)

Usa `express-validator`. Define reglas de validación para cada operación:

| Regla | Campos validados |
|---|---|
| `registerRules` | email (formato), password (≥6 chars), name (requerido) |
| `loginRules` | email (formato), password (requerido) |
| `updateProfileRules` | name (no vacío), email (formato) |
| `createJobRules` | title/company/description (requerido), mode (enum) |
| `updateJobRules` | Igual que create pero opcionales |
| `createCourseRules` | title/provider/description (requerido), level (enum), url/image (URL) |
| `updateCourseRules` | Igual que create pero opcionales |

### 3.6 Controladores

Cada controlador es un archivo en `backend/src/controllers/` que exporta funciones manejadoras de Express (`(req, res, next)`).

#### userController.js

| Función | Método | Ruta | Auth | Descripción |
|---|---|---|---|---|
| `register` | POST | `/api/users/register` | No | Crear usuario. Hash de password con bcrypt (10 rondas). Envía email de bienvenida no bloqueante. |
| `login` | POST | `/api/users/login` | No | Autenticar. Verifica credenciales, crea LoginSession, devuelve token JWT. |
| `logout` | POST | `/api/users/logout` | Sí | Cierra la sesión activa más reciente (actualiza logoutAt y duration). |
| `sessionStats` | GET | `/api/users/session-stats` | Sí | Devuelve duración promedio de sesión para candidatos y empresas. |
| `getProfile` | GET | `/api/users/:id` | Sí + owner | Obtener datos públicos del usuario. |
| `updateProfile` | PUT | `/api/users/profile/me` | Sí | Actualiza name y email. Verifica unicidad si cambia email. |
| `deleteAccount` | DELETE | `/api/users/account` | Sí | Elimina al usuario de la BD. |
| `forgotPassword` | POST | `/api/users/forgot-password` | No | Genera token criptográfico (crypto.randomBytes), guarda con expiración de 1h, envía email con enlace de reset. |
| `resetPassword` | POST | `/api/users/reset-password` | No | Verifica token y expiración, hashea nueva password, limpia token. |
| `changePassword` | POST | `/api/users/change-password` | Sí | Verifica contraseña actual, hashea y guarda la nueva. |
| `getCurriculum` | GET | `/api/users/curriculum` | Sí | Obtiene el JSON del curriculum del usuario autenticado. |
| `saveCurriculum` | PUT | `/api/users/curriculum` | Sí | Upsert del curriculum (crea si no existe, actualiza si existe). |

#### jobController.js

| Función | Método | Ruta | Auth | Descripción |
|---|---|---|---|---|
| `list` | GET | `/api/jobs` | No | Lista empleos con filtros: `category`, `location`, `mode`, `search`. |
| `detail` | GET | `/api/jobs/:id` | No | Detalle completo de un empleo. |
| `create` | POST | `/api/jobs` | COMPANY_* | Crear empleo. El autor se asigna desde `req.user.id`. |
| `update` | PUT | `/api/jobs/:id` | Autor/Admin | Actualizar empleo (solo el autor o admin). |
| `delete` | DELETE | `/api/jobs/:id` | Autor/Admin | Eliminar empleo. |

**Filtros de listado:**
- `category`: Igualdad exacta
- `location`: Búsqueda parcial insensible
- `mode`: Igualdad exacta (REMOTE, HYBRID, ONSITE)
- `search`: Búsqueda en título y empresa (OR)

#### courseController.js

Misma estructura que jobController pero para cursos. Filtros: `category`, `level`, `search`.

#### applicationController.js

| Función | Método | Ruta | Auth | Descripción |
|---|---|---|---|---|
| `create` | POST | `/api/applications` | CANDIDATE | Postularse a un empleo. Error 409 si ya existe. |
| `myApplications` | GET | `/api/applications/my` | CANDIDATE | Lista las postulaciones del usuario autenticado. |
| `jobApplications` | GET | `/api/applications/job/:jobId` | Autor/Admin | Lista postulaciones de un empleo específico. |
| `updateStatus` | PUT | `/api/applications/:id/status` | Autor/Admin | Cambiar estado (PENDING, ACCEPTED, REJECTED). |
| `cancel` | DELETE | `/api/applications/:id` | CANDIDATE | Cancelar postulación propia. |

#### courseApplicationController.js

| Función | Método | Ruta | Auth | Descripción |
|---|---|---|---|---|
| `create` | POST | `/api/course-applications` | CANDIDATE | Inscribirse en un curso. Error 409 si ya existe. |
| `myApplications` | GET | `/api/course-applications/my` | CANDIDATE | Lista inscripciones del usuario. |
| `cancel` | DELETE | `/api/course-applications/:id` | CANDIDATE | Cancelar inscripción propia. |

#### adminController.js

Todas las rutas requieren `authMiddleware` + `adminMiddleware`.

| Función | Ruta | Descripción |
|---|---|---|
| `getDashboardStats` | GET `/api/admin/dashboard` | Totales, usuarios por rol, aplicaciones por estado, actividad reciente (30 días) |
| `getAllUsers` | GET `/api/admin/users?role&search&page&limit` | Lista paginada de usuarios |
| `getUserDetails` | GET `/api/admin/users/:id` | Detalle completo con empleos, cursos y aplicaciones |
| `updateUserRole` | PUT `/api/admin/users/:id/role` | Cambiar rol (no permite auto-cambio) |
| `deleteUserAsAdmin` | DELETE `/api/admin/users/:id` | Eliminar usuario (no auto-eliminación) |
| `getAllJobs` | GET `/api/admin/jobs` | Empleos con autor y conteo de aplicaciones |
| `updateJobAsAdmin` | PUT `/api/admin/jobs/:id` | Actualizar cualquier empleo (whitelist de campos) |
| `deleteJobAsAdmin` | DELETE `/api/admin/jobs/:id` | Eliminar cualquier empleo |
| CRUD Cursos | GET/PUT/DELETE `/api/admin/courses/...` | Análogo a empleos |
| `getAllApplications` | GET `/api/admin/applications` | Todas las postulaciones |
| `updateApplicationStatusAsAdmin` | PUT `/api/admin/applications/:id/status` | Cambiar estado de cualquier aplicación |

### 3.7 Rutas

Cada archivo en `backend/src/routes/` define los endpoints y encadena los middleware necesarios:

```javascript
// Ejemplo de userRoutes.js
router.post('/register', authLimiter, registerRules, userController.register);
router.post('/login', authLimiter, loginRules, userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

router.get('/profile/me', authMiddleware, (req, res) => res.json(req.user));
router.post('/logout', authMiddleware, userController.logout);
router.get('/curriculum', authMiddleware, userController.getCurriculum);
router.put('/curriculum', authMiddleware, userController.saveCurriculum);
router.get('/session-stats', authMiddleware, userController.sessionStats);
```

### 3.8 Servicio de email

**Archivo:** `backend/src/services/emailService.js`

Usa **Resend** para enviar emails transaccionales. Si `RESEND_API_KEY` no está configurada, los emails se omiten silenciosamente.

| Función | Cuándo | Destinatario |
|---|---|---|
| `sendWelcome(to, name)` | Registro | Nuevo usuario |
| `sendApplicationReceived(to, jobTitle, applicantName)` | Postulación | Empresa que publicó el empleo |
| `sendPasswordReset(to, name, resetUrl)` | Solicitar reset | Usuario que lo solicita |

### 3.9 Seguridad

- **JWT:** Tokens firmados con `JWT_SECRET`, expiración configurable (7 días por defecto)
- **bcrypt:** 10 rondas de salt para hash de contraseñas
- **Rate limiting:** 30 requests/15 min en login y registro
- **CORS dinámico:** Solo orígenes explícitamente permitidos (incluye wildcards `*.vercel.app`)
- **Validación de entrada:** express-validator en todos los endpoints de escritura
- **Autorización:** Middleware de owner y admin para proteger recursos
- **Tokens criptográficos:** `crypto.randomBytes(32)` para reset de contraseña
- **Sanitización:** Los campos de actualización en admin tienen whitelist explícita

### 3.10 Seed de datos demo

**Archivo:** `backend/prisma/seed.js`

Crea datos de prueba usando `upsert` para ser ejecutable múltiples veces sin duplicados.

**Usuarios (9):**

| Email | Contraseña | Nombre | Rol |
|---|---|---|---|
| `admin@laboria.com` | `admin123` | Admin Laboria | ADMIN |
| `carlos@email.com` | `carlos123` | Carlos García López | CANDIDATE |
| `maria@email.com` | `maria123` | María Rodríguez Pérez | CANDIDATE |
| `javier@email.com` | `javier123` | Javier Martínez Ruiz | CANDIDATE |
| `info@techcorp.com` | `techcorp123` | TechCorp Solutions | COMPANY_EMPLOYEES |
| `info@edunext.com` | `edunext123` | EduNext Academy | COMPANY_STUDENTS |
| `info@innovagroup.com` | `innova123` | InnovaGroup | COMPANY_HYBRID |
| `info@datasoft.com` | `datasoft123` | DataSoft Technologies | COMPANY_EMPLOYEES |
| `info@cursosalfa.com` | `alfa123` | Cursos Alfa | COMPANY_STUDENTS |

**Empleos (8):** Desarrollador Full Stack, Data Scientist Senior, Diseñador UX/UI, DevOps Engineer, Profesor de Programación Web, Analista de Ciberseguridad, Técnico de Marketing Digital, Coordinador de Formación Online.

**Cursos (8):** React desde Cero, Node.js Avanzado, Python para Data Science, Diseño UX/UI Profesional, Ciberseguridad Práctica, Cloud Computing con AWS, Marketing Digital Completo, Inglés Técnico para TI.

**Postulaciones (5):** Carlos García y María Rodríguez postulados a diversos empleos.

### 3.11 Generador de datos españoles

**Archivo:** `backend/scripts/generateSpanishData.js`

Genera datos realistas para el mercado español y los escribe en `frontend/src/data/jobs.json` y `frontend/src/data/courses.json`.

**Qué genera:**
- **350 empleos** distribuidos entre las 50 provincias españolas, 14 sectores económicos (Tecnología, Salud, Educación, Finanzas, Marketing, Ingeniería, etc.)
- **150 cursos** de 26 plataformas/proveedores (Coursera, Udemy, Google Actívate, universidades españolas, etc.)

**Cómo ejecutar:**

```bash
cd backend
npm run generate:spanish-data
```

**Flags opcionales:** `--seed` (genera JSON + siembra BD), `--db-only` (solo siembra BD).

Cada empleo incluye: título, empresa, ubicación, salario realista, descripción, requisitos, beneficios, modalidad, sector, fecha de publicación.  
Cada curso incluye: título, plataforma, nivel, duración, formato, precio, certificación, instructor, valoración, número de estudiantes.

### 3.12 Tests del backend

18 tests en 4 archivos (Vitest). Usan mocking de `PrismaClient` para tests unitarios:

| Archivo | Descripción |
|---|---|
| `userController.test.js` | Registro (éxito, duplicado), login (inválido, wrong password), update (not found), delete (not found) |
| `jobController.test.js` | CRUD de empleos: list, detail, create, update, delete, error handling |
| `courseController.test.js` | CRUD de cursos: list, detail, create, update, delete, error handling |
| `authMiddleware.test.js` | Sin header, token inválido, usuario no encontrado, token válido |

```bash
cd backend
npx vitest run       # Ejecutar una vez
npx vitest           # Modo watch
```

---

## 4. Frontend

### 4.1 Entry point y configuración Vite

**Archivo:** `frontend/src/main.jsx`

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

**Vite config (`frontend/vite.config.js`):**

- Plugin React para HMR y transform JSX
- Servidor de desarrollo en puerto 5173
- Proxy para APIs externas (evita CORS en desarrollo):
  - `/api/jcyl` → data.opendatasoft.com
  - `/api/serpapi` → serpapi.com
  - `/api/jobicy` → jobicy.com
  - `/api/himalayas` → himalayas.app
  - `/api/remotive` → remotive.com
  - `/api/arbeitnow` → arbeitnow.com
- Build output en `dist/` con sourcemaps
- Base path configurable via `VITE_BASE_PATH` (para GitHub Pages)

**Variables de entorno:**

| Archivo | `VITE_API_URL` |
|---|---|
| `frontend/.env` (desarrollo) | `http://localhost:3000` |
| `frontend/.env.production` | `https://laboria-backend.onrender.com` |

### 4.2 Routing (HashRouter)

**Archivo:** `frontend/src/App.jsx`

Usa `HashRouter` para evitar problemas con servidores estáticos (las rutas se representan con `#` en la URL).

**Rutas públicas:**

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | Home | Landing page con hero, empleos/cursos destacados, estadísticas |
| `/empleos` | JobSearchPage | Búsqueda con filtros (categoría, ubicación, modalidad) |
| `/empleos/:id` | JobDetailPage | Detalle + botón "Aplicar" |
| `/cursos` | CourseSearchPage | Búsqueda con filtros (categoría, nivel) |
| `/cursos/:id` | CourseDetailPage | Detalle + botón "Inscribirme" |
| `/acerca-de` | AboutPage | Información de la plataforma |
| `/faq` | FAQPage | Preguntas frecuentes |
| `/login` | LoginPage | Inicio de sesión |
| `/registro` | RegisterPage | Registro de nuevo usuario |
| `/olvide-mi-contrasena` | ForgotPasswordPage | Solicitar restablecimiento |
| `/reset-password` | ResetPasswordPage | Restablecer con token |

**Rutas protegidas (por rol):**

| Ruta | Componente | Roles permitidos |
|---|---|---|
| `/perfil/candidato` | CandidateProfilePage | CANDIDATE |
| `/perfil/empresa` | CompanyProfilePage | COMPANY_* |
| `/panel` | DashboardPage | Cualquier autenticado |
| `/configuracion` | SettingsPage | Cualquier autenticado |
| `/publicar-oferta` | PostJobPage | COMPANY_EMPLOYEES, COMPANY_HYBRID |
| `/mis-ofertas` | MyJobsPage | COMPANY_EMPLOYEES, COMPANY_HYBRID |
| `/publicar-curso` | PostCoursePage | COMPANY_STUDENTS, COMPANY_HYBRID |
| `/mis-cursos` | MyCoursesPage | COMPANY_STUDENTS, COMPANY_HYBRID |
| `/mis-aplicaciones` | MyApplicationsPage | CANDIDATE |
| `/cursos-guardados` | SavedCoursesPage | CANDIDATE |
| `/curriculum` | CurriculumPage | CANDIDATE |

**Rutas de administración (ProtectedAdminRoute, solo ADMIN):**

`/admin`, `/admin/users`, `/admin/jobs`, `/admin/courses`, `/admin/applications`, `/admin/api-status`

### 4.3 Contexto de autenticación

**Archivo:** `frontend/src/context/AuthContext.jsx`

Provee estado global de autenticación mediante React Context.

**Estado:**

```javascript
const [user, setUser] = useState(null);    // { id, email, name, role }
const [loading, setLoading] = useState(true);
```

**Funciones expuestas via `useAuth()` hook:**

| Función | Descripción |
|---|---|
| `login(email, password)` | POST /api/users/login → guarda token + user en localStorage |
| `register(data)` | POST /api/users/register → igual que login |
| `logout()` | Async: llama POST /api/users/logout → limpia localStorage |
| `updateProfile(profileData)` | PUT /api/users/profile/me → actualiza estado y localStorage |
| `changePassword(current, new)` | POST /api/users/change-password |
| `deleteAccount()` | DELETE /api/users/account → limpia todo (token, user, profile, curriculum) |
| `isCandidate()` | `user.role === 'CANDIDATE'` |
| `isCompanyEmployees()` | `user.role === 'COMPANY_EMPLOYEES'` |
| `isCompanyStudents()` | `user.role === 'COMPANY_STUDENTS'` |
| `isCompanyHybrid()` | `user.role === 'COMPANY_HYBRID'` |
| `isAdmin()` | `user.role === 'ADMIN'` |
| `isAnyCompany()` | Cualquier rol COMPANY_* |
| `isAuthenticated` | `!!user` |

**Inicialización:** Al cargar la app, lee `token` y `user` de localStorage. Si existen, restaura la sesión y ejecuta `seedProfile()` para crear el perfil inicial en localStorage si no existe.

### 4.4 Servicios API

**Cliente HTTP base:** `frontend/src/services/api.js`

Usa Fetch API nativa (no axios). Incluye:
- Header `Authorization: Bearer <token>` automático
- Manejo de errores con status code
- Auto-logout si recibe 401 (limpia localStorage y redirige a /login)
- Métodos: `api.get()`, `api.post()`, `api.put()`, `api.delete()`

**Servicios específicos:**

| Servicio | Funciones clave |
|---|---|
| `authService.js` | `login`, `register`, `logout`, `getProfile`, `updateProfile`, `deleteAccount`, `changePassword`, `forgotPassword`, `resetPassword` |
| `jobService.js` | `list`, `detail`, `create`, `update`, `delete` |
| `courseService.js` | `list`, `detail`, `create`, `update`, `delete` |
| `applicationService.js` | `create`, `myApplications`, `jobApplications`, `updateStatus`, `cancel` |
| `courseApplicationService.js` | `create`, `myApplications`, `cancel` |
| `curriculumService.js` | `getCurriculum`, `updateCurriculum` |
| `sessionService.js` | `logout`, `getSessionStats` |
| `adminService.js` | `getDashboardStats`, `getAllUsers`, CRUD de usuarios/empleos/cursos/aplicaciones |

### 4.5 Componentes compartidos

#### Navbar (`frontend/src/components/Navbar/Navbar.jsx`)

Barra de navegación adaptable (menú hamburguesa en móvil). Muestra diferentes opciones según el estado de autenticación:

| Estado | Enlaces |
|---|---|
| No autenticado | Inicio, Empleos, Cursos, Acerca de, FAQ, Iniciar Sesión, Registrarse |
| CANDIDATE | Inicio (→/perfil/candidato), Búsqueda empleo, Búsqueda cursos, CV, Postulaciones, Configuración, Cerrar Sesión |
| COMPANY_* | Inicio (→/perfil/empresa), Búsqueda empleo, Búsqueda cursos, Configuración, Cerrar Sesión |
| ADMIN | Lo mismo que COMPANY + acceso al panel de admin |

#### ProtectedRoute (`frontend/src/components/ProtectedRoute.jsx`)

```jsx
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};
```

#### SessionDurationChart (`frontend/src/components/SessionDurationChart.jsx`)

Gráfico de barras usando **recharts** que muestra la duración promedio de sesión de candidatos vs empresas. Obtiene datos de `GET /api/users/session-stats`. Renderizado en el Dashboard (`/panel`).

#### CookieConsent

Banner de cookies GDPR que aparece hasta que el usuario acepta.

### 4.6 Páginas públicas

#### Home (`/`)

Landing page con:
- Hero section con título y botones CTA
- Secciones de empleos y cursos destacados
- Características de la plataforma
- Estadísticas (usuarios, empleos, cursos)
- Llamada a la acción final

#### JobSearchPage (`/empleos`)

Listado de empleos con filtros:
- Categoría (dropdown)
- Ubicación (texto)
- Modalidad (REMOTE/HYBRID/ONSITE)
- Búsqueda por texto (título + empresa)

Usa el hook `useSearch` para manejar filtros y debounce.

#### CourseSearchPage (`/cursos`)

Análogo a JobSearchPage pero para cursos. Filtros: categoría, nivel, búsqueda.

#### JobDetailPage / CourseDetailPage (`/empleos/:id`, `/cursos/:id`)

Vista detallada con toda la información del empleo/curso. Botón de "Aplicar" o "Inscribirme" para candidatos autenticados.

#### LoginPage / RegisterPage

Formularios de autenticación. Login incluye enlace a "Olvidé mi contraseña".

#### ForgotPasswordPage / ResetPasswordPage

Flujo de recuperación de contraseña en dos pasos: solicitar email → recibir enlace → ingresar nueva contraseña.

### 4.7 Páginas protegidas

#### CandidateProfilePage (`/perfil/candidato`)

Muestra el perfil del candidato con estadísticas (empleos aplicados, cursos inscritos, etc.). Ya no incluye "Acciones rápidas" — la edición de perfil se hace desde Configuración.

#### CompanyProfilePage (`/perfil/empresa`)

Perfil de empresa con estadísticas y gestión de empleos/cursos publicados. Tampoco incluye "Acciones rápidas".

#### DashboardPage (`/panel`)

Panel de control accesible para cualquier usuario autenticado. Incluye el `SessionDurationChart` con datos de duración de sesiones.

#### SettingsPage (`/configuracion`)

Configuración centralizada del perfil:
- Edición de datos personales (nombre, email, teléfono, ubicación)
- Campos extendidos: bio, experiencia, expectativa salarial, preferencia de modalidad
- Enlaces sociales: LinkedIn, GitHub, portfolio
- Cambio de contraseña
- Eliminación de cuenta (con confirmación)

Reemplaza al antiguo `EditProfileModal` que se eliminó de las páginas de perfil.

#### CurriculumPage (`/curriculum`)

Gestión completa del currículum vitae:
- Experiencia laboral (empresa, puesto, fechas, descripción)
- Educación (institución, título, campo, fechas)
- Habilidades (nombre, nivel)
- Proyectos
- Idiomas (idioma, nivel)

**Persistencia automática:** Cada add/edit/delete llama a `persistCurriculum()` que guarda simultáneamente en la API (`PUT /api/users/curriculum`) y en `localStorage` como respaldo.

#### MyApplicationsPage (`/mis-aplicaciones`)

Muestra todas las postulaciones del candidato con tabs para alternar entre:
- Postulaciones a empleos (desde `Application`)
- Inscripciones a cursos (desde `CourseApplication`)

### 4.8 Páginas de administración

Todas bajo `/admin/*` y protegidas por `ProtectedAdminRoute`. Incluyen:

- **AdminDashboard:** Estadísticas del sistema (totales, usuarios por rol, actividad reciente)
- **AdminUsers:** CRUD de usuarios con búsqueda y paginación
- **AdminJobs:** CRUD de empleos
- **AdminCourses:** CRUD de cursos
- **AdminApplications:** Gestión de postulaciones
- **ApiStatusPage:** Estado de las APIs externas

### 4.9 Estrategia de perfil en localStorage

**Problema original:** El backend solo almacena `name` y `email` en el modelo User. Los campos extendidos del perfil (teléfono, bio, habilidades, linkedin, etc.) no tienen modelo en la BD.

**Solución:** Almacenar el perfil extendido en `localStorage` bajo la clave `profile_{userId}`.

**Flujo:**

```
Login/Registro → AuthContext.handleSetUser()
  └─ seedProfile(user)
     └─ ¿Existe profile_{userId} en localStorage?
        ├─ Sí → no hacer nada
        └─ No → crear perfil inicial con name/email

SettingsPage (guardar)
  ├─ Guarda TODOS los campos en localStorage (profile_{userId})
  └─ Envía { name, email } a PUT /users/profile/me (backend)

Páginas de perfil
  └─ Lee de localStorage (profile_{userId}) con fallback a user.name
```

**Limitación:** Los datos solo persisten en el navegador. Si el usuario cambia de dispositivo, pierde los datos extendidos.

### 4.10 Datos estáticos españoles

Los archivos `frontend/src/data/jobs.json` y `frontend/src/data/courses.json` contienen datos realistas generados por `backend/scripts/generateSpanishData.js`.

| Archivo | Cantidad | Cobertura |
|---|---|---|
| `jobs.json` | 350 empleos | 50 provincias, 14 sectores |
| `courses.json` | 150 cursos | 26 plataformas/proveedores |

Estos datos se usan como contenido principal de la plataforma. El frontend los lee directamente como JSON estático (no requieren backend).

### 4.11 External API proxying

En desarrollo, Vite redirige llamadas a APIs externas a través de su proxy configurado en `vite.config.js` para evitar CORS.

En producción, Vercel hace lo mismo mediante `rewrites` en `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/jcyl/(.*)", "destination": "https://data.opendatasoft.com/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

APIs externas soportadas: OpenDataSoft (JCYL), Jobicy, Himalayas, Remotive, Arbeitnow, SerpAPI, Khan Academy.

### 4.12 Tests del frontend

57 tests en 8 archivos (Vitest + Testing Library + jsdom):

| Archivo | Tests |
|---|---|
| `App.test.jsx` | Renderizado, rutas, footer |
| `Home.test.jsx` | Secciones, botones, estadísticas |
| `LoginPage.test.jsx` | Formulario, validación |
| `RegisterPage.test.jsx` | Formulario, roles |
| `JobSearchPage.test.jsx` | Renderizado, filtros, búsqueda |
| `CourseSearchPage.test.jsx` | Renderizado, filtros, búsqueda |
| `Navbar.test.jsx` | Navegación, enlaces |
| `AuthContext.test.jsx` | Contexto de autenticación |

```bash
cd frontend
npx vitest run       # Una vez
npx vitest           # Modo watch
```

---

## 5. Despliegue

### 5.1 Frontend en Vercel

- Conectado al repositorio de GitHub
- Build command: `cd frontend && npm install && npm run build`
- Output directory: `frontend/dist`
- Variables de entorno: `VITE_API_URL`, `VITE_BASE_PATH`
- `vercel.json` define rewrites para APIs externas y SPA routing

### 5.2 Backend en Render

- Blueprint definido en `render.yaml`
- Servicio web `laboria-backend` con PostgreSQL integrado
- Build command: `cd backend && npm install && npm run build`
- Start command: `cd backend && npm start`
- Variables de entorno: `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `CORS_ORIGINS`, `FRONTEND_URL`

**Seed en producción:** Ejecutar desde Render Dashboard → Shell: `cd backend && npm run seed`

---

## 6. Usuarios demo

Ver `USUARIOS_DEMO.md` en la raíz del proyecto para una tabla imprimible con todas las cuentas de prueba.

Resumen rápido:

| Email | Contraseña | Rol |
|---|---|---|
| `admin@laboria.com` | `admin123` | ADMIN |
| `carlos@email.com` | `carlos123` | CANDIDATE |
| `maria@email.com` | `maria123` | CANDIDATE |
| `javier@email.com` | `javier123` | CANDIDATE |
| `info@techcorp.com` | `techcorp123` | COMPANY_EMPLOYEES |
| `info@edunext.com` | `edunext123` | COMPANY_STUDENTS |
| `info@innovagroup.com` | `innova123` | COMPANY_HYBRID |
| `info@datasoft.com` | `datasoft123` | COMPANY_EMPLOYEES |
| `info@cursosalfa.com` | `alfa123` | COMPANY_STUDENTS |
