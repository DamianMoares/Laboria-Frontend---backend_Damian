# Volumen 4: Frontend

## Índice del volumen

1. [Estructura del proyecto frontend](#1-estructura-del-proyecto-frontend)
2. [Dependencias clave](#2-dependencias-clave)
3. [Vite config](#3-vite-config)
4. [Router y navegación](#4-router-y-navegación)
5. [Contexto de autenticación](#5-contexto-de-autenticación)
6. [Servicios API](#6-servicios-api)
7. [Componentes compartidos](#7-componentes-compartidos)
8. [Páginas](#8-páginas)
9. [Estrategia de almacenamiento de perfil](#9-estrategia-de-almacenamiento-de-perfil)
10. [Diagrama de flujo de autenticación](#10-diagrama-de-flujo-de-autenticación)

---

## 1. Estructura del proyecto frontend

```
frontend/
├── index.html              # Entry point HTML
├── vite.config.js          # Configuración de Vite
├── package.json
├── .env                    # Variables locales (solo VITE_API_URL=http://localhost:3000)
├── .env.production         # Variables de producción (VITE_API_URL + VITE_BASE_PATH)
├── public/
│   └── data/
│       ├── jobs.json       # Datos estáticos de empleos (fallback)
│       └── courses.json    # Datos estáticos de cursos (fallback)
├── src/
│   ├── main.jsx            # Punto de entrada React + Router
│   ├── App.jsx             # Componente raíz
│   ├── index.css           # Estilos globales Tailwind
│   ├── api.js              # Instancia de axios con configuración base
│   ├── context/
│   │   └── AuthContext.jsx # Contexto de autenticación global
│   ├── services/
│   │   ├── authService.js  # API calls de autenticación
│   │   ├── jobService.js   # API calls de empleos
│   │   ├── courseService.js# API calls de cursos
│   │   └── applicationService.js # API calls de aplicaciones
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoginModal.jsx
│   │   ├── RegisterModal.jsx
│   │   ├── EditProfileModal.jsx
│   │   └── ApplicationModal.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── about/
│       │   └── AboutPage.jsx
│       ├── contacto/
│       │   └── ContactoPage.jsx
│       ├── catalogos/
│       │   ├── EmpleosPage.jsx      # Listado de empleos
│       │   ├── CursosPage.jsx       # Listado de cursos
│       │   ├── EmpleoDetallePage.jsx# Detalle de un empleo
│       │   └── CursoDetallePage.jsx # Detalle de un curso
│       ├── perfiles/
│       │   ├── CandidateProfilePage.jsx  # Perfil candidato
│       │   └── CompanyProfilePage.jsx    # Perfil empresa
│       ├── admin/
│       │   └── AdminDashboardPage.jsx    # Dashboard admin
│       └── auth/
│           ├── LoginPage.jsx
│           └── RegisterPage.jsx
```

---

## 2. Dependencias clave

**Archivo:** `frontend/package.json`

| Dependencia | Versión | Propósito |
|---|---|---|
| `react` | ^18 | UI Framework |
| `react-dom` | ^18 | Renderizado DOM |
| `react-router-dom` | ^6 | Routing (HashRouter) |
| `axios` | ^1 | HTTP client para llamadas API |
| `@tailwindcss/vite` | ^4 | Plugin de Tailwind para Vite |
| `tailwindcss` | ^4 | Framework CSS utility-first |

**Dependencias de desarrollo:**

| Dependencia | Propósito |
|---|---|
| `@vitejs/plugin-react` | Plugin de Vite para React (HMR, JSX transform) |
| `vite` | Bundler y dev server |

---

## 3. Vite config

**Archivo:** `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || '/',
})
```

| Elemento | Explicación |
|---|---|
| `react()` | Plugin que habilita JSX transform, Fast Refresh (HMR), etc. |
| `tailwindcss()` | Plugin que procesa las directivas `@tailwind`/`@apply` de Tailwind v4 |
| `base` | Ruta base para assets. En local: `/`. En producción: `/Laboria-Frontend---backend_Damian/` (definido en `.env.production`) |

### Diferencia entre .env y .env.production

| Archivo | Contenido | Se usa cuando |
|---|---|---|
| `frontend/.env` | `VITE_API_URL=http://localhost:3000` | `npm run dev` (local) |
| `frontend/.env.production` | `VITE_API_URL=http://localhost:3000` + `VITE_BASE_PATH=/Laboria-Frontend---backend_Damian/` | `npm run build` (producción) |

---

## 4. Router y navegación

**Archivo:** `frontend/src/main.jsx`

```javascript
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
```

**¿Por qué HashRouter?**

GitHub Pages no soporta el HTML5 History API (`pushState`). Con `HashRouter`, las rutas usan `#/ruta` en lugar de `/ruta`, lo que funciona sin configuración del servidor.

### Estructura de rutas en App.jsx

```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contacto" element={<ContactoPage />} />
  <Route path="/empleos" element={<EmpleosPage />} />
  <Route path="/empleos/:id" element={<EmpleoDetallePage />} />
  <Route path="/cursos" element={<CursosPage />} />
  <Route path="/cursos/:id" element={<CursoDetallePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/perfil" element={<ProtectedRoute><CandidateProfilePage /></ProtectedRoute>} />
  <Route path="/perfil-empresa" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
  <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
</Routes>
```

---

## 5. Contexto de autenticación

**Archivo:** `frontend/src/context/AuthContext.jsx`

### Estado global

```javascript
const [user, setUser] = useState(null);        // Datos del usuario autenticado
const [loading, setLoading] = useState(true);   // Controla carga inicial
const [profile, setProfile] = useState(null);   // Perfil extendido (localStorage)
```

### Funciones expuestas

| Función | Descripción |
|---|---|
| `login(email, password)` | Llama a `authService.login()`, guarda token en localStorage, setea usuario y perfil |
| `register(data)` | Llama a `authService.register()`, guarda token y usuario |
| `logout()` | Limpia token, usuario y perfil del estado y localStorage |
| `updateUser(userData)` | Actualiza el estado `user` (tras editar perfil) |
| `deleteAccount()` | **Async**: llama a `authService.deleteAccount()`, luego limpia todo (token, user, profile de localStorage) |
| `updateProfile(profileData)` | Escribe en localStorage bajo key `profile_{userId}` |
| `getProfile(userId)` | Lee de localStorage key `profile_{userId}` |
| `seedProfile(user)` | Crea un perfil inicial en localStorage al registrarse/login: para candidatos guarda `firstName`, para empresas guarda `companyName` |

### Flujo de inicialización

```
App carga
    │
    ▼
AuthProvider se monta
    │
    ▼
useEffect(() => {
   1. Leer token de localStorage
   2. Si existe token:
        ├─ Decodificar token (jwt-decode) para obtener userId
        ├─ llamar GET /api/users/:id para obtener datos actualizados
        ├─ Leer perfil de localStorage (key: profile_{userId})
        ├─ setUser(datos)
        ├─ setProfile(datosPerfil)
        └─ setLoading(false)
      Si NO existe:
        └─ setLoading(false)
}, [])
```

---

## 6. Servicios API

**Archivo:** `frontend/src/api.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: añade token Bearer a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Servicios específicos

| Servicio | Funciones | Endpoints |
|---|---|---|
| `authService.js` | `login`, `register`, `getProfile`, `updateProfile`, `deleteAccount` | `POST /login`, `POST /register`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/account` |
| `jobService.js` | `list`, `detail`, `create`, `update`, `delete` | `GET /jobs`, `GET /jobs/:id`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id` |
| `courseService.js` | `list`, `detail`, `create`, `update`, `delete` | `GET /courses`, `GET /courses/:id`, `POST /courses`, `PUT /courses/:id`, `DELETE /courses/:id` |
| `applicationService.js` | `create`, `myApplications`, `jobApplications`, `updateStatus`, `cancel` | `POST /applications`, `GET /applications/my`, `GET /applications/job/:jobId`, `PUT /applications/:id/status`, `DELETE /applications/:id` |

---

## 7. Componentes compartidos

### Navbar (`frontend/src/components/Navbar/Navbar.jsx`)

Renderiza navegación diferente según rol:

| Rol | Elementos visibles |
|---|---|
| No autenticado | Inicio, Empleos, Cursos, About, Contacto, Iniciar Sesión, Registrarse |
| CANDIDATE | Inicio, Empleos, Cursos, About, Contacto, Mi Perfil, Cerrar Sesión |
| COMPANY_* | Inicio, Empleos, Cursos, About, Contacto, Perfil Empresa, Cerrar Sesión |
| ADMIN | Todo lo anterior + Panel Admin |

### ProtectedRoute (`frontend/src/components/ProtectedRoute.jsx`)

```javascript
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return user ? children : <Navigate to="/login" />;
};
```

### Modales

| Modal | Propósito | Abierto desde |
|---|---|---|
| `LoginModal.jsx` | Login sin cambiar de página (actualmente no usado, se usa LoginPage) | — |
| `RegisterModal.jsx` | Registro sin cambiar de página (actualmente no usado, se usa RegisterPage) | — |
| `EditProfileModal.jsx` | Editar nombre y email del perfil | CandidateProfilePage, CompanyProfilePage |
| `ApplicationModal.jsx` | Formulario para aplicar a un empleo | EmpleoDetallePage |

---

## 8. Páginas

### Páginas públicas

| Página | Archivo | Descripción |
|---|---|---|
| Home | `pages/HomePage.jsx` | Landing page con hero, secciones de empleos/cursos destacados |
| About | `pages/about/AboutPage.jsx` | Información sobre la plataforma |
| Contacto | `pages/contacto/ContactoPage.jsx` | Formulario de contacto |
| Empleos | `pages/catalogos/EmpleosPage.jsx` | Listado con filtros (categoría, ubicación, modalidad, búsqueda) |
| Cursos | `pages/catalogos/CursosPage.jsx` | Listado con filtros (categoría, nivel, búsqueda) |
| Empleo Detalle | `pages/catalogos/EmpleoDetallePage.jsx` | Vista detalle de empleo + botón "Aplicar" |
| Curso Detalle | `pages/catalogos/CursoDetallePage.jsx` | Vista detalle de curso |
| Login | `pages/auth/LoginPage.jsx` | Formulario de inicio de sesión |
| Register | `pages/auth/RegisterPage.jsx` | Formulario de registro |

### Páginas protegidas

| Página | Archivo | Rol | Descripción |
|---|---|---|---|
| Perfil Candidato | `pages/perfiles/CandidateProfilePage.jsx` | CANDIDATE | Ver/editar perfil, ver aplicaciones, eliminar cuenta |
| Perfil Empresa | `pages/perfiles/CompanyProfilePage.jsx` | COMPANY_* | Ver/editar perfil empresa, gestionar empleos/cursos publicados, eliminar cuenta |
| Admin Dashboard | `pages/admin/AdminDashboardPage.jsx` | ADMIN | Estadísticas, gestión de usuarios, empleos, cursos, aplicaciones |

---

## 9. Estrategia de almacenamiento de perfil

**Problema original:** El backend solo maneja `name` y `email` en el modelo User. Los campos extendidos del perfil (teléfono, bio, habilidades, industria, etc.) no tienen modelo en la base de datos.

**Solución:** Almacenar perfil extendido en `localStorage` del navegador.

### Flujo de lectura/escritura

```
┌─────────────────────────────────────────────────────────────┐
│                     localStorage                            │
│                                                             │
│  key: "profile_uuid-del-usuario"                            │
│  value: {                                                   │
│    firstName: "Carlos",         // solo CANDIDATE           │
│    lastName: "García",                                      │
│    phone: "+34 600 000 000",                                │
│    location: "Madrid",                                      │
│    bio: "Desarrollador...",                                 │
│    skills: ["JavaScript", "React"],                         │
│    experience: "3 años",                                    │
│    education: "Ingeniería...",                              │
│    avatar: "url..."                                         │
│  }                                                          │
│  — O —                                                      │
│  value: {                                                   │
│    companyName: "TechCorp",      // solo COMPANY_*          │
│    industry: "Tecnología",                                  │
│    companySize: "50-200",                                   │
│    description: "Empresa...",                               │
│    website: "https://...",                                  │
│    location: "Barcelona",                                   │
│    phone: "+34 93 000 00 00"                                │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

### seedProfile (se ejecuta al registrarse o al hacer login por primera vez)

```
login() / register()
    │
    ▼
seedProfile(user)
    │
    ▼
¿Ya existe profile_{userId} en localStorage?
    ├─ Sí → No hacer nada (ya tiene perfil)
    └─ No → Crear perfil inicial:
         ├─ Si role === CANDIDATE:
         │    { firstName: user.name.split(' ')[0],
         │      phone: '', location: '', bio: '',
         │      skills: [], experience: '', education: '' }
         └─ Si role === COMPANY_*:
              { companyName: user.name,
                industry: '', companySize: '',
                description: '', website: '', location: '' }
```

### updateProfile (componente EditProfileModal)

```
Usuario edita perfil en el modal
    │
    ▼
PUT /api/users/:id  ← solo actualiza name y email en BD
    │
    ▼
localStorage.setItem('profile_{userId}', nuevoPerfil)  ← guarda todo
    │
    ▼
AuthContext.updateUser(newUserData)
AuthContext.updateProfile(newProfileData)
    │
    ▼
UI se re-renderiza con datos actualizados
```

---

## 10. Diagrama de flujo de autenticación

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
   │                              │  - setItem('userId', id)       │
   │                              │  setUser(user)                 │
   │                              │  seedProfile(user)             │
   │                              │                                │
   │  Redirigir a Home/Perfil     │                                │
   │<─────────────────────────────│                                │
   │                              │                                │
   │  (Días después, recarga)     │                                │
   │─────────────────────────────>│                                │
   │                              │  useEffect de AuthProvider:    │
   │                              │  1. Leer token de localStorage │
   │                              │  2. Decodificar token          │
   │                              │  3. GET /api/users/:id         │
   │                              │───────────────────────────────>│
   │                              │                                │  Buscar por ID
   │                              │  { user }                      │
   │                              │<───────────────────────────────│
   │                              │  4. Leer profile de localStorage │
   │                              │  5. setUser() + setProfile()   │
   │                              │  6. setLoading(false)          │
   │                              │                                │
   │  App renderizada con sesión  │                                │
   │<─────────────────────────────│                                │
```
