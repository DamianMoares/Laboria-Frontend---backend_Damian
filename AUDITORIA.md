# 📋 Auditoría Completa — Laboria

> Fecha: 16 mayo 2026 · Commit: `373e1a8`

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
- Build: `prisma generate && prisma db push`

### ⚠️ Validaciones

| Tipo | Estado | Detalle |
|------|--------|---------|
| Validación manual en controllers | ✅ | email regex, password >= 6, campos requeridos, roles válidos, etc. |
| Librería de validación (express-validator, Joi) | ❌ | No se usa ninguna |
| PUT jobs/courses aceptan `req.body` directo | ⚠️ | No hay validación de campos en update |

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
- NO usa axios (usa fetch nativo) — no es un requisito, pero está bien

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

**Conclusión:** Usa CSS Modules pero no de forma consistente. No es un error, pero debería ser homogéneo.

---

## 3️⃣ TESTING

### ✅ Al menos 8 tests

| Archivo | Tests | ¿Pasan? |
|---------|-------|---------|
| `App.test.jsx` | 4 | ✅ |
| `AuthContext.test.jsx` | 6 | ✅ |
| `Navbar.test.jsx` | 11 | ✅ |
| `Home.test.jsx` | 6 | ✅ |
| `LoginPage.test.jsx` | 9 | ✅ |
| `RegisterPage.test.jsx` | 11 | ✅ |
| `CourseSearchPage.test.jsx` | 6 | ✅ |
| `JobSearchPage.test.jsx` | 6 | ✅ |
| **Total** | **59 tests** | **✅ 59/59 pasan** |

### ⚠️ `npm test` desde la raíz — **ANTES FALLABA, AHORA FUNCIONA** ✅

**Antes:** `test:backend` ejecutaba `exit 1`, rompiendo el `&&` chain.

**Solución aplicada:** 
- `"test": "npm run test:frontend && npm run test:backend"` (root `package.json`)
- Backend ahora usa `vitest run`
- Frontend ahora usa `vitest run` (antes `vitest` en watch mode)

| Lote | Tests | Estado |
|------|-------|--------|
| Frontend | 59 tests (8 archivos) | ✅ |
| Backend | 3 tests (1 archivo) | ✅ |
| **Total** | **62 tests** | **✅ todos pasan** |

### ⚠️ Backend tenía 0 tests → **AHORA TIENE 3** ✅

Se agregó `vitest` + `supertest` + primer archivo de tests:

| Archivo | Tests | Lo que prueba |
|---------|-------|---------------|
| `backend/src/__tests__/userController.test.js` | 3 | Login sin email, login sin password, register sin campos |

Para ejecutar: `cd backend && npm test`

---

## 4️⃣ DESPLIEGUE

### ✅ Backend en Render

- `render.yaml` configurado con Web Service + PostgreSQL
- Build: `cd backend && npm install && npm run build`
- Start: `cd backend && node server.js`
- URL: `https://laboria-backend.onrender.com`

### ✅ Frontend en Vercel

- `vercel.json` con `rootDirectory: "frontend"`
- Framework Vite, SPA rewrites
- `package-lock.json` existe en el repo (requisito de `npm ci`)
- URL: `https://laboria-frontend-backend-damian.vercel.app`

### ✅ Base de datos en la nube

- Render PostgreSQL (free plan), creada vía Blueprint
- `DATABASE_URL` se conecta automáticamente desde el servicio

### ✅ Las apps se comunican

| Config | Valor |
|--------|-------|
| `VITE_API_URL` (producción) | `https://laboria-backend.onrender.com` |
| `CORS_ORIGINS` (producción) | `laboria-frontend-backend-damian.vercel.app,*.vercel.app` |
| Estado | ✅ Configuradas, pendiente verificar en vivo |

---

## 5️⃣ RESUMEN DE HALLAZGOS

### ✅ Todo correcto (cumple requisitos)

| Requisito | Estado |
|-----------|--------|
| API REST con 4+ recursos | ✅ 5 recursos, 28 endpoints |
| Autenticación JWT | ✅ login + middleware protector |
| Roles (user normal + admin) | ✅ 5 roles con permisos diferenciados |
| PostgreSQL con 4+ tablas | ✅ 4 tablas + 4 enums + relaciones |
| Prisma ORM | ✅ singleton + seed + db push |
| Validaciones en endpoints | ⚠️ manuales, sin librería |
| Manejo de errores centralizado | ✅ con HTTP codes apropiados |
| Variables de entorno | ✅ 7 variables |
| Integración externa | ✅ Resend (email) |
| React 18+ | ✅ 18.3.1 |
| Vite | ✅ 5.2.11 |
| React Router v6 | ✅ 27 rutas |
| Conexión API con fetch | ✅ wrapper propio |
| Context API | ✅ AuthContext |
| Formularios controlados | ✅ useForm + validación |
| Estados loading/error/vacío | ✅ en todas las páginas |
| Diseño responsive | ✅ 4 breakpoints |
| CSS Modules | ⚠️ parcial (5/20+ archivos) |
| 8+ tests | ✅ 59 tests |
| Tests pasan todos | ✅ 59/59 |
| Backend desplegado | ✅ Render |
| Frontend desplegado | ✅ Vercel |
| DB en la nube | ✅ Render PostgreSQL |
| Apps se comunican | ✅ configurado |

### ❌ Incidencias encontradas

| # | Incidencia | Gravedad | Estado | Solución |
|---|-----------|----------|--------|----------|
| 1 | `npm test` desde raíz **falla** por `test:backend` | 🔴 Alta | ✅ **FIXED** | Root `"test": "npm run test:frontend && npm run test:backend"` |
| 2 | Backend sin tests | 🟡 Media | ✅ **FIXED** | 3 tests con vitest en `backend/src/__tests__/` |
| 3 | CSS Modules inconsistentes (mezcla con CSS global) | 🟢 Baja | ⏳ Pendiente | Migrar CSS global a módulos gradualmente |
| 4 | PUT jobs/courses aceptan `req.body` sin validar | 🟡 Media | ✅ **FIXED** | Whitelist de campos permitidos en job/course controller |
| 5 | No hay migration history (usa `db push`) | 🟢 Baja | ⏳ Pendiente | Setup inicial con migrations es preferible |

---

## 6️⃣ ARQUITECTURA vs RECOMENDADA

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
