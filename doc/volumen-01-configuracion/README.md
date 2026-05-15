# Volumen 1: Configuración del Proyecto

## Índice del volumen

1. [.gitignore](#1-gitignore)
2. [backend/.env](#2-backendenv)
3. [frontend/.env](#3-frontendenv)
4. [frontend/.env.production](#4-frontendenvproduction)
5. [frontend/vite.config.js](#5-frontendviteconfigjs)
6. [frontend/index.html](#6-frontendindexhtml)
7. [backend/package.json](#7-backendpackagejson)
8. [frontend/package.json](#8-frontendpackagejson)
9. [frontend/src/index.css](#9-frontendsrcindexcss)

---

## 1. `.gitignore`

**Ubicación:** raíz del proyecto  
**Propósito:** Evita que archivos innecesarios o sensibles se suban al repositorio.

```gitignore
node_modules/
dist/
.env
*.db
.DS_Store
*.log
```

**Elementos ignorados:**

| Elemento | Motivo |
|---|---|
| `node_modules/` | Dependencias de npm — se regeneran con `npm install` |
| `dist/` | Build de producción del frontend — lo genera Vite |
| `.env` | Variables de entorno con credenciales locales |
| `*.db` | Archivos SQLite (ya no se usan, pero por seguridad) |
| `.DS_Store` | Archivos del sistema macOS |
| `*.log` | Logs de la aplicación |

---

## 2. `backend/.env`

**Ubicación:** `backend/.env`  
**Propósito:** Variables de entorno para el backend en desarrollo local.

```
# ==========================================
# CONFIGURACIÓN BACKEND - LABORIA (PostgreSQL)
# ==========================================
DATABASE_URL=postgresql://postgres:aironhack@localhost:5432/laboria

JWT_SECRET=laboria-super-secreto-jwt-development-2026

JWT_EXPIRES_IN=7d

NODE_ENV=development
PORT=3000

# Email Service (Resend) - opcional para desarrollo
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

**Detalle de cada variable:**

| Variable | Valor | Explicación |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:aironhack@localhost:5432/laboria` | Cadena de conexión a PostgreSQL local. Formato: `postgresql://usuario:password@host:puerto/base_de_datos` |
| `JWT_SECRET` | `laboria-super-secreto-...` | Clave secreta para firmar los tokens JWT. En producción se genera automáticamente en Render |
| `JWT_EXPIRES_IN` | `7d` | Tiempo de expiración del token: 7 días |
| `NODE_ENV` | `development` | Modo de ejecución. `development` muestra stack traces en errores; `production` los oculta |
| `PORT` | `3000` | Puerto donde corre el servidor Express |
| `RESEND_API_KEY` | (comentado) | API key de Resend para envío de emails. Opcional en desarrollo |

---

## 3. `frontend/.env`

**Ubicación:** `frontend/.env`  
**Propósito:** Variables de entorno para el frontend en **desarrollo local**.  
**Importante:** Este archivo NO debe contener `VITE_BASE_PATH` porque rompe el dev server local.

```
# API 1 - Junta Castilla y León Empleo (usa proxy Vite)
VITE_JOBS_API_1_URL=/api/jcyl/api/records/1.0/search/?dataset=ofertas-de-empleo@jcyl
VITE_JOBS_API_1_KEY=

# API 2 - SerpApi Google Jobs (usa proxy Vite)
VITE_JOBS_API_2_URL=https://serpapi.com/search
VITE_JOBS_API_2_KEY=af56fbbafa27a6085c4b284970657a383a6e1d7f0bf7a11b1fbc1ba7958839b0

# API 3 - Jobicy Remote Jobs (usa proxy Vite)
VITE_JOBS_API_3_URL=/api/jobicy/api/v2/remote-jobs
VITE_JOBS_API_3_KEY=

# API 4 - Himalayas Remote Jobs (usa proxy Vite)
VITE_JOBS_API_4_URL=/api/himalayas/jobs/api
VITE_JOBS_API_4_KEY=

# API 5 - Remotive Remote Jobs (usa proxy Vite)
VITE_JOBS_API_5_URL=/api/remotive/api/remote-jobs
VITE_JOBS_API_5_KEY=

# API 6 - Arbeitnow Job Board (usa proxy Vite)
VITE_JOBS_API_6_URL=/api/arbeitnow/api/job-board-api
VITE_JOBS_API_6_KEY=

# YouTube Data API
VITE_COURSES_YOUTUBE_KEY=AIzaSyAPW4sS96kSSJvShWKFdwjJACEmZNFi294

# Google Custom Search
VITE_COURSES_GOOGLE_SEARCH_KEY=tu_api_key_google
VITE_GOOGLE_CSE_ID=tu_custom_search_engine_id

# Bing Search API
VITE_COURSES_BING_KEY=tu_api_key_bing

# APIs de Cursos
VITE_COURSES_API_1_URL=/api/khanacademy/api/v1/topic/root
VITE_COURSES_API_1_KEY=

# API Backend Laboria
VITE_API_URL=http://localhost:3000
```

**Detalle de cada variable:**

| Variable | Propósito |
|---|---|
| `VITE_JOBS_API_1_URL` | API de empleos de la Junta de Castilla y León (proxy Vite) |
| `VITE_JOBS_API_2_URL` + `_KEY` | SerpApi para Google Jobs (requiere API key) |
| `VITE_JOBS_API_3_URL` | Jobicy — empleos remotos |
| `VITE_JOBS_API_4_URL` | Himalayas — empleos remotos |
| `VITE_JOBS_API_5_URL` | Remotive — empleos remotos |
| `VITE_JOBS_API_6_URL` | Arbeitnow — bolsa de trabajo |
| `VITE_COURSES_YOUTUBE_KEY` | YouTube Data API para buscar cursos |
| `VITE_COURSES_GOOGLE_SEARCH_KEY` + `VITE_GOOGLE_CSE_ID` | Google Custom Search para cursos |
| `VITE_COURSES_BING_KEY` | Bing Search API para cursos |
| `VITE_COURSES_API_1_URL` | Khan Academy API para cursos |
| `VITE_API_URL` | URL del backend de Laboria |

**Nota:** Las rutas que empiezan con `/api/...` usan el **proxy de Vite** en desarrollo para evitar CORS. En producción, estas llamadas irían directamente a las APIs externas desde el navegador.

---

## 4. `frontend/.env.production`

**Ubicación:** `frontend/.env.production`  
**Propósito:** Variables que Vite usa SOLO durante el build de producción (`vite build`).

```
VITE_BASE_PATH=/Laboria-Frontend---backend_Damian/

VITE_API_URL=http://localhost:3000
```

**Detalle de cada variable:**

| Variable | Valor | Explicación |
|---|---|---|
| `VITE_BASE_PATH` | `/Laboria-Frontend---backend_Damian/` | Ruta base para GitHub Pages. Vite la usa para generar las URLs de assets (CSS, JS, imágenes). Sin esto, los assets buscan en `/` y fallan con 404 |
| `VITE_API_URL` | `http://localhost:3000` | URL del backend. Temporalmente apunta a localhost hasta que el backend se despliegue en producción |

---

## 5. `frontend/vite.config.js`

**Ubicación:** `frontend/vite.config.js`  
**Propósito:** Configuración del bundler Vite.

```javascript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 5173,           // Puerto del dev server
      open: true,            // Abre navegador automáticamente
      proxy: {
        '/api/jcyl': {       // Proxy para APIs externas
          target: 'https://data.opendatasoft.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jcyl/, ''),
        },
        '/api/serpapi': {    // SerpApi
          target: 'https://serpapi.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/serpapi/, ''),
        },
        '/api/jobicy': {     // Jobicy
          target: 'https://jobicy.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/jobicy/, ''),
        },
        '/api/himalayas': {  // Himalayas
          target: 'https://himalayas.app',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/himalayas/, ''),
        },
        '/api/remotive': {   // Remotive
          target: 'https://remotive.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/remotive/, ''),
        },
        '/api/arbeitnow': {  // Arbeitnow
          target: 'https://www.arbeitnow.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/arbeitnow/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',        // Directorio de salida
      sourcemap: true        // Source maps para debugging
    },
    base: env.VITE_BASE_PATH || '/',  // Base path dinámico
  };
});
```

**Detalle de cada sección:**

| Sección | Explicación |
|---|---|
| `plugins: [react()]` | Plugin de React para Vite (HMR, JSX transform) |
| `server.port: 5173` | Puerto del servidor de desarrollo |
| `server.proxy` | **Proxy inverso**: en desarrollo, las rutas `/api/jcyl/*` se redirigen a `data.opendatasoft.com` sin que el navegador vea CORS. Esto permite que el frontend en `localhost:5173` llame a APIs externas como si fueran del mismo origen |
| `build.outDir: 'dist'` | Carpeta donde Vite genera el build de producción |
| `base: env.VITE_BASE_PATH \|\| '/'` | Base path dinámico: en local es `/`, en GitHub Pages es `/Laboria-Frontend---backend_Damian/` |

**Funcionamiento del proxy:**

```
Navegador                    Vite Dev Server               API Externa
   │                             │                             │
   │  fetch(/api/jcyl/...)       │                             │
   │────────────────────────────>│                             │
   │                             │  https://data.opendatasoft  │
   │                             │  .com/records/1.0/...       │
   │                             │────────────────────────────>│
   │                             │                             │
   │                             │        Respuesta            │
   │                             │<────────────────────────────│
   │        Respuesta            │                             │
   │<────────────────────────────│                             │
```

---

## 6. `frontend/index.html`

**Ubicación:** `frontend/index.html`  
**Propósito:** HTML raíz de la SPA. Vite lo usa como template e inyecta los assets.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Laboria</title>
    <link rel="icon" type="image/png" href="/favicon.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

| Elemento | Explicación |
|---|---|
| `<html lang="es">` | Idioma español para SEO y accesibilidad |
| `<meta viewport>` | Responsive design en móviles |
| `<div id="root">` | Contenedor donde React monta la aplicación |
| `<script type="module">` | Vite usa ES modules nativos. `main.jsx` es el entry point |
| `<link rel="icon">` | Favicon de la página |

---

## 7. `backend/package.json`

**Ubicación:** `backend/package.json`  
**Propósito:** Dependencias y scripts del backend Node.js.

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "commonjs",
  "prisma": {
    "seed": "node prisma/seed.js"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "npx prisma generate && npx prisma migrate deploy",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-rate-limit": "^8.5.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.20.0",
    "resend": "^3.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.14",
    "prisma": "^6.19.3"
  }
}
```

**Scripts:**

| Script | Comando | Propósito |
|---|---|---|
| `start` | `node server.js` | Inicia el servidor en producción |
| `dev` | `nodemon server.js` | Inicia con hot-reload para desarrollo |
| `build` | `npx prisma generate && npx prisma migrate deploy` | Genera Prisma Client y aplica migraciones pendientes |
| `test` | `echo "Error..."` | Placeholder (sin tests implementados) |

**Dependencias clave:**

| Paquete | Propósito |
|---|---|
| `express` | Framework HTTP |
| `@prisma/client` + `prisma` | ORM para PostgreSQL |
| `pg` | Driver nativo de PostgreSQL para Prisma |
| `bcryptjs` | Hash de contraseñas |
| `jsonwebtoken` | JWT para autenticación |
| `cors` | Middleware CORS |
| `express-rate-limit` | Rate limiting |
| `dotenv` | Variables de entorno |
| `resend` | Envío de emails |
| `nodemon` | Hot reload en desarrollo |

---

## 8. `frontend/package.json`

**Ubicación:** `frontend/package.json`  
**Propósito:** Dependencias y scripts del frontend React.

```json
{
  "name": "laboria",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.2.11",
    "vitest": "^1.4.0",
    "jsdom": "^24.0.0",
    "@testing-library/react": "^14.2.1",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitest/ui": "^1.4.0"
  }
}
```

**Scripts:**

| Script | Propósito |
|---|---|
| `npm run dev` | Inicia Vite dev server con HMR en `localhost:5173` |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente para verificar antes de deploy |
| `npm test` | Ejecuta tests con Vitest |
| `npm run test:ui` | Tests con interfaz gráfica |

**Dependencias clave:**

| Paquete | Propósito |
|---|---|
| `react` + `react-dom` | UI library |
| `react-router-dom` | Enrutamiento SPA |
| `vite` + `@vitejs/plugin-react` | Bundler y dev server con soporte React |
| `vitest` + `jsdom` | Testing con entorno DOM simulado |
| `@testing-library/react` | Testing de componentes React |

---

## 9. `frontend/src/index.css`

**Ubicación:** `frontend/src/index.css`  
**Propósito:** Estilos globales y variables CSS del tema.

**Variables CSS definidas:**

```css
:root {
  --color-black: #0a0a0a;
  --color-black-light: #1a1a1a;
  --color-black-medium: #2a2a2a;
  --color-gold: #d4af37;
  --color-gold-light: #f4d03f;
  --color-gold-dark: #b8960c;
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
  --color-text-muted: #888888;
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #1a1a1a;
  --color-bg-tertiary: #2a2a2a;
  --color-border: #3a3a3a;
  --color-border-gold: #d4af37;
}
```

**Paleta de colores:**

| Variable | Color | Uso |
|---|---|---|
| `--color-black` | `#0a0a0a` | Fondo principal (modo oscuro) |
| `--color-gold` | `#d4af37` | Dorado corporativo — botones, bordes, enlaces |
| `--color-gold-light` | `#f4d03f` | Hover de elementos dorados |
| `--color-text-primary` | `#ffffff` | Texto principal |
| `--color-text-secondary` | `#cccccc` | Texto secundario |
| `--color-bg-secondary` | `#1a1a1a` | Fondos de tarjetas y secciones |

También define estilos base para `body`, enlaces, botones, inputs y layout responsive.
