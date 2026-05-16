# Volumen 5: Despliegue

## Índice del volumen

1. [Arquitectura de despliegue](#1-arquitectura-de-despliegue)
2. [Vercel (Frontend)](#2-vercel-frontend)
3. [Render (Backend + Base de datos)](#3-render-backend--base-de-datos)
4. [Configuración de Vercel](#4-configuración-de-vercel)
5. [Configuración de Render](#5-configuración-de-render)
6. [CORS entre frontend y backend](#6-cors-entre-frontend-y-backend)
7. [Seed de datos en producción](#7-seed-de-datos-en-producción)
8. [Variables de entorno en cada entorno](#8-variables-de-entorno-en-cada-entorno)
9. [Procedimiento de deploy completo](#9-procedimiento-de-deploy-completo)
10. [Verificar comunicación frontend-backend](#10-verificar-comunicación-frontend-backend)
11. [Solución de problemas comunes](#11-solución-de-problemas-comunes)

---

## 1. Arquitectura de despliegue

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Vercel                                       │
│  https://laboria-frontend-backend-damian.vercel.app                 │
│                                                                     │
│  Sirve: SPA React (index.html + assets JS/CSS)                     │
│  Rewrites: /api/* → APIs externas (evita CORS)                     │
│  SPA Fallback: /* → /index.html                                    │
│                                                                     │
│  Llamadas API:                                                      │
│    · /api/users, /api/jobs, ... → https://laboria-backend.onrender.com │
│    · /api/jcyl/* → data.opendatasoft.com (proxy)                    │
│    · /api/jobicy/* → jobicy.com (proxy)                             │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       │ Peticiones HTTP (CORS permitido)
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Render                                       │
│  https://laboria-backend.onrender.com                               │
│                                                                     │
│  Servicio Web: laboria-backend (Node.js + Express)                  │
│    - Build: cd backend && npx prisma generate && npx prisma migrate │
│    - Start: cd backend && node server.js                            │
│                                                                     │
│  Base de Datos: laboria-db (PostgreSQL)                             │
│    - Conexión automática via DATABASE_URL                           │
│    - Generada por Render Blueprint                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Flujo de una petición

```
Navegador → Vercel (frontend)
  ├─ Ruta SPA (/empleos, /cursos...) → sirve index.html
  ├─ /api/users/*, /api/jobs/*   → proxy a https://laboria-backend.onrender.com
  └─ /api/jcyl/*, /api/khanacademy/* → proxy a APIs externas
```

---

## 2. Vercel (Frontend)

### Plataforma

Vercel despliega el frontend React como sitio estático. Cada push a `main` redepliega automáticamente (si está conectado al repositorio de GitHub).

### URL de producción

```
https://laboria-frontend-backend-damian.vercel.app
```

### Configuración

La configuración de Vercel está en `vercel.json` en la raíz del proyecto:

| Parámetro | Valor | Explicación |
|---|---|---|
| `rootDirectory` | `frontend` | Vercel ejecuta los comandos dentro de `frontend/` |
| `framework` | `vite` | Vercel reconoce automáticamente el framework y sus settings |
| `buildCommand` | `npm run build` | Genera el build en `frontend/dist/` |
| `outputDirectory` | `dist` | Directorio que Vercel sirve como sitio estático |
| `installCommand` | `npm ci` | Instalación limpia de dependencias |

### Rewrites

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

- Las primeras 6 reglas redirigen rutas `/api/*` a APIs externas (proxy inverso, evita CORS)
- La última regla captura **todas** las rutas SPA y las sirve con `index.html` (fallback para HashRouter)

### Sin VITE_BASE_PATH

A diferencia de GitHub Pages, Vercel despliega en la raíz del dominio. No se necesita `VITE_BASE_PATH`. El `base` de `vite.config.js` usa `'/'` por defecto.

---

## 3. Render (Backend + Base de datos)

### Plataforma

Render despliega el backend Node.js + PostgreSQL mediante **Render Blueprint** (infraestructura como código en `render.yaml`).

### Servicios

| Servicio | Tipo | Plan | URL |
|---|---|---|---|
| `laboria-backend` | Web Service (Node) | Free | `https://laboria-backend.onrender.com` |
| `laboria-db` | PostgreSQL | Free | Conectado automáticamente al backend |

### URL de producción del backend

```
https://laboria-backend.onrender.com
```

### Build y Start

```yaml
buildCommand: cd backend && npx prisma generate && npx prisma migrate deploy
startCommand: cd backend && node server.js
healthCheckPath: /
```

- **Build:** Genera Prisma Client y aplica migraciones automáticamente
- **Start:** Inicia Express en el puerto asignado por Render (10000)
- **Health check:** Render verifica que `GET /` responda 200

### Variables de entorno en Render

| Variable | Origen | Valor |
|---|---|---|
| `DATABASE_URL` | `fromDatabase: laboria-db` | Generada automáticamente por Render |
| `JWT_SECRET` | `generateValue: true` | Secreto aleatorio generado en el primer deploy |
| `JWT_EXPIRES_IN` | Valor fijo | `7d` |
| `CORS_ORIGINS` | Valor fijo | `https://laboria-frontend-backend-damian.vercel.app,*.vercel.app` |
| `NODE_ENV` | Valor fijo | `production` |
| `PORT` | Valor fijo | `10000` |

---

## 4. Configuración de Vercel

**Archivo:** `vercel.json` (raíz del proyecto)

```json
{
  "rootDirectory": "frontend",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
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

**Nota:** No hay regla para `/api/users/*` o `/api/jobs/*` porque esas llamadas van directamente al backend de Laboria (no pasan por proxy de Vercel). El frontend llama a `VITE_API_URL` directamente.

---

## 5. Configuración de Render

**Archivo:** `render.yaml` (raíz del proyecto)

```yaml
services:
  - type: web
    name: laboria-backend
    runtime: node
    plan: free
    buildCommand: cd backend && npx prisma generate && npx prisma migrate deploy
    startCommand: cd backend && node server.js
    healthCheckPath: /
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: laboria-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 7d
      - key: CORS_ORIGINS
        value: https://laboria-frontend-backend-damian.vercel.app,*.vercel.app
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000

databases:
  - name: laboria-db
    plan: free
    databaseName: laboria
```

### Despliegue del Blueprint

1. Ir a [dashboard.render.com](https://dashboard.render.com)
2. Conectar repositorio de GitHub
3. Seleccionar "Blueprint" como tipo de despliegue
4. Render detecta `render.yaml` y crea ambos servicios automáticamente

---

## 6. CORS entre frontend y backend

El backend acepta peticiones del frontend mediante una configuración CORS dinámica que soporta **patrones wildcard**:

```javascript
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:4173'];

const corsPatterns = corsOrigins.map(o => {
  if (o.startsWith('*.'))
    return new RegExp('^https?://[a-zA-Z0-9.-]+' + o.slice(1).replace('.', '\\.') + '$');
  return o;
});
```

### En producción

`CORS_ORIGINS` en Render:
```
https://laboria-frontend-backend-damian.vercel.app,*.vercel.app
```

Esto permite:
- `https://laboria-frontend-backend-damian.vercel.app` — URL exacta de producción
- `*.vercel.app` — cualquier subdominio de Vercel (deploy previews, branches)

### En desarrollo local

Sin `CORS_ORIGINS`, usa por defecto:
- `http://localhost:5173` — Vite dev server
- `http://localhost:4173` — Vite preview

---

## 7. Seed de datos en producción

El seed **no se ejecuta automáticamente** durante el build. Debe ejecutarse manualmente después del primer deploy.

### Opción 1: Render Shell

1. Ir a [dashboard.render.com](https://dashboard.render.com) → laboria-backend
2. Ir a la pestaña **Shell**
3. Ejecutar:
```bash
cd backend && node prisma/seed.js
```

### Opción 2: npm run seed (si el script está configurado)

```bash
cd backend && npm run seed
```

### Verificar seed

```bash
curl https://laboria-backend.onrender.com/api/admin/dashboard
# Debe mostrar stats con usuarios, empleos, cursos
```

---

## 8. Variables de entorno en cada entorno

| Variable | Local (frontend/.env) | Producción (frontend/.env.production) | Render (render.yaml) |
|---|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | `https://laboria-backend.onrender.com` | — |
| `VITE_BASE_PATH` | no definida | no definida | — |
| `VITE_JOBS_API_1_URL` | `/api/jcyl/...` | `/api/jcyl/...` | — |
| `DATABASE_URL` | En backend/.env local | — | Generada por Render |
| `JWT_SECRET` | En backend/.env local | — | Generada por Render |
| `CORS_ORIGINS` | no definida | — | `https://laboria-frontend-backend-damian.vercel.app,*.vercel.app` |
| `NODE_ENV` | `development` | — | `production` |

---

## 9. Procedimiento de deploy completo

### Primer deploy

#### Backend (Render)

1. Ir a [dashboard.render.com](https://dashboard.render.com)
2. Nuevo → Blueprint
3. Conectar repositorio de GitHub
4. Render detecta `render.yaml` → crea `laboria-backend` + `laboria-db`
5. Esperar a que terminen ambos servicios (~5 minutos)
6. Verificar: `curl https://laboria-backend.onrender.com/` → debe responder JSON
7. Ejecutar seed: Render Dashboard → laboria-backend → Shell → `cd backend && node prisma/seed.js`

#### Frontend (Vercel)

1. Ir a [vercel.com](https://vercel.com)
2. Importar repositorio de GitHub
3. Configurar:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Añadir variable de entorno: `VITE_API_URL=https://laboria-backend.onrender.com`
5. Deploy
6. Verificar: `https://laboria-frontend-backend-damian.vercel.app/`

### Deploys posteriores

- **Frontend:** Push a `main` → Vercel redepliega automáticamente
- **Backend:** Push a `main` → Render redepliega automáticamente

---

## 10. Verificar comunicación frontend-backend

1. Abrir `https://laboria-frontend-backend-damian.vercel.app/`
2. Abrir DevTools → Red (Network tab)
3. Navegar a Empleos → verificar que las peticiones a `/api/jobs` llegan al backend
4. Verificar que no hay errores CORS en la consola
5. Probar login con `admin@laboria.com` / `admin123`
6. Verificar que el token se guarda y las rutas protegidas funcionan

### Endpoints de verificación

| Endpoint | Método | Respuesta esperada |
|---|---|---|
| `https://laboria-backend.onrender.com/` | GET | `{ message: "¡Backend de Laboria funcionando!" }` |
| `https://laboria-frontend-backend-damian.vercel.app/` | GET | HTML de la SPA |
| `https://laboria-backend.onrender.com/api/jobs` | GET | Array de empleos (si hay seed) |

---

## 11. Solución de problemas comunes

### Frontend

| Problema | Causa probable | Solución |
|---|---|---|
| **Página blanca** | Error en build de Vite | Ver logs del deploy en Vercel Dashboard |
| **Error 404 al recargar página** | SPA fallback no configurado | Verificar `rewrites` en `vercel.json`: `{ "source": "/(.*)", "destination": "/index.html" }` |
| **Assets JS/CSS 404** | `VITE_BASE_PATH` incorrecto | Vercel despliega en raíz, no necesita base path. Verificar que no está definido en `.env.production` |
| **API calls fallan** | `VITE_API_URL` incorrecto | Verificar que apunta a `https://laboria-backend.onrender.com` en producción |
| **CORS error en consola** | Backend no permite el origen | Verificar `CORS_ORIGINS` en Render — debe incluir `*.vercel.app` |

### Backend (Render)

| Problema | Causa probable | Solución |
|---|---|---|
| **Deploy falla (build)** | Error en migraciones de Prisma | Revisar logs del build en Render. Verificar que `DATABASE_URL` está disponible |
| **Deploy falla (start)** | Puerto incorrecto | Render asigna `PORT=10000`. Verificar que `server.js` usa `process.env.PORT` |
| **Error 503** | Health check fallando | Verificar que `GET /` responde 200. Revisar logs de la aplicación |
| **Conexión a BD falla** | `DATABASE_URL` incorrecta | En Render se inyecta automáticamente. Verificar en Environment Variables |
| **Seed no funciona** | BD vacía o sin migraciones | Ejecutar migraciones primero: `cd backend && npx prisma migrate deploy` |

### Comunicación Frontend-Backend

| Problema | Causa | Solución |
|---|---|---|
| **Login devuelve 401** | Credenciales incorrectas o seed no ejecutado | Ejecutar seed en producción |
| **Login devuelve CORS error** | Origen no permitido | Verificar `CORS_ORIGINS` en Render |
| **Las rutas protegidas redirigen al login** | Token no se guarda o expiró | Verificar que `localStorage` tiene el token tras login |
| **Las APIs externas no responden** | Rewrite de Vercel mal configurado | Verificar `vercel.json` → las rutas `/api/jcyl/*` etc. deben coincidir |
