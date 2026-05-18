# Arquitectura del Sistema

> **Documento:** 02-ARQUITECTURA.md  
> **Versión:** 2.0  
> **Fecha:** Mayo 2026

---

## 1. Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18.x |
| Frontend Build | Vite | 5.x |
| Frontend Tests | Vitest + Testing Library | 1.6.x |
| Routing | React Router DOM | 6.x (BrowserRouter) |
| Estado | React Context API | — |
| Estilos | CSS Modules | — |
| Backend | Node.js + Express | 5.x |
| ORM | Prisma | 6.x |
| Base de datos | PostgreSQL | 16 |
| Autenticación | JWT (jsonwebtoken + bcryptjs) | — |
| Email | Resend SDK | — |
| Backend Tests | Vitest | 1.6.x |
| Contenedores | Docker + Docker Compose | — |
| Frontend Hosting | Vercel | — |
| Backend Hosting | Render | — |

---

## 2. Diagrama de arquitectura

```
  +--------------------------------------------------+
  |                   CLIENTE (Browser)               |
  |  React App (Vite build)                          |
  |  Router: BrowserRouter (SPA fallback en Vercel)  |
  +---------------------+----------------------------+
                        |
          HTTP / HTTPS  |  API calls (fetch + JWT)
                        |
  +---------------------v----------------------------+
  |              BACKEND (Express 5)                  |
  |                                                    |
  |  Middleware: helmet, cors, rate-limiter, auth     |
  |                                                    |
  |  +--------+  +--------+  +--------+  +--------+  |
  |  | Users  |  | Jobs   |  | Courses|  | Admin  |  |
  |  +--------+  +--------+  +--------+  +--------+  |
  |  +--------+  +--------+  +--------+  +--------+  |
  |  |  Apps  |  |CourseAp|  |Audit  |  |Health |  |
  |  +--------+  +--------+  +--------+  +--------+  |
  |                                                    |
  +---------------------+----------------------------+
                        |
                  Prisma ORM  |
                        |
  +---------------------v----------------------------+
  |              PostgreSQL 16                        |
  |  7 modelos: User, Job, Course, Application,      |
  |  CourseApplication, Curriculum, LoginSession,    |
  |  AuditLog                                         |
  +--------------------------------------------------+
                        ^
                        | (Vite proxy / Vercel rewrites)
  +---------------------+----------------------------+
  |          APIs EXTERNAS (jobs + courses)           |
  |  RemoteOK, Remotive, Arbeitnow, Jobicy,          |
  |  Himalayas, JCYL, SerpApi, YouTube, Google CSE,  |
  |  Bing, Khan Academy, Coursera, Udemy + RSS feeds |
  +--------------------------------------------------+
```

---

## 3. Patrones y decisiones técnicas

### 3.1 Frontend

| Decisión | Justificación |
|----------|---------------|
| **CSS Modules** | Scoped styles, sin dependencias externas, soporte nativo en Vite |
| **Context API** | Suficiente para auth state; Redux/Zustand sería overkill |
| **Lazy loading + Suspense** | Las 28 rutas se cargan bajo demanda; chunk size controlado |
| **Manual chunks (vendor)** | `react`, `react-dom`, `recharts` en vendor separado |
| **BrowserRouter** | URLs limpias; Vercel ya tiene SPA fallback configurado |
| **Servicios separados** | Cada dominio (auth, jobs, courses, etc.) tiene su propio service |
| **Strategy pattern (normalizeJobDetails)** | 7 normalizadores independientes para cada API externa |

### 3.2 Backend

| Decisión | Justificación |
|----------|---------------|
| **Prisma ORM** | Type-safe queries, migraciones automáticas, schema declarativo |
| **JWT access + refresh** | Access token 15min, refresh token 24h para equilibrio seguridad/UX |
| **Rate limiting** | 3 limitadores: auth (30/15min), write (60/15min), general (100/15min) |
| **Express 5** | Async error handling nativo, router mejorado |
| **Middleware pipeline** | auth -> admin/owner checks según ruta |
| **Servicio de email graceful** | Si no hay RESEND_API_KEY, loggea warning sin bloquear |

### 3.3 Base de datos

| Decisión | Justificación |
|----------|---------------|
| **UUIDs como PK** | Seguridad (no expone orden), escalabilidad distribuida |
| **Enum Role en DB** | Integridad referencial vs string suelto |
| **Índices compuestos** | `userId_jobId` unique en Application evita duplicados |
| **11 índices** | Cubren búsquedas frecuentes (categoría, ubicación, fecha, estado) |
| **AuditLog** | Trazabilidad completa de acciones administrativas |

---

## 4. Flujo de autenticación

```
  +--------+          +--------+          +--------+
  | Client |          | Backend|          |  DB    |
  +--------+          +--------+          +--------+
      |                   |                   |
      | POST /login       |                   |
      | (email+password)  |                   |
      |------------------>|                   |
      |                   | findUnique(User)  |
      |                   |------------------>|
      |                   | user data         |
      |                   |<------------------|
      |                   |                   |
      |                   | bcrypt.compare    |
      |                   | generateToken     |
      |                   | generateRefresh   |
      |                   | create Session    |
      |                   |                   |
      | {accessToken,     |                   |
      |  refreshToken,    |                   |
      |  user}            |                   |
      |<------------------|                   |
      |                   |                   |
      | Almacena en       |                   |
      | localStorage      |                   |
      |                   |                   |
      | GET /profile/me   |                   |
      | Authorization:    |                   |
      | Bearer <token>    |                   |
      |------------------>|                   |
      |                   | verifyToken       |
      |                   | findUnique(User)  |
      |                   |------------------>|
      |                   |<------------------|
      | {user}            |                   |
      |<------------------|                   |
```

---

## 5. Estructura del proyecto

```
Laboria-Frontend---backend_Damian/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Entry con routing
│   │   ├── components/          # 11 componentes compartidos
│   │   ├── pages/               # 30 páginas agrupadas por dominio
│   │   ├── services/            # 13 servicios API
│   │   ├── context/             # 4 contextos (Auth, Confirm, ConexionApi)
│   │   ├── hooks/               # 1 custom hook (useCurriculumSection)
│   │   ├── config/              # 3 configs (api, enums, externalApis)
│   │   ├── data/                # Datos estáticos (jobs, courses, searchData)
│   │   └── utils/               # Utilidades (logger)
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── controllers/         # 6 controladores (845 lines max)
│   │   ├── routes/              # 6 archivos de rutas
│   │   ├── middleware/          # 6 middlewares
│   │   ├── services/            # 2 servicios (audit, email)
│   │   ├── utils/               # 1 util (jwt)
│   │   ├── config/              # 1 config (database singleton)
│   │   └── __tests__/           # 6 archivos de test
│   ├── prisma/
│   │   └── schema.prisma        # 7 modelos, 4 enums, 11 indices
│   └── server.js
├── docker-compose.yml
├── docs/                        # Auditorias y guias
└── Documentacion/               # Documentacion del proyecto
```
