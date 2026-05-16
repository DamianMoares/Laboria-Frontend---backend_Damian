# Volumen 4: Frontend

## Índice del volumen

1. [Estructura del proyecto frontend](#1-estructura-del-proyecto-frontend)
2. [CSS Modules](#2-css-modules)
3. [Dependencias clave](#3-dependencias-clave)
4. [Vite config](#4-vite-config)
5. [Router y navegación](#5-router-y-navegación)
6. [Contexto de autenticación](#6-contexto-de-autenticación)
7. [Servicios API](#7-servicios-api)
8. [Componentes compartidos](#8-componentes-compartidos)
9. [Páginas](#9-páginas)
10. [Estrategia de almacenamiento de perfil](#10-estrategia-de-almacenamiento-de-perfil)
11. [Tests](#11-tests)
12. [External API proxying](#12-external-api-proxying)
13. [Diagrama de flujo de autenticación](#13-diagrama-de-flujo-de-autenticación)

---

## 1. Estructura del proyecto frontend

```
frontend/
├── index.html                  # Entry point HTML
├── vite.config.js              # Configuración de Vite
├── package.json
├── .env                        # Variables de desarrollo
├── .env.production             # Variables de producción (VITE_API_URL + APIs externas)
├── public/
│   ├── data/
│   │   ├── jobs.json           # Datos estáticos de empleos (fallback)
│   │   └── courses.json        # Datos estáticos de cursos (fallback)
│   ├── favicon.png
│   └── legal/                  # Documentos legales (aviso, privacidad, términos)
│       ├── aviso-legal.html
│       ├── politica-privacidad.html
│       └── terminos-condiciones.html
├── src/
│   ├── main.jsx                # Entry point React
│   ├── App.jsx                 # Componente raíz (Router + Layout)
│   ├── App.module.css          # Estilos del layout principal
│   ├── index.css               # Variables CSS globales y reset
│   ├── config/
│   │   ├── api.js              # URL base del backend (VITE_API_URL)
│   │   ├── enums.js            # Constantes de roles y enums
│   │   └── externalApis.js     # Configuración de APIs externas
│   ├── context/
│   │   ├── AuthContext.jsx     # Contexto de autenticación global
│   │   └── ConexionApi.jsx     # Contexto de conexión a APIs externas
│   ├── services/
│   │   ├── api.js              # Cliente HTTP base (Fetch API + auth interceptor)
│   │   ├── authService.js      # API calls de autenticación
│   │   ├── jobService.js       # API calls de empleos
│   │   ├── courseService.js    # API calls de cursos
│   │   ├── applicationService.js # API calls de aplicaciones
│   │   └── adminService.js     # API calls de administración
│   ├── hooks/
│   │   ├── useFetch.js         # Hook genérico para fetching
│   │   ├── useDebounce.js      # Hook para debounce en búsquedas
│   │   ├── useCurriculum.js    # Hook para gestión de CV
│   │   ├── useSearch.js        # Hook para búsqueda con filtros
│   │   ├── useToggle.js        # Hook para toggle booleano
│   │   ├── useForm.js          # Hook para manejo de formularios
│   │   └── useLocalStorage.js  # Hook para lectura/escritura en localStorage
│   ├── data/
│   │   └── searchData.js       # Datos de filtros/tags para búsqueda
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx      # Barra de navegación principal
│   │   │   └── Navbar.module.css
│   │   ├── navigation/
│   │   │   ├── TabsNavigation.jsx
│   │   │   └── TabsNavigation.module.css
│   │   ├── jobs/
│   │   │   ├── JobCard.jsx
│   │   │   └── JobCard.module.css
│   │   ├── courses/
│   │   │   ├── CourseCard.jsx
│   │   │   └── CourseCard.module.css
│   │   ├── ProtectedRoute.jsx
│   │   ├── EditProfileModal.jsx
│   │   ├── EditProfileModal.module.css
│   │   └── CookieConsent.jsx   # Banner de cookies GDPR
│   │   └── CookieConsent.module.css
│   ├── pages/
│   │   ├── inicio/
│   │   │   ├── Home.jsx
│   │   │   └── Home.module.css
│   │   ├── autenticacion/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── LoginPage.module.css
│   │   │   ├── LoginPage.test.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── RegisterPage.module.css
│   │   │   └── RegisterPage.test.jsx
│   │   ├── empleos/
│   │   │   ├── JobSearchPage.jsx
│   │   │   ├── JobSearchPage.module.css
│   │   │   ├── JobSearchPage.test.jsx
│   │   │   ├── JobDetailPage.jsx
│   │   │   ├── JobDetailPage.module.css
│   │   │   ├── PostJobPage.jsx
│   │   │   ├── MyJobsPage.jsx
│   │   │   └── MyApplicationsPage.jsx
│   │   ├── cursos/
│   │   │   ├── CourseSearchPage.jsx
│   │   │   ├── CourseSearchPage.module.css
│   │   │   ├── CourseSearchPage.test.jsx
│   │   │   ├── CourseDetailPage.jsx
│   │   │   ├── CourseDetailPage.module.css
│   │   │   ├── PostCoursePage.jsx
│   │   │   ├── MyCoursesPage.jsx
│   │   │   └── SavedCoursesPage.jsx
│   │   ├── perfiles/
│   │   │   ├── ProfilePage.module.css
│   │   │   ├── CandidateProfilePage.jsx
│   │   │   └── CompanyProfilePage.jsx
│   │   ├── panel/
│   │   │   ├── DashboardPage.jsx
│   │   │   └── DashboardPage.module.css
│   │   ├── informacion/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AboutPage.module.css
│   │   │   ├── FAQPage.jsx
│   │   │   └── FAQPage.module.css
│   │   ├── compartidos/
│   │   │   ├── FormPage.module.css
│   │   │   └── MyListingsPage.module.css
│   │   ├── curriculo/
│   │   │   ├── CurriculumPage.jsx
│   │   │   └── CurriculumPage.module.css
│   │   ├── aplicaciones/
│   │   │   └── MyApplicationsPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminDashboard.module.css
│   │       ├── AdminUsers.jsx
│   │       ├── AdminUsers.module.css
│   │       ├── AdminJobs.jsx
│   │       ├── AdminJobs.module.css
│   │       ├── AdminCourses.jsx
│   │       ├── AdminCourses.module.css
│   │       ├── AdminApplications.jsx
│   │       ├── AdminApplications.module.css
│   │       ├── AdminNavigation.jsx
│   │       ├── AdminNavigation.module.css
│   │       ├── ApiStatusPage.jsx
│   │       ├── ApiStatusPage.module.css
│   │       └── ProtectedAdminRoute.jsx
│   └── test/
│       └── setup.js            # Setup global de testing
```

---

## 2. CSS Modules

El proyecto utiliza **CSS Modules** para el encapsulado de estilos. No se usa Tailwind CSS ni ningún otro framework CSS.

### ¿Cómo funciona?

Cada componente o página tiene su propio archivo `*.module.css`. Los nombres de clase se transforman en identificadores únicos durante el build, evitando colisiones.

```css
/* Navbar.module.css */
.nav {
  background-color: var(--color-black-light);
  padding: 1rem 2rem;
}
.navLink {
  color: var(--color-text-secondary);
  text-decoration: none;
}
.navLink:hover {
  color: var(--color-gold);
}
```

```jsx
// Navbar.jsx
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={styles.nav}>
      <a className={styles.navLink} href="/">Inicio</a>
    </nav>
  );
}
```

### Archivos CSS Modules (28 en total)

| Categoría | Archivos |
|---|---|
| Layout global | `App.module.css` |
| Componentes | `Navbar.module.css`, `TabsNavigation.module.css`, `JobCard.module.css`, `CourseCard.module.css`, `EditProfileModal.module.css`, `CookieConsent.module.css` |
| Páginas de inicio/auth | `Home.module.css`, `LoginPage.module.css`, `RegisterPage.module.css` |
| Empleos | `JobSearchPage.module.css`, `JobDetailPage.module.css` |
| Cursos | `CourseSearchPage.module.css`, `CourseDetailPage.module.css` |
| Perfiles | `ProfilePage.module.css` |
| Panel/Dashboard | `DashboardPage.module.css` |
| Información | `AboutPage.module.css`, `FAQPage.module.css` |
| Compartidos | `FormPage.module.css`, `MyListingsPage.module.css` |
| Currículo | `CurriculumPage.module.css` |
| Admin | `AdminDashboard.module.css`, `AdminUsers.module.css`, `AdminJobs.module.css`, `AdminCourses.module.css`, `AdminApplications.module.css`, `AdminNavigation.module.css`, `ApiStatusPage.module.css` |

---

## 3. Dependencias clave

**Archivo:** `frontend/package.json`

| Dependencia | Versión | Propósito |
|---|---|---|
| `react` | ^18 | UI Framework |
| `react-dom` | ^18 | Renderizado DOM |
| `react-router-dom` | ^6 | Routing (HashRouter) |

**Dependencias de desarrollo:**

| Dependencia | Propósito |
|---|---|
| `@vitejs/plugin-react` | Plugin de Vite para React (HMR, JSX transform) |
| `vite` | Bundler y dev server |
| `vitest` + `jsdom` | Testing con entorno DOM simulado |
| `@testing-library/react` | Testing de componentes React |
| `@testing-library/jest-dom` | Matchers DOM para tests |
| `@testing-library/user-event` | Simulación de eventos de usuario |

**Nota:** No se usa `axios`. Las peticiones HTTP se hacen con la Fetch API nativa del navegador mediante `services/api.js`.

---

## 4. Vite config

**Archivo:** `frontend/vite.config.js`

```javascript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      globals: true,
    },
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: { /* proxys para APIs externas en desarrollo */ },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    base: env.VITE_BASE_PATH || '/',
  };
});
```

### Diferencia entre .env y .env.production

| Archivo | Contenido clave | Se usa cuando |
|---|---|---|
| `frontend/.env` | `VITE_API_URL=http://localhost:3000` + APIs externas | `npm run dev` (local) |
| `frontend/.env.production` | `VITE_API_URL=https://laboria-backend.onrender.com` + APIs externas proxy | `npm run build` (producción) |

No se define `VITE_BASE_PATH` porque Vercel despliega en la raíz del dominio.

---

## 5. Router y navegación

**Archivo:** `frontend/src/App.jsx`

El proyecto usa **HashRouter** de React Router. Las rutas se representan con `#` en la URL (`https://dominio/#/empleos`), lo que evita problemas con servidores estáticos.

```jsx
<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Navbar />
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/empleos" element={<JobSearchPage />} />
      <Route path="/empleos/:id" element={<JobDetailPage />} />
      <Route path="/cursos" element={<CourseSearchPage />} />
      <Route path="/cursos/:id" element={<CourseDetailPage />} />
      <Route path="/acerca-de" element={<AboutPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/perfil/candidato" element={<ProtectedRoute roles={[CANDIDATE]}><CandidateProfilePage /></ProtectedRoute>} />
      <Route path="/perfil/empresa" element={<ProtectedRoute roles={[COMPANY_EMPLOYEES, COMPANY_STUDENTS, COMPANY_HYBRID]}><CompanyProfilePage /></ProtectedRoute>} />
      <Route path="/panel" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/publicar-oferta" element={<ProtectedRoute roles={[COMPANY_EMPLOYEES, COMPANY_HYBRID]}><PostJobPage /></ProtectedRoute>} />
      <Route path="/mis-ofertas" element={<ProtectedRoute roles={[COMPANY_EMPLOYEES, COMPANY_HYBRID]}><MyJobsPage /></ProtectedRoute>} />
      <Route path="/publicar-curso" element={<ProtectedRoute roles={[COMPANY_STUDENTS, COMPANY_HYBRID]}><PostCoursePage /></ProtectedRoute>} />
      <Route path="/mis-cursos" element={<ProtectedRoute roles={[COMPANY_STUDENTS, COMPANY_HYBRID]}><MyCoursesPage /></ProtectedRoute>} />
      <Route path="/mis-aplicaciones" element={<ProtectedRoute roles={[CANDIDATE]}><MyApplicationsPage /></ProtectedRoute>} />
      <Route path="/cursos-guardados" element={<ProtectedRoute roles={[CANDIDATE]}><SavedCoursesPage /></ProtectedRoute>} />
      <Route path="/curriculum" element={<ProtectedRoute roles={[CANDIDATE]}><CurriculumPage /></ProtectedRoute>} />
      {/* Admin */}
      <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
      <Route path="/admin/jobs" element={<ProtectedAdminRoute><AdminJobs /></ProtectedAdminRoute>} />
      <Route path="/admin/courses" element={<ProtectedAdminRoute><AdminCourses /></ProtectedAdminRoute>} />
      <Route path="/admin/applications" element={<ProtectedAdminRoute><AdminApplications /></ProtectedAdminRoute>} />
      <Route path="/admin/api-status" element={<ProtectedAdminRoute><ApiStatusPage /></ProtectedAdminRoute>} />
    </Routes>
  </main>
</Router>
```

### Rutas públicas vs protegidas

| Tipo | Rutas |
|---|---|
| Públicas | `/`, `/empleos`, `/empleos/:id`, `/cursos`, `/cursos/:id`, `/acerca-de`, `/faq`, `/login`, `/registro` |
| Protegidas (candidato) | `/perfil/candidato`, `/mis-aplicaciones`, `/cursos-guardados`, `/curriculum` |
| Protegidas (empresa) | `/perfil/empresa`, `/publicar-oferta`, `/mis-ofertas`, `/publicar-curso`, `/mis-cursos` |
| Protegidas (cualquier auth) | `/panel` |
| Admin | `/admin/*` |

---

## 6. Contexto de autenticación

**Archivo:** `frontend/src/context/AuthContext.jsx`

### Estado global

```javascript
const [user, setUser] = useState(null);        // Datos del usuario autenticado
const [loading, setLoading] = useState(true);   // Controla carga inicial
```

### Funciones expuestas

| Función | Descripción |
|---|---|
| `login(email, password)` | Llama a `authService.login()`, guarda token+user en localStorage, seedProfile |
| `register(data)` | Llama a `authService.register()`, guarda token+user en localStorage, seedProfile |
| `logout()` | Limpia token y user de localStorage, resetea estado |
| `updateProfile(profileData)` | Llama a `authService.updateProfile()`, actualiza estado y localStorage |
| `deleteAccount()` | Llama a `authService.deleteAccount()`, limpia todo (token, user, profile, curriculum) |
| `isCandidate()` / `isCompanyEmployees()` / `isCompanyStudents()` / `isCompanyHybrid()` / `isAdmin()` / `isAnyCompany()` | Funciones helper de verificación de rol |

### Flujo de inicialización

```
App carga
    │
    ▼
AuthProvider se monta
    │
    ▼
useEffect(() => {
    1. Leer token + user de localStorage
    2. Si existe:
        ├─ handleSetUser(JSON.parse(user))
        │    └─ seedProfile(user) — crea perfil si no existe
        └─ setLoading(false)
      Si NO existe:
        └─ setLoading(false)
}, [])
```

---

## 7. Servicios API

### Cliente HTTP base: `frontend/src/services/api.js`

Usa **Fetch API** nativa (no axios). Incluye interceptor que añade el token JWT automáticamente.

```javascript
import API_URL from '../config/api';

const BASE_URL = `${API_URL}/api`;

const handleResponse = async (response) => {
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) message = errorData.error;
    } catch (e) {}

    if (response.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    throw new Error(message);
  }
  return { data: await response.json() };
};

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const { headers: extraHeaders, ...fetchOptions } = options;
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...extraHeaders
    },
    ...fetchOptions
  });
  return handleResponse(response);
};

const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default api;
```

### Servicios específicos

| Servicio | Funciones | Endpoints |
|---|---|---|
| `authService.js` | `login`, `register`, `getProfile`, `updateProfile`, `deleteAccount`, `logout` | `POST /login`, `POST /register`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/account` |
| `jobService.js` | `list`, `detail`, `create`, `update`, `delete` | `GET /jobs`, `GET /jobs/:id`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id` |
| `courseService.js` | `list`, `detail`, `create`, `update`, `delete` | `GET /courses`, `GET /courses/:id`, `POST /courses`, `PUT /courses/:id`, `DELETE /courses/:id` |
| `applicationService.js` | `create`, `myApplications`, `jobApplications`, `updateStatus`, `cancel` | `POST /applications`, `GET /applications/my`, `GET /applications/job/:jobId`, `PUT /applications/:id/status`, `DELETE /applications/:id` |
| `adminService.js` | `getDashboardStats`, `getAllUsers`, ... | `GET /admin/dashboard`, `GET /admin/users`, ... |

---

## 8. Componentes compartidos

### Navbar

Renderiza navegación diferente según rol:

| Rol | Elementos visibles |
|---|---|
| No autenticado | Inicio, Empleos, Cursos, Acerca de, FAQ, Iniciar Sesión, Registrarse |
| CANDIDATE | Inicio, Empleos, Cursos, Acerca de, FAQ, Mi Perfil, Panel, Cerrar Sesión |
| COMPANY_* | Inicio, Empleos, Cursos, Acerca de, FAQ, Perfil Empresa, Panel, Cerrar Sesión |
| ADMIN | Todo lo anterior + Admin Dashboard |

### ProtectedRoute

```jsx
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};
```

### ProtectedAdminRoute

Variante para rutas de administración que redirige si no es admin.

---

## 9. Páginas

### Páginas públicas

| Página | Archivo | Descripción |
|---|---|---|
| Home | `pages/inicio/Home.jsx` | Landing page con hero, secciones de empleos/cursos destacados |
| Empleos | `pages/empleos/JobSearchPage.jsx` | Listado con filtros (categoría, ubicación, modalidad, búsqueda) |
| Empleo Detalle | `pages/empleos/JobDetailPage.jsx` | Vista detalle de empleo + botón "Aplicar" |
| Cursos | `pages/cursos/CourseSearchPage.jsx` | Listado con filtros (categoría, nivel, búsqueda) |
| Curso Detalle | `pages/cursos/CourseDetailPage.jsx` | Vista detalle de curso |
| About | `pages/informacion/AboutPage.jsx` | Información sobre la plataforma |
| FAQ | `pages/informacion/FAQPage.jsx` | Preguntas frecuentes |
| Login | `pages/autenticacion/LoginPage.jsx` | Formulario de inicio de sesión |
| Register | `pages/autenticacion/RegisterPage.jsx` | Formulario de registro |

### Páginas protegidas

| Página | Archivo | Rol | Descripción |
|---|---|---|---|
| Perfil Candidato | `pages/perfiles/CandidateProfilePage.jsx` | CANDIDATE | Ver/editar perfil, ver aplicaciones, eliminar cuenta |
| Perfil Empresa | `pages/perfiles/CompanyProfilePage.jsx` | COMPANY_* | Ver/editar perfil empresa, gestionar empleos/cursos |
| Dashboard | `pages/panel/DashboardPage.jsx` | Cualquier auth | Panel de control con resumen de actividad |
| Publicar Oferta | `pages/empleos/PostJobPage.jsx` | COMPANY_EMPLOYEES, COMPANY_HYBRID | Crear nuevo empleo |
| Mis Ofertas | `pages/empleos/MyJobsPage.jsx` | COMPANY_EMPLOYEES, COMPANY_HYBRID | Gestionar empleos publicados |
| Publicar Curso | `pages/cursos/PostCoursePage.jsx` | COMPANY_STUDENTS, COMPANY_HYBRID | Crear nuevo curso |
| Mis Cursos | `pages/cursos/MyCoursesPage.jsx` | COMPANY_STUDENTS, COMPANY_HYBRID | Gestionar cursos publicados |
| Mis Aplicaciones | `pages/aplicaciones/MyApplicationsPage.jsx` | CANDIDATE | Ver aplicaciones enviadas |
| Cursos Guardados | `pages/cursos/SavedCoursesPage.jsx` | CANDIDATE | Cursos guardados como favoritos |
| Currículum | `pages/curriculo/CurriculumPage.jsx` | CANDIDATE | Gestión de CV |

### Páginas de administración

| Página | Archivo | Descripción |
|---|---|---|
| Admin Dashboard | `pages/admin/AdminDashboard.jsx` | Estadísticas del sistema |
| Admin Users | `pages/admin/AdminUsers.jsx` | Gestión de usuarios |
| Admin Jobs | `pages/admin/AdminJobs.jsx` | Gestión de empleos |
| Admin Courses | `pages/admin/AdminCourses.jsx` | Gestión de cursos |
| Admin Applications | `pages/admin/AdminApplications.jsx` | Gestión de aplicaciones |
| API Status | `pages/admin/ApiStatusPage.jsx` | Estado de APIs externas |

---

## 10. Estrategia de almacenamiento de perfil

**Problema original:** El backend solo maneja `name` y `email` en el modelo User. Los campos extendidos del perfil (teléfono, bio, habilidades, industria, etc.) no tienen modelo en la base de datos.

**Solución:** Almacenar perfil extendido en `localStorage` del navegador bajo la clave `profile_{userId}`.

### Flujo de lectura/escritura

```
Login/Registro (AuthContext.handleSetUser)
    │
    ├─ seedProfile(user)
    │    └─ ¿Ya existe profile_{userId} en localStorage?
    │       ├─ Sí → no hacer nada
    │       └─ No → crear perfil inicial con name/email
    │
    ▼
EditProfileModal (guardar)
  ├─ Guarda TODOS los campos en localStorage (profile_{userId})
  └─ Envía solo { name, email } a PUT /users/profile/me (backend)
    │
    ▼
Páginas de perfil
  └─ Lee de localStorage (profile_{userId})
     └─ Fallback → user.name
```

---

## 11. Tests

**Total:** 59 tests en 8 archivos (Vitest + Testing Library + jsdom).

| Archivo | Tests | Descripción |
|---|---|---|
| `App.test.jsx` | — | Tests del componente raíz |
| `Home.test.jsx` | — | Tests de la página de inicio |
| `LoginPage.test.jsx` | — | Tests del formulario de login |
| `RegisterPage.test.jsx` | — | Tests del formulario de registro |
| `JobSearchPage.test.jsx` | — | Tests de búsqueda de empleos |
| `CourseSearchPage.test.jsx` | — | Tests de búsqueda de cursos |
| `Navbar.test.jsx` | — | Tests de navegación |
| `AuthContext.test.jsx` | — | Tests del contexto de autenticación |

**Ejecución:**

```bash
cd frontend
npx vitest run     # Una vez
npx vitest         # Modo watch
```

**Total general:** 77 tests (59 frontend + 18 backend).

---

## 12. External API proxying

### En desarrollo (Vite proxy)

Las rutas `/api/*` en el frontend se redirigen mediante el proxy de Vite a las APIs externas reales. Configurado en `vite.config.js` → `server.proxy`.

### En producción (Vercel rewrites)

Vercel hace el mismo trabajo con su sistema de `rewrites` definido en `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/jcyl/(.*)", "destination": "https://data.opendatasoft.com/$1" },
    { "source": "/api/jobicy/(.*)", "destination": "https://jobicy.com/$1" },
    { "source": "/api/himalayas/(.*)", "destination": "https://himalayas.app/$1" },
    { "source": "/api/remotive/(.*)", "destination": "https://remotive.com/$1" },
    { "source": "/api/arbeitnow/(.*)", "destination": "https://www.arbeitnow.com/$1" },
    { "source": "/api/khanacademy/(.*)", "destination": "https://www.khanacademy.org/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Esto evita problemas de CORS al llamar APIs externas desde el frontend. La última regla redirige todas las rutas SPA a `index.html`.

---

## 13. Diagrama de flujo de autenticación

```
USUARIO                        FRONTEND                          BACKEND
   │                              │                                │
   │  Ingresa email+password      │                                │
   │─────────────────────────────>│                                │
   │                              │  POST /api/users/login         │
   │                              │───────────────────────────────>│
   │                              │                                │  Validar campos
   │                              │                                │  Buscar usuario
   │                              │                                │  Comparar password
   │                              │                                │  Generar JWT
   │                              │  { user, token }               │
   │                              │<───────────────────────────────│
   │                              │                                │
   │                              │  localStorage:                 │
   │                              │  - setItem('token', token)     │
   │                              │  - setItem('user', JSON...)    │
   │                              │  handleSetUser(user)           │
   │                              │  └─ seedProfile(user)          │
   │                              │                                │
   │  Redirigir a Home/Perfil     │                                │
   │<─────────────────────────────│                                │
   │                              │                                │
   │  (Recarga la página)         │                                │
   │─────────────────────────────>│                                │
   │                              │  useEffect de AuthProvider:    │
   │                              │  1. Leer token + user de       │
   │                              │     localStorage               │
   │                              │  2. handleSetUser(user)        │
   │                              │  3. setLoading(false)          │
   │                              │                                │
   │  App renderizada con sesión  │                                │
   │<─────────────────────────────│                                │
```
