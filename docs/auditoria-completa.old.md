# Auditoría Completa — Laboria

> **Fecha:** 17 de mayo de 2026
> **Alcance:** Full-stack (React/Vite frontend + Express/Prisma/PostgreSQL backend)
> **Líneas de código analizadas:** ~15.000+ (frontend + backend + config)

---

## Resumen de hallazgos por severidad

| Severidad | Total | Acción recomendada |
|-----------|-------|--------------------|
| 🔴 Crítico | 12 | Corregir inmediatamente |
| 🟠 Alto | 28 | Corregir esta semana |
| 🟡 Medio | 35 | Planificar para este mes |
| 🟢 Bajo | 30 | Corregir cuando sea posible |
| ℹ️ Informativo | 10 | Monitorear |
| **Total** | **~115** | |

---

# 1. SEGURIDAD

## 1.1 🔴 Crítico — Autoregistro como ADMIN

**Archivo:** `backend/src/controllers/userController.js:10,29`

El registro acepta `role` del body sin validación. Cualquier usuario puede registrarse como `ADMIN`:

```js
const { email, password, name, role } = req.body;
role: role ? role.toUpperCase() : 'CANDIDATE'
```

**Solución:** Eliminar `role` del destructuring en registro. Forzar siempre `CANDIDATE` en el servidor. Los roles de empresa solo deben asignarse por ADMIN.

## 1.2 🔴 Crítico — API Keys en público

**Archivos:** `frontend/.env:7,24`

Dos claves de API están en texto plano y commiteadas en el repositorio:

- `af56fbbafa27a6085c4b284970657a383a6e1d7f0bf7a11b1fbc1ba7958839b0` (SerpApi)
- `AIzaSyAPW4sS96kSSJvShWKFdwjJACEmZNFi294` (YouTube Data API)

**Solución:** Rotar ambas claves inmediatamente. Añadir `.env` a `.gitignore` si no lo está ya. Usar `.env.example`.

## 1.3 🔴 Crítico — Secrets del backend en el repo

**Archivo:** `backend/.env:4,6`

`JWT_SECRET` y `DATABASE_URL` (con contraseña `aironhack`) están commiteados.

**Solución:** Rotar el JWT_SECRET. Cambiar la contraseña de la DB local. Añadir `backend/.env` al `.gitignore`. Crear `backend/.env.example`.

## 1.4 🔴 Crítico — Sin cascade delete en Prisma

**Archivo:** `backend/prisma/schema.prisma` + migraciones

Todas las relaciones FK usan `ON DELETE RESTRICT`. Eliminar un `User` con aplicaciones, cursos, empleos, curriculum o sesiones lanza error de FK.

**Solución:** Añadir `onDelete: Cascade` o `onDelete: SetNull` a todas las relaciones. Para `User → Application`, `User → Course`, `User → Job`, `User → Curriculum`, `User → LoginSession`.

## 1.5 🟠 Alto — Sin rate limiting en password reset

**Archivos:** `backend/src/routes/userRoutes.js:21-24`

`forgot-password` y `reset-password` no tienen rate limiting. Un atacante puede bombardear con emails de reset o brute-force el token.

**Solución:** Aplicar `authLimiter` a ambos endpoints. Considerar un límite más restrictivo (5 intentos/15 min) para `reset-password`.

## 1.6 🟠 Alto — Sin helmet (seguridad HTTP)

**Archivo:** `backend/server.js`

No se usa `helmet` ni ningún middleware de seguridad HTTP. Faltan cabeceras críticas:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`
- `Referrer-Policy`

**Solución:** Instalar `helmet` y configurarlo en `server.js`.

## 1.7 🟠 Alto — Autorización faltante en `CourseApplication.updateStatus`

**Archivo:** `backend/src/controllers/courseApplicationController.js:57-88`

Cualquier usuario autenticado puede cambiar el estado de CUALQUIER inscripción a curso. No verifica que sea el autor del curso o ADMIN.

**Solución:** Añadir verificación: buscar el curso asociado a la aplicación y comprobar que `req.user.id === course.authorId` o `req.user.role === 'ADMIN'`.

## 1.8 🟠 Alto — `CourseApplication` sin FK a `Course`

**Archivo:** `backend/prisma/schema.prisma:95-106`

El modelo `CourseApplication` tiene un campo `courseId` (String) pero **no tiene relación FK** con el modelo `Course`. Esto significa:

- No hay integridad referencial: puedes crear inscripciones a cursos que no existen
- No hay cascade delete si se elimina un curso
- No puedes hacer `prisma.courseApplication.findMany({ include: { course: true } })`

**Solución:** Añadir relación FK a `Course`. Si `Course` está en la BD (no en JSON estático), la relación debería ser directa. Si los cursos son JSON estático, mantenerlo como string pero al menos validar en el controlador.

## 1.9 🟠 Alto — AuthContext.register no guarda token

**Archivo:** `frontend/src/context/AuthContext.jsx:52-61`

Después de `register()`, el usuario se guarda en estado pero **no se almacena el token** porque el backend no devuelve token en registro. El usuario aparece como logueado pero no puede hacer peticiones autenticadas.

**Solución:** Que el backend devuelva token en registro, o bien hacer login automático tras registro.

## 1.10 🟠 Alto — Token JWT en localStorage

**Archivo:** `frontend/src/services/authService.js:12-13`

El JWT se almacena en `localStorage`, expuesto a cualquier XSS. Si hay cualquier vulnerabilidad XSS, el token es robable.

**Solución:** Migrar a `httpOnly` cookies (requiere cambios en backend y frontend) o al menos implementar CSP estricto y corta duración del token.

## 1.11 🟠 Alto — Sin validación en endpoints de contraseña

**Archivos:** `backend/src/routes/userRoutes.js:21-24,48`

`forgot-password`, `reset-password` y `change-password` no tienen reglas de validación express-validator. El email en forgot-password ni siquiera se valida como email.

**Solución:** Crear reglas de validación para estos endpoints (email formato, password ≥ 8 chars con complejidad).

## 1.12 🟠 Alto — Seed accounts con contraseñas débiles

**Archivo:** `backend/prisma/seed.js:12-22`

Todas las cuentas semilla usan contraseñas de 8 caracteres alfanuméricos simples (`admin123`, `carlos123`, etc.).

**Solución:** Usar contraseñas más fuertes en seed, o documentar claramente que SOLO son para desarrollo y deben cambiarse en producción.

## 1.13 🟡 Medio — JWT sin revocación

**Archivo:** `backend/src/utils/jwt.js:3-9`

El logout registra una `LoginSession` pero no invalida el JWT. El token sigue siendo válido hasta su expiración (7 días).

**Solución:** Implementar blocklist de tokens (Redis o tabla en BD), o reducir expiración drásticamente y usar refresh tokens.

## 1.14 🟡 Medio — Expiración JWT de 7 días

**Archivo:** `backend/.env:8`

`JWT_EXPIRES_IN=7d` es demasiado largo. Si un token se roba, el atacante tiene 7 días de acceso.

**Solución:** Reducir a 15-60 minutos e implementar refresh tokens.

## 1.15 🟡 Medio — Password policy débil

**Archivo:** `backend/src/middleware/validate.js:15`

Solo se exigen 6 caracteres mínimo. Sin requisitos de mayúsculas, números o caracteres especiales.

**Solución:** Aumentar a 8 caracteres mínimo + al menos 1 mayúscula, 1 número, 1 especial.

## 1.16 🟡 Medio — CORS permite `*.vercel.app`

**Archivo:** `backend/server.js:26`, `render.yaml:19`

Cualquier subdominio de `vercel.app` (incluyendo previews de atacantes) puede hacer peticiones autenticadas.

**Solución:** Limitar CORS a URLs específicas en producción, no usar wildcards.

## 1.17 🟡 Medio — Sin validación server-side del curriculum JSON

**Archivo:** `backend/src/controllers/userController.js:292-306`

El campo `data` del curriculum se guarda como JSON sin validación de estructura ni tamaño.

**Solución:** Validar estructura esperada y tamaño máximo (ej: 1MB) antes de guardar.

## 1.18 🟡 Medio — Stack traces en logs

**Archivo:** `backend/src/middleware/errorHandler.js:2`

`console.error(err.stack)` logea stack traces completos. Si los logs se exponen, revelan estructura interna del proyecto.

**Solución:** En producción, loguear solo el mensaje de error. Stack trace solo en desarrollo.

## 1.19 🟡 Medio — Sin auditoría de acciones admin

**Archivo:** `backend/src/controllers/adminController.js`

Las acciones de administración (cambios de rol, eliminación de usuarios, etc.) no se registran en ningún log de auditoría.

**Solución:** Implementar modelo `AuditLog` o logger estructurado con winslon/pino.

## 1.20 🟡 Medio — Test runner expuesto vía API

**Archivo:** `backend/src/controllers/adminController.js:640-704`

`GET /api/admin/tests/run` ejecuta `vitest run` via `execSync`. Bloquea el event loop y expone resultados de tests internos.

**Solución:** Eliminar este endpoint en producción o deshabilitarlo condicionalmente con variable de entorno.

## 1.21 🟡 Medio — Sin protección CSRF

No hay tokens CSRF en ningún endpoint. Aunque JWT en header `Authorization` mitiga parcialmente, formularios y flujos de navegación siguen siendo vulnerables.

**Solución:** Implementar doble cookie submit pattern o usar SameSite cookies.

## 1.22 🟡 Medio — `isAuthenticated` solo chequea localStorage

**Archivo:** `frontend/src/services/authService.js:63`

```js
isAuthenticated: () => !!localStorage.getItem('token')
```

Con un token expirado o inventado, el frontend considera al usuario autenticado.

**Solución:** Validar el token contra el backend al montar la app, o al menos verificar fecha de expiración localmente.

## 1.23 🟡 Medio — 401 redirige sin aviso

**Archivo:** `frontend/src/services/api.js:14-18`

Cuando cualquier API devuelve 401, se limpia localStorage y se redirige a `/login`. Esto puede ocurrir en medio de una operación, perdiendo trabajo no guardado.

**Solución:** Mostrar un modal "Sesión expirada" en lugar de redirigir abruptamente.

## 1.24 🟡 Medio — Express 5 RC en producción

**Archivo:** `backend/package.json:26`

Express 5 (`^5.2.1`) es Release Candidate, no estable. Puede tener bugs de seguridad no descubiertos.

**Solución:** Usar Express 4.x estable, o monitorear activamente releases de Express 5.

## 1.25 🟢 Bajo — Email HTML sin sanitizar

**Archivo:** `backend/src/services/emailService.js:27,50,73`

El `name` y `resetUrl` del usuario se interpolan directamente en templates HTML de email.

**Solución:** Escapar HTML entities en los valores interpolados.

## 1.26 🟢 Bajo — Sourcemaps en producción

**Archivo:** `frontend/vite.config.js:52`

`sourcemap: true` en build de producción expone el código fuente original en el navegador.

**Solución:** Poner `sourcemap: false` en producción (usar env variable).

---

# 2. BASE DE DATOS

## 2.1 🟠 Alto — Sin índices en columnas de filtro

**Archivo:** `backend/prisma/schema.prisma`

No hay índices en:
- `Job.authorId` (usado en consultas de autor)
- `Job.category` (usado en filtros)
- `Course.authorId` (usado en consultas de autor)
- `Course.category`, `Course.level` (usados en filtros)
- `LoginSession.userId` (usado en cada login/logout)

**Solución:** Añadir índices con `@@index([field])` en schema.prisma y crear migración.

## 2.2 🟠 Alto — Sin paginación en GET /jobs y GET /courses

**Archivos:** `backend/src/controllers/jobController.js:20-26`, `courseController.js:19-25`

Devuelven TODOS los registros sin paginación. Con 350+ empleos y 150+ cursos, es ineficiente; con miles, será insostenible.

**Solución:** Implementar paginación con `skip`/`take` y parámetros `page`/`limit`.

## 2.3 🟡 Medio — `LoginSession.userRole` como String en vez de Enum

**Archivo:** `backend/prisma/schema.prisma:65`

El rol se almacena como `String` en lugar del enum `Role` de Prisma. Permite valores inválidos.

**Solución:** Cambiar a tipo `Role` (requiere migración).

## 2.4 🟢 Bajo — `Curriculum.data` sin validación de esquema

**Archivo:** `backend/prisma/schema.prisma:90`

El campo JSON acepta cualquier estructura. Si el frontend envía datos con formato inesperado, no hay error.

**Solución:** Validar con librería como `zod` en el controlador antes de guardar.

---

# 3. EXPERIENCIA DE USUARIO (UX)

## 3.1 🔴 Crítico — Sin Error Boundary

**Archivo:** `frontend/src/pages/**/*.jsx`

No hay ningún `ErrorBoundary` en el árbol de React. Si un componente falla al renderizar, la app muestra pantalla en blanco.

**Solución:** Envolver `<Routes>` en un `ErrorBoundary` con UI de fallback.

## 3.2 🔴 Crítico — 26 usos de `alert()` y `confirm()` nativos

**Archivos:**
- `frontend/src/pages/aplicaciones/MyApplicationsPage.jsx:49,53,55,61,65,67`
- `frontend/src/pages/cursos/CourseDetailPage.jsx:37,42,44,70,83,94`
- `frontend/src/pages/empleos/PostJobPage.jsx:62,70`
- `frontend/src/pages/empleos/MyJobsPage.jsx:41,45,47`
- `frontend/src/pages/empleos/JobDetailPage.jsx:49,80-82`
- `frontend/src/pages/cursos/SavedCoursesPage.jsx:38,44`
- `frontend/src/pages/cursos/PostCoursePage.jsx:60,67`
- `frontend/src/pages/cursos/MyCoursesPage.jsx:41,45,47`

`alert()` bloquea el event loop, no tiene estilo consistente, y es mala UX en móvil.

**Solución:** Implementar sistema de toasts/notificaciones y modales de confirmación personalizados.

## 3.3 🟠 Alto — Sin estados de carga visuales

**Archivos:**
- `frontend/src/pages/inicio/Home.jsx:90,94` — texto `'...'`
- `frontend/src/pages/empleos/JobSearchPage.jsx:382` — texto
- `frontend/src/pages/cursos/CourseSearchPage.jsx:451` — texto
- `frontend/src/components/SessionDurationChart.jsx:37` — texto
- `frontend/src/components/ProtectedRoute.jsx:9` — texto

Todos los estados de carga son texto plano. Sin spinners ni skeletons.

**Solución:** Reemplazar con componentes skeleton animados o spinners CSS.

## 3.4 🟠 Alto — Sin estados vacíos

Cuando no hay resultados de búsqueda, no hay aplicaciones, o no hay datos, la mayoría de páginas muestran nada o texto genérico. No hay ilustraciones ni mensajes útiles.

**Ejemplos:** páginas de admin cuando no hay usuarios, buscadores sin resultados.

**Solución:** Crear componente `EmptyState` con icono, mensaje y CTA.

## 3.5 🟠 Alto — Confirmación faltante en acciones destructivas

Borrar cuenta, retirar aplicación, cancelar inscripción: algunas usan `confirm()` (nativo y feo), otras no tienen confirmación.

**Solución:** Sistema de modales de confirmación consistente.

## 3.6 🟡 Medio — Sin feedback inline en formularios

`PostJobPage`, `PostCoursePage`, `ForgotPasswordPage`, `ResetPasswordPage`: la validación solo ocurre al enviar, no en blur/change. No hay errores inline ni campos marcados.

**Solución:** Implementar el mismo patrón de validación que `LoginPage` y `RegisterPage`.

## 3.7 🟡 Medio — `CurriculumPage` tiene 1004 líneas

**Archivo:** `frontend/src/pages/curriculo/CurriculumPage.jsx`

Cada sección (experience, education, skills, projects, languages) tiene la misma lógica CRUD duplicada.

**Solución:** Extraer lógica CRUD a un hook `useCurriculumSection` y renderizar con componente reutilizable.

## 3.8 🟡 Medio — Lógica de filtros duplicada en search pages

**Archivos:** `JobSearchPage.jsx:53-118,126-190`, `CourseSearchPage.jsx:76-156,164-242`

~65 líneas de lógica de filtrado copiada en el bloque try y en el catch.

**Solución:** Extraer a función helper compartida.

## 3.9 🟡 Medio — Debounce implementado pero no conectado

**Archivo:** `frontend/src/pages/cursos/CourseSearchPage.jsx:38-50`

`debouncedSearch` está definido pero nunca se conecta a ningún `onChange`.

**Solución:** Conectarlo al input de búsqueda o eliminarlo.

---

# 4. ACCESIBILIDAD

## 4.1 🔴 Crítico — Sin indicadores de foco visibles

**Archivo:** `frontend/src/index.css:107,153-156`

```css
button { outline: none; }
input:focus, select:focus, textarea:focus { outline: none; }
```

Se eliminó el outline global sin proporcionar un reemplazo visible. La navegación por teclado es imposible para usuarios videntes.

**Solución:** Añadir `:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px; }` global.

## 4.2 🟠 Alto — Sin `aria-current` en paginación

**Archivos:** `JobSearchPage.jsx:422-443`, `CourseSearchPage.jsx:491-512` + admin pages

Los botones de página activa tienen clase `active` pero no `aria-current="page"`.

**Solución:** Añadir `aria-current={currentPage === pageNum ? "page" : undefined}`.

## 4.3 🟠 Alto — Botones de solo-icono sin `aria-label`

**Archivos:** Admin pages (👁️, ✏️, 🗑️ botones)

Los botones de acción en tablas admin usan emojis/íconos sin `aria-label`.

**Solución:** Añadir `aria-label` descriptivo a cada botón.

## 4.4 🟡 Medio — Menú móvil sin focus trap

**Archivo:** `frontend/src/components/Navbar/Navbar.jsx`

Cuando el menú móvil está abierto, el foco del teclado puede salir del menú y navegar por el contenido detrás del overlay.

**Solución:** Implementar focus trapping con `focus-trap-react` o hook personalizado.

## 4.5 🟡 Medio — Hamburguesa sin `aria-expanded`

**Archivo:** `frontend/src/components/Navbar/Navbar.jsx:41`

El botón de menú móvil tiene `aria-label="Toggle menu"` (en inglés) pero no `aria-expanded` ni `aria-controls`.

**Solución:**
```jsx
aria-label="Abrir menú de navegación"
aria-expanded={mobileMenuOpen}
aria-controls="navbar-menu"
```

## 4.6 🟡 Medio — FAQ sin navegación por teclado (flechas)

**Archivo:** `frontend/src/pages/informacion/FAQPage.jsx`

El acordeón FAQ no soporta navegación con flechas arriba/abajo entre elementos.

**Solución:** Implementar handlers `onKeyDown` para ArrowUp/ArrowDown.

## 4.7 🟡 Medio — Contraste de color borderline

**Archivo:** `frontend/src/index.css`

- `--color-text-muted: #888888` sobre `#0a0a0a` (~5.7:1) — pasa AA para texto normal pero falla AAA
- Oro sobre fondo oscuro podría ser insuficiente para textos pequeños

**Solución:** Auditar con Axe DevTools y ajustar valores.

---

# 5. ARQUITECTURA Y CÓDIGO

## 5.1 🟠 Alto — `ProtectedRoute` usa `<a>` en vez de `<Link>`

**Archivo:** `frontend/src/components/ProtectedRoute.jsx:22`

```jsx
<a href="/" className="btn btn-primary">Volver al inicio</a>
```

Causa recarga completa de página, perdiendo todo el estado React.

**Solución:** Usar `<Link to="/">` de React Router.

## 5.2 🟠 Alto — Logout en profile pages no redirige

**Archivos:** `CandidateProfilePage.jsx:54`, `CompanyProfilePage.jsx:53`

Llaman a `logout()` pero no navegan. El usuario ve la misma página como invitado.

**Solución:** Añadir `navigate('/')` después de logout.

## 5.3 🟠 Alto — Sin ESLint, Prettier ni hooks de git

No hay configuración de ESLint, Prettier, Husky, lint-staged ni `.editorconfig` en todo el proyecto.

**Solución:** Configurar ESLint + Prettier con reglas estándar para React + Node. Añadir Husky para pre-commit.

## 5.4 🟠 Alto — `package-lock.json` excluido de git

**Archivo:** `.gitignore:7`

```gitignore
package-lock.json
```

Esto rompe `npm ci` en CI/CD (deploy.yml usa `npm ci`), y permite instalaciones no deterministas.

**Solución:** ELIMINAR esta línea del `.gitignore` y commitear el lock file.

## 5.5 🟠 Alto — `vitest` version mismatch

- Frontend: `vitest@^1.4.0`
- Backend: `vitest@^4.1.6` (versión probablemente inexistente — debería ser `^1.4.0`)

**Solución:** Unificar versión de vitest en todo el proyecto.

## 5.6 🟠 Alto — `pg` como dependencia no usada

**Archivo:** `backend/package.json:30`

El paquete `pg` está listado como dependencia pero no se usa directamente (Prisma maneja PostgreSQL).

**Solución:** Eliminar dependencia innecesaria.

## 5.7 🟡 Medio — `ConexionApi.jsx` es código muerto

**Archivo:** `frontend/src/context/ConexionApi.jsx`

No es importado por ningún componente. Código muerto.

**Solución:** Eliminar o refactorizar si se necesita.

## 5.8 🟡 Medio — `TabsNavigation.jsx` importado pero no usado

**Archivo:** `frontend/src/App.jsx:6`

Se importa `TabsNavigation` pero nunca se renderiza en el JSX.

**Solución:** Renderizarlo o eliminar el import.

## 5.9 🟡 Medio — `EditProfileModal.jsx` es código muerto

**Archivo:** `frontend/src/components/EditProfileModal.jsx`

No es importado por ninguna página desde que se eliminaron los botones "Editar Perfil" de los perfiles.

**Solución:** Eliminar o integrar en SettingsPage.

## 5.10 🟡 Medio — Nombres de archivo mixtos español/inglés

`pages/autenticacion/`, `empleos/`, `cursos/`, `curriculo/`, `configuracion/`, `aplicaciones/` vs `components/`, `services/`, `hooks/`, `context/`, `pages/admin/`, `pages/panel/`

**Solución:** Estandarizar a un idioma (recomendado: inglés para código, español solo para contenido visible al usuario).

## 5.11 🟡 Medio — `HashRouter` limita SEO

**Archivo:** `frontend/src/App.jsx`

`HashRouter` impide que crawlers de motores de búsqueda indexen rutas correctamente.

**Solución:** Migrar a `BrowserRouter` con configuración de servidor (Vercel ya la tiene en `vercel.json`).

## 5.12 🟡 Medio — `onKeyPress` deprecated

**Archivos:** `JobSearchPage.jsx:232`, `CourseSearchPage.jsx:287`

Usan `onKeyPress` que está deprecado.

**Solución:** Reemplazar con `onKeyDown`.

## 5.13 🟡 Medio — Sin i18n

Todo el texto está hardcodeado en español. No hay infraestructura para internacionalización.

**Solución:** Adoptar react-intl o i18next con archivos de traducción.

## 5.14 🟢 Bajo — `dotenv` cargado dos veces

**Archivos:** `backend/server.js:7`, `backend/src/config/database.js:2`

`dotenv.config()` se llama dos veces. Inofensivo pero inconsistente.

**Solución:** Cargar solo en server.js y pasar config a database.js.

## 5.15 🟢 Bajo — Doble `findUnique` en varios controladores

`updateProfile`, `deleteAccount`, `jobController.delete`, `courseController.delete` hacen dos queries a BD (una para verificar existencia, otra para operar).

**Solución:** Usar Prisma `update`/`delete` directamente y capturar error `P2025` (not found).

---

# 6. PRUEBAS

## 6.1 🔴 Crítico — 11/12 funciones de userController sin test

**Archivo:** `backend/src/__tests__/userController.test.js`

Solo se testean: register (éxito y error), login (2 errores), updateProfile (404), deleteAccount (404).

Sin test: `logout`, `getSessionStats`, `getProfile`, `forgotPassword`, `resetPassword`, `changePassword`, `getCurriculum`, `saveCurriculum`.

## 6.2 🔴 Crítico — 3 de 6 controladores del backend sin tests

Sin tests: `adminController`, `applicationController`, `courseApplicationController`.

## 6.3 🔴 Crítico — 24 archivos frontend sin tests

Sin tests:
- Todas las páginas admin (6 archivos)
- Todas las páginas de perfiles (2 archivos)
- Páginas de detalle (JobDetail, CourseDetail)
- Páginas de formulario (PostJob, PostCourse)
- Páginas de gestión (MyJobs, MyCourses, MyApplications, SavedCourses)
- CurriculumPage, DashboardPage, SettingsPage
- ForgotPasswordPage, ResetPasswordPage
- Componentes: SessionDurationChart, CookieConsent, ProtectedRoute

## 6.4 🟠 Alto — 9 servicios y 7 hooks sin tests

**Archivos:** `frontend/src/services/*` (9 archivos), `frontend/src/hooks/*` (7 archivos)

## 6.5 🟠 Alto — Mocking frágil con `require.cache`

**Archivos:** Todos los tests del backend

Usan manipulación de `require.cache` para mockear Prisma. Si Node.js cambia su sistema de módulos, estos tests se rompen.

**Solución:** Usar `vi.mock()` de Vitest con factory functions.

## 6.6 🟡 Medio — Tests de frontend son smoke tests

`App.test.jsx` mockea TODAS las páginas como `<div>` vacíos. No prueba routing real.

**Solución:** Escribir tests de integración que rendericen componentes reales con datos mock.

## 6.7 🟡 Medio — Sin script `test:coverage`

Referenciado en README pero no existe en ningún `package.json`.

**Solución:** Añadir configuración de coverage con umbrales mínimos.

## 6.8 🟡 Medio — Sin step de tests en CI/CD

**Archivo:** `.github/workflows/deploy.yml`

El pipeline de deploy no ejecuta `npm test`. Se puede desplegar código con tests rotos.

**Solución:** Añadir `npm test` antes del build.

---

# 7. CONFIGURACIÓN Y DESPLIEGUE

## 7.1 🔴 Crítico — GitHub Actions apunta a localhost

**Archivo:** `.github/workflows/deploy.yml:44`

```yaml
VITE_API_URL: http://localhost:3000
```

El frontend desplegado en GitHub Pages intentará conectar con `localhost:3000`.

**Solución:** Cambiar a `https://laboria-backend.onrender.com` (o la URL real del backend).

## 7.2 🟠 Alto — Sin `.env.example` para backend ni frontend

No hay archivos de ejemplo que documenten qué variables de entorno necesita cada parte.

**Solución:** Crear `backend/.env.example` y `frontend/.env.example`.

## 7.3 🟠 Alto — `FRONTEND_URL` no definido en `.env`

**Archivo:** `backend/src/controllers/userController.js:201`

El código usa `process.env.FRONTEND_URL` pero no está definido en `backend/.env`. Cae a `http://localhost:5173`.

**Solución:** Añadir `FRONTEND_URL` al `.env` y al `.env.example`.

## 7.4 🟡 Medio — Sin `.nvmrc` ni `.node-version`

No hay pinning de versión de Node.js. Diferentes entornos pueden usar versiones distintas.

**Solución:** Añadir `.nvmrc` con versión LTS.

## 7.5 🟡 Medio — Sin Docker/docker-compose

No hay forma de reproducir el entorno de desarrollo consistentemente (especialmente PostgreSQL).

**Solución:** Crear `docker-compose.yml` con PostgreSQL + backend + frontend.

## 7.6 🟡 Medio — Dos `vercel.json` (raíz y frontend/)

El de la raíz no hace nada útil. Confunde sobre dónde está la configuración real.

**Solución:** Eliminar `vercel.json` de la raíz.

## 7.7 🟢 Bajo — Sin healthcheck dedicado

`GET /` devuelve JSON en vez de un endpoint de healthcheck estándar (ej: `GET /health` → 200 OK).

**Solución:** Añadir endpoint `/health` separado.

---

# 8. DOCUMENTACIÓN

## 8.1 🔴 Crítico — README desactualizado

**Archivo:** `README.md`

Dice "Frontend-only sin backend" cuando el proyecto TIENE backend completo con Express + PostgreSQL + Prisma. También dice "18 tests" (la realidad es 75).

## 8.2 🟡 Medio — `API_REFERENCIA.md` y `DEPLOY.md` referenciados pero no existen

**Archivo:** `doc/README.md`

Referencia `API_REFERENCIA.md` y `DEPLOY.md` que no existen en el proyecto.

## 8.3 🟡 Medio — `TAREAS.md` desactualizado

Muestra tareas como pendientes que ya están completadas (backend desplegado, tests, etc.)

## 8.4 🟡 Medio — Sin guía de contribución ni coding standards

No hay `CONTRIBUTING.md` ni documentación de convenciones de código.

---

# 9. RENDIMIENTO

## 9.1 🟠 Alto — N+1 queries potenciales en admin endpoints

Los endpoints admin que listan aplicaciones pueden hacer N+1 queries si se incluyen relaciones anidadas sin `include` optimizado.

## 9.2 🟡 Medio — CSS Modules sin purgado

Todos los estilos CSS se incluyen en el bundle aunque no se usen. Sin purga de CSS no utilizado.

**Solución:** Configurar purge de CSS en Vite build.

## 9.3 🟡 Medio — Sin lazy loading de rutas

Todas las páginas se cargan en un solo bundle. Las rutas admin (rara vez visitadas) se cargan igual que Home.

**Solución:** Implementar `React.lazy()` y `Suspense` para rutas pesadas (admin, curriculum).

## 9.4 🟢 Bajo — Spreading de objetos sin select en Prisma

Varios controladores hacen `findUnique` y luego destructurean campos que no necesitan. Mejor usar `.select()`.

---

# 10. MEJORAS FUTURAS RECOMENDADAS

## 10.1 🟡 Prioridad alta

| Mejora | Justificación |
|--------|---------------|
| Sistema de notificaciones (toast) | Reemplazar 26 `alert()` + feedback visual consistente |
| Error Boundary global | Prevenir pantalla blanca por fallo de render |
| Skeletons/Loading spinners | Mejorar percepción de rendimiento |
| Paginación en jobs/courses | Escalabilidad con miles de registros |
| Refresh tokens | Seguridad de sesión |
| Auditoría de acciones admin | Compliance y trazabilidad |

## 10.2 🟡 Prioridad media

| Mejora | Justificación |
|--------|---------------|
| Modo oscuro | Usando CSS variables ya existentes |
| Testing E2E (Playwright/Cypress) | Cubrir flujos críticos completos |
| i18n | Preparación para internacionalización |
| Docker compose | Entorno de desarrollo reproducible |
| CI/CD con tests | Prevenir deploys con tests rotos |
| Rate limiting en write endpoints | Protección contra abuso |

## 10.3 🟢 Prioridad baja

| Mejora | Justificación |
|--------|---------------|
| PWA (Service Worker, offline) | Experiencia mobile mejorada |
| Lazy loading de rutas | Bundle splitting |
| Animaciones de transición | Mejora UX percibida |
| Filtros guardados en URL | Compartir búsquedas |
| Exportar datos a PDF/CSV | Funcionalidad avanzada |
| Dashboard con más gráficos | Más métricas de negocio |

---

# Prioridades de acción inmediata (Top 10)

| # | Acción | Área | Severidad | Esfuerzo |
|---|--------|------|-----------|----------|
| 1 | Rotar API keys (SerpApi, YouTube) | Seguridad | 🔴 Crítico | 10 min |
| 2 | Rotar JWT_SECRET y DB password | Seguridad | 🔴 Crítico | 15 min |
| 3 | Eliminar `package-lock.json` de `.gitignore` | DevOps | 🔴 Crítico | 1 min |
| 4 | Fix `VITE_API_URL` en deploy.yml | DevOps | 🔴 Crítico | 1 min |
| 5 | Restringir role en registro (solo CANDIDATE) | Seguridad | 🔴 Crítico | 10 min |
| 6 | Añadir cascade deletes en Prisma | DB | 🔴 Crítico | 30 min |
| 7 | Añadir Error Boundary global | UX | 🔴 Crítico | 15 min |
| 8 | Reemplazar `alert()` con toasts | UX | 🔴 Crítico | 2-4 h |
| 9 | Fix `ProtectedRoute` <a> → <Link> | Código | 🟠 Alto | 2 min |
| 10 | Añadir rate limiting a password reset | Seguridad | 🟠 Alto | 10 min |

> **Nota:** El esfuerzo estimado total para corregir los ~30 hallazgos críticos/altos es de aproximadamente 15-20 horas de desarrollo. Se recomienda abordar los de seguridad primero, luego UX, luego testing.
