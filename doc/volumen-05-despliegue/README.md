# Volumen 5: Despliegue

## Índice del volumen

1. [Arquitectura de despliegue](#1-arquitectura-de-despliegue)
2. [GitHub Pages + GitHub Actions](#2-github-pages--github-actions)
3. [HashRouter y Base Path](#3-hashrouter-y-base-path)
4. [Workflow CI/CD](#4-workflow-cicd)
5. [Variables de entorno](#5-variables-de-entorno)
6. [Procedimiento de deploy paso a paso](#6-procedimiento-de-deploy-paso-a-paso)
7. [Solución de problemas comunes](#7-solución-de-problemas-comunes)
8. [Próximos pasos: backend](#8-próximos-pasos-backend)

---

## 1. Arquitectura de despliegue

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub.com                               │
│                                                             │
│  ┌─────────────────────────────┐  ┌──────────────────────┐  │
│  │  Repositorio                │  │  GitHub Actions       │  │
│  │  damianmoares/              │  │                       │  │
│  │  Laboria-Frontend---backend │  │  Push a main:         │  │
│  │  _Damian                    │─>│  1. Setup Node        │  │
│  │                             │  │  2. npm ci            │  │
│  │  main branch                │  │  3. npm run build     │  │
│  │                             │  │  4. Deploy to Pages   │  │
│  └─────────────────────────────┘  └──────────┬───────────┘  │
│                                              │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                    ┌──────────────────────────┘
                    ▼
┌──────────────────────────────────────────────────────────────┐
│  GitHub Pages                                                │
│  https://damianmoares.github.io/Laboria-Frontend---backend_  │
│  Damian/                                                    │
│                                                             │
│  Sirve: index.html + assets JS/CSS (SPA estática)           │
│  API calls: localhost:3000 (backend local)                  │
└──────────────────────────────────────────────────────────────┘
```

**Actualmente:** Solo el frontend está desplegado en GitHub Pages. El backend se ejecuta localmente. La sección [8. Próximos pasos: backend](#8-próximos-pasos-backend) detalla cómo desplegarlo más adelante.

---

## 2. GitHub Pages + GitHub Actions

### Cómo funciona

GitHub Pages sirve archivos estáticos desde un workflow de GitHub Actions. En este proyecto:
1. Haces push a `main`
2. GitHub Actions ejecuta el workflow `.github/workflows/deploy.yml`
3. El workflow instala dependencias, hace build con Vite y despliega a GitHub Pages
4. La aplicación queda disponible en la URL pública

### Workflow: `.github/workflows/deploy.yml`

```yaml
name: Deploy Laboria to GitHub Pages

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Install dependencies
      working-directory: frontend
      run: npm ci

    - name: Build frontend
      working-directory: frontend
      run: npm run build

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: frontend/dist

    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### Paso a paso del workflow

| Paso | Acción | Descripción |
|---|---|---|
| 1 | `checkout@v4` | Clona el repositorio en el runner de GitHub |
| 2 | `setup-node@v4` | Instala Node 18 con cache de npm |
| 3 | `npm ci` | Instala dependencias exactas desde `package-lock.json` |
| 4 | `npm run build` | Ejecuta Vite build: lee `.env.production`, compila React, genera `frontend/dist/` |
| 5 | `upload-pages-artifact@v3` | Sube `frontend/dist/` como artifact |
| 6 | `deploy-pages@v4` | Despliega el artifact a GitHub Pages |

### Disparadores del workflow

- **Push a `main`** que modifique archivos en `frontend/`
- **Manual** desde la pestaña Actions → "Deploy Laboria to GitHub Pages" → "Run workflow"

---

## 3. HashRouter y Base Path

### Problema

GitHub Pages no permite configurar reglas de redirección del servidor. Si usas `BrowserRouter` de React Router, al recargar una ruta como `/empleos`, el servidor busca un archivo `/empleos/index.html` que no existe y devuelve 404.

### Solución: HashRouter

Con `HashRouter`, las rutas se representan con `#`:
- `https://domain.com/#/empleos`
- El navegador nunca envía `/empleos` al servidor
- El servidor solo ve `index.html` y lo sirve correctamente

### Base path

El proyecto se despliega en una subruta de GitHub Pages:
```
https://damianmoares.github.io/Laboria-Frontend---backend_Damian/
```

Vite necesita saber esta ruta para generar URLs correctas de assets (JS, CSS, imágenes).

**Configuración:**

`.env.production`:
```
VITE_BASE_PATH=/Laboria-Frontend---backend_Damian/
```

`vite.config.js`:
```javascript
base: env.VITE_BASE_PATH || '/',
```

Sin `VITE_BASE_PATH`, los assets se buscan en `https://damianmoares.github.io/assets/...` en lugar de `https://damianmoares.github.io/Laboria-Frontend---backend_Damian/assets/...`.

---

## 4. Variables de entorno

| Variable | Local (`frontend/.env`) | Producción (`frontend/.env.production`) |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | `http://localhost:3000` (pendiente backend) |
| `VITE_BASE_PATH` | (no definida) | `/Laboria-Frontend---backend_Damian/` |

**Nota:** `VITE_BASE_PATH` solo está en `.env.production` para no romper el dev server local.

---

## 5. Procedimiento de deploy paso a paso

### Prerequisitos
- Cuenta en GitHub con el repositorio pusheado
- El workflow `.github/workflows/deploy.yml` existe en `main`

### Paso 1: Verificar configuración de Pages

1. Ir a GitHub → Repositorio → Settings → Pages
2. Source: **GitHub Actions**
3. Verificar que no hay ningún otro origen configurado

### Paso 2: Push a main

```bash
git add .
git commit -m "mensaje"
git push origin main
```

### Paso 3: Verificar el workflow

1. Ir a GitHub → Repositorio → Actions
2. Ver el workflow "Deploy Laboria to GitHub Pages" en ejecución
3. Esperar a que termine (~2 minutos)
4. Verificar que el deploy es exitoso (checkmark verde)

### Paso 4: Verificar el sitio

1. Abrir `https://damianmoares.github.io/Laboria-Frontend---backend_Damian/`
2. Verificar que la página carga correctamente
3. Navegar entre rutas
4. Abrir DevTools → Network → verificar que no hay assets 404

---

## 6. Solución de problemas comunes

| Problema | Causa probable | Solución |
|---|---|---|
| **Página blanca** | `VITE_BASE_PATH` incorrecto o faltante | Verificar `.env.production` → debe coincidir con el nombre del repo exactamente |
| **Assets 404 (CSS/JS no cargan)** | `base` en vite.config.js incorrecto | Revisar que `VITE_BASE_PATH` termina con `/` |
| **Error 404 al recargar página** | Uso de `BrowserRouter` en vez de `HashRouter` | Cambiar a `HashRouter` en `main.jsx` |
| **npm run build falla localmente** | Dependencias faltantes | Ejecutar `npm ci` en `frontend/` |
| **Workflow de Actions falla** | Error en el build | Ir a Actions → ver logs → identificar el error |
| **El sitio no se actualiza tras push** | Workflow no se disparó | Verificar que los cambios están en `frontend/` (el workflow solo corre si hay cambios en esa carpeta) |
| **Favicon 404** | Favicon en ruta incorrecta | Colocar `favicon.png` en `frontend/public/` |

---

## 7. Próximos pasos: backend

Actualmente el frontend funciona en modo lectura con datos locales (JSON en `public/data/`). Cuando quieras desplegar el backend:

1. Elegir plataforma: Render, Railway, Fly.io, o la que prefieras
2. Configurar:
   - `DATABASE_URL` → PostgreSQL
   - `JWT_SECRET` → variable secreta
   - `CORS_ORIGINS` → `https://damianmoares.github.io`
3. Actualizar `frontend/.env.production`:
   ```
   VITE_API_URL=https://url-del-backend-en-produccion
   ```
4. Hacer push a main → GitHub Actions redepliega automáticamente

Este documento se actualizará cuando el backend esté desplegado.
