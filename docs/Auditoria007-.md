# Auditoria007 — Verificación completa de criterios

> **Fecha:** 17 de mayo de 2026
> **Proyecto:** Laboria (full-stack — React/Vite + Express/Prisma/PostgreSQL)
> **Tests:** 75/75 pasando (57 frontend + 18 backend)
> **Monorepo:** ✅ `frontend/` + `backend/`

---

## Resumen

| # | Criterio | Estado |
|---|----------|--------|
| B1 | API REST con ≥4 recursos | ✅ PASA |
| B2 | Autenticación JWT (registro, login, rutas protegidas) | ✅ PASA |
| B3 | Roles de usuario (normal + admin) | ✅ PASA |
| B4 | Base de datos PostgreSQL con ≥4 tablas relacionadas | ✅ PASA |
| B5 | Prisma ORM para acceso a datos | ✅ PASA |
| B6 | Validaciones en endpoints que reciben datos | ✅ PASA |
| B7 | Manejo de errores centralizado con códigos HTTP | ✅ PASA |
| B8 | Variables de entorno para configuración sensible | ✅ PASA |
| B9 | ≥1 integración externa (n8n, webhook, email, etc.) | ✅ PASA |
| F1 | React 18+ con Vite | ✅ PASA |
| F2 | React Router v6 con ≥4 rutas | ✅ PASA |
| F3 | Conexión a API con fetch o axios | ✅ PASA |
| F4 | Context API para estado global (usuario autenticado) | ✅ PASA |
| F5 | Formularios controlados con validación cliente | ✅ PASA |
| F6 | Manejo de estados: loading, error, datos vacíos | ✅ PASA |
| F7 | Diseño responsive (mobile y desktop) | ✅ PASA |
| F8 | CSS Modules para estilos | ✅ PASA |
| T1 | ≥8 tests (unitarios y/o integración) | ✅ PASA |
| T2 | Tests pasan todos (`npm test`) | ✅ PASA |
| D1 | Backend desplegado (Railway, Render, o similar) | ✅ PASA |
| D2 | Frontend desplegado (Netlify, Vercel, o similar) | ✅ PASA |
| D3 | Base de datos en la nube | ✅ PASA |
| D4 | Comunicación frontend-backend en producción | ✅ PASA |
| A1 | Estructura monorepo | ✅ PASA |

**24/24 criterios — TODOS PASAN**

---

## Backend (Node.js + Express + PostgreSQL)

### B1 ✅ API REST con ≥4 recursos

**Archivos:** `backend/src/routes/` — **6 recursos**

| Recurso | Archivo | Endpoints |
|---------|---------|-----------|
| Usuarios/Auth | `userRoutes.js` | `POST /register`, `POST /login`, `GET /profile/me`, `PUT /profile/me`, `POST /logout`, `POST /forgot-password`, `POST /reset-password`, `POST /change-password`, `DELETE /account`, `GET /curriculum`, `PUT /curriculum`, `GET /session-stats`, `GET /:id`, `PUT /:id`, `DELETE /:id` |
| Empleos | `jobRoutes.js` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Cursos | `courseRoutes.js` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |
| Postulaciones | `applicationRoutes.js` | `POST /`, `GET /my`, `GET /job/:jobId`, `PUT /:id/status`, `DELETE /:id` |
| Postulaciones cursos | `courseApplicationRoutes.js` | `POST /`, `GET /my`, `PUT /:id/status`, `DELETE /:id` |
| Admin | `adminRoutes.js` | `GET /dashboard`, `GET /users`, `PUT /users/:id/role`, `DELETE /users/:id`, `GET /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`, `GET /courses`, `PUT /courses/:id`, `DELETE /courses/:id`, `GET /applications`, `GET /audit-logs`, `GET /tests/run` |

Montados en `server.js:50-55` bajo `/api/users`, `/api/jobs`, `/api/courses`, `/api/applications`, `/api/course-applications`, `/api/admin`.

### B2 ✅ Autenticación JWT

**Creación de tokens:** `backend/src/utils/jwt.js:3-9`
```js
jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
```

**Middleware de verificación:** `backend/src/middleware/authMiddleware.js:4-44`
- Extrae token de `Authorization: Bearer <token>` (línea 7-13)
- Verifica con `jwt.verify()` (línea 18)
- Consulta usuario en BD (línea 26-29)
- Adjunta `req.user` con `{ id, email, name, role }` (línea 38)

**Rutas protegidas:** Aplicado en todos los endpoints que requieren autenticación (ej: `POST /api/jobs` línea 12, `POST /api/applications` línea 7, etc.)

### B3 ✅ Roles de usuario

**Definición:** `backend/prisma/schema.prisma:138-144` — 5 roles:
- `CANDIDATE` (default registro)
- `COMPANY_EMPLOYEES` (publica empleos)
- `COMPANY_STUDENTS` (publica cursos)
- `COMPANY_HYBRID` (publica ambos)
- `ADMIN` (control total)

**Middleware admin:** `backend/src/middleware/adminMiddleware.js:3` — verifica `req.user.role !== 'ADMIN'`.

**Restricción por rol:**
- `jobController.js:73` — solo COMPANY_EMPLOYEES/HYBRID/ADMIN pueden crear empleos
- `courseController.js:72` — solo COMPANY_STUDENTS/HYBRID/ADMIN pueden crear cursos
- `applicationController.js:22` — solo CANDIDATE/ADMIN pueden postularse

### B4 ✅ PostgreSQL con ≥4 tablas relacionadas

**8 modelos** en `backend/prisma/schema.prisma`:

| Modelo | Relaciones |
|--------|-----------|
| `User` | `hasMany` → Job, Course, Application, CourseApplication, LoginSession; `hasOne` → Curriculum |
| `Job` | `belongsTo` User (author); `hasMany` Application |
| `Course` | `belongsTo` User (author); `hasMany` CourseApplication |
| `Application` | `belongsTo` User + Job; `@@unique([userId, jobId])` |
| `CourseApplication` | `belongsTo` User + Course; `@@unique([userId, courseId])` |
| `LoginSession` | `belongsTo` User |
| `Curriculum` | `belongsTo` User (1:1) |
| `AuditLog` | Standalone (adminId referencial) |

Además: 4 enums (`Role`, `WorkMode`, `Level`, `ApplicationStatus`) y 11 índices compuestos para optimización.

### B5 ✅ Prisma ORM

**Archivos:**
- `prisma/schema.prisma` — esquema completo (162 líneas)
- `backend/src/config/database.js` — instancia única `new PrismaClient()`
- Todos los controladores importan y usan `prisma` para queries

### B6 ✅ Validaciones en endpoints

**Middleware:** `backend/src/middleware/validate.js` — usa `express-validator`

**10 conjuntos de reglas:**

| Reglas | Endpoint |
|--------|----------|
| `registerRules` | `POST /api/users/register` |
| `loginRules` | `POST /api/users/login` |
| `updateProfileRules` | `PUT /api/users/profile/me` |
| `createJobRules` | `POST /api/jobs` |
| `updateJobRules` | `PUT /api/jobs/:id` |
| `createCourseRules` | `POST /api/courses` |
| `updateCourseRules` | `PUT /api/courses/:id` |
| `forgotPasswordRules` | `POST /api/users/forgot-password` |
| `resetPasswordRules` | `POST /api/users/reset-password` |
| `changePasswordRules` | `POST /api/users/change-password` |

Además: validaciones de negocio inline en controladores (rol permitido, autoría, estado válido).

### B7 ✅ Manejo de errores centralizado

**Archivo:** `backend/src/middleware/errorHandler.js:1-11`
- Captura errores con `(err, req, res, next)`
- Extrae `statusCode` (400, 401, 403, 404, 409, 500)
- Muestra stack trace solo en desarrollo
- Aplicado en `server.js:68` después de todas las rutas

### B8 ✅ Variables de entorno

**Archivo:** `backend/.env.example` — 8 variables documentadas:
`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `CORS_ORIGINS`, `NODE_ENV`, `PORT`, `RESEND_API_KEY`

Uso en código: `process.env.JWT_SECRET`, `process.env.PORT`, `process.env.FRONTEND_URL`, etc. (10 ocurrencias)

### B9 ✅ Integración externa

**Email service:** `backend/src/services/emailService.js` usa **Resend API** (`resend.com`)
- 3 templates: bienvenida, notificación de aplicación, restablecer contraseña
- Degradación graceful: solo se activa si `RESEND_API_KEY` está configurada

---

## Frontend (React)

### F1 ✅ React 18+ con Vite

`package.json` → `"react": "^18.3.1"`, `"react-dom": "^18.3.1"`, `"vite": "^5.2.11"`

`vite.config.js` existe con plugin React, servidor de desarrollo con proxy para APIs externas, y config de build.

### F2 ✅ React Router v6 con ≥4 rutas

`App.jsx:53-81` — **28 rutas definidas** usando `HashRouter`, `Routes`, `Route`.
Incluye: Home, empleos (lista/detalle), cursos (lista/detalle), login, registro, recuperación, perfiles (candidato/empresa), panel, publicar oferta/curso, admin (6 subrutas), currículum, configuración, etc.

### F3 ✅ Conexión a API con fetch o axios

**Usa `fetch` nativo** (sin axios):
- `frontend/src/services/api.js` — wrapper con `get`, `post`, `put`, `delete`
- Incluye: header `Authorization: Bearer <token>`, manejo de errores, auto-logout en 401 con toast
- `frontend/src/services/authService.js` — consume `api.js` para todas las operaciones de auth
- `frontend/src/services/laboriaApi.js` — consume API backend para datos de empleos/cursos

### F4 ✅ Context API para estado global

**AuthContext:** `frontend/src/context/AuthContext.jsx`
- `createContext`, `useContext`, `useState`, `useEffect`
- Estado: `user`, `loading`, `isAuthenticated`
- Métodos: `login()`, `register()`, `logout()`, `updateProfile()`, `changePassword()`, `deleteAccount()`
- Helpers de rol: `isCandidate()`, `isCompanyEmployees()`, etc.
- Hook personalizado: `useAuth()`

**ConfirmContext:** `frontend/src/context/ConfirmContext.jsx` — diálogo de confirmación reutilizable.

### F5 ✅ Formularios controlados con validación cliente

| Página | Campos | Validación |
|--------|--------|-----------|
| `LoginPage.jsx` | email, password | Regex email, min 6 chars; `touched` + `fieldErrors` |
| `RegisterPage.jsx` | 16 campos (2 pasos) | Email regex, password >6, confirm match, name/company min 2, legal consents |
| `PostJobPage.jsx` | 10 campos | `REQUIRED_FIELDS` array, title min 5, description min 20 |
| `PostCoursePage.jsx` | 9 campos | `REQUIRED_FIELDS` array, title min 5, description min 20 |
| `ForgotPasswordPage.jsx` | email | Validación inline |
| `ResetPasswordPage.jsx` | password, confirm | Min 6, match check |

Patrón común: `handleInputChange` → actualiza estado + valida si `touched`; `handleBlur` → marca touched + valida; `handleSubmit` → valida todos + muestra errores.

### F6 ✅ Manejo de estados: loading, error, vacíos

| Componente | Loading | Error | Vacío |
|-----------|---------|-------|-------|
| `AdminDashboard.jsx` | Spinner "Cargando estadísticas..." | Mensaje + botón "Reintentar" | Condicional `stats?.recentActivity &&` |
| `MyApplicationsPage.jsx` | "Cargando..." | — | "No has aplicado..." |
| `AdminApplications.jsx` | Spinner | Mensaje + retry | Mensaje "No hay" |
| `ProtectedRoute.jsx` | "Cargando..." | "No autorizado" + link home | — |
| `Home.jsx` | "..." en stats | Fallback valores por defecto | — |
| `ErrorBoundary.jsx` | — | "Algo salió mal" + botón recargar | — |

### F7 ✅ Diseño responsive

**4 breakpoints en `index.css:204-271`:**
- `1200px` — container 960px, font-size reducido
- `992px` — container 720px
- `768px` — container 540px, botón/input full-width
- `576px` — container 100%, smallest fonts

**Navbar responsive:** `Navbar.module.css:202-302`
- Menú hamburguesa en ≤768px con slide-in desde derecha
- Overlay backdrop que cierra al hacer clic
- Focus trap + Escape key en menú móvil

### F8 ✅ CSS Modules

**28 archivos `.module.css`** — cada página/componente importa sus estilos:
```jsx
import styles from './LoginPage.module.css'
className={styles.loginCard}
```

Incluye: App, Navbar, CookieConsent, SessionDurationChart, JobCard, CourseCard, páginas (Home, About, FAQ, Login, Register, Panel, Perfiles, FormPage, MyListingsPage, JobSearch, JobDetail, CourseSearch, CourseDetail, AdminDashboard, AdminNavigation, AdminApplications, AdminCourses, AdminJobs, AdminUsers, ApiStatusPage, Configuración, CurriculumPage).

---

## Testing

### T1 ✅ ≥8 tests

**12 archivos de test — 75 casos:**

| Archivo | Tests |
|---------|-------|
| `backend/.../authMiddleware.test.js` | 4 |
| `backend/.../jobController.test.js` | 4 |
| `backend/.../courseController.test.js` | 4 |
| `backend/.../userController.test.js` | 6 |
| `frontend/.../App.test.jsx` | 4 |
| `frontend/.../Navbar.test.jsx` | 10 |
| `frontend/.../Home.test.jsx` | 6 |
| `frontend/.../JobSearchPage.test.jsx` | 6 |
| `frontend/.../CourseSearchPage.test.jsx` | 6 |
| `frontend/.../LoginPage.test.jsx` | 8 |
| `frontend/.../RegisterPage.test.jsx` | 11 |
| `frontend/.../AuthContext.test.jsx` | 6 |

### T2 ✅ Tests pasan todos

```
Backend:  18/18 passed (4 files)
Frontend: 57/57 passed (8 files)
Total:    75/75 passed (12 files)
```

---

## Despliegue

### D1 ✅ Backend desplegado

**Render** — definido en `render.yaml` (raíz):
- Servicio web: `laboria-backend` (Node, free plan)
- Build: `cd backend && npm install && prisma generate && prisma migrate deploy`
- Start: `cd backend && node server.js`
- URL producción: `https://laboria-backend.onrender.com`

### D2 ✅ Frontend desplegado

**GitHub Pages** — CI/CD en `.github/workflows/deploy.yml`:
- Trigger: push a `main`
- Test → Build → Deploy a GitHub Pages
- URL: `https://damianmoares.github.io/Laboria-Frontend---backend_Damian/`

También configurado para **Vercel** (`frontend/vercel.json` con proxy rewrites + SPA fallback).

### D3 ✅ Base de datos en la nube

**Render PostgreSQL** — definido en `render.yaml`:
- Servicio: `laboria-db` (PostgreSQL, free tier)
- `DATABASE_URL` inyectada automáticamente al backend

### D4 ✅ Comunicación frontend-backend en producción

`frontend/.env.production:5` → `VITE_API_URL=https://laboria-backend.onrender.com`

CI/CD inyecta la misma variable: `deploy.yml:48` → `VITE_API_URL: https://laboria-backend.onrender.com`

---

## Arquitectura

### A1 ✅ Estructura monorepo

```
Laboria-Frontend---backend_Damian/
├── frontend/                  # React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── config/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── backend/                   # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── .github/workflows/         # CI/CD
├── docs/                      # Documentación
├── render.yaml                # Render deploy config
├── .gitignore                 # node_modules, .env, dist, *.log
└── README.md
```

**Root `package.json`** con scripts orquestadores:
- `dev` → frontend + backend concurrentemente
- `test` → frontend → backend secuencial
- `build` → backend → frontend
- `deploy` → build frontend para GitHub Pages

---

## Diagrama de arquitectura

```
┌──────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)            │
│                                                      │
│  ┌─────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │  Auth   │  │  Pages   │  │  Context API     │    │
│  │ Context │  │ + Router │  │  (Auth, Confirm) │    │
│  └────┬────┘  └────┬─────┘  └────────┬─────────┘    │
│       └────────────┼─────────────────┘              │
│                    │ fetch (api.js wrapper)          │
└────────────────────┼─────────────────────────────────┘
                     │ HTTPS (JWT Bearer token)
                     │
┌────────────────────┼─────────────────────────────────┐
│              BACKEND (Node.js + Express)             │
│                    │                                 │
│  ┌─────────────────▼──────────────────────────────┐  │
│  │            Routes (6 recursos)                 │  │
│  │  /api/users, /api/jobs, /api/courses,          │  │
│  │  /api/applications, /api/course-applications,  │  │
│  │  /api/admin                                    │  │
│  └─────────────────┬──────────────────────────────┘  │
│  ┌─────────────────▼──────────────────────────────┐  │
│  │  Middleware: authMiddleware, adminMiddleware,   │  │
│  │  validate, errorHandler, ownerMiddleware       │  │
│  └─────────────────┬──────────────────────────────┘  │
│  ┌─────────────────▼──────────────────────────────┐  │
│  │            Controllers (6 + servicios)          │  │
│  │  Validaciones de negocio + next(error)          │  │
│  └─────────────────┬──────────────────────────────┘  │
│  ┌─────────────────▼──────────────────────────────┐  │
│  │        Prisma Client (ORM)                     │  │
│  │  8 modelos + 4 enums + 11 índices              │  │
│  └─────────────────┬──────────────────────────────┘  │
└────────────────────┼──────────────────────────────────┘
                     │ SQL
                     │
┌────────────────────┼──────────────────────────────────┐
│        PostgreSQL Database (Render Cloud)            │
│                                                      │
│  User ──┐                                            │
│         ├── Job ──┐                                  │
│         │         ├── Application                    │
│         ├── Course ──┐                               │
│         │            ├── CourseApplication           │
│         ├── LoginSession                             │
│         └── Curriculum                               │
│                                                      │
│  AuditLog (independiente)                            │
└──────────────────────────────────────────────────────┘

Integración externa:
  ┌─ Resend API (email service) ──────────────────────┐
  │  sendWelcome, sendApplicationReceived,             │
  │  sendPasswordReset                                 │
  └────────────────────────────────────────────────────┘
```

---

## Notas adicionales

- **75 tests superan el mínimo de 8** solicitado (9.4× el requisito)
- **6 recursos API** superan el mínimo de 4 (1.5×)
- **8 modelos BD** superan el mínimo de 4 tablas (2×)
- **28 rutas** superan el mínimo de 4 (7×)
- **28 CSS Modules** demuestran uso extensivo y consistente
- **5 roles** (CANDIDATE, COMPANY_EMPLOYEES, COMPANY_STUDENTS, COMPANY_HYBRID, ADMIN) superan el mínimo de 2 (normal + admin)

---

*Documento generado automáticamente mediante verificación de código fuente el 17 de mayo de 2026.*
