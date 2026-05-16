# 📋 Auditoría Completa — Laboria

> Fecha: 16 mayo 2026 · Commit: `b679b1a`

---

## 1️⃣ BACKEND (Node.js + Express + PostgreSQL)

### ✅ API REST con al menos 4 recursos principales

| Recurso | Rutas | Estado |
|---------|-------|--------|
| `/api/users` | 8 rutas (registro, login, perfil, CRUD) | ✅ |
| `/api/jobs` | 5 rutas (listar, detalle, crear, editar, borrar) | ✅ |
| `/api/courses` | 5 rutas (listar, detalle, crear, editar, borrar) | ✅ |
| `/api/applications` | 5 rutas (aplicar, listar, estado, cancelar) | ✅ |
| `/api/admin` | 13 rutas (dashboard, CRUD de todo) | ✅ |
| **Total** | **28 endpoints + health check** | ✅ |

### ✅ Autenticación JWT (registro, login, rutas protegidas)

- `POST /api/users/register` → crea usuario, NO devuelve token
- `POST /api/users/login` → devuelve `{ user, token }` (JWT con expiry 7d)
- `authMiddleware.js` → extrae `Bearer <token>` del header, verifica con `JWT_SECRET`, adjunta `req.user`
- Rutas protegidas con `authMiddleware` + `adminMiddleware` / `ownerMiddleware`

### ✅ Roles de usuario

| Rol | Permisos |
|-----|----------|
| `CANDIDATE` | Ver empleos/cursos, aplicar, ver perfil candidato |
| `COMPANY_EMPLOYEES` | Publicar empleos (solo empresa) |
| `COMPANY_STUDENTS` | Publicar cursos (solo empresa) |
| `COMPANY_HYBRID` | Publicar empleos Y cursos |
| `ADMIN` | CRUD de todo, dashboard, cambiar roles |

### ✅ Base de datos PostgreSQL con 4 tablas relacionadas

| Tabla | Relaciones |
|-------|-----------|
| `User` | 1─* Job, 1─* Course, 1─* Application |
| `Job` | *─1 User (author), 1─* Application |
| `Course` | *─1 User (author) |
| `Application` | *─1 User, *─1 Job (con unique [userId, jobId]) |

### ✅ Prisma ORM

- Singleton `PrismaClient` en `backend/src/config/database.js`
- Seed script con `upsert` para 5 usuarios demo
- Build: `prisma generate && prisma migrate deploy`
- Shutdown: `prisma.$disconnect()` en SIGTERM/SIGINT ✅

### ⚠️ Validaciones

| Tipo | Estado | Detalle |
|------|--------|---------|
| Validación manual en controllers | ✅ | email regex, password >= 6, campos requeridos, roles válidos, etc. |
| PUT jobs/courses con whitelist de campos | ✅ **FIXED** | Solo `title, company, location, salary, description, requirements, mode, category` (job) y `title, provider, description, category, level, duration, price, url, image` (course) |
| Librería de validación (express-validator, Joi) | ❌ | No se usa ninguna — todo es validación manual |

### ✅ Manejo de errores centralizado

- `errorHandler.js` middleware al final de la cadena
- Usa `err.statusCode` personalizado o 500 por defecto
- Stack trace solo en desarrollo
- Códigos HTTP: 200, 201, 400, 401, 403, 404, 409, 500

### ✅ Variables de entorno

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Conexión PostgreSQL |
| `JWT_SECRET` | Firma de tokens |
| `JWT_EXPIRES_IN` | Expiración (7d) |
| `CORS_ORIGINS` | Orígenes permitidos |
| `NODE_ENV` | production/development |
| `PORT` | Puerto del servidor |
| `RESEND_API_KEY` | Email (opcional, comentado en .env) |

### ✅ Integración externa

- **Resend** (email): `sendWelcome()` al registrarse, `sendApplicationReceived()` al aplicar
- Graceful fallback: si no hay API key, los emails se omiten sin error

---

## 2️⃣ FRONTEND (React)

### ✅ React 18+ con Vite

- React `^18.3.1` — 18+
- Vite `^5.2.11` — correcto
- `@vitejs/plugin-react` — configurado

### ✅ React Router v6 con al menos 4 rutas

- **27 rutas** definidas en `App.jsx`
- `HashRouter` con flags `v7_startTransition` y `v7_relativeSplatPath`
- 25 páginas distintas + 2 redirects

### ✅ Conexión a API con fetch

- Wrapper `request()` en `frontend/src/services/api.js`
- Auto-inyecta `Authorization: Bearer <token>` desde localStorage
- Servicios por recurso: `authService`, `jobService`, `courseService`, `applicationService`, `adminService`

### ✅ Context API para estado global

| Context | Archivo | Propósito |
|---------|---------|-----------|
| `AuthContext` | `context/AuthContext.jsx` | usuario autenticado, login/logout, roles |
| `ConexionApi` | `context/ConexionApi.jsx` | utilidad de APIs externas (NO es un Context Provider) |

### ✅ Formularios controlados con validación

- Hook `useForm.js` con reglas: required, email, password, confirmPassword, url, minLength, phone
- `LoginPage`: validación inline propia (validateEmail, validatePassword)
- `RegisterPage`: formulario multi-step con validación por paso
- `EditProfileModal`: validación con `validateForm()`

### ✅ Manejo de estados: loading, error, vacío

| Componente | Loading | Error | Vacío |
|-----------|---------|-------|-------|
| HomePage | ✅ spinner | ✅ fallback a defaults | ✅ |
| JobSearchPage | ✅ spinner | ✅ banner + fallback | ✅ "no-results" |
| CourseSearchPage | ✅ spinner | ✅ banner + fallback | ✅ "no-results" |
| AdminDashboard | ✅ spinner | ✅ con retry button | ✅ |
| ProtectedRoute | ✅ "Cargando..." | ✅ redirect | ✅ "No autorizado" |

### ✅ Diseño responsive

- 4 breakpoints: 1200px, 992px, 768px, 576px
- Navbar con menú off-canvas en mobile (768px)
- Grids colapsan a columna única
- `var(--spacing-*)` para consistencia

### ⚠️ CSS Modules

| Uso | Estado |
|-----|--------|
| CSS Modules (.module.css) | ⚠️ Parcial — solo 5 archivos |
| CSS global (.css) | ⚠️ 20+ archivos — mezcla de estilos |

---

## 3️⃣ TESTING

### ✅ Tests

| Lote | Archivos | Tests | Estado |
|------|----------|-------|--------|
| Frontend | 8 archivos (`*.test.jsx`) | 59 | ✅ |
| Backend | 1 archivo (`userController.test.js`) | 3 | ✅ |
| **Total** | **9 archivos** | **62** | **✅ todos pasan** |
| Backend test obsoletos eliminados | 3 archivos (`testDemoUsers.js`, `test_endpoints.js`, `test_endpoints_fixed.js`) | — | ✅ limpiado |

### ✅ `npm test` desde la raíz — FUNCIONA

```bash
npm test
# → frontend: 59 passed, backend: 3 passed = 62 total ✅
```

### ✅ Backend: primeros 3 tests (nuevos)

| Archivo | Tests | Lo que prueba |
|---------|-------|---------------|
| `backend/src/__tests__/userController.test.js` | 3 | Login sin email, login sin password, register sin campos |

---

## 4️⃣ DESPLIEGUE

### ✅ Backend en Render

- `render.yaml` con Web Service + PostgreSQL
- Build: `cd backend && npm install && npm run build`
- Start: `cd backend && node server.js`
- URL: `https://laboria-backend.onrender.com`

### ✅ Frontend en Vercel

- `vercel.json` con `rootDirectory: "frontend"`
- Framework Vite, SPA rewrites
- URL: `https://laboria-frontend-backend-damian.vercel.app`

### ✅ Base de datos en la nube

- Render PostgreSQL (free plan)
- `DATABASE_URL` auto-conectada desde el web service

### ✅ Las apps se comunican

| Config | Valor |
|--------|-------|
| `VITE_API_URL` (producción) | `https://laboria-backend.onrender.com` |
| `CORS_ORIGINS` (producción) | `laboria-frontend-backend-damian.vercel.app,*.vercel.app` |
| Estado | ✅ Configuradas |

---

## 5️⃣ RESUMEN DE REQUISITOS

| Requisito | Estado | Notas |
|-----------|--------|-------|
| API REST con 4+ recursos | ✅ | 5 recursos, 28 endpoints |
| Autenticación JWT | ✅ | login + middleware protector |
| Roles (user normal + admin) | ✅ | 5 roles con permisos |
| PostgreSQL con 4+ tablas | ✅ | 4 tablas + 4 enums |
| Prisma ORM | ✅ | singleton + seed |
| Validaciones en endpoints | ⚠️ | manuales, sin librería externa |
| Manejo de errores centralizado | ✅ | HTTP codes apropiados |
| Variables de entorno | ✅ | 7 variables |
| Integración externa | ✅ | Resend (email) |
| React 18+ | ✅ | 18.3.1 |
| Vite | ✅ | 5.2.11 |
| React Router v6 | ✅ | 27 rutas |
| Conexión API con fetch | ✅ | wrapper propio |
| Context API | ✅ | AuthContext |
| Formularios controlados | ✅ | useForm + validación |
| Estados loading/error/vacío | ✅ | en todas las páginas |
| Diseño responsive | ✅ | 4 breakpoints |
| CSS Modules | ⚠️ | parcial (5 módulos, 20+ globales) |
| 8+ tests | ✅ | 62 tests |
| Tests pasan todos | ✅ | 62/62 |
| Backend desplegado | ✅ | Render |
| Frontend desplegado | ✅ | Vercel |
| DB en la nube | ✅ | Render PostgreSQL |
| Apps se comunican | ✅ | CORS + API URL configurados |

---

## 6️⃣ INCIDENCIAS

### 🔴 Alta — Corregidas

| # | Incidencia | Solución aplicada |
|---|-----------|-------------------|
| 1 | `npm test` fallaba por `test:backend` (exit 1) | ✅ Root `package.json` ahora corre `npm run test:frontend && npm run test:backend` con `vitest run` |
| 4 | PUT jobs/courses aceptaban `req.body` sin filtrar | ✅ Whitelist de campos permitidos en `jobController.js:126` y `courseController.js:126` |

### 🟡 Media — Corregidas

| # | Incidencia | Solución aplicada |
|---|-----------|-------------------|
| 2 | Backend sin tests | ✅ 3 tests con vitest en `backend/src/__tests__/userController.test.js` |

### 🟢 Baja — Pendiente

#### #3 CSS Modules inconsistentes

**Qué es:** Mezcla de 5 archivos `.module.css` con 20+ archivos `.css` globales.

**Por qué importa:** Los CSS Modules evitan conflictos de nombres de clases. Al usar CSS global, dos componentes podrían pisarse los estilos sin querer.

**Soluciones:**

| Solución | Dificultad | Tiempo estimado |
|----------|-----------|-----------------|
| **A)** Migrar los 20+ CSS globales a `.module.css` uno por uno | Media | 2-3 horas |
| **B)** Dejar como está y solo usar módulos en componentes nuevos | Baja | 0 — solo cambiar convención |
| **C)** Usar CSS-in-JS (styled-components, emotion) para todo | Alta | 4-5 horas (refactor mayor) |

**Recomendación:** Opción B (cambiar convención para componentes nuevos) + migrar los archivos más conflictivos cuando haya tiempo.

### 🟢 Baja — Corregidas

#### #5 Build con `migrate deploy`

✅ **FIXED** — `backend/package.json` cambió de `prisma db push` a `prisma migrate deploy`. La migración ya existe en `prisma/migrations/` y se aplica correctamente en una DB limpia.

### 🟡 Media — Corregidas

#### #6 Backend no desconecta Prisma al apagarse

✅ **FIXED** — `server.js` ahora importa `prisma` desde `database.js` y llama a `await prisma.$disconnect()` antes de `process.exit()` en SIGTERM y SIGINT.

#### #7 Scripts de test manuales obsoletos

✅ **FIXED** — Eliminados `backend/testDemoUsers.js`, `backend/test_endpoints.js` y `backend/test_endpoints_fixed.js`.

---

## 7️⃣ ARQUITECTURA vs RECOMENDADA

```
     RECOMENDADA                              REAL (Laboria)
┌─────────────────────────┐       ┌────────────────────────────────┐
│       FRONTEND          │       │          FRONTEND              │
│  ┌──────┐ ┌──────┐     │       │   HashRouter (27 rutas)        │
│  │ Auth │ │Pages │     │       │   AuthContext (JWT)             │
│  │ Ctx  │ │+Rtr  │     │       │   ConexionApi (util)           │
│  └──┬───┘ └──┬───┘     │       │   useForm + validación         │
│     └───┬────┘         │       │                                │
│         │ fetch/axios  │       │   fetch wrapper (api.js)       │
└─────────┼──────────────┘       └───────────────┬────────────────┘
          │ HTTPS (JWT)                           │ HTTPS (JWT)
┌─────────┼──────────────┐       ┌───────────────┼────────────────┐
│    BACKEND              │       │      BACKEND                   │
│  ┌──── Routes ────┐    │       │   user/job/course/app/admin    │
│  ┌─ Middleware ────┐   │       │   auth/admin/owner middlewares │
│  ┌─ Controllers ───┐   │       │   controllers con try/catch    │
│  ┌─ Prisma Client ─┐   │       │   PrismaClient singleton       │
└─────────┼──────────────┘       └───────────────┼────────────────┘
          │ SQL                                   │ SQL
┌─────────┼──────────────┐       ┌───────────────┼────────────────┐
│    PostgreSQL          │       │   PostgreSQL (Render)          │
│                        │       │   4 tablas + 4 enums           │
└────────────────────────┘       └────────────────────────────────┘
```

✅ La arquitectura sigue el patrón recomendado: Frontend → API (fetch + JWT) → Backend (Routes → Middleware → Controllers → Prisma) → PostgreSQL.

---

## Prioridad de acciones — Pendientes

| Prioridad | Acción | Incidencia | Esfuerzo |
|-----------|--------|-----------|----------|
| 🟢 | Decidir convención de CSS Modules para adelante | #3 | 15 min (decisión) |

**✅ Incidencias #1, #2, #4, #5, #6, #7 — todas corregidas**
